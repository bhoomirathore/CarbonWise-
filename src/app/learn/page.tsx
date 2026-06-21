'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/shared/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { learnContent } from '@/data/learnContent';
import { 
  BookOpen, 
  Car, 
  Flame, 
  Utensils, 
  Trash2, 
  CheckCircle2, 
  Info,
  ChevronRight
} from 'lucide-react';

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Transportation', 'Energy', 'Food', 'Waste'];

  const filteredContent = selectedCategory === 'All' 
    ? learnContent 
    : learnContent.filter(item => item.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transportation':
        return <Car className="h-5 w-5 text-sky-600" />;
      case 'Energy':
        return <Flame className="h-5 w-5 text-orange-600" />;
      case 'Food':
        return <Utensils className="h-5 w-5 text-emerald-600" />;
      default:
        return <Trash2 className="h-5 w-5 text-indigo-600" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Transportation':
        return 'from-sky-400 to-blue-600';
      case 'Energy':
        return 'from-orange-400 to-amber-600';
      case 'Food':
        return 'from-emerald-400 to-teal-600';
      default:
        return 'from-indigo-400 to-purple-600';
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-10 md:py-16">
      <PageContainer>
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-primary text-white rounded-xl shadow-sm">
            <BookOpen className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Learning Hub</h1>
            <p className="text-sm text-slate-500">Explore practical guides and tips to reduce your greenhouse gas footprint</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'primary' : 'secondary'}
              onClick={() => setSelectedCategory(cat)}
              className={`h-9 px-4 rounded-xl text-xs font-semibold ${
                selectedCategory === cat 
                  ? 'bg-secondary text-white border-secondary' 
                  : 'bg-white text-slate-600 border-border hover:bg-slate-50'
              }`}
            >
              <span className="mr-1.5">{cat !== 'All' && getCategoryIcon(cat)}</span>
              <span>{cat}</span>
            </Button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredContent.map((item, idx) => (
            <Card key={idx} className="border border-border bg-white shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
              {/* Educational Illustration / Gradient Area */}
              <div className={`h-40 w-full bg-gradient-to-r ${getCategoryGradient(item.category)} relative flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                
                {/* Optional Image field render (with css fallback if image is missing/not uploaded yet) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <span className="inline-block p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-2 text-2xl">
                      {item.category === 'Transportation' ? '🚗' : item.category === 'Energy' ? '⚡' : item.category === 'Food' ? '🥗' : '♻️'}
                    </span>
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-white/90">{item.category} Guides</h3>
                  </div>
                </div>
                
                {/* Dynamic visual rings */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border-4 border-white/10" />
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-4 border-white/10" />
              </div>

              <CardHeader className="p-6 border-b border-border">
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Actionable Reduction Tips</h4>
                  <ul className="space-y-3">
                    {item.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start space-x-2.5 text-xs text-slate-600 leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-border mt-6 flex justify-between items-center text-[10px] text-slate-400">
                  <span className="flex items-center">
                    <Info className="h-3.5 w-3.5 text-slate-300 mr-1" />
                    Updates reflect dynamically in simulator
                  </span>
                  <Link href="/simulator">
                    <span className="text-secondary font-bold hover:underline flex items-center cursor-pointer">
                      Test in Simulator <ChevronRight className="h-3 w-3 ml-0.5" />
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
