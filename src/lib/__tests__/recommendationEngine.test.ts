import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../recommendationEngine';

describe('generateRecommendations', () => {
  // 1. Dynamic Priority Rules
  describe('determineDynamicPriority logic', () => {
    it('should assign high priority when category matches largestContributor AND points >= 15', () => {
      // 'Transportation' matches largestContributor, and 'transport_public_transport' has 15 points
      const recs = generateRecommendations('car', 0, 'low', 'vegan', 'always', 'Transportation');
      const publicTransport = recs.find(r => r.id === 'transport_public_transport');
      expect(publicTransport).toBeDefined();
      expect(publicTransport!.priority).toBe('high');
    });

    it('should assign medium priority when category matches largestContributor but points < 15 (e.g., 10)', () => {
      // 'Transportation' matches largestContributor, and 'transport_carpool' has 10 points
      const recs = generateRecommendations('car', 0, 'low', 'vegan', 'always', 'Transportation');
      const carpool = recs.find(r => r.id === 'transport_carpool');
      expect(carpool).toBeDefined();
      expect(carpool!.priority).toBe('medium');
    });

    it('should assign medium priority when points >= 15 but category does not match largestContributor', () => {
      // 'Energy' does not match largestContributor ('Transportation'), and 'energy_reduce_ac' has 15 points
      const recs = generateRecommendations('walking', 0, 'high', 'vegan', 'always', 'Transportation');
      const reduceAC = recs.find(r => r.id === 'energy_reduce_ac');
      expect(reduceAC).toBeDefined();
      expect(reduceAC!.priority).toBe('medium');
    });

    it('should assign low priority when points < 10 regardless of largestContributor', () => {
      // 'energy_led_lighting' has 5 points
      const recs = generateRecommendations('walking', 0, 'high', 'vegan', 'always', 'Energy');
      const led = recs.find(r => r.id === 'energy_led_lighting');
      expect(led).toBeDefined();
      expect(led!.priority).toBe('low');
    });
  });

  // 2. Input Matching Rules
  describe('input matching', () => {
    it('should match transport public transit and carpool recommendations for car/motorcycle', () => {
      const recs1 = generateRecommendations('car', 0, 'low', 'vegan', 'always', 'None');
      expect(recs1.some(r => r.id === 'transport_public_transport')).toBe(true);
      expect(recs1.some(r => r.id === 'transport_carpool')).toBe(true);

      const recs2 = generateRecommendations('motorcycle', 0, 'low', 'vegan', 'always', 'None');
      expect(recs2.some(r => r.id === 'transport_public_transport')).toBe(true);
      expect(recs2.some(r => r.id === 'transport_carpool')).toBe(true);
    });

    it('should match reduce distance recommendation when distance > 35', () => {
      const recs = generateRecommendations('walking', 36, 'low', 'vegan', 'always', 'None');
      expect(recs.some(r => r.id === 'transport_reduce_distance')).toBe(true);
    });

    it('should not match reduce distance recommendation when distance <= 35', () => {
      // Use medium energy to get 3 matched recommendations and prevent padding from adding 'transport_reduce_distance'
      const recs = generateRecommendations('walking', 35, 'medium', 'vegan', 'always', 'None');
      expect(recs.some(r => r.id === 'transport_reduce_distance')).toBe(false);
    });

    it('should match energy reducing recommendations when energy is medium or high', () => {
      const recsHigh = generateRecommendations('walking', 0, 'high', 'vegan', 'always', 'None');
      expect(recsHigh.some(r => r.id === 'energy_reduce_ac')).toBe(true);
      expect(recsHigh.some(r => r.id === 'energy_led_lighting')).toBe(true);
      expect(recsHigh.some(r => r.id === 'energy_turn_off_appliances')).toBe(true);

      const recsMed = generateRecommendations('walking', 0, 'medium', 'vegan', 'always', 'None');
      expect(recsMed.some(r => r.id === 'energy_reduce_ac')).toBe(true);
    });

    it('should match diet recommendations when diet is heavy meat, heavy-meat, or mixed', () => {
      const recsHeavy = generateRecommendations('walking', 0, 'low', 'heavy meat', 'always', 'None');
      expect(recsHeavy.some(r => r.id === 'diet_reduce_meat')).toBe(true);
      expect(recsHeavy.some(r => r.id === 'diet_plant_based')).toBe(true);

      const recsHeavyHyphen = generateRecommendations('walking', 0, 'low', 'heavy-meat', 'always', 'None');
      expect(recsHeavyHyphen.some(r => r.id === 'diet_reduce_meat')).toBe(true);

      const recsMixed = generateRecommendations('walking', 0, 'low', 'mixed', 'always', 'None');
      expect(recsMixed.some(r => r.id === 'diet_reduce_meat')).toBe(true);
    });

    it('should match waste recommendations when waste habit is sometimes or rarely', () => {
      const recsSometimes = generateRecommendations('walking', 0, 'low', 'vegan', 'sometimes', 'None');
      expect(recsSometimes.some(r => r.id === 'waste_recycle')).toBe(true);
      expect(recsSometimes.some(r => r.id === 'waste_reduce_plastic')).toBe(true);

      const recsRarely = generateRecommendations('walking', 0, 'low', 'vegan', 'rarely recycle', 'None');
      expect(recsRarely.some(r => r.id === 'waste_recycle')).toBe(true);
    });
  });

  // 3. Normalization (Case insensitivity & trimming)
  describe('normalization and fallbacks', () => {
    it('should normalize inputs by lowercasing and trimming', () => {
      const recs = generateRecommendations('  CaR  ', 0, '  HiGh  ', '  MiXeD  ', '  SoMeTiMeS  ', '  EnErGy  ');
      // Verify matches succeeded
      expect(recs.some(r => r.id === 'transport_public_transport')).toBe(true);
      expect(recs.some(r => r.id === 'energy_reduce_ac')).toBe(true);
      expect(recs.some(r => r.id === 'diet_reduce_meat')).toBe(true);
      expect(recs.some(r => r.id === 'waste_recycle')).toBe(true);
    });

    it('should handle undefined/null/empty parameters safely and use default string logic', () => {
      // @ts-expect-error - testing JS runtime behavior
      const recs = generateRecommendations(undefined, null, '', undefined, null, 'None');
      expect(recs).toBeDefined();
      expect(recs.length).toBe(3); // padded successfully
    });
  });

  // 4. Sorting logic (priority descending: high > medium > low, then reduction points descending)
  describe('sorting and constraints', () => {
    it('should sort recommendations by priority then estimated reduction points descending', () => {
      // Generate a variety of matches
      const recs = generateRecommendations('car', 100, 'high', 'heavy meat', 'rarely', 'Energy');

      // Priorities order should be: high, then medium, then low
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      for (let i = 0; i < recs.length - 1; i++) {
        const current = recs[i];
        const next = recs[i + 1];
        const currentWeight = priorityWeight[current.priority];
        const nextWeight = priorityWeight[next.priority];

        if (currentWeight !== nextWeight) {
          expect(currentWeight).toBeGreaterThan(nextWeight);
        } else {
          expect(current.estimatedReductionPoints).toBeGreaterThanOrEqual(next.estimatedReductionPoints);
        }
      }
    });

    it('should return at least 3 and at most 5 recommendations', () => {
      // Scenario with 0 matches (walking, 0km, low energy, vegan, always recycle) -> Should pad to 3
      const emptyRecs = generateRecommendations('walking', 0, 'low', 'vegan', 'always', 'None');
      expect(emptyRecs.length).toBe(3);

      // Scenario with too many matches (should cap at 5)
      const fullRecs = generateRecommendations('car', 100, 'high', 'heavy meat', 'rarely', 'None');
      expect(fullRecs.length).toBe(5);
    });
  });

  // 5. Edge cases for distance
  describe('distance edge cases', () => {
    it('should handle non-numeric distance gracefully by casting to 0', () => {
      // Use medium energy to get 3 matches and prevent padding from adding 'transport_reduce_distance'
      // @ts-expect-error - testing JS boundary
      const recs = generateRecommendations('walking', 'invalid-distance', 'medium', 'vegan', 'always', 'None');
      expect(recs.some(r => r.id === 'transport_reduce_distance')).toBe(false);
      expect(recs.length).toBe(3); // no padding added
    });

    it('should handle negative distance by treating it as <= 35', () => {
      // Use medium energy to get 3 matches and prevent padding from adding 'transport_reduce_distance'
      const recs = generateRecommendations('walking', -100, 'medium', 'vegan', 'always', 'None');
      expect(recs.some(r => r.id === 'transport_reduce_distance')).toBe(false);
    });
  });
});
