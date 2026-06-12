import React from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/shared/PageContainer';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ClipboardList, 
  Globe, 
  Footprints, 
  ArrowRight, 
  Lightbulb, 
  Activity 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <Section background="default" className="pt-16 pb-20 md:py-24 border-b border-border">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-50 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold border border-emerald-100">
                <Globe className="h-4 w-4 text-secondary animate-pulse" />
                <span>Track & Minimize Your Footprint</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Living sustainably starts with <span className="text-secondary">understanding</span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0">
                CarbonWise is a simple companion that helps you track your estimated carbon emissions, see where they come from, and discover practical everyday habits to reduce your environmental impact.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link href="/assessment">
                  <Button className="w-full sm:w-auto h-12 px-8 inline-flex items-center space-x-2 text-base">
                    <span>Calculate My Footprint</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="secondary" className="w-full sm:w-auto h-12 px-8">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 hidden lg:flex justify-center relative">
              <div className="absolute inset-0 bg-emerald-200/20 blur-3xl rounded-full -z-10"></div>
              <Card className="max-w-[400px] border border-border shadow-md p-8 bg-white relative">
                <div className="absolute top-4 right-4 bg-emerald-50 text-secondary p-2 rounded-xl">
                  <Footprints className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                    <Globe className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Why Track Carbon?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Most of us want to live eco-friendly lives but lack clarity on which choices (commuting, energy use, food choices, packaging) make the largest difference. CarbonWise translates daily habits into understandable impact metrics.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* Product Overview Section */}
      <Section background="surface" className="bg-white">
        <PageContainer>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Designed for Simplicity and Action
            </h2>
            <p className="text-base text-slate-500">
              Sustainable living shouldn&apos;t feel technical. We focus on understandable comparisons and straightforward, practical lifestyle adjustments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-primary mb-4 border border-emerald-100">
                <ClipboardList className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Short Questionnaire</h3>
              <p className="text-sm text-slate-500">
                Complete a 2–3 minute lifestyle assessment. Enter basic facts about your commuting habits, home electricity usage, eating diet, and recycling.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-primary mb-4 border border-emerald-100">
                <Lightbulb className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Personalized Insights</h3>
              <p className="text-sm text-slate-500">
                Get suggestions prioritized by your highest-impact areas. We tell you the &apos;why&apos; behind each reduction action.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-primary mb-4 border border-emerald-100">
                <Activity className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">What-If Simulation</h3>
              <p className="text-sm text-slate-500">
                Adjust lifestyle variables dynamically in real-time. See how tweaking specific behaviors lowers your overall monthly carbon output score.
              </p>
            </Card>
          </div>
        </PageContainer>
      </Section>

      {/* How CarbonWise Works Section */}
      <Section background="default">
        <PageContainer>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              How CarbonWise Works
            </h2>
            <p className="text-base text-slate-500">
              Three straightforward steps to build a sustainable daily lifestyle.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line for Desktop */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-border -translate-y-1/2 hidden md:block -z-10"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-transparent">
              <div className="space-y-4 bg-background px-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto text-lg border-4 border-white shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-semibold text-foreground">Calculate</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Take the simple assessment. We evaluate transportation, food, waste, and energy usage metrics.
                </p>
              </div>

              <div className="space-y-4 bg-background px-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto text-lg border-4 border-white shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-semibold text-foreground">Understand</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Review your score breakdown. Spot which parts of your routine account for the highest emissions.
                </p>
              </div>

              <div className="space-y-4 bg-background px-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto text-lg border-4 border-white shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-semibold text-foreground">Reduce</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Apply practical insights, run what-if simulations, and watch your carbon score improve.
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* CTA Section */}
      <Section background="dark" className="text-white text-center">
        <PageContainer size="narrow" className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Ready to make a difference?</h2>
          <p className="text-emerald-100 max-w-lg mx-auto">
            Calculate your current monthly footprint today and build healthy habits for a clean, green tomorrow.
          </p>
          <div className="pt-4">
            <Link href="/assessment">
              <Button variant="secondary" className="h-12 px-8 inline-flex items-center space-x-2 text-base text-primary font-semibold hover:bg-emerald-50 hover:text-primary border-none shadow-md">
                <span>Start Free Assessment</span>
                <ArrowRight className="h-5 w-5 text-secondary" />
              </Button>
            </Link>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
}
