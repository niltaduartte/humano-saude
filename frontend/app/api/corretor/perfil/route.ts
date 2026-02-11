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

// ─── GET: Buscar dados do corretor ──────────────────────────
export async function GET(request: NextRequest) {
  try {
    const corretorId = getCorretorIdFromCookie(request);
    if (!corretorId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Buscar dados do corretor
    const { data: corretor, error: corretorErr } = await supabase
      .from('corretores')
      .select('id, nome, cpf, email, telefone, whatsapp, susep, slug, data_admissao, metadata, created_at')
      .eq('id', corretorId)
      .eq('ativo', true)
      .single();

    if (corretorErr || !corretor) {
      return NextResponse.json({ error: 'Corretor não encontrado' }, { status: 404 });
    }

    // Buscar dados bancários (ativos + inativos para histórico)
    const { data: dadosBancarios } = await supabase
      .from('corretor_dados_bancarios')
      .select('id, banco_codigo, banco_nome, agencia, conta, tipo_conta, titular_nome, titular_documento, tipo_chave_pix, chave_pix, ativo, verificado, created_at, desativado_em, desativado_motivo')
      .eq('corretor_id', corretorId)
      .order('created_at', { ascending: false });

    // Buscar solicitações de alteração bancária
    const { data: alteracoes } = await supabase
      .from('corretor_alteracao_bancaria')
      .select('id, banco_nome, agencia, conta, motivo, status, motivo_rejeicao, created_at, aprovado_em')
      .eq('corretor_id', corretorId)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      corretor: {
        id: corretor.id,
        nome: corretor.nome,
        cpf: corretor.cpf,
        email: corretor.email,
        telefone: corretor.telefone,
        whatsapp: corretor.whatsapp,
        susep: corretor.susep,
        slug: corretor.slug || null,
        data_admissao: corretor.data_admissao,
        created_at: corretor.created_at,
        metadata: corretor.metadata || {},
      },
      dados_bancarios: dadosBancarios || [],
      alteracoes: alteracoes || [],
    });
  } catch (err) {
    console.error('[perfil GET]', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// ─── PATCH: Atualizar email ou senha ────────────────────────
export async function PATCH(request: NextRequest) {
  try {
    const corretorId = getCorretorIdFromCookie(request);
    if (!corretorId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { email, senha_atual, nova_senha, slug } = body;
    const supabase = createServiceClient();

    // ── Atualizar slug (link de indicação) ────
    if (slug !== undefined) {
      const slugNorm = slug
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 60);

      if (slugNorm.length < 3) {
        return NextResponse.json({ error: 'O slug deve ter pelo menos 3 caracteres' }, { status: 400 });
      }

      // Palavras reservadas
      const reservados = ['admin', 'api', 'login', 'dashboard', 'teste', 'test', 'humano', 'saude', 'humanosaude'];
      if (reservados.includes(slugNorm)) {
        return NextResponse.json({ error: 'Este nome não está disponível' }, { status: 400 });
      }

      // Verificar se já existe outro corretor com esse slug
      const { data: existente } = await supabase
        .from('corretores')
        .select('id')
        .eq('slug', slugNorm)
        .neq('id', corretorId)
        .single();

      if (existente) {
        return NextResponse.json({ error: 'Este link já está em uso. Tente outro nome.' }, { status: 409 });
      }

      const { error: updateErr } = await supabase
        .from('corretores')
        .update({ slug: slugNorm })
        .eq('id', corretorId);

      if (updateErr) {
        console.error('[perfil PATCH slug]', updateErr);
        return NextResponse.json({ error: 'Erro ao salvar link' }, { status: 500 });
      }

      return NextResponse.json({ success: true, slug: slugNorm, message: 'Link criado com sucesso!' });
    }

    // ── Atualizar e-mail ──────────────────────
    if (email) {
      const emailNorm = email.trim().toLowerCase();

      // Validar formato
      if (!emailNorm.includes('@') || !emailNorm.includes('.')) {
        return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
      }

      // Verificar se já existe outro corretor com esse email
      const { data: existente } = await supabase
        .from('corretores')
        .select('id')
        .eq('email', emailNorm)
        .neq('id', corretorId)
        .eq('ativo', true)
        .single();

      if (existente) {
        return NextResponse.json({ error: 'Este e-mail já está em uso por outro corretor' }, { status: 409 });
      }

      const { error: updateErr } = await supabase
        .from('corretores')
        .update({ email: emailNorm })
        .eq('id', corretorId);

      if (updateErr) {
        console.error('[perfil PATCH email]', updateErr);
        return NextResponse.json({ error: 'Erro ao atualizar e-mail' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'E-mail atualizado com sucesso' });
    }

    // ── Alterar senha ─────────────────────────
    if (senha_atual && nova_senha) {
      // Buscar corretor para verificar senha atual
      const { data: corretor } = await supabase
        .from('corretores')
        .select('id, metadata')
        .eq('id', corretorId)
        .single();

      if (!corretor) {
        return NextResponse.json({ error: 'Corretor não encontrado' }, { status: 404 });
      }

      const meta = (corretor.metadata || {}) as Record<string, unknown>;
      const senhaAtual = meta.senha_temporaria as string | undefined;

      // Verificar senha atual (em produção usar bcrypt)
      if (senhaAtual && senhaAtual !== senha_atual) {
        return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 });
      }

      // Validar nova senha
      if (nova_senha.length < 6) {
        return NextResponse.json({ error: 'A nova senha deve ter pelo menos 6 caracteres' }, { status: 400 });
      }

      // Atualizar senha no metadata
      const { error: updateErr } = await supabase
        .from('corretores')
        .update({
          metadata: {
            ...meta,
            senha_temporaria: nova_senha, // Em produção, usar hash bcrypt
            senha_alterada: true,
          },
        })
        .eq('id', corretorId);

      if (updateErr) {
        console.error('[perfil PATCH senha]', updateErr);
        return NextResponse.json({ error: 'Erro ao alterar senha' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Senha alterada com sucesso' });
    }

    return NextResponse.json({ error: 'Nenhum dado para atualizar' }, { status: 400 });
  } catch (err) {
    console.error('[perfil PATCH]', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
