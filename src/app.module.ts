import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { JobsModule } from './jobs/jobs.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    JobsModule,
    RedisModule, // ✅ Import RedisModule here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
