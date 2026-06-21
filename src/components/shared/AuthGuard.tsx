'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Leaf } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * NOTE ON SECURITY MODEL (Current Implementation):
 * AuthGuard provides client-side route UX only (redirecting unauthenticated users to the login page).
 * Actual data protection is enforced server-side via Supabase Row Level Security (RLS) on database tables
 * (such as the `assessments` table), which are scoped using `auth.uid() = user_id`.
 * 
 * This is the current implementation and is not meant to represent a fully "secure by design" end state.
 * Transitioning to a server-side session check via Next.js Middleware is a known future improvement.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Initial verification check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth');
      } else {
        setAuthenticated(true);
        setLoading(false);
      }
    });

    // Listen for real-time authentication state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/auth');
      } else {
        setAuthenticated(true);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading || !authenticated) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-background">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <Leaf className="h-10 w-10 text-secondary animate-bounce" />
          <p className="text-slate-500 font-semibold text-sm tracking-wide">Verifying Access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
