import { createServerClient } from "../supabase/server";

/**
 * Check if the current user has admin privileges
 * Uses getUser() for secure server-side token validation
 */
export async function isAdminUser(): Promise<boolean> {
  try {
    const supabase = await createServerClient();

    // Use getUser() — validates JWT against Supabase servers
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return false;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return false;
    }

    return profileData?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get current authenticated user (server-side validated)
 */
export async function getCurrentUser() {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}