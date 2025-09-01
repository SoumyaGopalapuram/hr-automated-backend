// src/resume/dto/create-resume.dto.ts
export class CreateResumeDto {
  name: string;
  email?: string;
  location?: string;
  skills?: string[];
  experience_years?: number;
  visa_status?: string;
  education?: string;
  projects?: string;
}
