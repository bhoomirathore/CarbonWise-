import { describe, it, expect } from 'vitest';
import { getImpactExplanation } from '../impactLevelEngine';

describe('getImpactExplanation', () => {
  it('should return correct explanation for low impact', () => {
    const result = getImpactExplanation('low');
    expect(result).toEqual({
      title: "Great Progress",
      description: "Your lifestyle currently produces relatively low emissions compared to the average user.",
      actionFocus: "Focus on maintaining your positive habits."
    });
  });

  it('should return correct explanation for moderate impact', () => {
    const result = getImpactExplanation('moderate');
    expect(result).toEqual({
      title: "Room For Improvement",
      description: "Your emissions are manageable, but several opportunities exist to reduce your footprint.",
      actionFocus: "Focus on your largest contributing category first."
    });
  });

  it('should return correct explanation for high impact', () => {
    const result = getImpactExplanation('high');
    expect(result).toEqual({
      title: "Significant Impact",
      description: "Several lifestyle choices are contributing heavily to your overall footprint.",
      actionFocus: "Transportation and energy improvements will have the biggest effect."
    });
  });

  it('should treat very high as fallback and return High Emission Lifestyle explanation', () => {
    // There is no explicit branch for 'very high' in the code; it falls through to the default block
    const result = getImpactExplanation('very high');
    expect(result).toEqual({
      title: "High Emission Lifestyle",
      description: "Your current lifestyle produces a significantly elevated carbon footprint.",
      actionFocus: "Immediate changes in transportation and energy habits will provide the largest reductions."
    });
  });

  it('should fall back to High Emission Lifestyle for garbage or empty input', () => {
    const result1 = getImpactExplanation('garbage-input');
    expect(result1.title).toBe("High Emission Lifestyle");

    const result2 = getImpactExplanation('');
    expect(result2.title).toBe("High Emission Lifestyle");

    // @ts-expect-error - testing JS runtime behavior
    const result3 = getImpactExplanation(null);
    expect(result3.title).toBe("High Emission Lifestyle");
  });

  it('should normalize inputs by lowercasing and trimming', () => {
    const result1 = getImpactExplanation('  LoW  ');
    expect(result1.title).toBe("Great Progress");

    const result2 = getImpactExplanation(' MODERATE ');
    expect(result2.title).toBe("Room For Improvement");
  });
});
