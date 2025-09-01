// // src/resume/resume.controller.ts
// import { Controller, Post, Get, Body } from '@nestjs/common';
// import { ResumeService } from './resume.service';
// import { CreateResumeDto } from './dto/create-resume.dto';
// import { ResumeImporterService } from './resume-importer.service';

// @Controller('resumes')
// export class ResumeController {
//   constructor(private readonly resumeService: ResumeService, private readonly importer: ResumeImporterService) {}

//   @Post()
//   async create(@Body() dto: CreateResumeDto) {
//     return this.resumeService.createResume(dto);
//   }

//   @Get()
//   async findAll() {
//     return this.resumeService.getAllResumes();
//   }
  
//   @Post('import')
//   async importResumes() {
//     await this.importer.importResumes();
//     return { message: 'Resumes imported successfully' };
//   }
// }
