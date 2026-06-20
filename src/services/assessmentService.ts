import { supabase } from '@/lib/supabase';
import { Assessment } from '@/types';

export type CreateAssessmentInput = Omit<Assessment, 'id' | 'created_at'>;

/**
 * Service to handle database operations for assessments.
 */
export const assessmentService = {
  /**
   * Saves a new assessment record to the Supabase database.
   */
  async createAssessment(data: CreateAssessmentInput): Promise<Assessment> {
    const { data: record, error } = await supabase
      .from('assessments')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error in createAssessment:', error);
      throw new Error(error.message || 'We could not save your assessment. Please try again.');
    }

    return record as Assessment;
  },

  /**
   * Fetches a single assessment record by its UUID.
   */
  async getAssessmentById(id: string): Promise<Assessment | null> {
    if (!id) return null;

    const { data: record, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .maybeSingle(); // Avoid throwing error on not found, return null instead

    if (error) {
      console.error('Error in getAssessmentById:', error);
      throw new Error(error.message || 'Unable to retrieve results.');
    }

    return record as Assessment | null;
  },

  /**
   * Fetches the user's latest 10 assessment history records sorted newest first.
   */
  async getUserAssessments(userId: string): Promise<Assessment[]> {
    if (!userId) return [];

    const { data: records, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error in getUserAssessments:', error);
      throw new Error(error.message || 'Unable to load your dashboard right now.');
    }

    return (records || []) as Assessment[];
  },

  /**
   * Returns the total count of assessments for a user.
   */
  async getUserAssessmentCount(userId: string): Promise<number> {
    if (!userId) return 0;

    const { count, error } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error in getUserAssessmentCount:', error);
      return 0;
    }

    return count || 0;
  }
};
