'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { assessmentService } from '@/services/assessmentService';
import { runSimulation } from '@/lib/simulatorEngine';
import { Assessment } from '@/types';
import { SimulatorInputs, SimulatorResult } from '@/types/simulator';
import { supabase } from '@/lib/supabase';
import { 
  Sliders, 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  TrendingDown, 
  AlertCircle,
  Car,
  Flame,
  Utensils,
  Trash2
} from 'lucide-react';

export default function SimulatorPage() {
  const [loading, setLoading] = useState(true);
  const [latestAssessment, setLatestAssessment] = useState<Assessment | null>(null);
  const [inputs, setInputs] = useState<SimulatorInputs>({
    transportType: 'Car',
    transportDistance: 50,
    energyUsage: 'Medium',
    dietType: 'Mixed',
    wasteHabit: 'Sometimes Recycle',
  });
  const [simulationResult, setSimulationResult] = useState<SimulatorResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Get logged in user and fetch latest assessment
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        assessmentService.getUserAssessments(user.id)
          .then((records) => {
            if (records.length > 0) {
              const latest = records[0];
              setLatestAssessment(latest);
              
              const initialInputs: SimulatorInputs = {
                transportType: latest.transport_type || 'Car',
                transportDistance: Number(latest.transport_distance) || 0,
                energyUsage: latest.energy_usage || 'Medium',
                dietType: latest.diet_type || 'Mixed',
                wasteHabit: latest.waste_habit || 'Sometimes Recycle',
              };
              setInputs(initialInputs);
              
              // Run initial simulation
              const result = runSimulation(latest, initialInputs);
              setSimulationResult(result);
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setErrorMsg('Unable to retrieve assessment history.');
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  // Update simulation when inputs change
  const handleInputChange = (key: keyof SimulatorInputs, value: string | number) => {
    if (!latestAssessment) return;
    
    const updatedInputs = {
      ...inputs,
      [key]: value,
    };
    setInputs(updatedInputs);
    
    const result = runSimulation(latestAssessment, updatedInputs);
    setSimulationResult(result);
  };

  const getImpactBadgeStyles = (level: string) => {
    const l = (level || '').toLowerCase().trim();
    if (l === 'low') return 'bg-emerald-50 text-emerald-800 border-emerald-100';
    if (l === 'moderate') return 'bg-amber-50 text-amber-800 border-amber-100';
    if (l === 'high') return 'bg-orange-50 text-orange-800 border-orange-100';
    return 'bg-red-50 text-red-800 border-red-100';
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === 'transportation') return <Car className="h-4 w-4 text-sky-600" />;
    if (cat === 'energy') return <Flame className="h-4 w-4 text-orange-600" />;
    if (cat === 'diet') return <Utensils className="h-4 w-4 text-emerald-600" />;
    return <Trash2 className="h-4 w-4 text-indigo-600" />;
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] py-12 animate-pulse">
        <Leaf className="h-10 w-10 text-secondary animate-bounce mb-4" />
        <p className="text-slate-500 font-semibold">Initializing simulator environment...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex-1 py-12">
        <PageContainer size="narrow">
          <div className="p-4 bg-red-50 text-red-800 border border-red-100 rounded-xl flex items-start space-x-2.5 text-sm font-medium">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!latestAssessment) {
    return (
      <div className="flex-1 py-12 bg-slate-50">
        <PageContainer size="narrow">
          <Card className="text-center p-8 md:p-12 max-w-lg mx-auto border border-border shadow-md bg-white">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sliders className="h-8 w-8 text-secondary" />
            </div>
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-extrabold text-foreground">No Assessment Found</CardTitle>
              <CardDescription className="text-base text-slate-500 mt-2 max-w-sm mx-auto">
                Before using the What-If Carbon Footprint Simulator, please complete your first assessment to establish a baseline score.
              </CardDescription>
            </CardHeader>
            <div className="pt-6">
              <Link href="/assessment">
                <Button className="px-8 h-12 text-base font-semibold">
                  Start Baseline Assessment
                </Button>
              </Link>
            </div>
          </Card>
        </PageContainer>
      </div>
    );
  }

  const scoreDiff = simulationResult ? simulationResult.difference : 0;
  const isScoreLower = scoreDiff < 0;
  const isScoreHigher = scoreDiff > 0;

  return (
    <AuthGuard>
      <div className="flex-1 bg-slate-50 py-10 md:py-16">
        <PageContainer>
          {/* Header Row */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-primary text-white rounded-xl shadow-sm">
              <Sliders className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">What-If Simulator</h1>
              <p className="text-sm text-slate-500">Modify your lifestyle parameters to preview score adjustments in real-time</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Control Panel: Column 1 */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border border-border bg-white shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-border py-4 px-6">
                  <CardTitle className="text-lg font-bold text-foreground">Simulation Controls</CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Adjust inputs below to simulate a greener lifestyle.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Transportation Type */}
                  <div className="space-y-2">
                    <label id="transport-type-label" className="text-sm font-bold text-slate-700 block">Transportation Type</label>
                    <div role="group" aria-labelledby="transport-type-label" className="grid grid-cols-3 gap-2">
                      {['Car', 'Motorcycle', 'Bus', 'Train', 'Bicycle', 'Walking'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleInputChange('transportType', type)}
                          aria-pressed={inputs.transportType === type}
                          className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                            inputs.transportType === type
                              ? 'bg-secondary text-white border-secondary'
                              : 'bg-white text-slate-600 border-border hover:bg-slate-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Travel Distance */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-700">Weekly Travel Distance</label>
                      <span className="text-xs font-semibold bg-emerald-50 text-secondary border border-emerald-100 rounded px-2 py-0.5">
                        {inputs.transportDistance} km
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="5"
                        value={inputs.transportDistance}
                        onChange={(e) => handleInputChange('transportDistance', Number(e.target.value))}
                        className="w-full accent-secondary h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <Input
                        type="number"
                        min="0"
                        value={inputs.transportDistance}
                        onChange={(e) => handleInputChange('transportDistance', Number(e.target.value))}
                        className="w-20 text-right h-9 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Energy Usage */}
                  <div className="space-y-2">
                    <label id="energy-usage-label" className="text-sm font-bold text-slate-700 block">Home Energy Usage</label>
                    <div role="group" aria-labelledby="energy-usage-label" className="grid grid-cols-3 gap-2">
                      {['Low', 'Medium', 'High'].map((usage) => (
                        <button
                          key={usage}
                          type="button"
                          onClick={() => handleInputChange('energyUsage', usage)}
                          aria-pressed={inputs.energyUsage === usage}
                          className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-all ${
                            inputs.energyUsage === usage
                              ? 'bg-secondary text-white border-secondary'
                              : 'bg-white text-slate-600 border-border hover:bg-slate-50'
                          }`}
                        >
                          {usage}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Diet Type */}
                  <div className="space-y-2">
                    <label id="diet-type-label" className="text-sm font-bold text-slate-700 block">Diet Type</label>
                    <div role="group" aria-labelledby="diet-type-label" className="grid grid-cols-4 gap-1.5">
                      {['Vegan', 'Vegetarian', 'Mixed', 'Heavy Meat'].map((diet) => (
                        <button
                          key={diet}
                          type="button"
                          onClick={() => handleInputChange('dietType', diet)}
                          aria-pressed={inputs.dietType === diet}
                          className={`py-2 px-1 text-[10px] sm:text-xs font-semibold rounded-lg border transition-all ${
                            inputs.dietType === diet
                              ? 'bg-secondary text-white border-secondary'
                              : 'bg-white text-slate-600 border-border hover:bg-slate-50'
                          }`}
                        >
                          {diet}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Waste Habits */}
                  <div className="space-y-2">
                    <label id="waste-habit-label" className="text-sm font-bold text-slate-700 block">Waste Recycling Habits</label>
                    <div role="group" aria-labelledby="waste-habit-label" className="grid grid-cols-3 gap-2">
                      {['Always Recycle', 'Sometimes Recycle', 'Rarely Recycle'].map((habit) => (
                        <button
                          key={habit}
                          type="button"
                          onClick={() => handleInputChange('wasteHabit', habit)}
                          aria-pressed={inputs.wasteHabit === habit}
                          className={`py-2 px-1 text-[10px] sm:text-xs font-semibold rounded-lg border transition-all ${
                            inputs.wasteHabit === habit
                              ? 'bg-secondary text-white border-secondary'
                              : 'bg-white text-slate-600 border-border hover:bg-slate-50'
                          }`}
                        >
                          {habit.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel: Column 2 */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top Compare Gauge Card */}
              {simulationResult && (
                <Card className="border border-border bg-white shadow-sm overflow-hidden relative">
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 transition-all ${
                    isScoreLower ? 'bg-emerald-500' : isScoreHigher ? 'bg-rose-500' : 'bg-slate-500'
                  }`} />
                  <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2 text-center md:text-left">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Simulated Footprint</h3>
                      <div className="flex items-baseline justify-center md:justify-start space-x-2">
                        <span className="text-4xl font-black text-foreground">{simulationResult.simulatedScore}</span>
                        <span className="text-sm font-medium text-slate-400">/ 210 points</span>
                      </div>
                      <div className="flex items-center space-x-2 justify-center md:justify-start">
                        <span className="text-xs text-slate-500">Impact Level:</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getImpactBadgeStyles(simulationResult.simulatedImpactLevel)}`}>
                          {simulationResult.simulatedImpactLevel}
                        </span>
                      </div>
                    </div>

                    {/* Compare Widget */}
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-border min-w-[200px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Delta Comparison</span>
                      
                      {scoreDiff === 0 ? (
                        <div className="text-center">
                          <span className="text-xl font-bold text-slate-600">No Change</span>
                          <p className="text-xs text-slate-400 mt-1">Adjust inputs to simulate changes</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className={`flex items-center justify-center font-bold text-2xl ${
                            isScoreLower ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {isScoreLower ? <TrendingDown className="h-6 w-6 mr-1" /> : null}
                            <span>{isScoreLower ? '' : '+'}{scoreDiff} pts</span>
                          </div>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 border ${
                            isScoreLower 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                              : 'bg-rose-50 text-rose-800 border-rose-100'
                          }`}>
                            {isScoreLower 
                              ? `${Math.abs(Math.round((scoreDiff / simulationResult.currentScore) * 100))}% reduction`
                              : `${Math.round((scoreDiff / simulationResult.currentScore) * 100)}% increase`
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Before/After Category comparison tables */}
              {simulationResult && (
                <Card className="border border-border bg-white shadow-sm">
                  <CardHeader className="py-4 px-6 border-b border-border">
                    <CardTitle className="text-base font-bold text-foreground">Category-Level Before/After Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {simulationResult.comparisons.map((comp) => {
                        const diff = comp.after - comp.before;
                        const isReduced = diff < 0;
                        const isIncreased = diff > 0;
                        
                        return (
                          <div key={comp.category} className="p-4 rounded-xl border border-border bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white rounded-lg border border-border shadow-xs">
                                {getCategoryIcon(comp.category)}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-700">{comp.category}</h4>
                                <div className="flex items-baseline space-x-1.5 mt-0.5">
                                  <span className="text-slate-400 text-xs font-semibold">{comp.before}</span>
                                  <ArrowRight className="h-3 w-3 text-slate-300 shrink-0" />
                                  <span className={`text-sm font-black ${
                                    isReduced ? 'text-emerald-600' : isIncreased ? 'text-rose-600' : 'text-slate-700'
                                  }`}>{comp.after}</span>
                                </div>
                              </div>
                            </div>
                            
                            {diff !== 0 && (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                                isReduced 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border-rose-100'
                              }`}>
                                {isReduced ? '' : '+'}{diff}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Dynamic Insight Banner */}
              {simulationResult?.insight && (
                <Card className="border border-border bg-white shadow-sm border-l-4 border-l-secondary overflow-hidden">
                  <CardContent className="p-5 flex items-start space-x-3.5">
                    <Sparkles className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Sustainability Coach Simulation Insight</h4>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        {simulationResult.insight}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Simulated Recommendations & Simulated Insights */}
              {simulationResult?.simulatedRecommendations && simulationResult.simulatedRecommendations.length > 0 && (
                <Card className="border border-border bg-white shadow-sm">
                  <CardHeader className="py-4 px-6 border-b border-border">
                    <CardTitle className="text-base font-bold text-foreground">Simulated Recommendations</CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Recommendations that would apply if you adopt these simulated habits
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 divide-y divide-border">
                    {simulationResult.simulatedRecommendations.map((rec) => (
                      <div key={rec.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold text-slate-700">{rec.title}</h4>
                            <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full ${
                              rec.priority === 'high' 
                                ? 'bg-red-50 text-red-700' 
                                : rec.priority === 'medium'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-normal">{rec.description}</p>
                        </div>
                        
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-emerald-600">-{rec.estimatedReductionPoints} pts</span>
                          <p className="text-[10px] text-slate-400">est. reduction</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </PageContainer>
      </div>
    </AuthGuard>
  );
}
