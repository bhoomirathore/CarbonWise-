import { CatalogRecommendation } from '@/types/insights';

export const recommendationCatalog: CatalogRecommendation[] = [
  // Transportation
  {
    id: "transport_public_transport",
    category: "Transportation",
    title: "Use public transport more often",
    description: "Try swapping solo car rides for bus or train trips. It is a great way to lower emissions while giving you time to read or relax!",
    estimatedReductionPoints: 15,
    priority: "high"
  },
  {
    id: "transport_reduce_distance",
    category: "Transportation",
    title: "Reduce weekly travel distance",
    description: "Consider grouping errands together or working remotely when possible to reduce weekly travel. Fewer miles driven means a healthier planet!",
    estimatedReductionPoints: 10,
    priority: "medium"
  },
  {
    id: "transport_carpool",
    category: "Transportation",
    title: "Carpool where possible",
    description: "Share the ride! Commuting with colleagues or friends is a fun way to cut down on vehicle emissions and fuel costs.",
    estimatedReductionPoints: 10,
    priority: "medium"
  },
  // Energy
  {
    id: "energy_reduce_ac",
    category: "Energy",
    title: "Reduce AC usage",
    description: "Give your AC a small break. Turning it off when you step out or raising it by a couple of degrees is an easy way to save energy.",
    estimatedReductionPoints: 15,
    priority: "high"
  },
  {
    id: "energy_led_lighting",
    category: "Energy",
    title: "Switch to LED lighting",
    description: "Brighten your home efficiently! Upgrading to LED bulbs uses up to 80% less energy and they last much longer.",
    estimatedReductionPoints: 5,
    priority: "low"
  },
  {
    id: "energy_turn_off_appliances",
    category: "Energy",
    title: "Turn off unused appliances",
    description: "Power down completely. Unplugging electronics when they are not active stops 'silent' energy drain and lowers electricity waste.",
    estimatedReductionPoints: 5,
    priority: "low"
  },
  // Diet
  {
    id: "diet_reduce_meat",
    category: "Diet",
    title: "Reduce meat consumption",
    description: "Try shifting your protein choices. Swapping beef or pork for poultry, fish, or beans makes a surprisingly large impact on your footprint.",
    estimatedReductionPoints: 15,
    priority: "high"
  },
  {
    id: "diet_plant_based",
    category: "Diet",
    title: "Increase plant-based meals",
    description: "Embrace plant-powered meals! Choosing vegetarian or vegan dishes a few times a week is one of the most effective personal actions for the climate.",
    estimatedReductionPoints: 10,
    priority: "medium"
  },
  // Waste
  {
    id: "waste_recycle",
    category: "Waste",
    title: "Improve recycling habits",
    description: "Keep recyclables out of landfills. Taking a moment to properly separate paper, glass, and plastic helps conserve valuable resources.",
    estimatedReductionPoints: 15,
    priority: "high"
  },
  {
    id: "waste_reduce_plastic",
    category: "Waste",
    title: "Reduce single-use plastics",
    description: "Choose reusables over single-use items. Bringing your own shopping bags or water bottle is a simple habit that avoids plastic waste.",
    estimatedReductionPoints: 10,
    priority: "medium"
  }
];
