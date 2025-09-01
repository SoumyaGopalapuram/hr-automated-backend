// src/jobs/jobs.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { OpenaiService } from '../openai/openai.service';
import { JobDto } from './dto/create-job.dto';
import { RedisService } from '../redis/redis.service';
//import { Controller, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';
//import { JobDto } from './dto/create-job.dto';
import { ResumesService } from '../resumes/resume.service';



@Controller('jobs')
export class JobsController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly openaiService: OpenaiService,
    private readonly redisService: RedisService,
    private readonly jobsService: JobsService,
    private readonly resumesService: ResumesService,
  ) {}

  @Post()
async createJob(@Body() jobDto: JobDto) {
  return await this.jobsService.createJob(jobDto);
}

@Post('create-and-match')
  async createAndMatch(@Body() jobDto: JobDto) {
    // 1️⃣ Create job + metadata
    const { job, metadata } = await this.jobsService.createJob(jobDto);

    // 2️⃣ Fetch top matching resumes
    const matches = await this.resumesService.getRelevantResumes(job.id, 26);

    return { job, metadata, matches };
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

  @Get('test-redis')
async testRedis() {
  const key = 'job:test-job';
  const value = { title: 'Test Job', location: 'Milwaukee' };
  await this.redisService.set(key, value, 60);
  return { message: 'Test job cached', key, value };
}
}
