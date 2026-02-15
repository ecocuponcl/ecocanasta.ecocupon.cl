'use server';

import { createServerClient } from '../supabase/server';

/**
 * Server action to verify admin access
 */
export async function verifyAdminAccess(): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createServerClient();

    // Get the current session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return {
        success: false,
        message: 'No active session or session error'
      };
    }

    // Check if user has admin role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return {
        success: false,
        message: 'Error verifying user profile'
      };
    }

    if ((profileData as any)?.role !== 'admin') {
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