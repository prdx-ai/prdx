'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { createClient } from '../../supabase/client';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Create Supabase client only once
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Use an IIFE to handle async operations
    (async () => {
      try {
        // Check for existing session in localStorage first for faster initial load
        const cachedSession = localStorage.getItem('supabase.auth.token');
        if (cachedSession) {
          try {
            const parsed = JSON.parse(cachedSession);
            if (parsed?.currentSession?.user) {
              // Pre-populate state while we verify with server
              setUser(parsed.currentSession.user);
            }
          } catch (e) {
            // Invalid cache, ignore
          }
        }

        // Then verify with server
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Unexpected error during getSession:', error);
      } finally {
        setIsLoading(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        router.refresh();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    session,
    isLoading,
    signOut: async () => {
      await supabase.auth.signOut();
      router.push('/sign-in');
    },
    refreshSession: async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error refreshing session:', error);
      }
    }
  }), [user, session, isLoading, supabase, router]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}