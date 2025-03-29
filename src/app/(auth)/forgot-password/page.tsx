'use client';

import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../supabase/client";

interface ForgotPasswordProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ForgotPasswordPage({ searchParams }: ForgotPasswordProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  // Handle error and message from URL params
  useEffect(() => {
    if (searchParams.error) {
      const errorMsg = typeof searchParams.error === 'string' ? searchParams.error : searchParams.error[0];
      setError(errorMsg);
      setMessage({ type: 'error', message: errorMsg });
    }
    
    if (searchParams.message) {
      const successMsg = typeof searchParams.message === 'string' ? searchParams.message : searchParams.message[0];
      setMessage({ type: 'success', message: successMsg });
    }
  }, [searchParams]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const email = formData.get("email") as string;
      
      if (!email) {
        const errorMsg = "Email is required";
        setError(errorMsg);
        setMessage({ type: 'error', message: errorMsg });
        return;
      }
      
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      
      if (error) {
        setError(error.message);
        setMessage({ type: 'error', message: error.message });
        return;
      }
      
      setIsEmailSent(true);
      setMessage({ 
        type: 'success', 
        message: 'Password reset instructions have been sent to your email' 
      });
      
    } catch (err: any) {
      const errorMsg = err.message || "An unexpected error occurred";
      setError(errorMsg);
      setMessage({ type: 'error', message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // Display message if present
  if (message && !isEmailSent) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          {isEmailSent ? (
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
              <p className="text-muted-foreground">
                We've sent you a password reset link. Please check your email.
              </p>
              <Link
                href="/sign-in"
                className="block w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md text-center"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="flex flex-col space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center">
                <Link
                  href="/sign-in"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-all"
                >
                  Back to Sign In
                </Link>
              </div>

              {error && (
                <div className="p-3 bg-destructive/15 border border-destructive/30 rounded-md text-destructive text-sm">
                  {error}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  );
}
