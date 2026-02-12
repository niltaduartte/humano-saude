import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60;

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

const SYSTEM_PROMPT = `Você é um especialista em extrair dados de faturas/boletos de planos de saúde brasileiros.
Analise o documento e extraia EXATAMENTE estas informações em formato JSON:

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

INSTRUÇÕES IMPORTANTES:
1. OPERADORA: A empresa de plano de saúde (NÃO o banco do boleto, NÃO a empresa de cobrança).
2. PAGADOR/SACADO: Campo próximo ao código de barras. O nome do pagador ou sacado.
3. CNPJ = PJ, CPF = PF, "LTDA", "S/A", "ME", "EIRELI" = PJ.
4. FAIXAS ETÁRIAS: Se houver lista de beneficiários com idades ou datas de nascimento, calcule a faixa ANS correspondente.
5. VALOR: Procure "Valor do documento", "Total", "Valor cobrado", "Total a pagar".
6. Se o documento estiver escaneado/fotografado, faça seu melhor esforço para ler os dados.
Se não conseguir identificar algum campo, use null.
Retorne APENAS o JSON válido, sem markdown, sem texto extra, sem comentários.`;

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

// ─── Chamar Gemini (PDF ou Imagem) com retry ───
async function callGemini(
  base64: string,
  mimeType: string,
  maxRetries = 2
): Promise<string> {
  if (!GOOGLE_AI_API_KEY) {
    throw new Error('Chave da API não configurada. Entre em contato com o suporte.');
  }

  const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2000,
    },
  });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[OCR] Tentativa ${attempt}/${maxRetries} (${mimeType}, ${Math.round(base64.length / 1024)}KB)...`);

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType,
            data: base64,
          },
        },
        {
          text: `${SYSTEM_PROMPT}\n\nAnalise este documento (fatura/boleto de plano de saúde) e extraia todos os dados solicitados. Retorne SOMENTE o JSON.`,
        },
      ]);

      const response = await result.response;
      const text = response.text();

      if (!text || text.length < 10) {
        throw new Error('Resposta vazia');
      }

      // Validar que é JSON parseável
      parseResponse(text);
      console.log(`[OCR] ✅ Sucesso na tentativa ${attempt}`);
      return text;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`[OCR] Tentativa ${attempt} falhou:`, lastError.message);

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }

  throw lastError || new Error('Não foi possível processar o documento.');
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
    console.log(`[OCR] ═══════════════════════════════════`);
    console.log(`[OCR] Arquivo: ${file.name}, type: ${file.type}, size: ${fileSizeMB}MB`);

    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(file.type);

    if (!isPDF && !isImage) {
      return NextResponse.json(
        { error: 'Formato não suportado. Envie PDF, JPG, PNG ou WebP.' },
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
    const base64 = buffer.toString('base64');

    // Verificar tamanho do base64 (Gemini aceita até ~20MB inline)
    if (base64.length > 20 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: 'Arquivo muito grande para processar. Tente um arquivo menor ou tire um print da fatura.',
      });
    }

    // Determinar mimeType
    let mimeType = file.type;
    if (isPDF) {
      mimeType = 'application/pdf';
    } else if (mimeType === 'image/heic' || mimeType === 'image/heif') {
      mimeType = 'image/jpeg';
    } else if (!mimeType || mimeType === 'application/octet-stream') {
      mimeType = 'image/jpeg';
    }

    console.log(`[OCR] Processando como ${isPDF ? 'PDF' : 'imagem'} (${mimeType})...`);

    // Chamar Gemini (funciona tanto para PDF quanto imagem)
    try {
      const content = await callGemini(base64, mimeType, 2);
      const dados = parseResponse(content);
      console.log('[OCR] ✅ Dados extraídos:', JSON.stringify(dados).substring(0, 500));
      return NextResponse.json({ success: true, dados });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao processar';
      console.error('[OCR] ❌ Falhou:', errorMsg);

      // Mensagem amigável para o usuário
      let userMsg = 'Não conseguimos ler este arquivo automaticamente. Preencha os dados manualmente.';
      if (errorMsg.includes('SAFETY')) {
        userMsg = 'O arquivo não pôde ser processado. Tente enviar outro arquivo ou preencha manualmente.';
      } else if (errorMsg.includes('too large') || errorMsg.includes('size')) {
        userMsg = 'Arquivo muito grande. Tente um arquivo menor ou tire um print/screenshot da fatura.';
      } else if (errorMsg.includes('format') || errorMsg.includes('INVALID')) {
        userMsg = 'Formato não reconhecido. Tente enviar como JPG, PNG ou outro PDF.';
      }

      return NextResponse.json({ success: false, error: userMsg });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Erro interno';
    console.error('[OCR] ❌ Erro geral:', errorMsg);
    return NextResponse.json({
      success: false,
      error: 'Erro ao processar o arquivo. Tente novamente ou preencha manualmente.',
    });
  }
}
