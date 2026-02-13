import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

// ─── Helper: extrair corretor_id do cookie ─────────────────
function getCorretorIdFromCookie(request: NextRequest): string | null {
  const token = request.cookies.get('corretor_token')?.value;
  if (!token) return null;
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (decoded.exp && decoded.exp < Date.now()) return null;
    return decoded.id || null;
  } catch {
    return null;
  }
}

// ─── POST: Upload de foto do corretor ───────────────────────
export async function POST(request: NextRequest) {
  try {
    const corretorId = getCorretorIdFromCookie(request);
    if (!corretorId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('foto') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use JPG, PNG, WebP ou GIF.' },
        { status: 400 },
      );
    }

    // Validar tamanho (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB.' },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `corretores/${corretorId}/foto_${Date.now()}.${ext}`;

    // Upload para Supabase Storage (bucket "documentos")
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('[foto upload]', uploadError);
      return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 });
    }

    // Gerar URL pública
    const { data: publicUrlData } = supabase.storage
      .from('documentos')
      .getPublicUrl(fileName);

    const fotoUrl = publicUrlData.publicUrl;

    // Atualizar foto_url no corretor
    const { error: updateError } = await supabase
      .from('corretores')
      .update({ foto_url: fotoUrl })
      .eq('id', corretorId);

    if (updateError) {
      console.error('[foto update]', updateError);
      return NextResponse.json({ error: 'Erro ao salvar URL da foto' }, { status: 500 });
    }

    return NextResponse.json({ success: true, foto_url: fotoUrl });
  } catch (err) {
    console.error('[foto POST]', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// ─── DELETE: Remover foto do corretor ───────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const corretorId = getCorretorIdFromCookie(request);
    if (!corretorId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Limpar foto_url
    const { error } = await supabase
      .from('corretores')
      .update({ foto_url: null })
      .eq('id', corretorId);

    if (error) {
      console.error('[foto delete]', error);
      return NextResponse.json({ error: 'Erro ao remover foto' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[foto DELETE]', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
