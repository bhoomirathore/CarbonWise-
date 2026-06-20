import { RankedContributor } from '@/types/insights';

/**
 * Calculates the ranking and contribution percentage of each category.
 * Sorted descending by score.
 */
export function getRankedContributors(
  transportScore: number,
  energyScore: number,
  dietScore: number,
  wasteScore: number
): RankedContributor[] {
  const total = transportScore + energyScore + dietScore + wasteScore;
  const items = [
    { category: 'Transportation', score: transportScore },
    { category: 'Energy', score: energyScore },
    { category: 'Diet', score: dietScore },
    { category: 'Waste', score: wasteScore }
  ];

  return items
    .map(item => ({
      category: item.category,
      score: item.score,
      percentage: total > 0 ? Math.round((item.score / total) * 100) : 0
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Returns the category that contributed the most to the carbon score.
 */
export function getLargestContributor(ranked: RankedContributor[]): RankedContributor | null {
  return ranked.length > 0 && ranked[0].score > 0 ? ranked[0] : null;
}

/**
 * Returns the category that contributed the second most to the carbon score.
 */
export function getSecondLargestContributor(ranked: RankedContributor[]): RankedContributor | null {
  return ranked.length > 1 && ranked[1].score > 0 ? ranked[1] : null;
}
