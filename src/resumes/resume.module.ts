import { Module } from '@nestjs/common';
import { ResumesService } from './resume.service';
import { SupabaseService } from '../supabase/supabase.service';
import { ResumeImporterService } from './resume-importer.service';

@Module({
  providers: [ResumesService, SupabaseService, ResumeImporterService],
  exports: [ResumesService], // other modules (JobsModule) can inject it
})
export class ResumeModule {}
