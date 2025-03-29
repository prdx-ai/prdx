'use client';

import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";

interface ResetPasswordProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordProps) {
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
    
    // Check if user is authenticated
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in?error=Password reset link is invalid or has expired');
      }
    };
    
    checkUser();
  }, [searchParams, router]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      
      if (!password || !confirmPassword) {
        const errorMsg = "Both password fields are required";
        setError(errorMsg);
        setMessage({ type: 'error', message: errorMsg });
        return;
      }
      
      if (password !== confirmPassword) {
        const errorMsg = "Passwords do not match";
        setError(errorMsg);
        setMessage({ type: 'error', message: errorMsg });
        return;
      }
      
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        setError(error.message);
        setMessage({ type: 'error', message: error.message });
        return;
      }
      
      // Set success message and show a link to sign-in instead of redirecting
      setMessage({ type: 'success', message: 'Your password has been reset successfully' });
      
    } catch (err: any) {
      const errorMsg = err.message || "An unexpected error occurred";
      setError(errorMsg);
      setMessage({ type: 'error', message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // Display message if present
  if (message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <FormMessage message={message} />
          {message.type === 'success' && (
            <div className="text-center mt-4">
              <Link 
                href="/sign-in" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md inline-block"
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
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
              <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
              <p className="text-sm text-muted-foreground">
                Enter your new password below
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  New Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
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
              {isLoading ? "Resetting..." : "Reset Password"}
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