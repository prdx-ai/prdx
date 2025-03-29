'use client';

import { useAuth } from './auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // This ensures hydration matching by only rendering on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !user && isClient) {
      router.push('/sign-in');
    }
  }, [user, isLoading, router, isClient]);

  // Show nothing during server render to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}