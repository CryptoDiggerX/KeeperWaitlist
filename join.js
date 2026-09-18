import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  const { address, telegram, boc, referredBy } = req.body || {};

  if (!address) {
    return res.status(400).json({ error: 'address required' });
  }

  try {
    const key = `keeper:wallet:${address}`;
    const already = await redis.get(key);

    if (!already) {
      await redis.set(key, JSON.stringify({
        address,
        telegram: telegram || null,
        referredBy: referredBy || null,
        boc: boc || null,
        joinedAt: Date.now()
      }));
      await redis.incr('keeper:total_count');

      if (referredBy) {
        await redis.incr(`keeper:ref_count:${referredBy}`);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'server error' });
  }
}
