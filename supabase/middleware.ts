import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Updates the user session by refreshing auth cookies and handling route protection
 * This middleware function is called on every request that matches the config pattern
 * @param request The incoming request object
 * @returns NextResponse with updated cookies or redirects for protected routes
 */
export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map(({ name, value }) => ({
              name,
              value,
            }));
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components and route protection
    try {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;

      // Handle protected routes
      const isAuthRoute = request.nextUrl.pathname.startsWith('/(auth)') || 
                          request.nextUrl.pathname === '/sign-in' || 
                          request.nextUrl.pathname === '/sign-up' ||
                          request.nextUrl.pathname === '/forgot-password';
      
      // If user is authenticated and trying to access auth routes, redirect to dashboard
      if (user && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // If user is not authenticated and trying to access protected routes, redirect to sign-in
      if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    } catch (authError) {
      console.error("Auth error in middleware:", authError);
      // If auth fails, redirect protected routes to sign-in
      if (request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    console.error("Supabase client creation error:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
