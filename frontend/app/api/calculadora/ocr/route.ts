import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

// ─── Prompt compartilhado (melhorado) ───
const SYSTEM_PROMPT = `Você é um especialista em extrair dados de faturas/boletos de planos de saúde brasileiros.
Analise o conteúdo da fatura/boleto e extraia EXATAMENTE estas informações em formato JSON:

{
  "operadora": "nome da operadora de saúde (ex: Amil, Bradesco Saúde, SulAmérica, Unimed, Porto Saúde, Prevent Senior, MedSênior, Assim Saúde, Golden Cross, NotreDame Intermédica, Hapvida, São Francisco)",
  "plano": "nome/tipo do plano se visível",
  "valor_total": número decimal do valor total da fatura/boleto (apenas o número, sem R$),
  "vencimento": "data de vencimento se visível (DD/MM/YYYY)",
  "beneficiarios": número de beneficiários/vidas (conte a quantidade de nomes listados se houver uma lista de beneficiários),
  "titular": "nome do titular/responsável financeiro/pagador — procure no campo 'Pagador', 'Sacado', 'Beneficiário do boleto', 'Cliente' ou 'Titular'",
  "razao_social": "Razão Social ou nome completo do pagador/sacado — se for empresa, copie o nome da empresa. Se for pessoa física, copie o nome completo",
  "documento": "CNPJ (XX.XXX.XXX/XXXX-XX) ou CPF (XXX.XXX.XXX-XX) do pagador/sacado — procure próximo ao código de barras, ao nome do pagador, ou nos dados do sacado/pagador",
  "tipo_pessoa": "PF" ou "PJ",
  "faixas_etarias": ["lista de faixas etárias dos beneficiários se visível, no formato ANS: 0-18, 19-23, 24-28, 29-33, 34-38, 39-43, 44-48, 49-53, 54-58, 59+"],
  "confianca": número de 0 a 100 indicando sua confiança na extração
}

INSTRUÇÕES IMPORTANTES:
1. OPERADORA: É a empresa de plano de saúde (não confunda com o banco do boleto). Procure logotipo, nome no cabeçalho, ou na descrição do serviço.
2. PAGADOR/SACADO: O campo próximo ao código de barras geralmente tem "Pagador" ou "Sacado" com nome, CNPJ/CPF e endereço.
3. CNPJ vs CPF:
   - CNPJ (XX.XXX.XXX/XXXX-XX) = PJ
   - CPF (XXX.XXX.XXX-XX) = PF
   - "LTDA", "S/A", "ME", "EIRELI", "EPP", "Razão Social" = PJ
4. FAIXAS ETÁRIAS: Se houver lista de beneficiários com idades ou datas de nascimento, calcule a faixa de cada um no padrão ANS.
5. VALOR: Procure o valor total da mensalidade/boleto. Pode estar como "Valor do documento", "Total", "Valor cobrado".

Se não conseguir identificar algum campo, use null.
Retorne APENAS o JSON válido, sem markdown, sem texto extra, sem explicações.`;

// ─── Chamar GPT Vision para imagens ───
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

    let openaiError = '';
    try {
      const errObj = JSON.parse(errorText);
      openaiError = errObj?.error?.message || '';
    } catch { /* */ }

    if (response.status === 400) {
      let errorMsg = 'Não foi possível processar o arquivo.';
      if (openaiError.includes('image') || openaiError.includes('Could not process')) {
        errorMsg = 'A imagem não pôde ser lida. Tente uma foto mais nítida ou envie como PDF.';
      } else if (openaiError.includes('too large') || openaiError.includes('maximum')) {
        errorMsg = 'Arquivo muito grande. Tente enviar com resolução menor.';
      }
      throw new Error(errorMsg);
    }
    if (response.status === 429) {
      throw new Error('Muitas requisições. Aguarde alguns segundos e tente novamente.');
    }
    throw new Error('Erro ao processar com IA. Tente novamente.');
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content?.trim() || '';
}

// ─── Chamar Gemini 2.0 Flash para PDFs (com retry) ───
async function callGeminiPDF(pdfBase64: string, maxRetries = 2): Promise<string> {
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
          text: `${SYSTEM_PROMPT}\n\nAnalise este PDF de fatura/boleto de plano de saúde e extraia todos os dados solicitados. Preste atenção especial ao PAGADOR/SACADO (nome, CNPJ ou CPF) que geralmente aparece próximo ao código de barras.`,
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // Verificar se a resposta contém JSON válido
      if (!text || text.length < 10) {
        throw new Error('Resposta vazia do Gemini');
      }

      // Tentar parsear para garantir que é JSON válido
      parseResponse(text);

      return text;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`[OCR] Gemini tentativa ${attempt} falhou:`, lastError.message);

      if (attempt < maxRetries) {
        // Esperar antes de tentar novamente (backoff exponencial)
        const waitMs = attempt * 1500;
        console.log(`[OCR] Aguardando ${waitMs}ms antes de retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }
  }

  throw lastError || new Error('Gemini falhou após todas as tentativas');
}

// ─── Parsear resposta JSON ───
function parseResponse(content: string) {
  // Limpar markdown e extrair JSON
  let jsonStr = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  // Tentar encontrar JSON em caso de texto extra
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('fatura') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const fileSizeKB = (file.size / 1024).toFixed(0);
    console.log(`[OCR] Arquivo: ${file.name}, type: ${file.type}, size: ${fileSizeKB}KB`);

    // Validar tipo
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

    // ─────────────────────────────────────
    // ROTA 1: PDF → Gemini 2.0 Flash (aceita PDF nativo!)
    // ─────────────────────────────────────
    if (isPDF) {
      console.log('[OCR] Processando PDF com Gemini 2.0 Flash...');

      if (!GOOGLE_AI_API_KEY) {
        console.error('[OCR] GOOGLE_AI_API_KEY não configurada, tentando fallback OpenAI...');
        // Fallback: tentar extrair texto com pdf-parse + OpenAI
        return await fallbackPDFWithOpenAI(buffer);
      }

      try {
        const pdfBase64 = buffer.toString('base64');
        console.log(`[OCR] PDF base64: ${(pdfBase64.length / 1024).toFixed(0)}KB`);

        content = await callGeminiPDF(pdfBase64);
        console.log('[OCR] Resposta Gemini:', content.substring(0, 600));
      } catch (geminiErr) {
        console.error('[OCR] Erro Gemini, tentando fallback OpenAI:', geminiErr);
        // Fallback para OpenAI com pdf-parse
        return await fallbackPDFWithOpenAI(buffer);
      }
    }
    // ─────────────────────────────────────
    // ROTA 2: Imagem → GPT-4o Vision
    // ─────────────────────────────────────
    else {
      if (!OPENAI_API_KEY) {
        console.error('[OCR] OPENAI_API_KEY não configurada');
        return NextResponse.json({ error: 'OpenAI não configurada' }, { status: 500 });
      }

      console.log('[OCR] Processando imagem com GPT-4o Vision...');
      const base64 = buffer.toString('base64');

      let mimeType = file.type;
      if (mimeType === 'image/heic' || mimeType === 'image/heif') mimeType = 'image/jpeg';
      if (!mimeType || mimeType === 'application/octet-stream') mimeType = 'image/jpeg';

      const dataUrl = `data:${mimeType};base64,${base64}`;
      const imageDetail = base64.length > 5_000_000 ? 'low' : 'high';
      console.log(`[OCR] Base64: ${(base64.length / 1024).toFixed(0)}KB, detail: ${imageDetail}`);

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extraia os dados desta fatura/boleto de plano de saúde. Identifique o pagador/sacado, CNPJ ou CPF, e a operadora de saúde:' },
            { type: 'image_url', image_url: { url: dataUrl, detail: imageDetail } },
          ],
        },
      ];

      content = await callGPTVision(messages);
      console.log('[OCR] Resposta GPT-4o:', content.substring(0, 600));
    }

    // ─── Parsear resultado ───
    try {
      const dados = parseResponse(content);
      console.log('[OCR] Dados extraídos:', JSON.stringify(dados));
      return NextResponse.json({ success: true, dados });
    } catch {
      console.error('[OCR] Falha ao parsear resposta:', content);
      return NextResponse.json({
        success: false,
        error: 'Não foi possível extrair os dados. Tente uma foto mais nítida ou outro arquivo.',
        raw: content,
      });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Erro interno no servidor';
    console.error('[OCR] Erro:', errorMsg);
    return NextResponse.json({ success: false, error: errorMsg });
  }
}

// ─── Fallback: PDF → pdf-parse + OpenAI text ───
async function fallbackPDFWithOpenAI(buffer: Buffer) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const pdfData = await pdfParse(buffer);
    const pdfText = pdfData.text?.trim() || '';
    console.log(`[OCR] Fallback pdf-parse: ${pdfText.length} chars`);

    if (pdfText.length < 20) {
      return NextResponse.json({
        success: false,
        error: 'Este PDF parece ser uma imagem escaneada. Tire um print/screenshot e envie como imagem.',
      });
    }

    const textTruncated = pdfText.substring(0, 4000);

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Extraia os dados desta fatura de plano de saúde. Identifique o pagador/sacado, CNPJ ou CPF, e a operadora. Texto extraído do PDF:\n\n---\n${textTruncated}\n---`,
      },
    ];

    const content = await callGPTVision(messages);
    console.log('[OCR] Fallback resposta GPT:', content.substring(0, 500));

    const dados = parseResponse(content);
    return NextResponse.json({ success: true, dados });
  } catch (fallbackErr) {
    console.error('[OCR] Fallback também falhou:', fallbackErr);
    return NextResponse.json({
      success: false,
      error: 'Não foi possível ler este PDF. Tente enviar um print/screenshot da fatura.',
    });
  }
}
