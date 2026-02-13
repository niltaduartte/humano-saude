import { Resend } from 'resend';
import type { SendEmailOptions, SendEmailResult } from '@/lib/types/email';
import { logEmailToDb, updateEmailLog, injectTrackingPixel } from '@/lib/email-tracking';

// Lazy initialization para evitar erro durante build (env vars não disponíveis em build time)
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!);
  }
  return _resend;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Humano Saúde <noreply@humanosaude.com.br>';
const ADMIN_EMAILS = ['comercial@humanosaude.com.br'];
const CC_EMAILS = ['contato@helciomattos.com.br'];
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://humanosaude.com.br';

// URLs das logos (absolutas para funcionar em email — usar domínio de produção)
const LOGO_PRINCIPAL = 'https://humanosaude.com.br/images/logos/LOGO%201%20SEM%20FUNDO.png';
const LOGO_120 = 'https://humanosaude.com.br/images/logos/logo%20humano%20saude%20-%20120x120.png';

// ─── Layout base dos emails ────────────────────────────────
function emailLayout(content: string, showSpamWarning = false): string {
  const spamBlock = showSpamWarning ? `
    <div style="background-color:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:16px;margin-top:20px;" class="dm-card">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td width="24" valign="top" style="padding-right:10px;">⚠️</td>
          <td style="color:#92400E;font-size:13px;line-height:1.5;" class="dm-muted">
            <strong>Importante:</strong> Nossos e-mails podem cair na pasta <strong>Spam/Lixo Eletrônico</strong>. 
            Fique de olho e marque como "Não é spam" para receber os próximos comunicados normalmente.
          </td>
        </tr>
      </table>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <style>
        :root { color-scheme: light dark; }
        @media (prefers-color-scheme: dark) {
          .email-body { background-color: #0A0A0A !important; }
          .email-header { background-color: #050505 !important; }
          .email-card { background-color: #1A1A1A !important; border-color: #333 !important; }
          .dm-card { background-color: #252525 !important; border-color: #3A3A3A !important; }
          .dm-heading { color: #F5F5F5 !important; }
          .dm-text { color: #D4D4D4 !important; }
          .dm-muted { color: #A1A1AA !important; }
          .dm-label { color: #D4AF37 !important; }
          .dm-border { border-color: #333 !important; }
          .dm-box { background-color: #252525 !important; border-color: #3A3A3A !important; }
          .dm-code { background-color: #333 !important; color: #F5F5F5 !important; }
        }
      </style>
    </head>
    <body style="margin:0;padding:0;background-color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;" class="email-body">
      <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
        
        <!-- Header com logo -->
        <div style="text-align:center;margin-bottom:28px;background-color:#050505;border-radius:16px;padding:24px 16px;" class="email-header">
          <img src="${LOGO_PRINCIPAL}" alt="Humano Saúde" width="220" height="73" style="display:block;margin:0 auto;" />
        </div>
        
        <!-- Card principal -->
        <div style="background-color:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);" class="email-card">
          ${content}
        </div>
        
        ${spamBlock}
        
        <!-- Footer -->
        <div style="text-align:center;margin-top:24px;">
          <p style="color:#9CA3AF;font-size:11px;margin:0;">
            © ${new Date().getFullYear()} Humano Saúde — Todos os direitos reservados
          </p>
          <p style="color:#6B7280;font-size:10px;margin:4px 0 0;" class="dm-muted">
            Este é um e-mail automático. Em caso de dúvidas, responda diretamente ou escreva para
            <a href="mailto:comercial@humanosaude.com.br" style="color:#D4AF37;text-decoration:none;">comercial@humanosaude.com.br</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ─── Email de confirmação para o corretor ──────────────────
export async function enviarEmailConfirmacaoCadastro(dados: {
  nome: string;
  email: string;
  tipoPessoa: 'pf' | 'pj';
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('[email] RESEND_API_KEY não configurada, pulando envio');
      return { success: false, error: 'API key não configurada' };
    }

    const content = `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;background-color:#D4AF3720;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:28px;">✅</span>
        </div>
      </div>
      
      <h2 style="color:#111827;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;" class="dm-heading">
        Olá, ${dados.nome.split(' ')[0]}!
      </h2>
      <p style="color:#4B5563;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;" class="dm-text">
        Recebemos sua solicitação de cadastro como corretor${dados.tipoPessoa === 'pj' ? ' (Pessoa Jurídica)' : ''} parceiro da Humano Saúde.
      </p>
      
      <div style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:24px;" class="dm-box">
        <h3 style="color:#D4AF37;font-size:14px;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;" class="dm-label">
          📋 Próximos passos
        </h3>
        <ol style="color:#4B5563;font-size:14px;line-height:2;margin:0;padding-left:20px;" class="dm-text">
          <li>Nossa equipe analisará seu cadastro</li>
          <li>Você receberá um e-mail com a resposta em até <strong>48 horas úteis</strong></li>
          <li>Se aprovado, enviaremos seus dados de acesso e um link para completar seu onboarding</li>
        </ol>
      </div>
      
      <p style="color:#9CA3AF;font-size:13px;text-align:center;margin:0;" class="dm-muted">
        Caso tenha dúvidas, entre em contato pelo e-mail<br>
        <a href="mailto:comercial@humanosaude.com.br" style="color:#D4AF37;text-decoration:none;font-weight:600;">comercial@humanosaude.com.br</a>
      </p>
    `;

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: dados.email,
      subject: 'Cadastro recebido — Humano Saúde',
      html: emailLayout(content, true), // COM aviso de SPAM
    });

    if (error) {
      console.error('[email] Erro ao enviar confirmação:', error);
      return { success: false, error: error.message };
    }

    console.log('[email] Confirmação enviada para', dados.email, data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[email] Erro inesperado:', err);
    return { success: false, error: 'Erro inesperado ao enviar e-mail' };
  }
}

// ─── Email de notificação para admin (novo cadastro) ───────
export async function enviarEmailNotificacaoAdmin(dados: {
  nome: string;
  email: string;
  telefone: string;
  tipoPessoa: 'pf' | 'pj';
  cpf?: string | null;
  cnpj?: string | null;
  experienciaAnos?: number;
  comoConheceu?: string | null;
  motivacoes?: string[] | null;
  modalidade?: string | null;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('[email] RESEND_API_KEY não configurada, pulando notificação admin');
      return { success: false, error: 'API key não configurada' };
    }

    const motivacoesText = dados.motivacoes?.map(m => m.replace(/_/g, ' ')).join(', ') || '—';
    const documento = dados.tipoPessoa === 'pj' ? `CNPJ: ${dados.cnpj || '—'}` : `CPF: ${dados.cpf || '—'}`;
    const tipoBadge = dados.tipoPessoa === 'pj'
      ? '<span style="background-color:#DBEAFE;color:#1D4ED8;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;">PESSOA JURÍDICA</span>'
      : '<span style="background-color:#F3E8FF;color:#7C3AED;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;">PESSOA FÍSICA</span>';

    const content = `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;background-color:#D4AF3720;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:28px;">🆕</span>
        </div>
      </div>
      
      <h2 style="color:#111827;font-size:22px;text-align:center;margin:0 0 24px;font-weight:700;" class="dm-heading">
        Nova solicitação de cadastro
      </h2>
      
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;width:130px;font-weight:600;" class="dm-muted dm-border">Nome</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#111827;font-size:14px;font-weight:600;" class="dm-heading dm-border">${dados.nome}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">Tipo</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;" class="dm-border">${tipoBadge}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">E-mail</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#D4AF37;font-size:14px;font-weight:500;" class="dm-border">${dados.email}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">Telefone</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#374151;font-size:14px;" class="dm-text dm-border">${dados.telefone}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">Documento</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#374151;font-size:14px;" class="dm-text dm-border">${documento}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">Experiência</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#374151;font-size:14px;" class="dm-text dm-border">${dados.experienciaAnos || 0} anos</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">Motivações</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#374151;font-size:14px;" class="dm-text dm-border">${motivacoesText}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">Modalidade</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#374151;font-size:14px;" class="dm-text dm-border">${dados.modalidade || 'digital'}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted">Como conheceu</td>
          <td style="padding:12px 0;color:#374151;font-size:14px;" class="dm-text">${dados.comoConheceu?.replace(/_/g, ' ') || '—'}</td>
        </tr>
      </table>
      
      <div style="text-align:center;margin-top:28px;">
        <a href="${BASE_URL}/portal-interno-hks-2026/corretores" 
           style="display:inline-block;background-color:#D4AF37;color:#FFFFFF;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">
          Analisar Solicitação →
        </a>
      </div>
    `;

    // Resend: CC só funciona se o domínio do CC estiver verificado ou se enviar para o mesmo domínio
    // Para garantir, enviamos separadamente para CC se o principal falhar
    const emailOptions: {
      from: string;
      to: string[];
      cc?: string[];
      subject: string;
      html: string;
    } = {
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      subject: `Novo Corretor — ${dados.nome} (${dados.tipoPessoa.toUpperCase()})`,
      html: emailLayout(content, false),
    };

    // Tentar com CC
    try {
      emailOptions.cc = CC_EMAILS;
      const { data, error } = await getResend().emails.send(emailOptions);

      if (error) {
        // Se falhar com CC, tentar sem CC e enviar separado
        console.warn('[email] CC falhou, enviando sem CC:', error.message);
        delete emailOptions.cc;
        const { data: data2, error: error2 } = await getResend().emails.send(emailOptions);
        
        if (error2) {
          console.error('[email] Erro ao notificar admin:', error2);
          return { success: false, error: error2.message };
        }

        // Enviar cópia separada para CC
        try {
          await getResend().emails.send({
            from: FROM_EMAIL,
            to: CC_EMAILS,
            subject: `[CC] Novo Corretor — ${dados.nome} (${dados.tipoPessoa.toUpperCase()})`,
            html: emailLayout(content, false),
          });
        } catch (ccErr) {
          console.warn('[email] Cópia CC falhou (não crítico):', ccErr);
        }

        console.log('[email] Notificação admin enviada (sem CC)', data2?.id);
        return { success: true, id: data2?.id };
      }

      console.log('[email] Notificação admin enviada com CC', data?.id);
      return { success: true, id: data?.id };
    } catch (err) {
      console.error('[email] Erro inesperado notificação admin:', err);
      return { success: false, error: 'Erro inesperado' };
    }
  } catch (err) {
    console.error('[email] Erro inesperado notificação admin:', err);
    return { success: false, error: 'Erro inesperado' };
  }
}

// ─── Email de aprovação com dados de acesso ────────────────
export async function enviarEmailAprovacao(dados: {
  nome: string;
  email: string;
  onboardingLink: string;
  senhaTemporaria?: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('[email] RESEND_API_KEY não configurada, pulando envio');
      return { success: false, error: 'API key não configurada' };
    }

    const loginUrl = `${BASE_URL}/dashboard/corretor/login`;
    
    const dadosAcessoBlock = dados.senhaTemporaria ? `
      <div style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px;margin:20px 0;" class="dm-box">
        <h3 style="color:#166534;font-size:14px;margin:0 0 12px;font-weight:700;">
          🔐 Seus dados de acesso
        </h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:#6B7280;font-size:13px;width:100px;font-weight:600;" class="dm-muted">E-mail:</td>
            <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;" class="dm-heading">${dados.email}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#6B7280;font-size:13px;font-weight:600;" class="dm-muted">Senha:</td>
            <td style="padding:6px 0;font-size:14px;">
              <code style="background-color:#E5E7EB;padding:4px 10px;border-radius:6px;font-family:monospace;font-size:15px;color:#111827;font-weight:700;letter-spacing:1px;" class="dm-code">
                ${dados.senhaTemporaria}
              </code>
            </td>
          </tr>
        </table>
        <p style="color:#6B7280;font-size:12px;margin:10px 0 0;font-style:italic;" class="dm-muted">
          ⚠️ Recomendamos alterar sua senha após o primeiro acesso.
        </p>
      </div>
      
      <div style="text-align:center;margin-bottom:20px;">
        <a href="${loginUrl}" 
           style="display:inline-block;background-color:#D4AF37;color:#FFFFFF !important;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;margin-right:8px;">
          <span style="color:#FFFFFF !important;">Acessar Painel →</span>
        </a>
      </div>
    ` : '';

    const content = `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;background-color:#DCFCE7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:28px;">🎉</span>
        </div>
      </div>
      
      <h2 style="color:#111827;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;" class="dm-heading">
        Parabéns, ${dados.nome.split(' ')[0]}!
      </h2>
      <p style="color:#4B5563;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;" class="dm-text">
        Seu cadastro como corretor parceiro da Humano Saúde foi <strong style="color:#16A34A;">aprovado</strong>!
      </p>
      
      ${dadosAcessoBlock}
      
      <div style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:20px;" class="dm-box">
        <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:0 0 16px;" class="dm-text">
          Para finalizar, complete seu onboarding enviando seus documentos e dados bancários:
        </p>
        <div style="text-align:center;">
          <a href="${dados.onboardingLink}" 
             style="display:inline-block;background-color:#D4AF37;color:#FFFFFF;padding:14px 36px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;">
            Completar Onboarding →
          </a>
        </div>
      </div>
      
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">
        O link de onboarding é válido por 7 dias. Caso expire, entre em contato conosco.
      </p>
    `;

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: dados.email,
      subject: 'Cadastro aprovado — Humano Saúde',
      html: emailLayout(content, true), // COM aviso de SPAM
    });

    if (error) {
      console.error('[email] Erro ao enviar aprovação:', error);
      return { success: false, error: error.message };
    }

    console.log('[email] Email de aprovação enviado para', dados.email, data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[email] Erro inesperado:', err);
    return { success: false, error: 'Erro inesperado' };
  }
}

// ─── Email: Corretor solicitou alteração bancária ──────────
export async function enviarEmailAlteracaoBancariaCorretor(dados: {
  nome: string;
  email: string;
  bancoNovo: string;
  motivo: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'API key não configurada' };

    const content = `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;background-color:#D4AF3720;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:28px;">🏦</span>
        </div>
      </div>
      
      <h2 style="color:#111827;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;" class="dm-heading">
        Solicitação recebida
      </h2>
      <p style="color:#4B5563;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;" class="dm-text">
        Olá, ${dados.nome.split(' ')[0]}! Sua solicitação de alteração de conta bancária foi recebida.
      </p>
      
      <div style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:24px;" class="dm-box">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#6B7280;font-size:13px;width:130px;font-weight:600;" class="dm-muted">Novo Banco:</td>
            <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;" class="dm-heading">${dados.bancoNovo}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6B7280;font-size:13px;font-weight:600;" class="dm-muted">Motivo:</td>
            <td style="padding:8px 0;color:#374151;font-size:14px;" class="dm-text">${dados.motivo}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6B7280;font-size:13px;font-weight:600;" class="dm-muted">Status:</td>
            <td style="padding:8px 0;">
              <span style="background-color:#FEF3C7;color:#D4AF37;padding:3px 10px;border-radius:6px;font-size:12px;font-weight:700;">EM ANÁLISE</span>
            </td>
          </tr>
        </table>
      </div>
      
      <p style="color:#9CA3AF;font-size:13px;text-align:center;margin:0;">
        Nossa equipe analisará sua solicitação e você será notificado por e-mail sobre o resultado.<br>
        Sua conta atual permanece ativa até a aprovação.
      </p>
    `;

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: dados.email,
      subject: 'Solicitação de alteração bancária recebida — Humano Saúde',
      html: emailLayout(content, true),
    });

    if (error) { console.error('[email] alteracao bancaria corretor:', error); return { success: false, error: error.message }; }
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[email] alteracao bancaria corretor:', err);
    return { success: false, error: 'Erro inesperado' };
  }
}

// ─── Email: Admin notificado de alteração bancária ─────────
export async function enviarEmailAlteracaoBancariaAdmin(dados: {
  corretorNome: string;
  corretorEmail: string;
  bancoAntigo: string;
  bancoNovo: string;
  motivo: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'API key não configurada' };

    const content = `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;background-color:#FEE2E220;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:28px;">⚠️</span>
        </div>
      </div>
      
      <h2 style="color:#111827;font-size:22px;text-align:center;margin:0 0 24px;font-weight:700;" class="dm-heading">
        Solicitação de alteração bancária
      </h2>
      
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;width:130px;font-weight:600;" class="dm-muted dm-border">Corretor</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#111827;font-size:14px;font-weight:600;" class="dm-heading dm-border">${dados.corretorNome}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">E-mail</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#D4AF37;font-size:14px;" class="dm-border">${dados.corretorEmail}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">Banco Atual</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#374151;font-size:14px;" class="dm-text dm-border">${dados.bancoAntigo}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">Novo Banco</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#111827;font-size:14px;font-weight:600;" class="dm-heading dm-border">${dados.bancoNovo}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted">Motivo</td>
          <td style="padding:12px 0;color:#374151;font-size:14px;" class="dm-text">${dados.motivo}</td>
        </tr>
      </table>
      
      <div style="text-align:center;margin-top:28px;">
        <a href="${BASE_URL}/portal-interno-hks-2026/corretores" 
           style="display:inline-block;background-color:#D4AF37;color:#FFFFFF;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">
          Analisar Solicitação →
        </a>
      </div>
    `;

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      subject: `Alteração Bancária — ${dados.corretorNome}`,
      html: emailLayout(content, false),
    });

    if (error) { console.error('[email] alteracao bancaria admin:', error); return { success: false, error: error.message }; }
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[email] alteracao bancaria admin:', err);
    return { success: false, error: 'Erro inesperado' };
  }
}

// ─── Email: Alteração bancária APROVADA ────────────────────
export async function enviarEmailAlteracaoBancariaAprovada(dados: {
  nome: string;
  email: string;
  bancoNovo: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'API key não configurada' };

    const content = `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;background-color:#DCFCE7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:28px;">✅</span>
        </div>
      </div>
      
      <h2 style="color:#111827;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;" class="dm-heading">
        Alteração bancária aprovada!
      </h2>
      <p style="color:#4B5563;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;" class="dm-text">
        Olá, ${dados.nome.split(' ')[0]}! Sua solicitação de alteração de conta bancária foi <strong style="color:#16A34A;">aprovada</strong>.
      </p>
      
      <div style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px;margin-bottom:24px;" class="dm-box">
        <h3 style="color:#166534;font-size:14px;margin:0 0 10px;font-weight:700;">
          🏦 Nova conta ativa
        </h3>
        <p style="color:#4B5563;font-size:14px;margin:0;" class="dm-text">
          <strong>${dados.bancoNovo}</strong> — Seus próximos pagamentos serão creditados nesta conta.
        </p>
      </div>
      
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;" class="dm-muted">
        A conta anterior foi desativada e consta no seu histórico para fins de auditoria.
      </p>
    `;

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: dados.email,
      subject: 'Alteração bancária aprovada — Humano Saúde',
      html: emailLayout(content, true),
    });

    if (error) { console.error('[email] alteracao aprovada:', error); return { success: false, error: error.message }; }
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[email] alteracao aprovada:', err);
    return { success: false, error: 'Erro inesperado' };
  }
}

// ─── Email: Alteração bancária REJEITADA ───────────────────
export async function enviarEmailAlteracaoBancariaRejeitada(dados: {
  nome: string;
  email: string;
  motivo: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'API key não configurada' };

    const content = `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;background-color:#FEE2E2;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:28px;">❌</span>
        </div>
      </div>
      
      <h2 style="color:#111827;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;" class="dm-heading">
        Alteração bancária não aprovada
      </h2>
      <p style="color:#4B5563;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;" class="dm-text">
        Olá, ${dados.nome.split(' ')[0]}. Infelizmente sua solicitação de alteração de conta bancária não foi aprovada.
      </p>
      
      <div style="background-color:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:20px;margin-bottom:24px;" class="dm-box">
        <h3 style="color:#991B1B;font-size:14px;margin:0 0 10px;font-weight:700;">
          Motivo
        </h3>
        <p style="color:#4B5563;font-size:14px;margin:0;" class="dm-text">
          ${dados.motivo}
        </p>
      </div>
      
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;" class="dm-muted">
        Sua conta bancária atual continua ativa. Caso queira, você pode enviar uma nova solicitação.<br>
        Em caso de dúvidas, entre em contato pelo e-mail
        <a href="mailto:comercial@humanosaude.com.br" style="color:#D4AF37;text-decoration:none;font-weight:600;">comercial@humanosaude.com.br</a>
      </p>
    `;

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: dados.email,
      subject: 'Alteração bancária não aprovada — Humano Saúde',
      html: emailLayout(content, true),
    });

    if (error) { console.error('[email] alteracao rejeitada:', error); return { success: false, error: error.message }; }
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[email] alteracao rejeitada:', err);
    return { success: false, error: 'Erro inesperado' };
  }
}

// ─── Email: Corretor completou onboarding — aguarde verificação ──
export async function enviarEmailAguardeVerificacao(dados: {
  nome: string;
  email: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'API key não configurada' };

    const content = `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;background-color:#DCFCE7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:28px;">&#9989;</span>
        </div>
      </div>
      
      <h2 style="color:#111827;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;" class="dm-heading">
        Documentos recebidos com sucesso!
      </h2>
      <p style="color:#4B5563;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;" class="dm-text">
        Olá, ${dados.nome.split(' ')[0]}! Seu onboarding foi concluído e seus documentos e dados bancários foram enviados.
      </p>
      
      <div style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:24px;" class="dm-box">
        <h3 style="color:#D4AF37;font-size:14px;margin:0 0 10px;font-weight:700;" class="dm-label">
          Agora é com a gente!
        </h3>
        <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:0;" class="dm-text">
          Nossa equipe irá verificar suas informações. Esse processo leva até <strong>48 horas úteis</strong>.<br>
          Assim que a verificação for concluída, você receberá um e-mail com seus dados de acesso ao painel do corretor.
        </p>
      </div>
      
      <p style="color:#9CA3AF;font-size:13px;text-align:center;margin:0;" class="dm-muted">
        Enquanto isso, fique tranquilo — entraremos em contato em breve!<br>
        Em caso de dúvidas: <a href="mailto:comercial@humanosaude.com.br" style="color:#D4AF37;text-decoration:none;font-weight:600;">comercial@humanosaude.com.br</a>
      </p>
    `;

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: dados.email,
      subject: 'Onboarding concluído — Aguarde a verificação — Humano Saúde',
      html: emailLayout(content, true),
    });

    if (error) { console.error('[email] aguarde verificacao:', error); return { success: false, error: error.message }; }
    console.log('[email] Email aguarde verificação enviado para', dados.email, data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[email] aguarde verificacao:', err);
    return { success: false, error: 'Erro inesperado' };
  }
}

// ─── Email: Admin notificado de onboarding concluído ───────
export async function enviarEmailOnboardingConcluidoAdmin(dados: {
  corretorNome: string;
  corretorEmail: string;
  corretorTelefone?: string;
  corretorCpf?: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'API key não configurada' };

    const content = `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;background-color:#DCFCE7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:28px;">&#128203;</span>
        </div>
      </div>
      
      <h2 style="color:#111827;font-size:22px;text-align:center;margin:0 0 24px;font-weight:700;" class="dm-heading">
        Onboarding concluído
      </h2>
      
      <p style="color:#4B5563;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;" class="dm-text">
        O corretor <strong>${dados.corretorNome}</strong> completou o onboarding e enviou todos os documentos e dados bancários.
      </p>
      
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;width:130px;font-weight:600;" class="dm-muted dm-border">Corretor</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#111827;font-size:14px;font-weight:600;" class="dm-heading dm-border">${dados.corretorNome}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">E-mail</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#D4AF37;font-size:14px;" class="dm-border">${dados.corretorEmail}</td>
        </tr>
        ${dados.corretorTelefone ? `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">Telefone</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#374151;font-size:14px;" class="dm-text dm-border">${dados.corretorTelefone}</td>
        </tr>
        ` : ''}
        ${dados.corretorCpf ? `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted dm-border">CPF</td>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#374151;font-size:14px;" class="dm-text dm-border">${dados.corretorCpf}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding:12px 0;color:#6B7280;font-size:12px;text-transform:uppercase;font-weight:600;" class="dm-muted">Status</td>
          <td style="padding:12px 0;">
            <span style="background-color:#DCFCE7;color:#166534;padding:3px 10px;border-radius:6px;font-size:12px;font-weight:700;">DOCUMENTOS ENVIADOS</span>
          </td>
        </tr>
      </table>
      
      <div style="text-align:center;margin-top:28px;">
        <a href="${BASE_URL}/portal-interno-hks-2026/corretores" 
           style="display:inline-block;background-color:#D4AF37;color:#FFFFFF;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">
          Verificar Documentos →
        </a>
      </div>
    `;

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      subject: `Onboarding concluído — ${dados.corretorNome}`,
      html: emailLayout(content, false),
    });

    if (error) { console.error('[email] onboarding concluido admin:', error); return { success: false, error: error.message }; }
    console.log('[email] Email onboarding concluído admin enviado', data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[email] onboarding concluido admin:', err);
    return { success: false, error: 'Erro inesperado' };
  }
}

// ─── Email de convite: "Alguém te convidou!" ───────────────
export async function enviarEmailConviteCorretor(dados: {
  emailConvidado: string;
  nomeConvidante: string;
}) {
  try {
    const content = `
      <h2 style="color:#111827;font-size:26px;font-weight:800;margin:0 0 8px;text-align:center;" class="dm-heading">
        Você foi convidado!
      </h2>
      
      <p style="color:#4B5563;font-size:16px;line-height:1.7;text-align:center;margin:0 0 24px;" class="dm-text">
        <strong style="color:#111827;" class="dm-heading">${dados.nomeConvidante}</strong> acredita no seu potencial e te convidou para fazer parte 
        da <strong style="color:#D4AF37;">rede de corretores da Humano Saúde</strong>.
      </p>
      
      <div style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:24px;" class="dm-box">
        <p style="color:#111827;font-size:16px;font-weight:700;margin:0 0 12px;" class="dm-heading">Por que ser um corretor Humano Saúde?</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:6px 0;color:#4B5563;font-size:15px;" class="dm-text">✅ Comissões competitivas acima do mercado</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#4B5563;font-size:15px;" class="dm-text">✅ Plataforma completa com CRM e Pipeline</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#4B5563;font-size:15px;" class="dm-text">✅ Leads qualificados direto no seu painel</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#4B5563;font-size:15px;" class="dm-text">✅ Suporte pós-venda dedicado</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#4B5563;font-size:15px;" class="dm-text">✅ Treinamento contínuo e materiais exclusivos</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align:center;margin-bottom:16px;">
        <a href="${BASE_URL}/seja-corretor" 
           style="display:inline-block;background-color:#D4AF37;color:#FFFFFF !important;padding:16px 40px;border-radius:12px;font-size:16px;font-weight:700;text-decoration:none;">
          <span style="color:#FFFFFF !important;">Conheça o Programa →</span>
        </a>
      </div>
      
      <p style="color:#9CA3AF;font-size:14px;text-align:center;margin:0;" class="dm-muted">
        Acesse e cadastre-se. É rápido, gratuito e sem burocracia.
      </p>
    `;

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: [dados.emailConvidado],
      subject: 'Humano Saude te convidou para ser Especialista em Seguros',
      html: emailLayout(content, false),
    });

    if (error) { console.error('[email] convite corretor:', error); return { success: false, error: error.message }; }
    console.log('[email] Email convite corretor enviado', data?.id);
    return { success: true, id: data?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[email] convite corretor erro:', msg, err);
    return { success: false, error: msg || 'Erro inesperado' };
  }
}

// ─────────────────────────────────────────────────────────────
// BLUEPRINT 14: Central transactional email sender with
// DB logging, tracking pixel injection, and Resend integration.
// ─────────────────────────────────────────────────────────────

/**
 * Central function to send any email with full tracking.
 * Logs to email_logs table, injects tracking pixel, sends via Resend.
 */
export async function sendTransactionalEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('[email] RESEND_API_KEY não configurada, pulando envio');
      return { success: false, error: 'API key não configurada' };
    }

    const to = Array.isArray(options.to) ? options.to : [options.to];

    // 1. Pre-log to DB (status: queued) to get the log ID for tracking pixel
    const logId = await logEmailToDb({
      ...options,
      status: 'queued',
      saveHtmlContent: options.saveHtmlContent !== false,
    });

    // 2. Inject tracking pixel if we have a log ID
    let finalHtml = options.html;
    if (logId && options.injectTrackingPixel !== false) {
      finalHtml = injectTrackingPixel(finalHtml, logId);
    }

    // 3. Send via Resend
    const { data, error } = await getResend().emails.send({
      from: options.from || FROM_EMAIL,
      to,
      cc: options.cc,
      bcc: options.bcc,
      replyTo: options.replyTo,
      subject: options.subject,
      html: finalHtml,
      text: options.text,
    });

    if (error) {
      console.error('[email] Resend error:', error);
      // Update DB log with failure
      if (logId) {
        await updateEmailLog(logId, {
          status: 'failed',
          error_message: error.message,
          failed_at: new Date().toISOString(),
        });
      }
      return { success: false, error: error.message, logId: logId || undefined };
    }

    // 4. Update DB log with Resend ID
    if (logId && data?.id) {
      await updateEmailLog(logId, {
        resend_id: data.id,
        status: 'sent',
        html_content: options.saveHtmlContent !== false ? finalHtml : undefined,
      });
    }

    console.log('[email] Sent:', options.subject, '→', to.join(', '), data?.id);
    return { success: true, id: data?.id, logId: logId || undefined };
  } catch (err) {
    console.error('[email] Unexpected error in sendTransactionalEmail:', err);
    return { success: false, error: 'Erro inesperado ao enviar e-mail' };
  }
}

// ─── Email: Boas-vindas (Welcome) ───────────────────────────
export async function sendWelcomeEmail(dados: {
  nome: string;
  email: string;
}): Promise<SendEmailResult> {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:56px;height:56px;background-color:#D4AF3720;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
        <span style="font-size:28px;">👋</span>
      </div>
    </div>
    
    <h2 style="color:#111827;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;" class="dm-heading">
      Bem-vindo(a), ${dados.nome.split(' ')[0]}!
    </h2>
    <p style="color:#4B5563;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;" class="dm-text">
      Estamos felizes em ter você conosco. A <strong style="color:#D4AF37;">Humano Saúde</strong> está pronta para ajudá-lo a encontrar o plano de saúde ideal.
    </p>
    
    <div style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:24px;" class="dm-box">
      <h3 style="color:#D4AF37;font-size:14px;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;" class="dm-label">
        🎯 O que você pode fazer agora
      </h3>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr><td style="padding:6px 0;color:#4B5563;font-size:14px;" class="dm-text">✅ Comparar planos de saúde com economia real</td></tr>
        <tr><td style="padding:6px 0;color:#4B5563;font-size:14px;" class="dm-text">✅ Fazer uma cotação online em poucos minutos</td></tr>
        <tr><td style="padding:6px 0;color:#4B5563;font-size:14px;" class="dm-text">✅ Falar com um especialista via WhatsApp</td></tr>
      </table>
    </div>
    
    <div style="text-align:center;margin-bottom:16px;">
      <a href="${BASE_URL}/economizar" 
         style="display:inline-block;background-color:#D4AF37;color:#FFFFFF;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">
        Ver Planos com Desconto →
      </a>
    </div>
    
    <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;" class="dm-muted">
      Em caso de dúvidas, responda este e-mail ou escreva para
      <a href="mailto:comercial@humanosaude.com.br" style="color:#D4AF37;text-decoration:none;">comercial@humanosaude.com.br</a>
    </p>
  `;

  return sendTransactionalEmail({
    to: dados.email,
    subject: 'Bem-vindo(a) à Humano Saúde! 👋',
    html: emailLayout(content, true),
    templateName: 'welcome',
    emailType: 'transactional',
    category: 'onboarding',
    tags: ['welcome', 'new-user'],
    triggeredBy: 'system',
  });
}

// ─── Email: Confirmação de compra ────────────────────────────
export async function sendPurchaseConfirmationEmail(dados: {
  nome: string;
  email: string;
  plano: string;
  operadora: string;
  valor: string;
  vigencia: string;
  protocolo: string;
}): Promise<SendEmailResult> {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:56px;height:56px;background-color:#DCFCE7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
        <span style="font-size:28px;">🎉</span>
      </div>
    </div>
    
    <h2 style="color:#111827;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;" class="dm-heading">
      Compra confirmada!
    </h2>
    <p style="color:#4B5563;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;" class="dm-text">
      Parabéns, ${dados.nome.split(' ')[0]}! Seu plano de saúde foi contratado com sucesso.
    </p>
    
    <div style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:24px;" class="dm-box">
      <h3 style="color:#D4AF37;font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;" class="dm-label">
        📋 Detalhes do plano
      </h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:13px;width:130px;font-weight:600;" class="dm-muted dm-border">Protocolo</td>
          <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;color:#111827;font-size:14px;font-weight:700;" class="dm-heading dm-border">
            <code style="background-color:#E5E7EB;padding:3px 8px;border-radius:4px;font-family:monospace;" class="dm-code">${dados.protocolo}</code>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:13px;font-weight:600;" class="dm-muted dm-border">Operadora</td>
          <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;color:#111827;font-size:14px;font-weight:600;" class="dm-heading dm-border">${dados.operadora}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:13px;font-weight:600;" class="dm-muted dm-border">Plano</td>
          <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;color:#374151;font-size:14px;" class="dm-text dm-border">${dados.plano}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:13px;font-weight:600;" class="dm-muted dm-border">Valor</td>
          <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;" class="dm-border">
            <span style="color:#16A34A;font-size:18px;font-weight:800;">R$ ${dados.valor}</span><span style="color:#9CA3AF;font-size:12px;">/mês</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6B7280;font-size:13px;font-weight:600;" class="dm-muted">Vigência</td>
          <td style="padding:8px 0;color:#374151;font-size:14px;" class="dm-text">${dados.vigencia}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:16px;margin-bottom:24px;" class="dm-card">
      <p style="color:#92400E;font-size:13px;margin:0;line-height:1.5;" class="dm-muted">
        <strong>📌 Importante:</strong> Guarde o número do protocolo para acompanhar o andamento da sua proposta.
        Sua carência será contada a partir da data de vigência.
      </p>
    </div>
    
    <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;" class="dm-muted">
      Em caso de dúvidas, entre em contato:
      <a href="mailto:comercial@humanosaude.com.br" style="color:#D4AF37;text-decoration:none;font-weight:600;">comercial@humanosaude.com.br</a>
    </p>
  `;

  return sendTransactionalEmail({
    to: dados.email,
    subject: `Compra confirmada — ${dados.plano} — Humano Saúde`,
    html: emailLayout(content, true),
    templateName: 'purchase_confirmation',
    emailType: 'transactional',
    category: 'vendas',
    tags: ['purchase', 'confirmation', dados.operadora.toLowerCase()],
    triggeredBy: 'system',
    metadata: { protocolo: dados.protocolo, plano: dados.plano, operadora: dados.operadora },
  });
}

// ─── Email: PIX pendente ─────────────────────────────────────
export async function sendPixPendingEmail(dados: {
  nome: string;
  email: string;
  valor: string;
  pixCode: string;
  expiresAt: string;
}): Promise<SendEmailResult> {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:56px;height:56px;background-color:#D4AF3720;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
        <span style="font-size:28px;">💰</span>
      </div>
    </div>
    
    <h2 style="color:#111827;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;" class="dm-heading">
      Pagamento via PIX pendente
    </h2>
    <p style="color:#4B5563;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;" class="dm-text">
      Olá, ${dados.nome.split(' ')[0]}! Seu pagamento via PIX está aguardando confirmação.
    </p>
    
    <div style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;" class="dm-box">
      <p style="color:#6B7280;font-size:13px;margin:0 0 8px;text-transform:uppercase;font-weight:600;" class="dm-muted">Valor a pagar</p>
      <p style="color:#16A34A;font-size:32px;font-weight:800;margin:0 0 16px;">R$ ${dados.valor}</p>
      
      <p style="color:#6B7280;font-size:12px;margin:0 0 8px;text-transform:uppercase;font-weight:600;" class="dm-muted">Código PIX (Copia e Cola)</p>
      <div style="background-color:#E5E7EB;border-radius:8px;padding:12px;margin-bottom:12px;word-break:break-all;" class="dm-code">
        <code style="font-family:monospace;font-size:12px;color:#111827;line-height:1.4;">${dados.pixCode}</code>
      </div>
      
      <p style="color:#EF4444;font-size:13px;margin:0;font-weight:600;">
        ⏰ Expira em: ${dados.expiresAt}
      </p>
    </div>
    
    <div style="background-color:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:16px;margin-bottom:24px;" class="dm-card">
      <p style="color:#991B1B;font-size:13px;margin:0;line-height:1.5;" class="dm-muted">
        <strong>⚠️ Atenção:</strong> O código PIX tem validade limitada. Após o vencimento, será necessário gerar um novo código.
      </p>
    </div>
    
    <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;" class="dm-muted">
      Dúvidas sobre o pagamento? Entre em contato:
      <a href="mailto:comercial@humanosaude.com.br" style="color:#D4AF37;text-decoration:none;font-weight:600;">comercial@humanosaude.com.br</a>
    </p>
  `;

  return sendTransactionalEmail({
    to: dados.email,
    subject: `PIX pendente — R$ ${dados.valor} — Humano Saúde`,
    html: emailLayout(content, true),
    templateName: 'pix_pending',
    emailType: 'transactional',
    category: 'financeiro',
    tags: ['pix', 'payment', 'pending'],
    triggeredBy: 'system',
    metadata: { valor: dados.valor },
  });
}

// ─── Re-export getResend for admin resend route ──────────────
export { getResend as _getResend };
