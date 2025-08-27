import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface JobDto {
  job_description: string;
  location: string;
  years_experience: number;
  visa_status: string;
}

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
  async insertJob(jobs: JobDto | JobDto[]) {
  const jobArray = Array.isArray(jobs) ? jobs : [jobs];

  const { data, error } = await this.supabase
    .from('jobs')
    .insert(jobArray)
    .select(); // <- this ensures Supabase returns the inserted rows

  if (error) throw error;
  return data;
}
}
