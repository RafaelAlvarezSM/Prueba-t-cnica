import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

  // Public routes que no requieren autenticación
  const publicRoutes = ['/login', '/register', '/catalog', '/'];

  // Protected routes que requieren autenticación
  const protectedRoutes = ['/dashboard', '/profile', '/orders'];

  const { pathname } = request.nextUrl;

  // Si accede a la raíz sin token, redirigir a login
  if (pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si accede a rutas protegidas sin token, redirigir a login
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si HAY token y está en la raíz, al Dashboard
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  // Si accede a rutas públicas (excepto raíz) con token, redirigir basado en rol
  if (publicRoutes.some(route => route !== '/' && pathname.startsWith(route)) && token) {
    // Para usuarios autenticados, redirigir al dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ACCESO TOTAL PARA ADMIN - Permitir acceso a cualquier subruta de /dashboard
  if (pathname.startsWith('/dashboard') && token) {
    // No hacer validaciones adicionales para ADMIN
    // El AuthContext se encargará de la redirección basada en rol
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
