'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { assessmentService } from '@/services/assessmentService';
import { calculateAchievements } from '@/lib/achievements';
import { generateInsights } from '@/lib/insightsEngine';
import { Assessment } from '@/types';
import { supabase } from '@/lib/supabase';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  LogOut, 
  LayoutDashboard, 
  Leaf,
  Trophy,
  Activity,
  AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [memberSince, setMemberSince] = useState<string>('');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentCount, setAssessmentCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || 'user@email.com');
        
        // Format member since date
        if (user.created_at) {
          const date = new Date(user.created_at);
          const formatted = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          setMemberSince(formatted);
        } else {
          setMemberSince('Unknown');
        }

        // Fetch assessments
        Promise.all([
          assessmentService.getUserAssessments(user.id),
          assessmentService.getUserAssessmentCount(user.id)
        ])
          .then(([records, count]) => {
            setAssessments(records);
            setAssessmentCount(count);
            setLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setErrorMsg('Unable to retrieve profile statistics.');
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getImpactBadgeStyles = (level: string) => {
    const l = (level || '').toLowerCase().trim();
    if (l === 'low') return 'bg-emerald-50 text-emerald-800 border-emerald-100';
    if (l === 'moderate') return 'bg-amber-50 text-amber-800 border-amber-100';
    if (l === 'high') return 'bg-orange-50 text-orange-800 border-orange-100';
    return 'bg-red-50 text-red-800 border-red-100';
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] py-12 animate-pulse">
        <Leaf className="h-10 w-10 text-secondary animate-bounce mb-4" />
        <p className="text-slate-500 font-semibold">Loading profile profile...</p>
      </div>
    );
  }

  const latest = assessments[0];
  const currentScore = latest ? (latest.total_score || 0) : '—';
  const impactLevel = latest ? (latest.impact_level || 'Low') : '—';

  // Calculate best score (minimum score from history, lower is better)
  const bestScore = assessments.length > 0
    ? Math.min(...assessments.map(r => r.total_score || 0))
    : '—';

  // Calculate achievements
  const achievements = calculateAchievements(assessments);

  // Focus area logic (concise contributor check)
  let focusArea = 'Log assessments to find your footprint focus area.';
  if (latest) {
    const latestInsights = generateInsights(
      Number(latest.transport_score || 0),
      Number(latest.energy_score || 0),
      Number(latest.diet_score || 0),
      Number(latest.waste_score || 0)
    );
    if (latestInsights && latestInsights.largestContributor !== 'None') {
      focusArea = `${latestInsights.largestContributor} contributes the largest share of your footprint.`;
    } else {
      focusArea = 'Outstanding! You currently have zero footprint contributors.';
    }
  }

  return (
    <AuthGuard>
      <div className="flex-1 bg-slate-50 py-8 md:py-12 flex items-center justify-center min-h-[85vh]">
        <PageContainer size="narrow">
          {errorMsg && (
            <div className="p-4 mb-6 bg-red-50 text-red-800 border border-red-100 rounded-xl flex items-start space-x-2.5 text-sm font-medium">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-6 max-w-md mx-auto">
            {/* Section 1: Profile Header Card */}
            <Card className="border border-border bg-white shadow-sm text-center p-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
                <UserIcon className="h-10 w-10 text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">User Profile</h2>
              <div className="mt-2 flex flex-col items-center space-y-1 text-slate-500 text-xs">
                <span className="flex items-center space-x-1 font-medium">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{userEmail}</span>
                </span>
                <span className="flex items-center space-x-1 text-[11px] font-semibold text-slate-400">
                  <Calendar className="h-3.5 w-3.5 text-slate-300" />
                  <span>Member since {memberSince}</span>
                </span>
              </div>
            </Card>

            {/* Section 2: Sustainability Snapshot (4 Compact Stats) */}
            <Card className="border border-border bg-white shadow-sm p-5">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">Sustainability Snapshot</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Current Score</span>
                  <span className="text-lg font-black text-slate-800 mt-1 block">
                    {currentScore} {latest && <span className="text-[10px] text-slate-400 font-medium">/ 210</span>}
                  </span>
                </div>

                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Impact Level</span>
                  <div className="mt-1">
                    {latest ? (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${getImpactBadgeStyles(impactLevel)}`}>
                        {impactLevel}
                      </span>
                    ) : (
                      <span className="text-lg font-black text-slate-800">—</span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Completed</span>
                  <span className="text-lg font-black text-slate-800 mt-1 block">{assessmentCount}</span>
                </div>

                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Best Score</span>
                  <span className="text-lg font-black text-emerald-600 mt-1 block">
                    {bestScore} {assessments.length > 0 && <span className="text-[10px] text-slate-400 font-medium">/ 210</span>}
                  </span>
                </div>
              </div>
            </Card>

            {/* Section 3: Achievements (Compact layout of all badges) */}
            <Card className="border border-border bg-white shadow-sm p-5">
              <div className="flex items-center space-x-1.5 mb-3.5">
                <Trophy className="h-4 w-4 text-amber-500" />
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Achievements</h3>
              </div>
              <div className="flex justify-around items-center gap-1.5 py-1">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    title={`${ach.title}: ${ach.criteria}`}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border w-[22%] transition-all ${
                      ach.unlocked 
                        ? 'bg-amber-50/20 border-amber-200/50' 
                        : 'bg-slate-50/40 border-slate-100 opacity-40'
                    }`}
                  >
                    <span className="text-2xl mb-1">{ach.icon}</span>
                    <span className={`text-[9px] font-bold text-center truncate w-full ${ach.unlocked ? 'text-amber-800' : 'text-slate-400'}`}>
                      {ach.title.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Section 4: Focus Area Card */}
            <Card className="border border-border bg-white shadow-sm p-4 border-l-4 border-l-secondary">
              <div className="flex items-start space-x-3">
                <Activity className="h-4.5 w-4.5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-secondary">Emission Focus Area</h4>
                  <p className="text-xs font-bold text-slate-600 mt-1 leading-normal">
                    {focusArea}
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 5: Account Actions */}
            <div className="flex gap-3">
              <Link href="/dashboard" className="flex-1">
                <Button variant="secondary" className="w-full h-11 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 border border-border bg-white text-slate-700 hover:bg-slate-50">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>View Dashboard</span>
                </Button>
              </Link>
              <Button
                variant="primary"
                onClick={handleSignOut}
                className="flex-1 h-11 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </PageContainer>
      </div>
    </AuthGuard>
  );
}
