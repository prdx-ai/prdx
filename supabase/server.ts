import { createServerClient } from '@supabase/ssr';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// Create a client that takes cookies as a parameter
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
