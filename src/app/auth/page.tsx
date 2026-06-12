'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/shared/PageContainer';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, Leaf, ArrowRight } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      }
      setSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to send login link. Please try again.' });
    } else {
      setMessage({ type: 'success', text: 'Check your email for the magic login link!' });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setLoading(false);
      setMessage({ type: 'error', text: error.message || 'Google Sign-In failed.' });
    }
  };

  if (sessionLoading) {
    return (
      <Section background="default" className="flex-1 flex items-center justify-center">
        <PageContainer className="text-center">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <Leaf className="h-10 w-10 text-secondary animate-bounce" />
            <p className="text-slate-500 font-medium">Checking your account...</p>
          </div>
        </PageContainer>
      </Section>
    );
  }

  if (user) {
    return (
      <Section background="default" className="flex-1 flex items-center justify-center">
        <PageContainer size="narrow">
          <Card className="max-w-md mx-auto text-center p-8">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="h-8 w-8 text-secondary" />
            </div>
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-bold">You are already signed in</CardTitle>
              <CardDescription className="text-slate-500 mt-2">
                Currently logged in as <strong className="text-foreground">{user.email}</strong>
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <Button onClick={() => router.push('/dashboard')} className="w-full h-12 flex items-center justify-center space-x-2">
                <span>Go to Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                }}
                className="w-full h-12 text-slate-600 hover:text-red-600 border border-border"
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </PageContainer>
      </Section>
    );
  }

  return (
    <Section background="default" className="flex-1 flex items-center justify-center py-16">
      <PageContainer size="narrow">
        <Card className="max-w-md mx-auto p-8 border border-border shadow-md">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Leaf className="h-10 w-10 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome to CarbonWise</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to save your sustainability footprints</p>
          </div>

          <CardContent className="p-0 space-y-6">
            {/* Google OAuth Trigger */}
            <Button
              onClick={handleGoogleSignIn}
              variant="secondary"
              className="w-full h-12 flex items-center justify-center space-x-2 font-semibold hover:bg-slate-50 border border-border"
              disabled={loading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </Button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <span className="relative bg-white px-4 text-xs font-semibold uppercase text-slate-400">Or email link</span>
            </div>

            {/* Email OTP Trigger */}
            <form onSubmit={handleMagicLink} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-12"
              />
              <Button type="submit" className="w-full h-12 flex items-center justify-center space-x-2" isLoading={loading}>
                <Mail className="h-5 w-5" />
                <span>Send Magic Link</span>
              </Button>
            </form>

            {message && (
              <div
                className={`p-4 rounded-xl border text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-primary border-emerald-100'
                    : 'bg-red-50 text-red-700 border-red-100'
                }`}
              >
                {message.text}
              </div>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </Section>
  );
}
