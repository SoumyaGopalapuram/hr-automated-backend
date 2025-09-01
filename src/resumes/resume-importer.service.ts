// src/resumes/resume-importer.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import fetch from 'node-fetch';

interface Resume {
  name: string;
  email?: string;
  location?: string;
  skills?: string[];
  experience_years?: number;
  visa_status?: string;
  education?: string;
  projects?: string;
}

@Injectable()
export class ResumeImporterService {
  private readonly logger = new Logger(ResumeImporterService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async importResumes() {
    const supabase = this.supabaseService.getClient();

    this.logger.log('Fetching dataset from Hugging Face...');
    const url =
     "https://datasets-server.huggingface.co/first-rows?dataset=datasetmaster%2Fresumes&config=default&split=train";

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch dataset: ${response.statusText}`);
    }

    // ✅ Explicitly type the JSON as Resume[]
    const resumes = (await response.json()) as Resume[];

    this.logger.log(`Fetched ${resumes.length} resumes. Inserting into DB...`);

    for (const resume of resumes) {
      const { error } = await supabase.from('resumes').insert({
        name: resume.name,
        email: resume.email || null,
        location: resume.location || null,
        skills: resume.skills || [],
        experience_years: resume.experience_years || 0,
        visa_status: resume.visa_status || null,
        education: resume.education || null,
        projects: resume.projects || null,
      });

      if (error) {
        this.logger.error(`❌ Error inserting resume ${resume.name}:`, error);
      }
    }

    this.logger.log('✅ Import complete.');
  }
}
