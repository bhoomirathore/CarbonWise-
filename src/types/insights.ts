export interface RankedContributor {
  category: string;
  score: number;
  percentage: number;
}

export interface ImpactExplanation {
  title: string;
  description: string;
  actionFocus: string;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  estimatedReductionPoints: number;
  priority: "high" | "medium" | "low";
}

export interface CatalogRecommendation {
  id: string;
  category: "Transportation" | "Energy" | "Diet" | "Waste";
  title: string;
  description: string;
  estimatedReductionPoints: number;
  priority: "high" | "medium" | "low";
}
