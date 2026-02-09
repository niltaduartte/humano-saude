import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas protegidas - portal interno
  if (pathname.startsWith('/portal-interno-hks-2026')) {
    const token = request.cookies.get('admin_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    // Se não tiver token, redireciona para login
    if (!token && pathname !== '/portal-interno-hks-2026/login') {
      const loginUrl = new URL('/admin-login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Bloquear acesso direto ao /dashboard antigo (redirecionamento de segurança)
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Bloquear acesso direto ao /admin antigo
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
  ],
};
