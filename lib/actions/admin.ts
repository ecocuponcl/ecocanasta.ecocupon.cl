'use server';

import { createServerClient } from '../supabase/server';

/**
 * Server action to verify admin access
 * Uses getUser() for secure server-side JWT validation
 */
export async function verifyAdminAccess(): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createServerClient();

    // Use getUser() — validates JWT against Supabase auth servers
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        success: false,
        message: 'No active session or authentication error'
      };
    }

    // Check if user has admin role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return {
        success: false,
        message: 'Error verifying user profile'
      };
    }

    if (profileData?.role !== 'admin') {
      return {
        success: false,
        message: 'Insufficient permissions'
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error in verifyAdminAccess:', error);
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}