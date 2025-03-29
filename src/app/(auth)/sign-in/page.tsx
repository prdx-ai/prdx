'use client';

import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "../../../../supabase/client";

interface LoginProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SignInPage({ searchParams }: LoginProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  
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

  // Memoize the submit handler to prevent recreation on each render
  const handleSubmit = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      
      if (!email || !password) {
        const errorMsg = "Email and password are required";
        setError(errorMsg);
        setMessage({ type: 'error', message: errorMsg });
        return;
      }
      
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        setMessage({ type: 'error', message: error.message });
        return;
      }
      
      if (data.user) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      const errorMsg = err.message || "An unexpected error occurred";
      setError(errorMsg);
      setMessage({ type: 'error', message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Display message if present
  if (message) {
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
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  className="text-primary font-medium hover:underline transition-all"
                  href="/sign-up"
                >
                  Sign up
                </Link>
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

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-all"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
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
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            {error && (
              <div className="p-3 bg-destructive/15 border border-destructive/30 rounded-md text-destructive text-sm">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
