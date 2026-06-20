import { ImpactExplanation } from '@/types/insights';

/**
 * Returns title, description, and action focus depending on the score impact level.
 */
export function getImpactExplanation(impactLevel: string): ImpactExplanation {
  const level = (impactLevel || '').toLowerCase().trim();

  if (level === 'low') {
    return {
      title: "Great Progress",
      description: "Your lifestyle currently produces relatively low emissions compared to the average user.",
      actionFocus: "Focus on maintaining your positive habits."
    };
  }

  if (level === 'moderate') {
    return {
      title: "Room For Improvement",
      description: "Your emissions are manageable, but several opportunities exist to reduce your footprint.",
      actionFocus: "Focus on your largest contributing category first."
    };
  }

  if (level === 'high') {
    return {
      title: "Significant Impact",
      description: "Several lifestyle choices are contributing heavily to your overall footprint.",
      actionFocus: "Transportation and energy improvements will have the biggest effect."
    };
  }

  // Very High or fallback
  return {
    title: "High Emission Lifestyle",
    description: "Your current lifestyle produces a significantly elevated carbon footprint.",
    actionFocus: "Immediate changes in transportation and energy habits will provide the largest reductions."
  };
}
