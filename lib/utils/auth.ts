import { createServerClient } from "../supabase/server";

/**
 * Check if the current user has admin privileges
 * This function verifies if the user is authenticated and has admin role
 */
export async function isAdminUser(): Promise<boolean> {
  try {
    const supabase = await createServerClient();

    // Get the current session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return false;
    }

    // Check if user has admin role
    // This assumes you have a way to determine admin status
    // Either through a user roles table or custom claims
    const { data: profileData, error: profileError } = await supabase
      .from('profiles') // Assuming you have a profiles table
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return false;
    }

    return (profileData as any)?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  try {
    const supabase = await createServerClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}