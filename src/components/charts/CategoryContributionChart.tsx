'use client';

import React, { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';

interface CategoryContributionChartProps {
  transportScore: number;
  energyScore: number;
  dietScore: number;
  wasteScore: number;
}

export default function CategoryContributionChart({
  transportScore,
  energyScore,
  dietScore,
  wasteScore,
}: CategoryContributionChartProps) {
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
        <span className="text-sm text-slate-400 font-semibold">Loading breakdown analytics...</span>
      </div>
    );
  }

  const total = transportScore + energyScore + dietScore + wasteScore;

  if (total === 0) {
    return (
      <div className="h-72 w-full flex flex-col items-center justify-center bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-emerald-50 text-secondary rounded-full flex items-center justify-center mb-3">
          ✨
        </div>
        <h4 className="text-sm font-bold text-slate-700 mb-1">Zero Emissions Tracked</h4>
        <p className="text-xs text-slate-500 max-w-xs">
          Your footprint is currently 0! Complete assessments with travel, energy, diet or waste scores to view category charts.
        </p>
      </div>
    );
  }

  const chartData = [
    { name: 'Transportation', value: transportScore, color: '#0ea5e9' }, // sky-500
    { name: 'Energy', value: energyScore, color: '#f97316' }, // orange-500
    { name: 'Diet', value: dietScore, color: '#10b981' }, // emerald-500
    { name: 'Waste', value: wasteScore, color: '#6366f1' }, // indigo-500
  ].filter(item => item.value > 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = Math.round((data.value / total) * 100);
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 border border-slate-100 rounded-xl shadow-lg text-xs">
          <p className="font-bold text-slate-800">{data.name}</p>
          <p className="font-medium text-slate-500 mt-1">
            Score: <span className="font-black text-slate-800">{data.value}</span> ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={customTooltip} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs font-bold text-slate-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
