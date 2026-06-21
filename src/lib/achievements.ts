import { Assessment } from '@/types';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  criteria: string;
}

/**
 * Calculates achievements status based on assessment history.
 * Assessments array is expected to be sorted newest first.
 */
export function calculateAchievements(assessments: Assessment[]): Achievement[] {
  const totalCount = assessments.length;
  
  // Find oldest assessment (chronological first)
  const chronological = [...assessments].reverse();
  
  // Criteria calculations
  const firstAssessment = chronological[0];
  const thirdAssessment = chronological[2];
  
  // Find first assessment meeting low-score criteria
  const greenCitizenAssessment = chronological.find(a => (a.total_score || 0) <= 50);
  const climateChampionAssessment = chronological.find(a => (a.total_score || 0) <= 25);

  return [
    {
      id: 'carbon_explorer',
      title: 'Carbon Explorer',
      description: 'Logged your very first carbon footprint assessment.',
      icon: '🧭',
      unlocked: totalCount >= 1,
      unlockedAt: firstAssessment?.created_at,
      criteria: 'Complete 1 assessment',
    },
    {
      id: 'sustainability_starter',
      title: 'Sustainability Starter',
      description: 'Successfully logged 3 lifestyle carbon assessments.',
      icon: '🌱',
      unlocked: totalCount >= 3,
      unlockedAt: thirdAssessment?.created_at,
      criteria: 'Complete 3 assessments',
    },
    {
      id: 'green_citizen',
      title: 'Green Citizen',
      description: 'Achieved an eco-friendly score of 50 points or below.',
      icon: '🏡',
      unlocked: !!greenCitizenAssessment,
      unlockedAt: greenCitizenAssessment?.created_at,
      criteria: 'Score 50 or below in any assessment',
    },
    {
      id: 'climate_champion',
      title: 'Climate Champion',
      description: 'Achieved an exceptional carbon footprint score of 25 points or below.',
      icon: '🏆',
      unlocked: !!climateChampionAssessment,
      unlockedAt: climateChampionAssessment?.created_at,
      criteria: 'Score 25 or below in any assessment',
    },
  ];
}
