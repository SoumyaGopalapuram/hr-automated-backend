import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { JobDto } from './dto/create-job.dto';
import { OpenaiService } from '../openai/openai.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class JobsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly openaiService: OpenaiService,
    private readonly redisService: RedisService,
  ) {}

  async createJob(jobDto: JobDto) {
    const supabase = this.supabaseService.getClient();
    const cacheKey = `job:${jobDto.job_description}`;
    console.log('🔹 Cache key:', cacheKey);

    // Try Redis cache first
    const cached = await this.redisService.get(cacheKey);
    if (cached) return { fromCache: true, ...cached };

    // Insert job into Supabase
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert([jobDto])
      .select()
      .single();
    if (jobError || !job) throw new InternalServerErrorException('Failed to insert job');

    // Extract metadata via OpenAI
    // Extract metadata via OpenAI
    const metadata = await this.openaiService.extractMetadata(job.job_description);


    // Insert metadata into Supabase
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
    if (metaError) throw new InternalServerErrorException('Failed to insert metadata');

    const result = { fromCache: false, job, metadata: meta };

    // Save result in Redis cache
    await this.redisService.set(cacheKey, result, 60);

    return result;
  }
}
