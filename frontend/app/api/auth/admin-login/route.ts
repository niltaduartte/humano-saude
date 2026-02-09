import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Credenciais de admin (em produção, buscar do banco)
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@humanosaude.com.br',
  password: process.env.ADMIN_PASSWORD || 'HumanoSaude@2026!Secure',
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validar credenciais
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Gerar token simples (em produção usar JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

      return NextResponse.json({
        success: true,
        token,
        message: 'Login bem-sucedido',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Erro no login admin:', error);
    return NextResponse.json(
      { success: false, message: 'Erro no servidor' },
      { status: 500 }
    );
  }
}
