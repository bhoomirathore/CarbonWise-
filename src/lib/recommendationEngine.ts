import { Recommendation } from '@/types/insights';
import { recommendationCatalog } from './recommendationCatalog';

/**
 * Returns dynamic priority based on category contribution.
 * High Priority: Recommendations affecting largest contributor AND estimated reduction >= 15 points.
 * Medium Priority: Estimated reduction 10-14 points.
 * Low Priority: Estimated reduction below 10 points.
 */
function determineDynamicPriority(
  category: string,
  points: number,
  largestContributor: string
): "high" | "medium" | "low" {
  if (category === largestContributor && points >= 15) {
    return "high";
  }
  if (points >= 10) {
    return "medium";
  }
  return "low";
}

/**
 * Generates 3-5 personalized recommendations based on the user's assessment answers.
 * Sorted by priority (high > medium > low), then estimated reduction points descending.
 */
export function generateRecommendations(
  transportType: string,
  transportDistance: number,
  energyUsage: string,
  dietType: string,
  wasteHabit: string,
  largestContributor: string
): Recommendation[] {
  const matchedIds = new Set<string>();

  // Transportation rules
  const transportLower = (transportType || '').toLowerCase().trim();
  if (transportLower === 'car' || transportLower === 'motorcycle') {
    matchedIds.add('transport_public_transport');
    matchedIds.add('transport_carpool');
  }
  if (Number(transportDistance) > 35) {
    matchedIds.add('transport_reduce_distance');
  }

  // Energy rules
  const energyLower = (energyUsage || '').toLowerCase().trim();
  if (energyLower === 'high' || energyLower === 'medium') {
    matchedIds.add('energy_reduce_ac');
    matchedIds.add('energy_led_lighting');
    matchedIds.add('energy_turn_off_appliances');
  }

  // Diet rules
  const dietLower = (dietType || '').toLowerCase().trim();
  if (dietLower === 'heavy meat' || dietLower === 'heavy-meat' || dietLower === 'mixed') {
    matchedIds.add('diet_reduce_meat');
    matchedIds.add('diet_plant_based');
  }

  // Waste rules
  const wasteLower = (wasteHabit || '').toLowerCase().trim();
  if (
    wasteLower === 'sometimes recycle' || 
    wasteLower === 'sometimes' || 
    wasteLower === 'rarely recycle' || 
    wasteLower === 'rarely'
  ) {
    matchedIds.add('waste_recycle');
    matchedIds.add('waste_reduce_plastic');
  }

  // Map matched IDs to catalog recommendations and set dynamic priorities
  const list: Recommendation[] = recommendationCatalog
    .filter(item => matchedIds.has(item.id))
    .map(item => {
      const dynamicPriority = determineDynamicPriority(item.category, item.estimatedReductionPoints, largestContributor);
      return {
        id: item.id,
        category: item.category,
        title: item.title,
        description: item.description,
        estimatedReductionPoints: item.estimatedReductionPoints,
        priority: dynamicPriority
      };
    });

  // If matched list is less than 3, fill with remaining items from the catalog
  if (list.length < 3) {
    const existingIds = new Set(list.map(x => x.id));
    for (const catalogItem of recommendationCatalog) {
      if (list.length >= 3) break;
      if (!existingIds.has(catalogItem.id)) {
        const dynamicPriority = determineDynamicPriority(
          catalogItem.category, 
          catalogItem.estimatedReductionPoints, 
          largestContributor
        );
        list.push({
          id: catalogItem.id,
          category: catalogItem.category,
          title: catalogItem.title,
          description: catalogItem.description,
          estimatedReductionPoints: catalogItem.estimatedReductionPoints,
          priority: dynamicPriority
        });
      }
    }
  }

  // Sort by priority (high > medium > low), then estimated reduction points descending
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  
  list.sort((a, b) => {
    const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (pDiff !== 0) return pDiff;
    return b.estimatedReductionPoints - a.estimatedReductionPoints;
  });

  // Return exactly between 3 and 5 items
  const count = Math.max(3, Math.min(5, list.length));
  return list.slice(0, count);
}
