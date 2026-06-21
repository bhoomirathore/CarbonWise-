'use client';

import React, { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Assessment } from '@/types';

interface AssessmentTrendChartProps {
  assessments: Assessment[];
}

export default function AssessmentTrendChart({ assessments }: AssessmentTrendChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-slate-50/50 border border-slate-100 rounded-2xl animate-pulse">
        <span className="text-sm text-slate-400 font-semibold">Loading footprint history trend...</span>
      </div>
    );
  }

  if (!assessments || assessments.length === 0) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-center">
        <p className="text-sm text-slate-400 font-semibold">No assessments completed yet to display history trend.</p>
      </div>
    );
  }

  // Reverse array copy so assessments are shown from oldest (left) to newest (right)
  const chronologicalData = [...assessments].reverse();

  const chartData = chronologicalData.map((item) => {
    const d = new Date(item.created_at);
    const compactDate = !isNaN(d.getTime())
      ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) // e.g., Jun 18
      : 'Unknown';
    return {
      date: compactDate,
      score: item.total_score || 0,
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 border border-slate-100 rounded-xl shadow-lg text-xs">
          <p className="font-bold text-slate-500">{data.date}</p>
          <p className="font-medium text-slate-800 mt-1">
            Footprint Score: <span className="font-black">{data.score}</span> / 210
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 pr-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
            tickLine={false}
            axisLine={false} 
            dy={8}
          />
          <YAxis 
            domain={[0, 210]} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
            tickLine={false}
            axisLine={false}
            dx={-8}
          />
          <Tooltip content={customTooltip} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#10b981" // emerald-500
            strokeWidth={3} 
            activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
            dot={{ r: 4, fill: '#10b981', stroke: '#ffffff', strokeWidth: 1.5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
