// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { JobsModule } from './jobs/jobs.module';
import { ResumeModule } from './resumes/resume.module';
import { RedisModule } from './redis/redis.module'; // ✅ use the module, not the service

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    JobsModule,
    ResumeModule,
    RedisModule, // ✅ include the module here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
