import { calculateFootprint } from './carbonCalculator';
import { SimulatorInputs, SimulatorResult, CategoryComparison } from '@/types/simulator';
import { Assessment } from '@/types';
import { generateInsights } from './insightsEngine';
import { generateRecommendations } from './recommendationEngine';

/**
 * Runs a simulation comparing simulated choices against the latest assessment.
 * Reuses existing carbonCalculator logic and generates deterministic insights.
 */
export function runSimulation(
  latestAssessment: Assessment,
  inputs: SimulatorInputs
): SimulatorResult {
  // 1. Calculate simulated score using existing scoring logic
  const simResult = calculateFootprint(
    inputs.transportType,
    inputs.transportDistance,
    inputs.energyUsage,
    inputs.dietType,
    inputs.wasteHabit
  );

  const currentScore = latestAssessment.total_score || 0;
  const simulatedScore = simResult.totalScore;
  const difference = simulatedScore - currentScore;

  // 2. Category level before/after comparisons
  const comparisons: CategoryComparison[] = [
    {
      category: 'Transportation',
      before: Number(latestAssessment.transport_score || 0),
      after: simResult.transportScore,
    },
    {
      category: 'Energy',
      before: Number(latestAssessment.energy_score || 0),
      after: simResult.energyScore,
    },
    {
      category: 'Diet',
      before: Number(latestAssessment.diet_score || 0),
      after: simResult.dietScore,
    },
    {
      category: 'Waste',
      before: Number(latestAssessment.waste_score || 0),
      after: simResult.wasteScore,
    },
  ];

  // 3. Generate rule-based deterministic insight
  let insight = '';
  const changes: { category: string; reduction: number; desc: string }[] = [];

  // Compare categories to find positive reductions
  const transportDiff = Number(latestAssessment.transport_score || 0) - simResult.transportScore;
  if (transportDiff > 0) {
    let desc = '';
    const originalType = (latestAssessment.transport_type || '').toLowerCase().trim();
    const newType = (inputs.transportType || '').toLowerCase().trim();
    if (originalType !== newType) {
      desc = `Switching from ${latestAssessment.transport_type} to ${inputs.transportType}`;
    } else {
      desc = 'Reducing your weekly travel distance';
    }
    changes.push({ category: 'Transportation', reduction: transportDiff, desc });
  }

  const energyDiff = Number(latestAssessment.energy_score || 0) - simResult.energyScore;
  if (energyDiff > 0) {
    changes.push({ 
      category: 'Energy', 
      reduction: energyDiff, 
      desc: `Reducing your home energy usage from ${latestAssessment.energy_usage} to ${inputs.energyUsage}` 
    });
  }

  const dietDiff = Number(latestAssessment.diet_score || 0) - simResult.dietScore;
  if (dietDiff > 0) {
    changes.push({ 
      category: 'Diet', 
      reduction: dietDiff, 
      desc: `Shifting your diet from ${latestAssessment.diet_type} to ${inputs.dietType}` 
    });
  }

  const wasteDiff = Number(latestAssessment.waste_score || 0) - simResult.wasteScore;
  if (wasteDiff > 0) {
    changes.push({ 
      category: 'Waste', 
      reduction: wasteDiff, 
      desc: `Improving your waste habits from ${latestAssessment.waste_habit} to ${inputs.wasteHabit}` 
    });
  }

  if (changes.length > 0) {
    // Sort changes descending by reduction amount
    changes.sort((a, b) => b.reduction - a.reduction);
    const primary = changes[0];
    insight = `${primary.desc} has the strongest effect in this simulation, saving you ${primary.reduction} points.`;
  } else if (difference > 0) {
    insight = 'Your simulated choices have increased your carbon footprint. Try choosing lower impact travel, energy, or diet alternatives to see reductions!';
  } else {
    insight = 'No modifications were simulated. Adjust some options above to see how they impact your carbon footprint score!';
  }

  // Reuse insightsEngine and recommendationEngine
  const simInsights = generateInsights(
    simResult.transportScore,
    simResult.energyScore,
    simResult.dietScore,
    simResult.wasteScore
  );

  const simRecommendations = generateRecommendations(
    inputs.transportType,
    inputs.transportDistance,
    inputs.energyUsage,
    inputs.dietType,
    inputs.wasteHabit,
    simInsights.largestContributor
  );

  return {
    currentScore,
    simulatedScore,
    difference,
    currentImpactLevel: latestAssessment.impact_level || 'Low',
    simulatedImpactLevel: simResult.impactLevel,
    comparisons,
    insight,
    simulatedInsights: {
      largestContributor: simInsights.largestContributor,
      secondLargestContributor: simInsights.secondLargestContributor,
      contributionPercentage: simInsights.contributionPercentage,
      summary: simInsights.summary,
    },
    simulatedRecommendations: simRecommendations,
  };
}

