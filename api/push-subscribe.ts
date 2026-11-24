import { kv } from '@vercel/kv';

/**
 * اشتراكات إشعار الصباح اليومي. يحفظ اشتراك كل جهاز (endpoint ومفاتيحه)
 * في مجموعة KV، بلا أي بيانات شخصية؛ الإشعار نفسه عام (نفس المحتوى
 * لكل الأجهزة). الإلغاء يتم من إعدادات التطبيق.
 */

const SUBSCRIPTIONS_KEY = 'push:subscriptions';

function json(res: any, status: number, body: unknown): void {
  res.status(status).json(body);
}

interface PushSubscriptionJson {
  endpoint?: unknown;
  keys?: { p256dh?: unknown; auth?: unknown };
}

function validSubscription(value: unknown): value is PushSubscriptionJson {
  if (!value || typeof value !== 'object') return false;
  const sub = value as PushSubscriptionJson;
  if (typeof sub.endpoint !== 'string' || !sub.endpoint.startsWith('https://')) return false;
  if (!sub.keys || typeof sub.keys !== 'object') return false;
  return typeof sub.keys.p256dh === 'string' && typeof sub.keys.auth === 'string';
}

export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'method_not_allowed' });
    return;
  }
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    json(res, 503, { error: 'not_configured' });
    return;
  }
  const action = req.body?.action;
  if (action === 'subscribe') {
    const subscription = req.body?.subscription;
    if (!validSubscription(subscription)) {
      json(res, 400, { error: 'invalid_request' });
      return;
    }
    await kv.sadd(SUBSCRIPTIONS_KEY, JSON.stringify(subscription));
    json(res, 200, { ok: true });
    return;
  }
  if (action === 'unsubscribe') {
    const endpoint = req.body?.endpoint;
    if (typeof endpoint !== 'string' || !endpoint) {
      json(res, 400, { error: 'invalid_request' });
      return;
    }
    const members = (await kv.smembers(SUBSCRIPTIONS_KEY)) as string[];
    const stale = members.filter((member) => {
      try {
        return (JSON.parse(member) as PushSubscriptionJson).endpoint === endpoint;
      } catch {
        return false;
      }
    });
    if (stale.length > 0) await kv.srem(SUBSCRIPTIONS_KEY, ...stale);
    json(res, 200, { ok: true });
    return;
  }
  json(res, 400, { error: 'invalid_request' });
}
