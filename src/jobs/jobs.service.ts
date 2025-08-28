import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { JobDto } from './dto/create-job.dto';
import { OpenaiService } from '../openai/openai.service';

@Injectable()
export class JobsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly openaiService: OpenaiService,
  ) {}

  async createJob(jobDto: JobDto) {
    const supabase = this.supabaseService.getClient();

    // 1️⃣ Insert raw job into `jobs` table
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert([jobDto])
      .select()
      .single();

    if (jobError || !job) {
      throw new InternalServerErrorException(
        'Failed to insert job into jobs table.',
      );
    }

    // 2️⃣ Call OpenAI to extract structured metadata
    const metadata = await this.openaiService.extractMetadata(job);

const { data: meta, error: metaError } = await supabase
  .from('job_metadata')
  .insert({
    job_id: job.id,
    skills: metadata.skills,
    location: metadata.location || job.location,
    years_experience: metadata.years_experience || job.years_experience,
    visa_status: metadata.visa_status || job.visa_status,
  })
  .select()
  .single();

if (metaError) {
  throw new InternalServerErrorException(
    'Failed to insert AI metadata into job_metadata table.',
  );
}}
}
