// src/jobs/jobs.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';  // ✅ Added Get
import { JobsService } from './jobs.service';
import { SupabaseService } from '../supabase/supabase.service'; // ✅ Import SupabaseService
//import { JobDto } from './dto/create-job.dto';

class JobDto {
  job_description: string;
  location: string;
  years_experience: number;
  visa_status: string;
}

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly supabaseService: SupabaseService,  // ✅ Injected SupabaseService
  ) {}

  @Post()
async createJob(@Body() body: JobDto) {
  const data = await this.supabaseService.insertJob(body);
  return { success: true, data };
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


