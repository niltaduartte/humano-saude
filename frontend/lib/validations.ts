import { z } from 'zod';

// ============================================
// HELPERS
// ============================================

/** Remove todos os caracteres não-numéricos */
const cleanPhone = (phone: string) => phone.replace(/\D/g, '');

/** Valida telefone brasileiro (10-11 dígitos, DDD 11-99, não repetido) */
const isValidBrazilianPhone = (phone: string): boolean => {
  const digits = cleanPhone(phone);
  if (digits.length < 10 || digits.length > 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  const ddd = parseInt(digits.substring(0, 2));
  return ddd >= 11 && ddd <= 99;
};

/** Valida nome (min 3 chars, pelo menos 1 letra, não só números) */
const isValidName = (name: string): boolean => {
  if (name.trim().length < 3) return false;
  if (!/[a-zA-ZÀ-ÿ]/.test(name)) return false;
  if (/^\d+$/.test(name.trim())) return false;
  return true;
};

// ============================================
// SCHEMAS – LANDING PAGE HERO LEAD
// ============================================

export const heroLeadSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .refine(isValidName, 'Nome inválido'),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
  telefone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .refine(isValidBrazilianPhone, 'Telefone inválido. Ex: (21) 98888-7777'),
  perfil: z
    .string()
    .min(1, 'Selecione seu perfil'),
});

export type HeroLeadInput = z.infer<typeof heroLeadSchema>;

// ============================================
// SCHEMAS – CALCULADORA WIZARD LEAD
// ============================================

export const calculatorLeadSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .refine(isValidName, 'Nome inválido'),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
  telefone: z
    .string()
    .min(1, 'WhatsApp é obrigatório')
    .refine(isValidBrazilianPhone, 'Telefone inválido'),
  perfil: z.string().optional(),
  tipo_contratacao: z.string().optional(),
  cnpj: z.string().nullable().optional(),
  acomodacao: z.string().optional(),
  idades_beneficiarios: z.array(z.string()).optional(),
  bairro: z.string().optional(),
  top_3_planos: z.array(z.string()).optional(),
});

export type CalculatorLeadInput = z.infer<typeof calculatorLeadSchema>;

// ============================================
// SCHEMAS – COTAÇÃO (PORTAL INTERNO)
// ============================================

export const cotacaoInputSchema = z.object({
  idades: z
    .array(z.number().int().min(0).max(120))
    .min(1, 'Adicione pelo menos uma idade'),
  tipo: z.string().min(1, 'Selecione o tipo de contratação'),
  operadora: z.string().min(1, 'Selecione uma operadora'),
});

export type CotacaoInputValidated = z.infer<typeof cotacaoInputSchema>;

// ============================================
// SCHEMAS – API /api/leads (SERVER-SIDE)
// ============================================

export const apiLeadSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  perfil: z.string().min(1, 'Perfil é obrigatório'),
  // Campos opcionais
  tipo_contratacao: z.string().optional(),
  cnpj: z.string().nullable().optional(),
  acomodacao: z.string().optional(),
  idades_beneficiarios: z.array(z.string()).optional(),
  bairro: z.string().optional(),
  top_3_planos: z.union([z.string(), z.array(z.string())]).optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export type ApiLeadInput = z.infer<typeof apiLeadSchema>;

// ============================================
// HELPER: Extrair primeira mensagem de erro Zod
// ============================================

export function getZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
