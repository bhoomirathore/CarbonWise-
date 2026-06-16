'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { calculateFootprint } from '@/lib/carbonCalculator';
import { assessmentService } from '@/services/assessmentService';
import { supabase } from '@/lib/supabase';
import { 
  ClipboardList, 
  Car, 
  Flame, 
  Utensils, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [transportType, setTransportType] = useState('Car');
  const [transportDistance, setTransportDistance] = useState('50');
  const [energyUsage, setEnergyUsage] = useState('Medium');
  const [dietType, setDietType] = useState('Mixed');
  const [wasteHabit, setWasteHabit] = useState('Sometimes Recycle');

  useEffect(() => {
    // Get user id on load
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!userId) {
      setErrorMsg('You must be signed in to submit an assessment.');
      return;
    }

    const distance = Number(transportDistance);
    if (isNaN(distance) || distance < 0) {
      setErrorMsg('Please enter a valid positive number for distance.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Calculate emission scores
      const calcResult = calculateFootprint(
        transportType,
        distance,
        energyUsage,
        dietType,
        wasteHabit
      );

      // 2. Prepare payload for Supabase insertion
      const payload = {
        user_id: userId,
        transport_type: transportType,
        transport_distance: distance,
        energy_usage: energyUsage,
        diet_type: dietType,
        waste_habit: wasteHabit,
        total_score: calcResult.totalScore,
        transport_score: calcResult.transportScore,
        energy_score: calcResult.energyScore,
        diet_score: calcResult.dietScore,
        waste_score: calcResult.wasteScore,
        impact_level: calcResult.impactLevel
      };

      // 3. Centralized service submission
      const record = await assessmentService.createAssessment(payload);

      // 4. Redirect to Results page with new record UUID query parameter
      router.push(`/results?id=${record.id}`);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'We could not save your assessment. Please try again.';
      setErrorMsg(message);
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="flex-1 bg-slate-50 py-10 md:py-16">
        <PageContainer size="narrow">
          <div className="flex items-center space-x-3 mb-6 justify-center md:justify-start">
            <div className="p-2 bg-primary text-white rounded-xl shadow-sm">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Carbon Assessment</h1>
              <p className="text-sm text-slate-500">Calculate your personal estimated monthly carbon score</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transportation Card */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                <div className="p-2 bg-emerald-50 text-secondary rounded-lg">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">1. Transportation</CardTitle>
                  <CardDescription>Tell us about your weekly transit habits</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="transportType" className="text-sm font-medium text-foreground">
                    Primary Transport Method
                  </label>
                  <select
                    id="transportType"
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                  >
                    <option value="Car">Car</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Bus">Bus</option>
                    <option value="Train">Train</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Walking">Walking</option>
                  </select>
                </div>

                <Input
                  label="Distance Travelled Per Week (km)"
                  id="transportDistance"
                  type="number"
                  min="0"
                  value={transportDistance}
                  onChange={(e) => setTransportDistance(e.target.value)}
                  required
                />
              </CardContent>
            </Card>

            {/* Energy Usage Card */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                <div className="p-2 bg-emerald-50 text-secondary rounded-lg">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">2. Energy Usage</CardTitle>
                  <CardDescription>Estimate your home electricity and cooling footprint</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="energyUsage" className="text-sm font-medium text-foreground">
                    Electricity & AC usage level
                  </label>
                  <select
                    id="energyUsage"
                    value={energyUsage}
                    onChange={(e) => setEnergyUsage(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                  >
                    <option value="Low">Low (Minimal AC, eco-appliances, lower bills)</option>
                    <option value="Medium">Medium (Average AC usage, standard home utilities)</option>
                    <option value="High">High (Regular AC running in multiple rooms, high usage)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Diet Card */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                <div className="p-2 bg-emerald-50 text-secondary rounded-lg">
                  <Utensils className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">3. Food Habits</CardTitle>
                  <CardDescription>Select the option that best describes your diet</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="dietType" className="text-sm font-medium text-foreground">
                    Your Diet Type
                  </label>
                  <select
                    id="dietType"
                    value={dietType}
                    onChange={(e) => setDietType(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                  >
                    <option value="Vegan">Vegan (Plant-based only)</option>
                    <option value="Vegetarian">Vegetarian (No meat, includes dairy/eggs)</option>
                    <option value="Mixed">Mixed (Standard diet, poultry/meat occasionally)</option>
                    <option value="Heavy Meat">Heavy Meat (Consume red meat or poultry daily)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Waste Card */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                <div className="p-2 bg-emerald-50 text-secondary rounded-lg">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">4. Waste Management</CardTitle>
                  <CardDescription>Tell us about your recycling and waste habits</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="wasteHabit" className="text-sm font-medium text-foreground">
                    Recycling Habit
                  </label>
                  <select
                    id="wasteHabit"
                    value={wasteHabit}
                    onChange={(e) => setWasteHabit(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                  >
                    <option value="Always Recycle">Always Recycle (Recycle plastic, glass, carry bags)</option>
                    <option value="Sometimes Recycle">Sometimes Recycle (Recycle occasionally, mix bins)</option>
                    <option value="Rarely Recycle">Rarely Recycle (Minimal recycling, regular disposal)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-800 border border-red-100 rounded-xl flex items-start space-x-2.5 text-sm font-medium">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto h-12 px-8 font-semibold text-lg" isLoading={submitting}>
                Submit & Calculate Footprint
              </Button>
            </div>
          </form>
        </PageContainer>
      </div>
    </AuthGuard>
  );
}
