import { Resend } from 'resend';

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
    <div style="background-color:#252525;border:1px solid #3A3A3A;border-radius:12px;padding:16px;margin-top:20px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td width="24" valign="top" style="padding-right:10px;">⚠️</td>
          <td style="color:#D4AF37;font-size:13px;line-height:1.5;">
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
      <meta name="color-scheme" content="dark">
      <meta name="supported-color-schemes" content="dark">
      <style>
        :root { color-scheme: dark; supported-color-schemes: dark; }
        [data-ogsb] { background-color: inherit !important; }
        a[x-apple-data-detectors] { color: inherit !important; }
      </style>
    </head>
    <body style="margin:0;padding:0;background-color:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;" data-ogsb="true">
      <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
        
        <!-- Header com logo -->
        <div style="text-align:center;margin-bottom:28px;background-color:#050505;border-radius:16px;padding:24px 16px;" data-ogsb="true">
          <img src="${LOGO_PRINCIPAL}" alt="Humano Saúde" width="220" height="73" style="display:block;margin:0 auto;" />
        </div>
        
        <!-- Card principal -->
        <div style="background-color:#1A1A1A;border:1px solid #333;border-radius:16px;padding:32px;" data-ogsb="true">
          ${content}
        </div>
        
        ${spamBlock}
        
        <!-- Footer -->
        <div style="text-align:center;margin-top:24px;">
          <p style="color:#9CA3AF;font-size:11px;margin:0;">
            © ${new Date().getFullYear()} Humano Saúde — Todos os direitos reservados
          </p>
          <p style="color:#D1D5DB;font-size:10px;margin:4px 0 0;">
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
      
      <h2 style="color:#F5F5F5;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;">
        Olá, ${dados.nome.split(' ')[0]}!
      </h2>
      <p style="color:#A1A1AA;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;">
        Recebemos sua solicitação de cadastro como corretor${dados.tipoPessoa === 'pj' ? ' (Pessoa Jurídica)' : ''} parceiro da Humano Saúde.
      </p>
      
      <div style="background-color:#252525;border:1px solid #3A3A3A;border-radius:12px;padding:20px;margin-bottom:24px;">
        <h3 style="color:#D4AF37;font-size:14px;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">
          📋 Próximos passos
        </h3>
        <ol style="color:#A1A1AA;font-size:14px;line-height:2;margin:0;padding-left:20px;">
          <li>Nossa equipe analisará seu cadastro</li>
          <li>Você receberá um e-mail com a resposta em até <strong>48 horas úteis</strong></li>
          <li>Se aprovado, enviaremos seus dados de acesso e um link para completar seu onboarding</li>
        </ol>
      </div>
      
      <p style="color:#9CA3AF;font-size:13px;text-align:center;margin:0;">
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
      
      <h2 style="color:#F5F5F5;font-size:22px;text-align:center;margin:0 0 24px;font-weight:700;">
        Nova solicitação de cadastro
      </h2>
      
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;width:130px;font-weight:600;">Nome</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#E5E5E5;font-size:14px;font-weight:600;">${dados.nome}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">Tipo</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;">${tipoBadge}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">E-mail</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#D4AF37;font-size:14px;font-weight:500;">${dados.email}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">Telefone</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#D4D4D4;font-size:14px;">${dados.telefone}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">Documento</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#D4D4D4;font-size:14px;">${documento}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">Experiência</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#D4D4D4;font-size:14px;">${dados.experienciaAnos || 0} anos</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">Motivações</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#D4D4D4;font-size:14px;">${motivacoesText}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">Modalidade</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#D4D4D4;font-size:14px;">${dados.modalidade || 'digital'}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">Como conheceu</td>
          <td style="padding:12px 0;color:#D4D4D4;font-size:14px;">${dados.comoConheceu?.replace(/_/g, ' ') || '—'}</td>
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
      <div style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px;margin:20px 0;">
        <h3 style="color:#166534;font-size:14px;margin:0 0 12px;font-weight:700;">
          🔐 Seus dados de acesso
        </h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:#A1A1AA;font-size:13px;width:100px;font-weight:600;">E-mail:</td>
            <td style="padding:6px 0;color:#E5E5E5;font-size:14px;font-weight:600;">${dados.email}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#A1A1AA;font-size:13px;font-weight:600;">Senha:</td>
            <td style="padding:6px 0;font-size:14px;">
              <code style="background-color:#333;padding:4px 10px;border-radius:6px;font-family:monospace;font-size:15px;color:#F5F5F5;font-weight:700;letter-spacing:1px;">
                ${dados.senhaTemporaria}
              </code>
            </td>
          </tr>
        </table>
        <p style="color:#6B7280;font-size:12px;margin:10px 0 0;font-style:italic;">
          ⚠️ Recomendamos alterar sua senha após o primeiro acesso.
        </p>
      </div>
      
      <div style="text-align:center;margin-bottom:20px;">
        <a href="${loginUrl}" 
           style="display:inline-block;background-color:#D4AF37;color:#FFFFFF !important;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;margin-right:8px;" data-ogsb="true">
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
      
      <h2 style="color:#F5F5F5;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;">
        Parabéns, ${dados.nome.split(' ')[0]}!
      </h2>
      <p style="color:#A1A1AA;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;">
        Seu cadastro como corretor parceiro da Humano Saúde foi <strong style="color:#16A34A;">aprovado</strong>!
      </p>
      
      ${dadosAcessoBlock}
      
      <div style="background-color:#252525;border:1px solid #3A3A3A;border-radius:12px;padding:20px;margin-bottom:20px;">
        <p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 16px;">
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
      
      <h2 style="color:#F5F5F5;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;">
        Solicitação recebida
      </h2>
      <p style="color:#A1A1AA;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;">
        Olá, ${dados.nome.split(' ')[0]}! Sua solicitação de alteração de conta bancária foi recebida.
      </p>
      
      <div style="background-color:#252525;border:1px solid #3A3A3A;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#A1A1AA;font-size:13px;width:130px;font-weight:600;">Novo Banco:</td>
            <td style="padding:8px 0;color:#E5E5E5;font-size:14px;font-weight:600;">${dados.bancoNovo}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#A1A1AA;font-size:13px;font-weight:600;">Motivo:</td>
            <td style="padding:8px 0;color:#D4D4D4;font-size:14px;">${dados.motivo}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#A1A1AA;font-size:13px;font-weight:600;">Status:</td>
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
      
      <h2 style="color:#F5F5F5;font-size:22px;text-align:center;margin:0 0 24px;font-weight:700;">
        Solicitação de alteração bancária
      </h2>
      
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;width:130px;font-weight:600;">Corretor</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#E5E5E5;font-size:14px;font-weight:600;">${dados.corretorNome}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">E-mail</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#D4AF37;font-size:14px;">${dados.corretorEmail}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">Banco Atual</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#D4D4D4;font-size:14px;">${dados.bancoAntigo}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">Novo Banco</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#E5E5E5;font-size:14px;font-weight:600;">${dados.bancoNovo}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">Motivo</td>
          <td style="padding:12px 0;color:#D4D4D4;font-size:14px;">${dados.motivo}</td>
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
      
      <h2 style="color:#F5F5F5;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;">
        Alteração bancária aprovada!
      </h2>
      <p style="color:#A1A1AA;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;">
        Olá, ${dados.nome.split(' ')[0]}! Sua solicitação de alteração de conta bancária foi <strong style="color:#16A34A;">aprovada</strong>.
      </p>
      
      <div style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <h3 style="color:#166534;font-size:14px;margin:0 0 10px;font-weight:700;">
          🏦 Nova conta ativa
        </h3>
        <p style="color:#A1A1AA;font-size:14px;margin:0;">
          <strong>${dados.bancoNovo}</strong> — Seus próximos pagamentos serão creditados nesta conta.
        </p>
      </div>
      
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">
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
      
      <h2 style="color:#F5F5F5;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;">
        Alteração bancária não aprovada
      </h2>
      <p style="color:#A1A1AA;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;">
        Olá, ${dados.nome.split(' ')[0]}. Infelizmente sua solicitação de alteração de conta bancária não foi aprovada.
      </p>
      
      <div style="background-color:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:20px;margin-bottom:24px;">
        <h3 style="color:#991B1B;font-size:14px;margin:0 0 10px;font-weight:700;">
          Motivo
        </h3>
        <p style="color:#A1A1AA;font-size:14px;margin:0;">
          ${dados.motivo}
        </p>
      </div>
      
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">
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
      
      <h2 style="color:#F5F5F5;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;">
        Documentos recebidos com sucesso!
      </h2>
      <p style="color:#A1A1AA;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;">
        Olá, ${dados.nome.split(' ')[0]}! Seu onboarding foi concluído e seus documentos e dados bancários foram enviados.
      </p>
      
      <div style="background-color:#252525;border:1px solid #3A3A3A;border-radius:12px;padding:20px;margin-bottom:24px;">
        <h3 style="color:#D4AF37;font-size:14px;margin:0 0 10px;font-weight:700;">
          Agora é com a gente!
        </h3>
        <p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0;">
          Nossa equipe irá verificar suas informações. Esse processo leva até <strong>48 horas úteis</strong>.<br>
          Assim que a verificação for concluída, você receberá um e-mail com seus dados de acesso ao painel do corretor.
        </p>
      </div>
      
      <p style="color:#9CA3AF;font-size:13px;text-align:center;margin:0;">
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
      
      <h2 style="color:#F5F5F5;font-size:22px;text-align:center;margin:0 0 24px;font-weight:700;">
        Onboarding concluído
      </h2>
      
      <p style="color:#A1A1AA;font-size:15px;text-align:center;line-height:1.6;margin:0 0 24px;">
        O corretor <strong>${dados.corretorNome}</strong> completou o onboarding e enviou todos os documentos e dados bancários.
      </p>
      
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;width:130px;font-weight:600;">Corretor</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#E5E5E5;font-size:14px;font-weight:600;">${dados.corretorNome}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">E-mail</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#D4AF37;font-size:14px;">${dados.corretorEmail}</td>
        </tr>
        ${dados.corretorTelefone ? `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">Telefone</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#D4D4D4;font-size:14px;">${dados.corretorTelefone}</td>
        </tr>
        ` : ''}
        ${dados.corretorCpf ? `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">CPF</td>
          <td style="padding:12px 0;border-bottom:1px solid #333;color:#D4D4D4;font-size:14px;">${dados.corretorCpf}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding:12px 0;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:600;">Status</td>
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
      <h2 style="color:#F5F5F5;font-size:26px;font-weight:800;margin:0 0 8px;text-align:center;">
        Você foi convidado!
      </h2>
      
      <p style="color:#A1A1AA;font-size:16px;line-height:1.7;text-align:center;margin:0 0 24px;">
        <strong style="color:#F5F5F5;">${dados.nomeConvidante}</strong> acredita no seu potencial e te convidou para fazer parte 
        da <strong style="color:#D4AF37;">rede de corretores da Humano Saúde</strong>.
      </p>
      
      <div style="background-color:#252525;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#E5E5E5;font-size:16px;font-weight:700;margin:0 0 12px;">Por que ser um corretor Humano Saúde?</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:6px 0;color:#A1A1AA;font-size:15px;">✅ Comissões competitivas acima do mercado</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#A1A1AA;font-size:15px;">✅ Plataforma completa com CRM e Pipeline</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#A1A1AA;font-size:15px;">✅ Leads qualificados direto no seu painel</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#A1A1AA;font-size:15px;">✅ Suporte pós-venda dedicado</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#A1A1AA;font-size:15px;">✅ Treinamento contínuo e materiais exclusivos</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align:center;margin-bottom:16px;">
        <a href="${BASE_URL}/seja-corretor" 
           style="display:inline-block;background-color:#D4AF37;color:#FFFFFF !important;padding:16px 40px;border-radius:12px;font-size:16px;font-weight:700;text-decoration:none;" data-ogsb="true">
          <span style="color:#FFFFFF !important;">Conheça o Programa →</span>
        </a>
      </div>
      
      <p style="color:#71717A;font-size:14px;text-align:center;margin:0;">
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
