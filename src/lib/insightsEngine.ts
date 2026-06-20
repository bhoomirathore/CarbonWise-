import { RankedContributor } from '@/types/insights';
import { 
  getRankedContributors, 
  getLargestContributor, 
  getSecondLargestContributor 
} from './contributorUtils';

export interface InsightsResult {
  largestContributor: string;
  secondLargestContributor: string;
  contributionPercentage: number;
  summary: string;
  rankedContributors: RankedContributor[];
}

/**
 * Evaluates category scores to output ranked contributors and summaries.
 */
export function generateInsights(
  transportScore: number,
  energyScore: number,
  dietScore: number,
  wasteScore: number
): InsightsResult {
  const rankedContributors = getRankedContributors(
    transportScore,
    energyScore,
    dietScore,
    wasteScore
  );

  const largest = getLargestContributor(rankedContributors);
  const second = getSecondLargestContributor(rankedContributors);

  const largestContributor = largest ? largest.category : 'None';
  const secondLargestContributor = second ? second.category : 'None';
  const contributionPercentage = largest ? largest.percentage : 0;

  let summary = '';
  if (largest && largest.score > 0) {
    const categoryTips: Record<string, string> = {
      Transportation: "Transportation contributes the largest share of your footprint. Small changes in travel habits, like using public transit or carpooling, could have the biggest impact on reducing your emissions.",
      Energy: "Energy use at home contributes the largest share of your footprint. Simple adjustments to heating, cooling, and lighting can help you save energy and emissions.",
      Diet: "Your dietary choices contribute the largest share of your footprint. Swapping heavy meat options for plant-based alternatives is a powerful way to lower your daily impact.",
      Waste: "Waste habits contribute the largest share of your footprint. Mindful purchasing, reducing single-use items, and recycling are highly effective ways to minimize landfill waste."
    };
    const tip = categoryTips[largest.category] || "Every positive step towards sustainable habits makes a difference.";
    summary = `${largest.category} contributes the largest share of your footprint (${largest.percentage}%). ${tip}`;
    if (second && second.score > 0) {
      summary += ` Your second largest contributor is ${second.category} (${second.percentage}%).`;
    }
  } else {
    summary = 'Great job! Your carbon footprint is currently zero. You are leading a highly sustainable lifestyle!';
  }

  return {
    largestContributor,
    secondLargestContributor,
    contributionPercentage,
    summary,
    rankedContributors
  };
}
