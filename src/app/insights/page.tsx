import React from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function InsightsPlaceholder() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] py-12">
      <PageContainer size="narrow">
        <Card className="text-center p-8 max-w-md mx-auto border border-border shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="h-8 w-8 text-secondary" />
          </div>
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold">Personal Insights</CardTitle>
            <div className="mt-2 inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
              Coming Soon
            </div>
          </CardHeader>
          <CardDescription className="text-base text-slate-500">
            This feature will be implemented in a future sprint.
          </CardDescription>
        </Card>
      </PageContainer>
    </div>
  );
}
