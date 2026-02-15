import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { supabase, response } = await updateSession(request);

  // Only protect admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return response;
  }

  // Get session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // If no session or error, redirect to home
  if (error || !session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if user has admin role
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profileError || (profileData as any)?.role !== 'admin') {
    // If not admin, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access to admin routes for admins
  return response;
}

// Specify which paths the middleware should run for
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};