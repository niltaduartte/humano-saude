import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager, FileState } from '@google/generative-ai/server';

export const maxDuration = 60;

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY!;

const SYSTEM_PROMPT = `Você é um especialista em faturas de planos de saúde brasileiros.
Analise o documento e retorne APENAS um JSON válido com estes campos:

{
  "operadora": "nome da operadora (Amil, Bradesco Saúde, SulAmérica, Unimed, Porto Saúde, Prevent Senior, MedSênior, Assim Saúde, Golden Cross, NotreDame Intermédica, Hapvida, Leve Saúde, etc)",
  "plano": "nome do plano se visível",
  "valor_total": 1234.56,
  "vencimento": "DD/MM/YYYY",
  "beneficiarios": 3,
  "titular": "nome do titular/pagador",
  "razao_social": "razão social do sacado/pagador",
  "documento": "CPF ou CNPJ do sacado",
  "tipo_pessoa": "PF ou PJ",
  "faixas_etarias": ["0-18", "29-33", "59+"],
  "confianca": 85
}

REGRAS:
- OPERADORA = empresa do plano de saúde, NÃO o banco do boleto.
- VALOR = procure "Valor do Documento", "Total a Pagar", "Valor Cobrado". Só o número, sem R$.
- SACADO/PAGADOR = nome e documento perto do código de barras.
- CNPJ ou palavras LTDA/S.A/ME/EIRELI = tipo_pessoa "PJ". CPF = tipo_pessoa "PF".
- FAIXAS ETÁRIAS formato ANS: 0-18, 19-23, 24-28, 29-33, 34-38, 39-43, 44-48, 49-53, 54-58, 59+
- Foque no QUADRO DE RESUMO e na área do sacado/pagador.
- Se não encontrar um campo, use null.
- Retorne SOMENTE o JSON, sem markdown, sem explicação.`;

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

// ─── Aguardar processamento do arquivo ───
async function waitForFileReady(fileManager: GoogleAIFileManager, fileName: string): Promise<void> {
  let file = await fileManager.getFile(fileName);
  let attempts = 0;
  while (file.state === FileState.PROCESSING && attempts < 10) {
    console.log(`[OCR] Arquivo em processamento... (${attempts + 1})`);
    await new Promise((r) => setTimeout(r, 2000));
    file = await fileManager.getFile(fileName);
    attempts++;
  }
  if (file.state === FileState.FAILED) {
    throw new Error('O Google não conseguiu processar este arquivo.');
  }
}

// ─── MAIN POST ───
export async function POST(request: NextRequest) {
  const fileManager = new GoogleAIFileManager(GOOGLE_AI_API_KEY);
  let uploadedFileName: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get('fatura') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    console.log(`[OCR] ═══════════════════════════════════════`);
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

    // ═══ DETERMINAR MIME TYPE ═══
    let mimeType = file.type;
    if (isPDF) {
      mimeType = 'application/pdf';
    } else if (mimeType === 'image/heic' || mimeType === 'image/heif') {
      mimeType = 'image/jpeg';
    } else if (!mimeType || mimeType === 'application/octet-stream') {
      mimeType = 'image/jpeg';
    }

    // ═══ UPLOAD PARA GOOGLE FILE API ═══
    console.log(`[OCR] Fazendo upload para Google File API (${mimeType})...`);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await fileManager.uploadFile(buffer, {
      mimeType,
      displayName: file.name,
    });

    uploadedFileName = uploadResult.file.name;
    console.log(`[OCR] ✅ Upload feito: ${uploadedFileName} (uri: ${uploadResult.file.uri})`);

    // Aguardar processamento (PDFs podem demorar)
    await waitForFileReady(fileManager, uploadedFileName);
    console.log(`[OCR] ✅ Arquivo pronto para análise`);

    // ═══ ENVIAR PARA GEMINI ═══
    const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2000,
      },
    });

    console.log(`[OCR] Enviando para Gemini 2.0 Flash...`);
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri,
        },
      },
      {
        text: SYSTEM_PROMPT,
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // ═══ LOG DA RESPOSTA BRUTA ═══
    console.log(`[OCR] ═══ RESPOSTA BRUTA DO GEMINI ═══`);
    console.log(text);
    console.log(`[OCR] ═══ FIM DA RESPOSTA BRUTA ═══`);

    if (!text || text.length < 10) {
      return NextResponse.json({
        success: false,
        error: 'Não conseguimos ler o documento. Preencha os dados manualmente.',
      });
    }

    // ═══ PARSEAR JSON ═══
    try {
      const dados = parseResponse(text);
      console.log('[OCR] ✅ DADOS EXTRAÍDOS:', JSON.stringify(dados, null, 2));
      return NextResponse.json({ success: true, dados });
    } catch (parseErr) {
      console.error('[OCR] ❌ Erro ao parsear JSON:', parseErr);
      console.error('[OCR] Resposta bruta era:', text.substring(0, 500));
      return NextResponse.json({
        success: false,
        error: 'Não foi possível extrair os dados. Preencha manualmente.',
      });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Erro interno';
    console.error('[OCR] ❌ Erro:', errorMsg);

    let userMsg = 'Não conseguimos processar o arquivo. Preencha os dados manualmente.';
    if (errorMsg.includes('SAFETY')) {
      userMsg = 'O arquivo não pôde ser processado. Tente outro ou preencha manualmente.';
    } else if (errorMsg.includes('too large') || errorMsg.includes('size')) {
      userMsg = 'Arquivo muito grande. Tire um print da fatura e envie como imagem.';
    }

    return NextResponse.json({ success: false, error: userMsg });
  } finally {
    // ═══ LIMPAR: DELETAR ARQUIVO DO GOOGLE ═══
    if (uploadedFileName) {
      try {
        await fileManager.deleteFile(uploadedFileName);
        console.log(`[OCR] 🗑️ Arquivo deletado do Google: ${uploadedFileName}`);
      } catch {
        console.log(`[OCR] ⚠️ Não deletou arquivo (vai expirar em 48h): ${uploadedFileName}`);
      }
    }
  }
}
