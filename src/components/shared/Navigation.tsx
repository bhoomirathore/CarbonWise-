'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Activity, 
  BookOpen, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Leaf 
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Assessment', href: '/assessment', icon: ClipboardList },
    { label: 'Simulator', href: '/simulator', icon: Activity },
    { label: 'Learn', href: '/learn', icon: BookOpen },
    { label: 'Profile', href: '/profile', icon: UserIcon },
  ];

  // If path is auth, do not show navigation to keep it focused
  if (pathname === '/auth') {
    return null;
  }

  return (
    <>
      {/* Desktop Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-xl hover:opacity-90 transition-opacity">
            <Leaf className="h-6 w-6 text-secondary" />
            <span>CarbonWise</span>
          </Link>

          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-emerald-50 text-primary font-semibold' 
                      : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {!loading && (
              user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-500 max-w-[150px] truncate" title={user.email}>
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-border rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-green-900 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border py-1 px-2 md:hidden flex justify-around items-center h-16 shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[10px] font-medium transition-colors ${
                isActive 
                  ? 'text-primary font-semibold' 
                  : 'text-slate-500 hover:text-primary'
              }`}
            >
              <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'text-secondary' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
