// src/jobs/jobs.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { OpenaiService } from '../openai/openai.service';
import { JobDto } from './dto/create-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly openaiService: OpenaiService,
  ) {}

  @Post()
async createJob(@Body() body: JobDto) {
  // 1️⃣ Store job in Supabase
  const savedJob = await this.supabaseService.insertJob(body);

  // 2️⃣ Extract only skills from OpenAI
  const aiResult = await this.openaiService.extractMetadata(savedJob.job_description);


  // 3️⃣ Insert metadata into job_metadata table
  const supabase = this.supabaseService.getClient();
  const { data: meta, error: metaError } = await supabase
  .from('job_metadata')
  .insert({
    job_id: savedJob.id,
    skills: aiResult.skills,
    location: savedJob.location,
    years_experience: savedJob.years_experience,
    visa_status: savedJob.visa_status,
  })
  .select()
  .single();

if (metaError) {
  console.error('Metadata insert failed:', metaError); // 👈 log exact issue
  throw new Error(`Failed to insert AI metadata: ${metaError.message}`);
}

  // 4️⃣ Return both job and metadata
  return {
    success: true,
    job: savedJob,
    metadata: meta,
  };
}


  @Get('test-connection')
  async testConnection() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .limit(1);

    if (error) {
      return { success: false, error };
    }
    return { success: true, data };
  }
}
