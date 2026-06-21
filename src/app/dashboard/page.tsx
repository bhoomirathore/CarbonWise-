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

import { generateInsights } from '@/lib/insightsEngine';
import { getRankedContributors, getLargestContributor } from '@/lib/contributorUtils';
import dynamic from 'next/dynamic';

const CategoryContributionChart = dynamic(
  () => import('@/components/charts/CategoryContributionChart'),
  { ssr: false }
);

const AssessmentTrendChart = dynamic(
  () => import('@/components/charts/AssessmentTrendChart'),
  { ssr: false }
);

import { calculateAchievements } from '@/lib/achievements';
import { Trophy } from 'lucide-react';

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentCount, setAssessmentCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHistory = async (uid: string) => {
    try {
      const [records, count] = await Promise.all([
        assessmentService.getUserAssessments(uid),
        assessmentService.getUserAssessmentCount(uid)
      ]);
      setAssessments(records);
      setAssessmentCount(count);
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
      return 'bg-emerald-50 text-emerald-800 border-emerald-100';
    } else if (l === 'moderate') {
      return 'bg-amber-50 text-amber-800 border-amber-100';
    } else if (l === 'high') {
      return 'bg-orange-50 text-orange-800 border-orange-100';
    } else {
      return 'bg-red-50 text-red-800 border-red-100';
    }
  };

  const latest = assessments[0];
  const latestScore = latest ? (latest.total_score || 0) : 0;
  const latestImpact = latest ? (latest.impact_level || 'None') : 'None';

  // Run inline (no useMemo)
  const latestInsights = latest ? generateInsights(
    Number(latest.transport_score || 0),
    Number(latest.energy_score || 0),
    Number(latest.diet_score || 0),
    Number(latest.waste_score || 0)
  ) : null;
  const biggestContributor = latestInsights ? latestInsights.largestContributor : 'None';

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
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border p-5 bg-white shadow-sm flex flex-col justify-between min-h-[100px]">
                  <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Latest Score</span>
                  <span className="text-2xl font-black text-foreground">{latestScore} <span className="text-xs text-slate-400 font-medium">/ 210</span></span>
                </Card>
                <Card className="border-border p-5 bg-white shadow-sm flex flex-col justify-between min-h-[100px]">
                  <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Impact Level</span>
                  <span className={`inline-block px-2.5 py-0.5 mt-1 rounded-full text-xs font-bold border ${getImpactBadgeStyles(latestImpact)}`}>
                    {latestImpact}
                  </span>
                </Card>
                <Card className="border-border p-5 bg-white shadow-sm flex flex-col justify-between min-h-[100px]">
                  <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Assessments Count</span>
                  <span className="text-2xl font-black text-foreground">{assessmentCount}</span>
                </Card>
                <Card className="border-border p-5 bg-white shadow-sm flex flex-col justify-between min-h-[100px]">
                  <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Biggest Contributor</span>
                  <span className="text-lg font-black text-foreground mt-1 block truncate">{biggestContributor}</span>
                </Card>
              </div>

              {/* Visual Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-border p-6 bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Latest Category Breakdown</h3>
                    <CategoryContributionChart
                      transportScore={Number(latest.transport_score || 0)}
                      energyScore={Number(latest.energy_score || 0)}
                      dietScore={Number(latest.diet_score || 0)}
                      wasteScore={Number(latest.waste_score || 0)}
                    />
                  </div>
                </Card>

                <Card className="border border-border p-6 bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Assessment History Trend</h3>
                    <AssessmentTrendChart assessments={assessments} />
                  </div>
                </Card>
              </div>

              {/* Quick Insights & Historical Improvement */}
              <Card className="border border-border p-6 bg-white shadow-sm border-l-4 border-l-primary">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-3">Quick Insights</h3>
                <div className="space-y-2 text-sm font-medium text-slate-600">
                  {(() => {
                    if (biggestContributor === 'None') {
                      return (
                        <p className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                          <span>Awesome job! You currently have no emission contributors. You are leading a highly sustainable lifestyle!</span>
                        </p>
                      );
                    }
                    const categoryTips: Record<string, string> = {
                      Transportation: "Transportation contributes the largest share of your footprint. Small changes in travel habits, like using public transit or carpooling, could have the biggest impact on reducing your emissions.",
                      Energy: "Energy use at home contributes the largest share of your footprint. Simple adjustments like modifying heating, cooling, or lighting can make a big difference in reducing electricity consumption.",
                      Diet: "Your dietary choices contribute the largest share of your footprint. Swapping heavy meat options for plant-based alternatives is a powerful way to lower your daily impact.",
                      Waste: "Waste habits contribute the largest share of your footprint. Mindful purchasing and consistent recycling are highly effective ways to minimize landfill waste."
                    };
                    const tip = categoryTips[biggestContributor] || "Every positive step towards sustainable habits makes a difference.";
                    return (
                      <p className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                        <span>{tip}</span>
                      </p>
                    );
                  })()}
                  {assessments.length >= 2 ? (() => {
                    const diff = Number(assessments[1].total_score || 0) - Number(assessments[0].total_score || 0);
                    if (diff > 0) {
                      return (
                        <p className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                          <span className="text-primary font-bold">Great progress! Your footprint score decreased by {diff} points compared to your previous assessment.</span>
                        </p>
                      );
                    } else if (diff < 0) {
                      return (
                        <p className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                          <span>Your footprint score increased by {Math.abs(diff)} points compared to your previous assessment. Let&apos;s check out the recommendations to get back on track!</span>
                        </p>
                      );
                    } else {
                      return (
                        <p className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                          <span>Your footprint score is unchanged since your last assessment. Small steps can lead to a bigger reduction next time!</span>
                        </p>
                      );
                    }
                  })() : (
                    <p className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                      <span>Complete a second assessment in the future to track your footprint changes and improvement history!</span>
                    </p>
                  )}
                  {assessments.length >= 3 && (() => {
                    const latestScore = Number(assessments[0].total_score || 0);
                    const thirdLatestScore = Number(assessments[2].total_score || 0);
                    const diff3 = thirdLatestScore - latestScore;
                    if (diff3 > 0) {
                      return (
                        <p className="flex items-start space-x-2 text-emerald-600 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          <span>You reduced your footprint by {diff3} points over your last 3 assessments. Keep up the excellent work!</span>
                        </p>
                      );
                    } else if (diff3 < 0) {
                      return (
                        <p className="flex items-start space-x-2 text-rose-600 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                          <span>Your footprint score increased by {Math.abs(diff3)} points over your last 3 assessments. Try simulator choices to plan your reduction!</span>
                        </p>
                      );
                    } else {
                      return (
                        <p className="flex items-start space-x-2 text-slate-500 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                          <span>Your footprint score remained stable over your last 3 assessments.</span>
                        </p>
                      );
                    }
                  })()}
                  {assessments.length < 3 && (
                    <p className="flex items-start space-x-2 text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1.5" />
                      <span>Log at least 3 assessments to unlock long-term footprint improvement trend summaries.</span>
                    </p>
                  )}
                </div>
              </Card>

              {/* Achievements Widget */}
              <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <h3 className="text-base font-bold text-foreground">Local Achievements</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {calculateAchievements(assessments).map((ach) => (
                    <div 
                      key={ach.id} 
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[120px] ${
                        ach.unlocked 
                          ? 'bg-amber-50/20 border-amber-200/60' 
                          : 'bg-slate-50/50 border-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{ach.icon}</span>
                          {ach.unlocked ? (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-full">Unlocked</span>
                          ) : (
                            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-0.5 rounded-full">Locked</span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mt-2">{ach.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-normal">{ach.description}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-wider">{ach.criteria}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Assessments History Card */}
              <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-slate-50/50">
                  <h3 className="text-base font-bold text-foreground">Recent Assessments</h3>
                  <p className="text-xs text-slate-400">Displaying your latest 10 assessments</p>
                </div>
                <div className="divide-y divide-border">
                  {assessments.map((item) => {
                    const itemRanked = getRankedContributors(
                      Number(item.transport_score || 0),
                      Number(item.energy_score || 0),
                      Number(item.diet_score || 0),
                      Number(item.waste_score || 0)
                    );
                    const itemLargest = getLargestContributor(itemRanked);
                    const itemContributor = itemLargest ? itemLargest.category : 'None';

                    return (
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
                              {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Unknown Date'}
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="text-slate-500 font-medium">Transit: {item.transport_type || 'Unknown'}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500 font-medium">Diet: {item.diet_type || 'Unknown'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          <div className="text-right sm:text-left space-y-1">
                            <div className="flex items-baseline space-x-1 justify-end sm:justify-start">
                              <span className="text-lg font-bold text-foreground">{item.total_score || 0}</span>
                              <span className="text-xs text-slate-400">/ 210</span>
                            </div>
                            <div className="flex items-center space-x-2 justify-end sm:justify-start">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getImpactBadgeStyles(item.impact_level || 'Low')}`}>
                                {item.impact_level || 'Low'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">
                                Top: {itemContributor}
                              </span>
                            </div>
                          </div>
                          <Link href={`/results?id=${item.id}`}>
                            <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg border border-transparent hover:border-border transition-all">
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </PageContainer>
      </div>
    </AuthGuard>
  );
}
