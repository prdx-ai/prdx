import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'

// Create a more resilient client that handles cookies properly
export const createClient = cache(() => {
  try {
    // Only access cookies when this function is actually called
    const cookieStore = cookies()
    
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Handle the error silently or log it if needed
            }
          },
          remove(name, options) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Handle the error silently or log it if needed
            }
          },
        },
      }
    )
  } catch (error) {
    // Return a client with empty cookie handlers if cookies() fails
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return undefined;
          },
          set(name, value, options) {
            // No-op when outside request context
          },
          remove(name, options) {
            // No-op when outside request context
          },
        },
      }
    )
  }
})
