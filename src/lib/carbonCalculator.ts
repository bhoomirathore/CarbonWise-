export interface CalculationResult {
  totalScore: number;
  transportScore: number;
  energyScore: number;
  dietScore: number;
  wasteScore: number;
  impactLevel: string;
}

/**
 * Calculates carbon footprint scores based on user inputs.
 * 
 * Transportation method score:
 * - Car = 50
 * - Motorcycle = 30
 * - Bus = 15
 * - Train = 10
 * - Bicycle = 0
 * - Walking = 0
 * 
 * Transportation distance score (weekly):
 * - < 35 km = 5
 * - 35 to 105 km = 15
 * - 106 to 210 km = 30
 * - > 210 km = 50
 * 
 * Energy Usage score:
 * - Low = 10
 * - Medium = 25
 * - High = 40
 * 
 * Diet score:
 * - Vegan = 0
 * - Vegetarian = 10
 * - Mixed = 25
 * - Heavy Meat = 40
 * 
 * Waste score:
 * - Always Recycle = 0
 * - Sometimes Recycle = 15
 * - Rarely Recycle = 30
 * 
 * Impact Level:
 * - 0 to 50 = Low
 * - 51 to 100 = Moderate
 * - 101 to 150 = High
 * - 151 to 210 = Very High
 */
export function calculateFootprint(
  transportType: string,
  transportDistance: number,
  energyUsage: string,
  dietType: string,
  wasteHabit: string
): CalculationResult {
  // 1. Transportation Method Score
  let methodScore = 0;
  const transportLower = (transportType || '').toLowerCase().trim();
  if (transportLower === 'car') {
    methodScore = 50;
  } else if (transportLower === 'motorcycle') {
    methodScore = 30;
  } else if (transportLower === 'bus') {
    methodScore = 15;
  } else if (transportLower === 'train') {
    methodScore = 10;
  } else if (transportLower === 'bicycle') {
    methodScore = 0;
  } else if (transportLower === 'walking') {
    methodScore = 0;
  }

  // 2. Weekly Distance Score
  let distanceScore = 0;
  const distanceVal = Number(transportDistance) || 0;
  if (distanceVal < 35) {
    distanceScore = 5;
  } else if (distanceVal <= 105) {
    distanceScore = 15;
  } else if (distanceVal <= 210) {
    distanceScore = 30;
  } else {
    distanceScore = 50;
  }

  const transportScore = methodScore + distanceScore;

  // 3. Energy Usage Score
  let energyScore = 25; // default Medium fallback
  const energyLower = (energyUsage || '').toLowerCase().trim();
  if (energyLower === 'low') {
    energyScore = 10;
  } else if (energyLower === 'medium') {
    energyScore = 25;
  } else if (energyLower === 'high') {
    energyScore = 40;
  }

  // 4. Diet Score
  let dietScore = 25; // default Mixed fallback
  const dietLower = (dietType || '').toLowerCase().trim();
  if (dietLower === 'vegan') {
    dietScore = 0;
  } else if (dietLower === 'vegetarian') {
    dietScore = 10;
  } else if (dietLower === 'mixed') {
    dietScore = 25;
  } else if (dietLower === 'heavy meat' || dietLower === 'heavy-meat') {
    dietScore = 40;
  }

  // 5. Waste Score
  let wasteScore = 15; // default Sometimes Recycle fallback
  const wasteLower = (wasteHabit || '').toLowerCase().trim();
  if (wasteLower === 'always recycle' || wasteLower === 'always') {
    wasteScore = 0;
  } else if (wasteLower === 'sometimes recycle' || wasteLower === 'sometimes') {
    wasteScore = 15;
  } else if (wasteLower === 'rarely recycle' || wasteLower === 'rarely') {
    wasteScore = 30;
  }

  const totalScore = transportScore + energyScore + dietScore + wasteScore;

  // 6. Impact Level Mapping
  let impactLevel = 'Low';
  if (totalScore <= 50) {
    impactLevel = 'Low';
  } else if (totalScore <= 100) {
    impactLevel = 'Moderate';
  } else if (totalScore <= 150) {
    impactLevel = 'High';
  } else {
    impactLevel = 'Very High';
  }

  return {
    totalScore,
    transportScore,
    energyScore,
    dietScore,
    wasteScore,
    impactLevel
  };
}
