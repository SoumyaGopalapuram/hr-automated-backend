// src/resumes/resumes.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ResumesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Fetch relevant resumes based on job ID
   */
  async getRelevantResumes(jobId: number, limit = 20) {
    const supabase = this.supabaseService.getClient();

    // Call the PostgreSQL function
    const { data, error } = await supabase.rpc('match_resumes_jsonb', {
      p_job_id: jobId,
      p_result_limit: limit,
    });

    if (error) {
      console.error('Error fetching relevant resumes:', error);
      throw new Error(error.message);
    }

    return data;
  }
}
