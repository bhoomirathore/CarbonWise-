import { describe, it, expect } from 'vitest';
import { calculateAchievements } from '../achievements';
import { Assessment } from '@/types';

// Helper to create mock assessments
function createMockAssessment(id: string, totalScore: number | undefined, createdAt: string): Assessment {
  return {
    id,
    user_id: 'user-1',
    created_at: createdAt,
    transport_type: 'car',
    transport_distance: 100,
    energy_usage: 'high',
    diet_type: 'mixed',
    waste_habit: 'sometimes',
    total_score: totalScore as number, // bypass typescript check
    transport_score: 50,
    energy_score: 25,
    diet_score: 25,
    waste_score: 15,
    impact_level: 'High'
  };
}

describe('calculateAchievements', () => {
  it('should return all achievements locked when assessment history is empty', () => {
    const achievements = calculateAchievements([]);
    expect(achievements).toHaveLength(4);
    for (const ach of achievements) {
      expect(ach.unlocked).toBe(false);
      expect(ach.unlockedAt).toBeUndefined();
    }
  });

  // Carbon Explorer (1 assessment)
  it('should unlock Carbon Explorer when at least 1 assessment exists', () => {
    const assessments = [
      createMockAssessment('1', 80, '2026-06-01T12:00:00Z')
    ];
    const achievements = calculateAchievements(assessments);
    const explorer = achievements.find(a => a.id === 'carbon_explorer');
    expect(explorer?.unlocked).toBe(true);
    expect(explorer?.unlockedAt).toBe('2026-06-01T12:00:00Z');
  });

  // Sustainability Starter (3 assessments)
  it('should unlock Sustainability Starter when at least 3 assessments exist', () => {
    const assessments = [
      createMockAssessment('3', 80, '2026-06-03T12:00:00Z'), // newest
      createMockAssessment('2', 80, '2026-06-02T12:00:00Z'),
      createMockAssessment('1', 80, '2026-06-01T12:00:00Z')  // oldest
    ];
    const achievements = calculateAchievements(assessments);
    const starter = achievements.find(a => a.id === 'sustainability_starter');
    expect(starter?.unlocked).toBe(true);
    expect(starter?.unlockedAt).toBe('2026-06-03T12:00:00Z'); // unlocked at third assessment chronological (which is ID 3)
  });

  // Green Citizen Boundaries (<= 50 vs 51)
  describe('Green Citizen score boundaries', () => {
    it('should unlock Green Citizen when score is exactly 50', () => {
      const assessments = [createMockAssessment('1', 50, '2026-06-01T12:00:00Z')];
      const achievements = calculateAchievements(assessments);
      const greenCitizen = achievements.find(a => a.id === 'green_citizen');
      expect(greenCitizen?.unlocked).toBe(true);
    });

    it('should not unlock Green Citizen when score is 51', () => {
      const assessments = [createMockAssessment('1', 51, '2026-06-01T12:00:00Z')];
      const achievements = calculateAchievements(assessments);
      const greenCitizen = achievements.find(a => a.id === 'green_citizen');
      expect(greenCitizen?.unlocked).toBe(false);
    });
  });

  // Climate Champion Boundaries (<= 25 vs 26)
  describe('Climate Champion score boundaries', () => {
    it('should unlock Climate Champion when score is exactly 25', () => {
      const assessments = [createMockAssessment('1', 25, '2026-06-01T12:00:00Z')];
      const achievements = calculateAchievements(assessments);
      const champion = achievements.find(a => a.id === 'climate_champion');
      expect(champion?.unlocked).toBe(true);
    });

    it('should not unlock Climate Champion when score is 26', () => {
      const assessments = [createMockAssessment('1', 26, '2026-06-01T12:00:00Z')];
      const achievements = calculateAchievements(assessments);
      const champion = achievements.find(a => a.id === 'climate_champion');
      expect(champion?.unlocked).toBe(false);
    });
  });

  // Finding first chronological match using oldest-first search order
  it('should unlock green_citizen and climate_champion using the oldest assessment that met the criteria', () => {
    const assessments = [
      createMockAssessment('newest', 20, '2026-06-03T12:00:00Z'), // chronological 3rd (score 20 - matches both)
      createMockAssessment('middle', 70, '2026-06-02T12:00:00Z'), // chronological 2nd (score 70)
      createMockAssessment('oldest', 45, '2026-06-01T12:00:00Z')  // chronological 1st (score 45 - matches green_citizen)
    ];

    const achievements = calculateAchievements(assessments);
    
    const greenCitizen = achievements.find(a => a.id === 'green_citizen');
    expect(greenCitizen?.unlocked).toBe(true);
    // Should match the oldest (2026-06-01) since it chronologically came first and had score 45 (<= 50)
    expect(greenCitizen?.unlockedAt).toBe('2026-06-01T12:00:00Z');

    const champion = achievements.find(a => a.id === 'climate_champion');
    expect(champion?.unlocked).toBe(true);
    // Since oldest and middle did not meet <= 25, it matches the newest (2026-06-03)
    expect(champion?.unlockedAt).toBe('2026-06-03T12:00:00Z');
  });

  // Fallback testing for undefined/null total score
  it('should handle undefined/missing total_score by falling back to 0', () => {
    const assessments = [
      createMockAssessment('1', undefined, '2026-06-01T12:00:00Z')
    ];
    const achievements = calculateAchievements(assessments);
    
    // With 0 fallback, both green_citizen (0 <= 50) and climate_champion (0 <= 25) should unlock
    expect(achievements.find(a => a.id === 'green_citizen')?.unlocked).toBe(true);
    expect(achievements.find(a => a.id === 'climate_champion')?.unlocked).toBe(true);
  });
});
