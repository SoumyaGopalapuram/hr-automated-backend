import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { OpenaiModule } from '../openai/openai.module';
import { RedisModule } from '../redis/redis.module'; // ✅ import Redis

@Module({
  imports: [OpenaiModule, RedisModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
