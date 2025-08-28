import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async extractMetadata(jobDescription: string) {
    const prompt = `
Extract the following from the job description:
1. Technical skills (as an array of strings)
2. Job location
3. Minimum years of experience
4. Visa status

Respond strictly as JSON in the format:
{
  "skills": ["skill1", "skill2"],
  "location": "string",
  "years_experience": number,
  "visa_status": "string"
}

Job description: "${jobDescription}"
`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    // Safely parse
    const result = JSON.parse(response.choices[0].message.content || '{}');

    // Defaults to avoid nulls
    if (!result.skills) result.skills = [];
    if (!result.location) result.location = '';
    if (!result.years_experience) result.years_experience = 0;
    if (!result.visa_status) result.visa_status = '';

    return result;
  }
}
