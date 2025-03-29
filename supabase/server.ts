import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { cache } from 'react';

// Create a more resilient client that handles cookies properly
export const createClient = cache(() => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Only access cookies when this function is called
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            // Only access cookies when this function is called
            cookies().set({ name, value, ...options });
          } catch (error) {
            // Handle cookies in read-only context
          }
        },
        remove(name: string, options: any) {
          try {
            // Only access cookies when this function is called
            cookies().set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookies in read-only context
          }
        },
      },
    }
  );
});
