export interface LearnItem {
  category: 'Transportation' | 'Energy' | 'Food' | 'Waste';
  title: string;
  description: string;
  tips: string[];
  imageUrl?: string;
}

export const learnContent: LearnItem[] = [
  {
    category: 'Transportation',
    title: 'Decarbonizing Your Commute',
    description: 'Transportation is one of the largest sources of individual carbon emissions globally. Swapping high-impact transit options for active transport or electric options significantly lowers greenhouse gas output.',
    tips: [
      'Switch to public transportation (bus, train, subway) to reduce emissions per passenger-kilometer by up to 80%.',
      'Walk, bike, or use electric kick-scooters for short trips under 5 kilometers.',
      'Carpool with colleagues or friends to distribute travel emissions and reduce road congestion.',
      'Transition to an hybrid or battery electric vehicle (BEV) to run on low-carbon electrical grids.',
      'Combine multiple errands into a single trip, avoiding frequent short drives.'
    ],
    imageUrl: '/images/learn/transit.jpg'
  },
  {
    category: 'Energy',
    title: 'Smart Home Energy Management',
    description: 'Residential power usage is a massive contributor to carbon footprints. Energy efficiency updates not only reduce utility bills but also drop daily emissions from fossil fuel-burning power plants.',
    tips: [
      'Replace all standard incandescent light bulbs with high-efficiency LEDs, saving up to 75% on lighting power.',
      'Use a programmable or smart thermostat to adjust temperatures automatically when you are sleeping or away.',
      'Unplug "phantom load" appliances (TVs, chargers, microwave clocks) when they are not in active use.',
      'Upgrade to ENERGY STAR certified home appliances (fridges, laundry, dishwashers).',
      'Verify wall and window insulation to keep heat in during winter and cool air in during summer.'
    ],
    imageUrl: '/images/learn/energy.jpg'
  },
  {
    category: 'Food',
    title: 'Climate-Friendly Dietary Practices',
    description: 'The agriculture sector accounts for nearly a quarter of global emissions. Moving toward plant-centric meals and avoiding waste has a direct, massive positive impact on greenhouse gas mitigation.',
    tips: [
      'Adopt a plant-based or vegetarian diet to reduce food-related emissions by up to 60-70%.',
      'Choose local, seasonal produce to reduce fuel emissions linked to long-distance food transport.',
      'Reduce red meat consumption (beef, lamb) which requires 20x more land and releases far more greenhouse gases than plant proteins.',
      'Plan your meals and shop with a list to prevent food spoilage and landfill organic waste.',
      'Support sustainable agriculture or regenerative farming brands that capture carbon in soil.'
    ],
    imageUrl: '/images/learn/diet.jpg'
  },
  {
    category: 'Waste',
    title: 'Closing the Loop: Recycling & Circular Habits',
    description: 'When waste goes to landfills, it decomposes anaerobically and produces methane, a potent greenhouse gas. Practicing the circular economy principles of Reduce, Reuse, and Recycle is crucial.',
    tips: [
      'Recycle clean paper, cardboard, glass, metals, and designated plastics diligently according to local guidelines.',
      'Compost food scraps and organic yard waste to reduce landfill methane emissions and create rich soil nutrients.',
      'Decline single-use plastics (straws, cups, checkout bags) in favor of durable, reusable alternatives.',
      'Repair or donate household items instead of discarding them to extend their product lifespan.',
      'Buy bulk goods with minimal packaging to reduce overall packaging waste footprint.'
    ],
    imageUrl: '/images/learn/waste.jpg'
  }
];
