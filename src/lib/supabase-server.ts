'use server';

import { cookies } from 'next/headers';
import { createServerComponentClient } from '../../supabase/server';

/**
 * Creates a Supabase client for use in Server Components and Route Handlers
 * This function should only be called within a Server Component or Route Handler
 * @returns Supabase client with cookie-based auth
 */
export function getSupabase() {
  try {
    const cookieStore = cookies();
    return createServerComponentClient(cookieStore);
  } catch (error) {
    console.error('Error getting cookies:', error);
    throw new Error('This function can only be used in a Server Component or Route Handler');
  }
}