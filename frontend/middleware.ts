import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================
  // PROTEÇÃO: Portal interno (UI)
  // ============================================
  if (pathname.startsWith('/portal-interno-hks-2026')) {
    const token = request.cookies.get('admin_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    // Se não tiver token, redireciona para login
    if (!token && pathname !== '/portal-interno-hks-2026/login') {
      const loginUrl = new URL('/admin-login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ============================================
  // PROTEÇÃO: Webhooks (validação básica — tokens verificados dentro das routes)
  // ============================================
  if (pathname.startsWith('/api/webhooks/')) {
    const response = NextResponse.next();
    // Headers de segurança
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  }

  // ============================================
  // PROTEÇÃO: API routes internas (exceto leads e calculadora públicos)
  // ============================================
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/leads') && !pathname.startsWith('/api/calculadora') && !pathname.startsWith('/api/webhooks') && !pathname.startsWith('/api/health') && !pathname.startsWith('/api/auth')) {
    const token = request.cookies.get('admin_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
  }

  // ============================================
  // BLOQUEIO: Rotas legadas
  // ============================================
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/portal-interno-hks-2026/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*',
  ],
};
