/**
 * LifeAuthContext
 * Centrální auth context pro LifePro
 * Based on CoachPro TesterAuthContext
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface LifeAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
  isAdmin: boolean;
}

const LifeAuthContext = createContext<LifeAuthContextType | undefined>(undefined);

export function LifeAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Načíst session při mountu
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        // Zkontrolovat admin status
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Poslouchat změny auth stavu
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
        }

        setLoading(false);
        router.refresh();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  // Zkontrolovat, zda je uživatel admin
  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('lifepro_admin_users')
        .select('id, role')
        .eq('user_id', userId)
        .single();

      setIsAdmin(!error && !!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  // Sign In s emailem a heslem
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  // Sign Up s emailem a heslem
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  // Sign In s Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return { error };
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Update Profile
  const updateProfile = async (data: any) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const { error } = await supabase.auth.updateUser({
        data,
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    isAdmin,
  };

  return (
    <LifeAuthContext.Provider value={value}>
      {children}
    </LifeAuthContext.Provider>
  );
}

// Hook pro použití auth contextu
export function useLifeAuth() {
  const context = useContext(LifeAuthContext);
  if (context === undefined) {
    throw new Error('useLifeAuth must be used within LifeAuthProvider');
  }
  return context;
}

// Export také jako default
export default LifeAuthContext;
