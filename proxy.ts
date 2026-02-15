import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { supabase, response } = await updateSession(request);

  // Only protect admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return response;
  }

  // Use getUser() instead of getSession() for secure server-side validation
  // getSession() reads from cookies which can be tampered with
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If no user or error, redirect to home
  if (error || !user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if user has admin role
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string | null }>();

  if (profileError || profileData?.role !== 'admin') {
    // If not admin, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access to admin routes for admins
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};