'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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

  // Define styling colors based on the calculated Impact Level
  const getImpactDetails = (level: string) => {
    const l = (level || '').toLowerCase().trim();
    if (l === 'low') {
      return {
        bg: 'bg-emerald-50 border-emerald-100',
        text: 'text-primary',
        label: 'Low Impact',
        desc: 'Your lifestyle currently has a relatively low carbon footprint. Keep it up!'
      };
    } else if (l === 'moderate') {
      return {
        bg: 'bg-amber-50 border-amber-100',
        text: 'text-amber-800',
        label: 'Moderate Impact',
        desc: 'You are doing well but still have opportunities to improve.'
      };
    } else if (l === 'high') {
      return {
        bg: 'bg-orange-50 border-orange-100',
        text: 'text-orange-800',
        label: 'High Impact',
        desc: 'Several lifestyle changes could significantly reduce your footprint.'
      };
    } else {
      return {
        bg: 'bg-red-50 border-red-100',
        text: 'text-red-800',
        label: 'Very High Impact',
        desc: 'Your footprint is relatively high and should be prioritized for improvement.'
      };
    }
  };

  const impact = getImpactDetails(assessment.impact_level);

  return (
    <div className="space-y-8">
      {/* Banner Summary */}
      <Card className={`border ${impact.bg} p-8 shadow-sm transition-all duration-300`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold uppercase tracking-wider text-slate-500">Your footprint score</h2>
            <div className="flex items-baseline space-x-2">
              <span className={`text-5xl font-extrabold ${impact.text}`}>{assessment.total_score}</span>
              <span className="text-slate-400 font-medium">/ 210 pts</span>
            </div>
            <p className="text-slate-600 font-medium text-sm leading-relaxed max-w-xl">
              {impact.desc}
            </p>
          </div>

          <div className="shrink-0">
            <div className={`px-4 py-2 border rounded-xl text-center font-bold text-sm md:text-base ${impact.bg} ${impact.text} border-current`}>
              {impact.label}
            </div>
          </div>
        </div>
      </Card>

      {/* Breakdown Header */}
      <div>
        <h3 className="text-xl font-bold text-foreground">Score Breakdown</h3>
        <p className="text-sm text-slate-500">See how each category contributes to your footprint</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transit */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                <Car className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Transportation</CardTitle>
            </div>
            <span className="text-lg font-bold text-foreground">{assessment.transport_score} <span className="text-xs text-slate-400 font-medium">pts</span></span>
          </CardHeader>
          <CardContent className="pt-2 text-sm text-slate-600 space-y-1">
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span>Primary Transit Mode</span>
              <span className="font-semibold text-foreground">{assessment.transport_type}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span>Weekly Distance</span>
              <span className="font-semibold text-foreground">{assessment.transport_distance} km</span>
            </div>
          </CardContent>
        </Card>

        {/* Energy */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                <Flame className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Energy Usage</CardTitle>
            </div>
            <span className="text-lg font-bold text-foreground">{assessment.energy_score} <span className="text-xs text-slate-400 font-medium">pts</span></span>
          </CardHeader>
          <CardContent className="pt-2 text-sm text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Home Electricity Level</span>
              <span className="font-semibold text-foreground">{assessment.energy_usage}</span>
            </div>
          </CardContent>
        </Card>

        {/* Food */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                <Utensils className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Diet Type</CardTitle>
            </div>
            <span className="text-lg font-bold text-foreground">{assessment.diet_score} <span className="text-xs text-slate-400 font-medium">pts</span></span>
          </CardHeader>
          <CardContent className="pt-2 text-sm text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Primary Food Diet</span>
              <span className="font-semibold text-foreground">{assessment.diet_type}</span>
            </div>
          </CardContent>
        </Card>

        {/* Waste */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                <Trash2 className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Waste & Recycling</CardTitle>
            </div>
            <span className="text-lg font-bold text-foreground">{assessment.waste_score} <span className="text-xs text-slate-400 font-medium">pts</span></span>
          </CardHeader>
          <CardContent className="pt-2 text-sm text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Recycling Habit</span>
              <span className="font-semibold text-foreground">{assessment.waste_habit}</span>
            </div>
          </CardContent>
        </Card>
      </div>

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
