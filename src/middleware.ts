import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '../supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/payments/webhook (webhook endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/payments/webhook).*)',
  ],
};
