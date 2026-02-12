import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

// ─── Prompt compartilhado ───
const SYSTEM_PROMPT = `Você é um especialista em extrair dados de faturas/boletos de planos de saúde brasileiros.
Analise o conteúdo da fatura/boleto e extraia EXATAMENTE estas informações em formato JSON:

{
  "operadora": "nome da operadora de saúde (ex: Amil, Bradesco Saúde, SulAmérica, Unimed, Porto Saúde, Prevent Senior, MedSênior, Assim Saúde, Golden Cross, NotreDame Intermédica, Hapvida, São Francisco, Leve Saúde)",
  "plano": "nome/tipo do plano se visível",
  "valor_total": número decimal do valor total da fatura/boleto (apenas o número, sem R$),
  "vencimento": "data de vencimento se visível (DD/MM/YYYY)",
  "beneficiarios": número de beneficiários/vidas (conte a quantidade de nomes listados se houver uma lista de beneficiários),
  "titular": "nome do titular/responsável financeiro/pagador",
  "razao_social": "Razão Social ou nome completo do pagador/sacado",
  "documento": "CNPJ (XX.XXX.XXX/XXXX-XX) ou CPF (XXX.XXX.XXX-XX) do pagador/sacado",
  "tipo_pessoa": "PF" ou "PJ",
  "faixas_etarias": ["lista de faixas etárias dos beneficiários no formato ANS: 0-18, 19-23, 24-28, 29-33, 34-38, 39-43, 44-48, 49-53, 54-58, 59+"],
  "confianca": número de 0 a 100 indicando sua confiança na extração
}

INSTRUÇÕES:
1. OPERADORA: A empresa de plano de saúde (não o banco do boleto).
2. PAGADOR/SACADO: Campo próximo ao código de barras.
3. CNPJ = PJ, CPF = PF, "LTDA", "S/A", "ME", "EIRELI" = PJ.
4. FAIXAS ETÁRIAS: Se houver lista de beneficiários com idades/datas de nascimento, calcule a faixa ANS.
5. VALOR: Procure "Valor do documento", "Total", "Valor cobrado".
Se não conseguir identificar algum campo, use null.
Retorne APENAS o JSON válido, sem markdown, sem texto extra.`;

// ─── GPT Vision (imagens) ───
async function callGPTVision(messages: Array<{ role: string; content: unknown }>) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      max_tokens: 1000,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[OCR] OpenAI error (${response.status}):`, errorText);

    if (response.status === 400) {
      throw new Error('Imagem não pôde ser processada. Tente uma foto mais nítida.');
    }
    if (response.status === 429) {
      throw new Error('Muitas requisições. Aguarde alguns segundos.');
    }
    throw new Error(`OpenAI erro ${response.status}`);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content?.trim() || '';
}

// ─── Gemini 2.0 Flash (PDFs) com retry robusto ───
async function callGeminiPDF(pdfBase64: string, maxRetries = 3): Promise<string> {
  if (!GOOGLE_AI_API_KEY) {
    throw new Error('Google AI não configurada');
  }

  const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[OCR] Gemini tentativa ${attempt}/${maxRetries}...`);

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: pdfBase64,
          },
        },
        {
          text: `${SYSTEM_PROMPT}\n\nAnalise este PDF de fatura/boleto de plano de saúde e extraia todos os dados solicitados.`,
        },
      ]);

      const response = await result.response;
      const text = response.text();

      if (!text || text.length < 10) {
        throw new Error('Resposta vazia do Gemini');
      }

      // Validar que é JSON parseável
      parseResponse(text);
      console.log(`[OCR] Gemini sucesso na tentativa ${attempt}`);
      return text;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`[OCR] Gemini tentativa ${attempt} falhou:`, lastError.message);

      if (attempt < maxRetries) {
        const waitMs = attempt * 2000;
        console.log(`[OCR] Aguardando ${waitMs}ms antes de retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }
  }

  throw lastError || new Error('Gemini falhou após todas as tentativas');
}

// ─── Gemini com PDF como imagem (fallback alternativo) ───
async function callGeminiPDFAsImage(pdfBase64: string): Promise<string> {
  if (!GOOGLE_AI_API_KEY) throw new Error('Google AI não configurada');

  const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
  // Tentar com modelo gemini-1.5-flash que pode lidar diferente
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  console.log('[OCR] Tentando Gemini 1.5 Flash como fallback...');

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'application/pdf',
        data: pdfBase64,
      },
    },
    {
      text: `${SYSTEM_PROMPT}\n\nAnalise este PDF de fatura/boleto de plano de saúde e extraia todos os dados solicitados.`,
    },
  ]);

  const response = await result.response;
  const text = response.text();

  if (!text || text.length < 10) {
    throw new Error('Resposta vazia do Gemini 1.5');
  }

  parseResponse(text);
  console.log('[OCR] Gemini 1.5 Flash sucesso');
  return text;
}

// ─── Parsear resposta JSON ───
function parseResponse(content: string) {
  let jsonStr = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  const dados = JSON.parse(jsonStr);
  return {
    operadora: dados.operadora || null,
    plano: dados.plano || null,
    valor_total: dados.valor_total || null,
    vencimento: dados.vencimento || null,
    beneficiarios: dados.beneficiarios || null,
    titular: dados.titular || null,
    razao_social: dados.razao_social || null,
    documento: dados.documento || null,
    tipo_pessoa: dados.tipo_pessoa === 'PF' || dados.tipo_pessoa === 'PJ' ? dados.tipo_pessoa : null,
    faixas_etarias: Array.isArray(dados.faixas_etarias) ? dados.faixas_etarias : null,
    confianca: dados.confianca || 0,
  };
}

// ─── Fallback: pdf-parse + OpenAI text ───
async function fallbackPDFWithOpenAI(buffer: Buffer): Promise<NextResponse> {
  try {
    console.log('[OCR] Fallback: tentando pdf-parse + OpenAI...');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const pdfData = await pdfParse(buffer);
    const pdfText = pdfData.text?.trim() || '';
    console.log(`[OCR] pdf-parse extraiu ${pdfText.length} chars`);

    if (pdfText.length < 20) {
      return NextResponse.json({
        success: false,
        error: 'Este PDF parece ser uma imagem escaneada e não conseguimos ler. Tire um print/screenshot da fatura e envie como imagem (JPG/PNG).',
      });
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Não foi possível processar este PDF. Tente enviar como imagem.',
      });
    }

    const textTruncated = pdfText.substring(0, 4000);
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Extraia os dados desta fatura de plano de saúde:\n\n---\n${textTruncated}\n---`,
      },
    ];

    const content = await callGPTVision(messages);
    console.log('[OCR] Fallback GPT resposta:', content.substring(0, 300));

    const dados = parseResponse(content);
    return NextResponse.json({ success: true, dados });
  } catch (fallbackErr) {
    console.error('[OCR] Fallback pdf-parse também falhou:', fallbackErr);
    return NextResponse.json({
      success: false,
      error: 'Não conseguimos ler este PDF. Tente enviar como imagem (tire um print da fatura).',
    });
  }
}

// ─── MAIN POST ───
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('fatura') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    console.log(`[OCR] ========================================`);
    console.log(`[OCR] Arquivo: ${file.name}, type: ${file.type}, size: ${fileSizeMB}MB`);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isPDF && !allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Formato não suportado (${file.type}). Envie JPG, PNG, WebP ou PDF.` },
        { status: 400 },
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 20MB.' }, { status: 400 });
    }

    if (file.size < 100) {
      return NextResponse.json({ error: 'Arquivo parece vazio ou corrompido.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let content: string;

    // ═══════════════════════════════════
    // ROTA PDF: Gemini 2.0 Flash → Gemini 1.5 Flash → pdf-parse + OpenAI
    // ═══════════════════════════════════
    if (isPDF) {
      console.log('[OCR] Processando PDF...');
      const pdfBase64 = buffer.toString('base64');
      const pdfSizeKB = Math.round(pdfBase64.length / 1024);
      console.log(`[OCR] PDF base64: ${pdfSizeKB}KB`);

      // Limite de 10MB para inlineData do Gemini
      if (pdfBase64.length > 10 * 1024 * 1024) {
        console.log('[OCR] PDF muito grande para Gemini, indo direto para fallback...');
        return await fallbackPDFWithOpenAI(buffer);
      }

      // Tentativa 1: Gemini 2.0 Flash (3 retries internos)
      try {
        content = await callGeminiPDF(pdfBase64, 3);
        console.log('[OCR] ✅ Gemini 2.0 Flash sucesso');
      } catch (gemini2Err) {
        console.error('[OCR] ❌ Gemini 2.0 Flash falhou:', gemini2Err instanceof Error ? gemini2Err.message : gemini2Err);

        // Tentativa 2: Gemini 1.5 Flash
        try {
          content = await callGeminiPDFAsImage(pdfBase64);
          console.log('[OCR] ✅ Gemini 1.5 Flash sucesso');
        } catch (gemini15Err) {
          console.error('[OCR] ❌ Gemini 1.5 Flash falhou:', gemini15Err instanceof Error ? gemini15Err.message : gemini15Err);

          // Tentativa 3: pdf-parse + OpenAI
          console.log('[OCR] Tentando fallback final: pdf-parse + OpenAI...');
          return await fallbackPDFWithOpenAI(buffer);
        }
      }
    }
    // ═══════════════════════════════════
    // ROTA IMAGEM: GPT-4o Vision
    // ═══════════════════════════════════
    else {
      if (!OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OpenAI não configurada' }, { status: 500 });
      }

      console.log('[OCR] Processando imagem com GPT-4o Vision...');
      const base64 = buffer.toString('base64');

      let mimeType = file.type;
      if (mimeType === 'image/heic' || mimeType === 'image/heif') mimeType = 'image/jpeg';
      if (!mimeType || mimeType === 'application/octet-stream') mimeType = 'image/jpeg';

      const dataUrl = `data:${mimeType};base64,${base64}`;
      const imageDetail = base64.length > 5_000_000 ? 'low' : 'high';

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extraia os dados desta fatura/boleto de plano de saúde:' },
            { type: 'image_url', image_url: { url: dataUrl, detail: imageDetail } },
          ],
        },
      ];

      content = await callGPTVision(messages);
      console.log('[OCR] Resposta GPT-4o:', content.substring(0, 300));
    }

    // ─── Parsear resultado ───
    try {
      const dados = parseResponse(content);
      console.log('[OCR] ✅ Dados extraídos:', JSON.stringify(dados).substring(0, 500));
      return NextResponse.json({ success: true, dados });
    } catch (parseErr) {
      console.error('[OCR] ❌ Falha ao parsear:', content?.substring(0, 500));
      console.error('[OCR] Parse error:', parseErr);
      return NextResponse.json({
        success: false,
        error: 'Não foi possível extrair os dados. Tente uma foto mais nítida ou outro arquivo.',
        raw: content?.substring(0, 200),
      });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Erro interno';
    console.error('[OCR] ❌ Erro geral:', errorMsg);
    return NextResponse.json({ success: false, error: errorMsg });
  }
}
