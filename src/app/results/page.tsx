'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { assessmentService } from '@/services/assessmentService';
import { Assessment } from '@/types';
import { 
  Leaf, 
  Car, 
  Flame, 
  Utensils, 
  Trash2, 
  ChevronRight, 
  AlertCircle, 
  RotateCcw, 
  LayoutDashboard 
} from 'lucide-react';
import { generateInsights } from '@/lib/insightsEngine';
import { generateRecommendations } from '@/lib/recommendationEngine';
import { getImpactExplanation } from '@/lib/impactLevelEngine';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    !id ? 'No assessment ID provided. Please complete the assessment first.' : null
  );

  useEffect(() => {
    if (!id) return;

    const fetchResult = async () => {
      try {
        const record = await assessmentService.getAssessmentById(id);
        if (!record) {
          setErrorMsg('Assessment result not found.');
        } else {
          setAssessment(record);
        }
      } catch (err) {
        console.error(err);
        const msg = err instanceof Error ? err.message : 'Unable to retrieve result.';
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse space-y-4">
        <Leaf className="h-10 w-10 text-secondary animate-bounce" />
        <p className="text-slate-500 font-semibold">Retrieving your footprint results...</p>
      </div>
    );
  }

  if (errorMsg || !assessment) {
    return (
      <Card className="max-w-md mx-auto border-red-100 p-8 text-center bg-white shadow-sm mt-8">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-xl font-bold">Calculation Error</CardTitle>
          <CardDescription className="text-slate-500 mt-2">
            {errorMsg || 'We encountered an error loading your result.'}
          </CardDescription>
        </CardHeader>
        <Button onClick={() => router.push('/assessment')} className="w-full">
          Start New Assessment
        </Button>
      </Card>
    );
  }

  // Generate engines output
  const insights = generateInsights(
    Number(assessment?.transport_score || 0),
    Number(assessment?.energy_score || 0),
    Number(assessment?.diet_score || 0),
    Number(assessment?.waste_score || 0)
  );

  const recommendations = generateRecommendations(
    assessment?.transport_type || '',
    Number(assessment?.transport_distance || 0),
    assessment?.energy_usage || '',
    assessment?.diet_type || '',
    assessment?.waste_habit || '',
    insights.largestContributor
  );

  const explanation = getImpactExplanation(assessment?.impact_level || 'Low');

  // Compute projections
  const potentialReduction = recommendations.reduce((sum, rec) => sum + rec.estimatedReductionPoints, 0);
  const totalScore = Number(assessment?.total_score || 0);
  const maxAllowedReduction = totalScore * 0.5;
  const actualReduction = Math.min(potentialReduction, maxAllowedReduction);
  const projectedScore = Math.max(0, Math.round(totalScore - actualReduction));
  
  const getImpactDetails = (level: string) => {
    const l = (level || '').toLowerCase().trim();
    if (l === 'low') {
      return {
        bg: 'bg-emerald-50 border-emerald-100',
        text: 'text-emerald-800',
        label: 'Low Impact'
      };
    } else if (l === 'moderate') {
      return {
        bg: 'bg-amber-50 border-amber-100',
        text: 'text-amber-800',
        label: 'Moderate Impact'
      };
    } else if (l === 'high') {
      return {
        bg: 'bg-orange-50 border-orange-100',
        text: 'text-orange-800',
        label: 'High Impact'
      };
    } else {
      return {
        bg: 'bg-red-50 border-red-100',
        text: 'text-red-800',
        label: 'Very High Impact'
      };
    }
  };

  const currentImpact = getImpactDetails(assessment?.impact_level || 'Low');
  const projectedImpactLevel = projectedScore <= 50 ? 'Low' : projectedScore <= 100 ? 'Moderate' : projectedScore <= 150 ? 'High' : 'Very High';
  const projectedImpact = getImpactDetails(projectedImpactLevel);

  const getPriorityBadgeStyles = (priority: string) => {
    const p = (priority || '').toLowerCase().trim();
    if (p === 'high') return 'bg-red-100 text-red-800 border-red-200';
    if (p === 'medium') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="space-y-8">
      {/* 1. Score Summary Banner */}
      <Card className={`border ${currentImpact.bg} p-8 shadow-sm transition-all duration-300`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold uppercase tracking-wider text-slate-500">Your footprint score</h2>
            <div className="flex items-baseline space-x-2">
              <span className={`text-5xl font-extrabold ${currentImpact.text}`}>{assessment?.total_score || 0}</span>
              <span className="text-slate-400 font-medium">/ 210 pts</span>
            </div>
            <p className="text-slate-600 font-medium text-sm leading-relaxed max-w-xl">
              Based on your answers, your estimated lifestyle impact level is classified below.
            </p>
          </div>

          <div className="shrink-0">
            <div className={`px-4 py-2 border rounded-xl text-center font-bold text-sm md:text-base ${currentImpact.bg} ${currentImpact.text} border-current`}>
              {currentImpact.label}
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Impact Explanation Card */}
      <Card className="border-border p-6 bg-white shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-1">{explanation.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{explanation.description}</p>
        <div className="p-3 bg-slate-50 rounded-xl border border-border flex items-start space-x-2.5">
          <AlertCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">Action Focus</span>
            <span className="text-sm font-semibold text-foreground">{explanation.actionFocus}</span>
          </div>
        </div>
      </Card>

      {/* 3. Largest Contributor Card */}
      <Card className="border-border p-6 bg-white shadow-sm border-l-4 border-l-secondary">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Largest Contributor</h3>
            <span className="text-2xl font-extrabold text-foreground">{insights.largestContributor}</span>
          </div>
          <span className="text-3xl font-extrabold text-secondary">{insights.contributionPercentage}%</span>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">{insights.summary}</p>
      </Card>

      {/* 4. Category Ranking */}
      <Card className="border-border overflow-hidden bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-border bg-slate-50/50">
          <h3 className="text-base font-bold text-foreground">Category Contributions</h3>
          <p className="text-xs text-slate-400">All lifestyle areas ranked descending by impact score</p>
        </div>
        <div className="divide-y divide-border">
          {insights.rankedContributors.map((ranked) => {
            const getCategoryIcon = (cat: string) => {
              if (cat === 'Transportation') return <Car className="h-5 w-5 text-slate-600" />;
              if (cat === 'Energy') return <Flame className="h-5 w-5 text-slate-600" />;
              if (cat === 'Diet') return <Utensils className="h-5 w-5 text-slate-600" />;
              return <Trash2 className="h-5 w-5 text-slate-600" />;
            };
            return (
              <div key={ranked.category} className="px-6 py-4 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      {getCategoryIcon(ranked.category)}
                    </div>
                    <div>
                      <span className="font-bold text-foreground block text-sm">{ranked.category}</span>
                      <span className="text-xs text-slate-500">Contribution: {ranked.percentage}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-foreground block text-sm">{ranked.score} pts</span>
                  </div>
                </div>
                {/* Progress bar representing percentage contribution */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-secondary h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: ranked.percentage + '%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 5. Personalized Recommendations */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Recommended Actions</h3>
          <p className="text-sm text-slate-500">Personalized steps tailored to reduce your footprint</p>
        </div>
        {recommendations.length === 0 ? (
          <Card className="border border-border p-8 text-center bg-white shadow-sm">
            <p className="text-slate-500 font-medium">
              Great news! Your footprint is already fully optimized, and no additional action matches were found. Keep up the amazing work!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="border-border p-6 bg-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2.5">
                    <span className={`px-2 py-0.5 border text-xs font-bold rounded-full uppercase tracking-wider ${getPriorityBadgeStyles(rec.priority)}`}>
                      {rec.priority} Priority
                    </span>
                    <span className="text-xs text-slate-400 font-bold uppercase">{rec.category}</span>
                  </div>
                  <h4 className="text-base font-bold text-foreground">{rec.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{rec.description}</p>
                </div>
                <div className="shrink-0 flex items-center space-x-2 bg-emerald-50 px-4 py-2 border border-emerald-100 rounded-xl">
                  <span className="text-lg font-bold text-primary">-{rec.estimatedReductionPoints}</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">pts</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 6. Improvement Opportunity Card */}
      <Card className="border-border bg-white shadow-sm overflow-hidden border-t-4 border-t-primary">
        <div className="px-6 py-4 border-b border-border bg-slate-50/50">
          <h3 className="text-base font-bold text-foreground">Estimated Improvement Opportunity</h3>
          <p className="text-xs text-slate-400">See your projected footprint after applying these habits</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-border">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Current Score</span>
              <span className="text-2xl font-black text-foreground">{assessment?.total_score || 0}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-primary">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Potential Reduction</span>
              <span className="text-2xl font-black text-primary">-{actualReduction}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-border">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Projected Score</span>
              <span className="text-2xl font-black text-foreground">{projectedScore}</span>
            </div>
            <div className={`p-3 rounded-xl border ${projectedImpact.bg} ${projectedImpact.text}`}>
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Projected Impact</span>
              <span className="text-sm font-black uppercase block mt-1">{projectedImpact.label}</span>
            </div>
          </div>
          {potentialReduction > maxAllowedReduction && (
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              * Note: The projected score is constrained by a 50% maximum achievable lifestyle reduction threshold to keep projections realistic.
            </p>
          )}
        </div>
      </Card>

      {/* Navigation Triggers */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-border">
        <Button
          onClick={() => router.push('/assessment')}
          variant="secondary"
          className="w-full sm:w-auto flex items-center justify-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Retake Assessment</span>
        </Button>
        <Button
          onClick={() => router.push('/dashboard')}
          className="w-full sm:w-auto flex items-center justify-center space-x-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Go to Dashboard</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <AuthGuard>
      <div className="flex-1 bg-slate-50 py-10 md:py-16">
        <PageContainer size="narrow">
          <div className="flex items-center space-x-3 mb-6 justify-center md:justify-start">
            <div className="p-2 bg-primary text-white rounded-xl shadow-sm">
              <Leaf className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Assessment Results</h1>
              <p className="text-sm text-slate-500">Your carbon emission estimation details</p>
            </div>
          </div>

          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Leaf className="h-10 w-10 text-secondary animate-bounce" />
              <p className="text-slate-500 font-semibold">Loading results content...</p>
            </div>
          }>
            <ResultsContent />
          </Suspense>
        </PageContainer>
      </div>
    </AuthGuard>
  );
}
