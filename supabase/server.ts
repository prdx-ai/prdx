import { createServerClient } from '@supabase/ssr';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers';

// Create a client that takes cookies as a parameter to avoid calling cookies() outside request context
export const createServerComponentClient = (cookieStore: ReadonlyRequestCookies) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {
          // Server components can't set cookies
          return;
        },
        remove() {
          // Server components can't remove cookies
          return;
        },
      },
    }
  );
};

// Create a client for route handlers that can set cookies
export const createClient = async (cookieStore?: ReadonlyRequestCookies) => {
  // If cookieStore is not provided, get it from the cookies() function
  if (!cookieStore) {
    try {
      cookieStore = cookies();
    } catch (error) {
      console.error('Error getting cookies:', error);
      // Fallback to a client with no cookie handling
      return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get() { return undefined; },
            set() { return; },
            remove() { return; },
          },
        }
      );
    }
  }
  
  // Create client with the provided or retrieved cookieStore
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore!.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore!.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore!.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
};
