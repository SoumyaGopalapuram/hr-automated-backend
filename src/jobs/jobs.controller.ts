// src/jobs/jobs.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';

class CreateJobDto {
  jdText: string;
}

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  handleCreateJob(@Body() body: CreateJobDto) {
    // Just change this one line to call the new function name
    return this.jobsService.createAndParseJob(body.jdText);
  }
}