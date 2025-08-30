import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
  this.client = new Redis({
    host: '127.0.0.1',
    port: 6379,
  });

  this.client.on('connect', () => console.log('✅ Redis connected'));
  this.client.on('error', (err) => console.error('Redis error:', err));
}

  async get(key: string) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttlSeconds?: number) {
  const stringValue = JSON.stringify(value);
  if (ttlSeconds) {
    await this.client.set(key, stringValue, 'EX', ttlSeconds);
  } else {
    await this.client.set(key, stringValue);
  }
  console.log('🔹 Redis SET', key, value);  // <-- this logs every key set
}
}
