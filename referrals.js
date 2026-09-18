import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'code required' });
  }

  try {
    const count = await redis.get(`keeper:ref_count:${code}`);
    return res.status(200).json({ count: Number(count) || 0 });
  } catch (err) {
    return res.status(500).json({ error: 'server error' });
  }
}

