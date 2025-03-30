/**
 * User authentication and profile hook
 */

"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  subscription_tier?: string;
  created_at?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Get the current user
    const getUser = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        if (user) {
          setUser(user);
          // Fetch the user's profile
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else if (profile) {
            setProfile({
              id: user.id,
              email: user.email || "",
              name: profile.name,
              avatar_url: profile.avatar_url,
              subscription_tier: profile.subscription_tier,
              created_at: profile.created_at,
            });
          } else {
            // If no profile exists, use basic user info
            setProfile({
              id: user.id,
              email: user.email || "",
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error("Error in useUser:", err);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
      throw err;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update the local profile state
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));

      return data;
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  };
}
