// src/jobs/jobs.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class JobsService {
  private supabase: SupabaseClient;
  private openai: OpenAI;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {
    this.supabase = this.supabaseService.getClient();
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async createAndParseJob(jdText: string) {
    // --- Step 1: Save the initial job to Supabase ---
    console.log('Saving new job description to Supabase...');
    const { data: newJob, error: insertError } = await this.supabase
      .from('jobs')
      .insert({ jd_text: jdText, status: 'pending' })
      .select()
      .single();

    if (insertError || !newJob) {
      console.error('Error saving job:', insertError?.message || 'Job data was null');
      throw new InternalServerErrorException('Could not save job to database.');
    }

    console.log('Job saved successfully with ID:', newJob.id);

    // --- Step 2: Call OpenAI to parse the job description ---
    try {
      console.log('Sending job description to OpenAI for parsing...');
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert HR assistant. Your task is to parse a job description and extract key information into a structured JSON format. Identify mandatory skills, preferred skills, minimum years of experience, and the role location.',
          },
          {
            role: 'user',
            content: jdText,
          },
        ],
        response_format: { type: 'json_object' },
      });
      
      const messageContent = response.choices[0].message.content;
      if (!messageContent) {
        throw new Error('OpenAI returned an empty response.');
      }
      
      const parsedReq = JSON.parse(messageContent);
      console.log('Successfully parsed JD from OpenAI:', parsedReq);

      // --- Step 3: Update the job in Supabase with the parsed data ---
      const { data: updatedJob, error: updateError } = await this.supabase
        .from('jobs')
        .update({ parsed_req: parsedReq, status: 'parsed' })
        .eq('id', newJob.id)
        .select()
        .single();
      
      if (updateError) {
        throw new InternalServerErrorException('Could not update job with parsed data.');
      }

      return { message: 'Job created and parsed successfully!', job: updatedJob };

    } catch (e) {
      console.error('Error calling OpenAI or updating the job:', e);
      throw new InternalServerErrorException('Failed to parse job description with AI.');
    }
  }
}