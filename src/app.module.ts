// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    // This line MUST be here and configured like this.
    // It loads your .env file and makes it available to all other modules.
    ConfigModule.forRoot({ isGlobal: true }),

    SupabaseModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}