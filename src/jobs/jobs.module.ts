// src/jobs/jobs.module.ts
import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [OpenaiModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}