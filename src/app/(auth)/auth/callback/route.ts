import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect_to = requestUrl.searchParams.get("redirect_to") || "/dashboard"; // Default to dashboard
  
  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("Auth error:", error.message);
        // If there's an error, redirect to sign-in with error message
        return NextResponse.redirect(
          new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        );
      }
    } catch (err) {
      console.error("Session exchange error:", err);
      return NextResponse.redirect(
        new URL('/sign-in?error=Authentication%20failed', requestUrl.origin)
      );
    }
  }
  
  // Always redirect to dashboard after successful authentication
  return NextResponse.redirect(new URL(redirect_to, requestUrl.origin));
}