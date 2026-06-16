'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { assessmentService } from '@/services/assessmentService';
import { Assessment } from '@/types';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Calendar, 
  ChevronRight, 
  Plus, 
  ClipboardList, 
  AlertCircle,
  Leaf
} from 'lucide-react';

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHistory = async (uid: string) => {
    try {
      const records = await assessmentService.getUserAssessments(uid);
      setAssessments(records);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Unable to retrieve your assessment history.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get logged in user and fetch history
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        fetchHistory(user.id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const getImpactBadgeStyles = (level: string) => {
    const l = (level || '').toLowerCase().trim();
    if (l === 'low') {
      return 'bg-emerald-50 text-primary border-emerald-100';
    } else if (l === 'moderate') {
      return 'bg-amber-50 text-amber-800 border-amber-100';
    } else if (l === 'high') {
      return 'bg-orange-50 text-orange-800 border-orange-100';
    } else {
      return 'bg-red-50 text-red-800 border-red-100';
    }
  };

  return (
    <AuthGuard>
      <div className="flex-1 bg-slate-50 py-10 md:py-16">
        <PageContainer>
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary text-white rounded-xl shadow-sm">
                <LayoutDashboard className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-slate-500">Track and monitor your recent sustainability logs</p>
              </div>
            </div>
            {assessments.length > 0 && (
              <Link href="/assessment">
                <Button className="flex items-center space-x-1.5 h-11">
                  <Plus className="h-4 w-4" />
                  <span>New Assessment</span>
                </Button>
              </Link>
            )}
          </div>

          {errorMsg && (
            <div className="p-4 mb-6 bg-red-50 text-red-800 border border-red-100 rounded-xl flex items-start space-x-2.5 text-sm font-medium">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse space-y-4">
              <Leaf className="h-10 w-10 text-secondary animate-bounce" />
              <p className="text-slate-500 font-semibold">Loading dashboard items...</p>
            </div>
          ) : assessments.length === 0 ? (
            /* Empty State Layout */
            <Card className="text-center p-8 md:p-12 max-w-lg mx-auto border-border shadow-sm bg-white mt-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardList className="h-8 w-8 text-secondary" />
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-extrabold">No assessments yet</CardTitle>
                <CardDescription className="text-base text-slate-500 mt-2 max-w-sm mx-auto">
                  Take your first carbon footprint lifestyle questionnaire to begin tracking your sustainability score.
                </CardDescription>
              </CardHeader>
              <div className="pt-4">
                <Link href="/assessment">
                  <Button className="px-8 h-12 text-base font-semibold">
                    Take Assessment Now
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            /* Historical Logs Grid */
            <div className="space-y-6">
              <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-slate-50/50">
                  <h3 className="text-base font-bold text-foreground">Recent Assessments</h3>
                  <p className="text-xs text-slate-400">Displaying your latest 10 assessments</p>
                </div>
                <div className="divide-y divide-border">
                  {assessments.map((item) => (
                    <div 
                      key={item.id} 
                      className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-emerald-50 rounded-xl text-secondary">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {new Date(item.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="text-slate-500 font-medium">Transit: {item.transport_type}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 font-medium">Diet: {item.diet_type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-right sm:text-left space-y-1">
                          <div className="flex items-baseline space-x-1 justify-end sm:justify-start">
                            <span className="text-lg font-bold text-foreground">{item.total_score}</span>
                            <span className="text-xs text-slate-400">/ 210</span>
                          </div>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getImpactBadgeStyles(item.impact_level)}`}>
                            {item.impact_level}
                          </span>
                        </div>
                        <Link href={`/results?id=${item.id}`}>
                          <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg border border-transparent hover:border-border transition-all">
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </PageContainer>
      </div>
    </AuthGuard>
  );
}
