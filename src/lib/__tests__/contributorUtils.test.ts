import { describe, it, expect } from 'vitest';
import { 
  getRankedContributors, 
  getLargestContributor, 
  getSecondLargestContributor 
} from '../contributorUtils';
import { RankedContributor } from '@/types/insights';

describe('contributorUtils', () => {
  describe('getRankedContributors', () => {
    it('should return 4 fixed categories sorted descending by score with correct percentages', () => {
      const result = getRankedContributors(50, 25, 10, 15);
      
      expect(result).toHaveLength(4);
      
      // Order: Transportation (50), Energy (25), Waste (15), Diet (10)
      expect(result[0]).toEqual({ category: 'Transportation', score: 50, percentage: 50 });
      expect(result[1]).toEqual({ category: 'Energy', score: 25, percentage: 25 });
      expect(result[2]).toEqual({ category: 'Waste', score: 15, percentage: 15 });
      expect(result[3]).toEqual({ category: 'Diet', score: 10, percentage: 10 });
    });

    it('should handle tie scores by keeping them in rank (stable sort behavior)', () => {
      const result = getRankedContributors(30, 30, 30, 30);
      expect(result).toHaveLength(4);
      // All scores are 30, total 120, each is 25%
      for (const item of result) {
        expect(item.score).toBe(30);
        expect(item.percentage).toBe(25);
      }
    });

    it('should handle all zero scores safely by setting percentage to 0', () => {
      const result = getRankedContributors(0, 0, 0, 0);
      expect(result).toHaveLength(4);
      for (const item of result) {
        expect(item.score).toBe(0);
        expect(item.percentage).toBe(0);
      }
    });
  });

  describe('getLargestContributor', () => {
    it('should return the top category when score is greater than 0', () => {
      const ranked: RankedContributor[] = [
        { category: 'Transportation', score: 50, percentage: 50 },
        { category: 'Energy', score: 25, percentage: 25 }
      ];
      expect(getLargestContributor(ranked)).toEqual(ranked[0]);
    });

    it('should return null if the top category score is 0', () => {
      const ranked: RankedContributor[] = [
        { category: 'Transportation', score: 0, percentage: 0 }
      ];
      expect(getLargestContributor(ranked)).toBeNull();
    });

    it('should return null when called directly with an empty array', () => {
      expect(getLargestContributor([])).toBeNull();
    });
  });

  describe('getSecondLargestContributor', () => {
    it('should return the second category when its score is greater than 0', () => {
      const ranked: RankedContributor[] = [
        { category: 'Transportation', score: 50, percentage: 50 },
        { category: 'Energy', score: 25, percentage: 25 }
      ];
      expect(getSecondLargestContributor(ranked)).toEqual(ranked[1]);
    });

    it('should return null if the second category score is 0', () => {
      const ranked: RankedContributor[] = [
        { category: 'Transportation', score: 50, percentage: 100 },
        { category: 'Energy', score: 0, percentage: 0 }
      ];
      expect(getSecondLargestContributor(ranked)).toBeNull();
    });

    it('should return null if the ranked list has fewer than 2 items', () => {
      const ranked: RankedContributor[] = [
        { category: 'Transportation', score: 50, percentage: 100 }
      ];
      expect(getSecondLargestContributor(ranked)).toBeNull();
    });

    it('should return null when called directly with an empty array', () => {
      expect(getSecondLargestContributor([])).toBeNull();
    });
  });
});
