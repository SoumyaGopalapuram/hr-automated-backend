// src/jobs/jobs.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { SupabaseClient } from '@supabase/supabase-js';
import OpenAI from 'openai'; // Import OpenAI
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class JobsService {
  private supabase: SupabaseClient;
  private openai: OpenAI; // Add a property for the OpenAI client

  // Inject both SupabaseService and ConfigService
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {
    this.supabase = this.supabaseService.getClient();

    // Create a new instance of the OpenAI client with your API key
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  // The function is now renamed to reflect its new purpose
  async createAndParseJob(jdText: string) {
    // --- Step 1: Save the initial job to Supabase (Same as before) ---
    console.log('Saving new job description to Supabase...');
    const { data: job, error: insertError } = await this.supabase
      .from('jobs')
      .insert({ jd_text: jdText, status: 'pending' })
      .select()
      .single();

    if (insertError) {
      console.error('Error saving job:', insertError.message);
      throw new InternalServerErrorException('Could not save job to database.');
    }
    console.log('Job saved successfully with ID:', job.id);

    // --- Step 2: Call OpenAI to parse the job description ---
    console.log('Sending job description to OpenAI for parsing...');
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // Or 'gpt-3.5-turbo' for a faster, cheaper option
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
        // This forces OpenAI to respond with a JSON object that matches our schema
        response_format: { type: 'json_object' },
      });

      const parsedReq = JSON.parse(response.choices[0].message.content);
      console.log('Successfully parsed JD from OpenAI:', parsedReq);

      // --- Step 3: Update the job in Supabase with the parsed data ---
      const { data: updatedJob, error: updateError } = await this.supabase
        .from('jobs')
        .update({ parsed_req: parsedReq, status: 'parsed' })
        .eq('id', job.id)
        .select()
        .single();
      
      if (updateError) {
        throw new InternalServerErrorException('Could not update job with parsed data.');
      }

      return { message: 'Job created and parsed successfully!', job: updatedJob };

    } catch (e) {
      console.error('Error calling OpenAI or updating the job:', e);
      // If AI fails, we should still return the job that was created
      throw new InternalServerErrorException('Failed to parse job description with AI.');
    }
  }
}