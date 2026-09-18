import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    const count = await redis.get('keeper:total_count');
    return res.status(200).json({ count: Number(count) || 0 });
  } catch (err) {
    return res.status(500).json({ error: 'server error' });
  }
}

