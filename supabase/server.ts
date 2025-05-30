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
  // If cookieStore is not provided, get it from cookies()
  const cookieStoreToUse = cookieStore || cookies();
  
  // Create client with the provided cookieStore
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStoreToUse.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStoreToUse.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStoreToUse.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
};
