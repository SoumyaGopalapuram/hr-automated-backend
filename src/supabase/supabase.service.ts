import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { JobDto } from '../jobs/dto/create-job.dto';

// export interface JobDto {
//   job_description: string;
//   location: string;
//   years_experience: number;
//   visa_status: string;
// }

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')!;
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY')!;

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Helper to insert a job
  async insertJob(job: JobDto) {
    const { data, error } = await this.supabase
      .from('jobs')
      .insert([job])
      .select(); // returns inserted row
    if (error) throw error;
    return data[0];
  }

  async getJobById(id: number) {
    const { data, error } = await this.supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async getAllJobs() {
    const { data, error } = await this.supabase
      .from('jobs')
      .select('*');
    if (error) throw error;
    return data;
  }

  async insertJobMetadata(jobId: number, metadata: any) {
    const { data, error } = await this.supabase
      .from('job_metadata')
      .insert([
        {
          job_id: jobId,
          skills: metadata.skills,
          location: metadata.location,
          years_experience: metadata.years_experience,
          visa_status: metadata.visa_status,
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  }
}
