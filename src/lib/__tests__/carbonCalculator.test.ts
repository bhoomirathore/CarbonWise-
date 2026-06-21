import { describe, it, expect } from 'vitest';
import { calculateFootprint } from '../carbonCalculator';

describe('calculateFootprint', () => {
  // 1. Best-case and Worst-case Inputs
  it('should return the lowest possible score for best-case inputs', () => {
    const result = calculateFootprint('walking', 0, 'low', 'vegan', 'always');
    expect(result.totalScore).toBe(15);
    expect(result.transportScore).toBe(5); // 0 method + 5 distance (< 35)
    expect(result.energyScore).toBe(10);
    expect(result.dietScore).toBe(0);
    expect(result.wasteScore).toBe(0);
    expect(result.impactLevel).toBe('Low');
  });

  it('should return the highest possible score for worst-case inputs', () => {
    const result = calculateFootprint('car', 300, 'high', 'heavy meat', 'rarely');
    expect(result.totalScore).toBe(210);
    expect(result.transportScore).toBe(100); // 50 method + 50 distance (> 210)
    expect(result.energyScore).toBe(40);
    expect(result.dietScore).toBe(40);
    expect(result.wasteScore).toBe(30);
    expect(result.impactLevel).toBe('Very High');
  });

  // 2. Specific Transportation Method Scores
  describe('transportation methods', () => {
    it('should assign correct method scores for car (50)', () => {
      const result = calculateFootprint('car', 0, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(55); // 50 method + 5 distance
    });

    it('should assign correct method scores for motorcycle (30)', () => {
      const result = calculateFootprint('motorcycle', 0, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(35); // 30 method + 5 distance
    });

    it('should assign correct method scores for bus (15)', () => {
      const result = calculateFootprint('bus', 0, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(20); // 15 method + 5 distance
    });

    it('should assign correct method scores for train (10)', () => {
      const result = calculateFootprint('train', 0, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(15); // 10 method + 5 distance
    });

    it('should assign correct method scores for bicycle (0)', () => {
      const result = calculateFootprint('bicycle', 0, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(5); // 0 method + 5 distance
    });

    it('should assign correct method scores for walking (0)', () => {
      const result = calculateFootprint('walking', 0, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(5); // 0 method + 5 distance
    });
  });

  // 3. Weekly Distance Score Boundaries (< 35, <= 105, <= 210, > 210)
  describe('distance-to-score boundaries', () => {
    // Threshold 35
    it('should assign score 5 for distance just below 35', () => {
      const result = calculateFootprint('walking', 34.9, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(5); // 0 method + 5 distance
    });

    it('should assign score 15 for distance exactly 35', () => {
      const result = calculateFootprint('walking', 35, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(15); // 0 method + 15 distance
    });

    it('should assign score 15 for distance just above 35', () => {
      const result = calculateFootprint('walking', 35.1, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(15); // 0 method + 15 distance
    });

    // Threshold 105
    it('should assign score 15 for distance just below 105', () => {
      const result = calculateFootprint('walking', 104.9, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(15); // 0 method + 15 distance
    });

    it('should assign score 15 for distance exactly 105', () => {
      const result = calculateFootprint('walking', 105, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(15); // 0 method + 15 distance
    });

    it('should assign score 30 for distance just above 105', () => {
      const result = calculateFootprint('walking', 105.1, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(30); // 0 method + 30 distance
    });

    // Threshold 210
    it('should assign score 30 for distance just below 210', () => {
      const result = calculateFootprint('walking', 209.9, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(30); // 0 method + 30 distance
    });

    it('should assign score 30 for distance exactly 210', () => {
      const result = calculateFootprint('walking', 210, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(30); // 0 method + 30 distance
    });

    it('should assign score 50 for distance just above 210', () => {
      const result = calculateFootprint('walking', 210.1, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(50); // 0 method + 50 distance
    });
  });

  // 4. Impact Level Boundaries (Low: 0-50, Moderate: 51-100, High: 101-150, Very High: 151+)
  // Note: All scores are multiples of 5, making exact off-by-one scores like 51, 101, 151 unreachable
  // via normal score combinations. We verify the transitions using the closest achievable scores.
  describe('impact level boundaries', () => {
    it('should return Low for total score exactly 50', () => {
      // train(10) + distance 0(5) + low(10) + vegetarian(10) + sometimes(15) = 50
      const result = calculateFootprint('train', 0, 'low', 'vegetarian', 'sometimes');
      expect(result.totalScore).toBe(50);
      expect(result.impactLevel).toBe('Low');
    });

    it('should return Moderate for total score 55 (next achievable score above 50)', () => {
      // walking(0) + distance 0(5) + low(10) + mixed(25) + sometimes(15) = 55
      const result = calculateFootprint('walking', 0, 'low', 'mixed', 'sometimes');
      expect(result.totalScore).toBe(55);
      expect(result.impactLevel).toBe('Moderate');
    });

    it('should return Moderate for total score exactly 100', () => {
      // car(50) + distance 35(15) + low(10) + vegetarian(10) + sometimes(15) = 100
      const result = calculateFootprint('car', 35, 'low', 'vegetarian', 'sometimes');
      expect(result.totalScore).toBe(100);
      expect(result.impactLevel).toBe('Moderate');
    });

    it('should return High for total score 105 (next achievable score above 100)', () => {
      // car(50) + distance 35(15) + medium(25) + vegan(0) + sometimes(15) = 105
      const result = calculateFootprint('car', 35, 'medium', 'vegan', 'sometimes');
      expect(result.totalScore).toBe(105);
      expect(result.impactLevel).toBe('High');
    });

    it('should return High for total score exactly 150', () => {
      // car(50) + distance 150(30) + high(40) + vegan(0) + rarely(30) = 150
      const result = calculateFootprint('car', 150, 'high', 'vegan', 'rarely');
      expect(result.totalScore).toBe(150);
      expect(result.impactLevel).toBe('High');
    });

    it('should return Very High for total score 155 (next achievable score above 150)', () => {
      // car(50) + distance 250(50) + high(40) + vegan(0) + sometimes(15) = 155
      const result = calculateFootprint('car', 250, 'high', 'vegan', 'sometimes');
      expect(result.totalScore).toBe(155);
      expect(result.impactLevel).toBe('Very High');
    });
  });

  // 5. Normalization (Case insensitivity & whitespace trimming)
  describe('input normalization', () => {
    it('should normalize inputs by trimming and lowercasing', () => {
      const result = calculateFootprint('  cAr  ', 0, '  LoW  ', '  VeGaN  ', '  AlWaYs  ');
      expect(result.transportScore).toBe(55); // 50 method + 5 distance
      expect(result.energyScore).toBe(10);
      expect(result.dietScore).toBe(0);
      expect(result.wasteScore).toBe(0);
    });

    it('should handle alternative spelling/formatting for heavy meat and sometimes/always recycle', () => {
      // Test heavy-meat alias
      const result1 = calculateFootprint('walking', 0, 'low', 'heavy-meat', 'always recycle');
      expect(result1.dietScore).toBe(40);
      expect(result1.wasteScore).toBe(0);

      // Test sometimes recycle alias
      const result2 = calculateFootprint('walking', 0, 'low', 'vegan', 'sometimes recycle');
      expect(result2.wasteScore).toBe(15);

      // Test rarely recycle alias
      const result3 = calculateFootprint('walking', 0, 'low', 'vegan', 'rarely recycle');
      expect(result3.wasteScore).toBe(30);
    });
  });

  // 6. Fallback behavior for unrecognized/invalid inputs
  describe('fallback behavior', () => {
    it('should fall back to defaults for unrecognized string inputs', () => {
      const result = calculateFootprint('airplane', 0, 'extreme', 'pescatarian', 'never');
      expect(result.transportScore).toBe(5); // unrecognized type falls back to 0 method + 5 distance
      expect(result.energyScore).toBe(25); // unrecognized energy falls back to 25
      expect(result.dietScore).toBe(25); // unrecognized diet falls back to 25
      expect(result.wasteScore).toBe(15); // unrecognized waste falls back to 15
    });

    it('should handle undefined/null values by falling back to empty string logic', () => {
      // @ts-expect-error - testing JS boundary with invalid types
      const result = calculateFootprint(null, null, undefined, null, undefined);
      expect(result.transportScore).toBe(5); // 0 method + 5 distance
      expect(result.energyScore).toBe(25); // 25 fallback
      expect(result.dietScore).toBe(25); // 25 fallback
      expect(result.wasteScore).toBe(15); // 15 fallback
    });
  });

  // 7. Edge cases for distance
  describe('distance parameter edge cases', () => {
    it('should handle NaN by falling back to 0 distance', () => {
      const result = calculateFootprint('walking', NaN, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(5); // 0 method + 5 distance
    });

    it('should handle negative numbers by treating them as < 35 (giving score 5)', () => {
      const result = calculateFootprint('walking', -100, 'low', 'vegan', 'always');
      expect(result.transportScore).toBe(5); // 0 method + 5 distance
    });

    it('should handle empty strings or non-numeric strings as distance', () => {
      // @ts-expect-error - testing JS runtime behavior
      const result1 = calculateFootprint('walking', '', 'low', 'vegan', 'always');
      expect(result1.transportScore).toBe(5);

      // @ts-expect-error - testing JS runtime behavior
      const result2 = calculateFootprint('walking', 'not-a-number', 'low', 'vegan', 'always');
      expect(result2.transportScore).toBe(5);
    });
  });
});
