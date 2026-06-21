import { Recommendation } from './insights';

export interface SimulatorInputs {
  transportType: string;
  transportDistance: number;
  energyUsage: string;
  dietType: string;
  wasteHabit: string;
}

export interface CategoryComparison {
  category: string;
  before: number;
  after: number;
}

export interface SimulatorResult {
  currentScore: number;
  simulatedScore: number;
  difference: number;
  currentImpactLevel: string;
  simulatedImpactLevel: string;
  comparisons: CategoryComparison[];
  insight: string;
  simulatedInsights?: {
    largestContributor: string;
    secondLargestContributor: string;
    contributionPercentage: number;
    summary: string;
  };
  simulatedRecommendations?: Recommendation[];
}

