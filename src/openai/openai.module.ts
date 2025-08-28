// src/openai/openai.module.ts
import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Module({
  providers: [OpenaiService],
  exports: [OpenaiService], // ✅ export so other modules can use it
})
export class OpenaiModule {}
