import { kv } from '@vercel/kv';
import * as webPush from 'web-push';
import { dailyContent, todayInMorocco } from '../src/data/daily';

/**
 * إرسال إشعار الصباح اليومي (آية وحديث وحكمة اليوم) إلى كل الأجهزة
 * المشتركة. تستدعيه مهمة Vercel المجدولة كل يوم 07:00 UTC (08:00
 * بتوقيت المغرب)؛ ويمكن لصاحب التطبيق تشغيله يدويًا بترويسة التفويض
 * نفسها (CRON_SECRET أو كلمة سر الإدارة) للاختبار.
 *
 * الاشتراكات المنتهية (404/410 من خدمة الدفع) تُحذف تلقائيًا.
 */

const SUBSCRIPTIONS_KEY = 'push:subscriptions';

/** اشتراك دفع كما يُحفظ في KV (نفس شكل PushSubscription JSON). */
interface StoredSubscription {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  expirationTime?: number | null;
}

function json(res: any, status: number, body: unknown): void {
  res.status(status).json(body);
}

export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'GET' && req.method !== 'POST') {
    json(res, 405, { error: 'method_not_allowed' });
    return;
  }
  const cronSecret = process.env.CRON_SECRET;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!cronSecret && !adminPassword) {
    json(res, 503, { error: 'not_configured' });
    return;
  }
  const header = req.headers?.authorization;
  const bearer = typeof header === 'string' && header.startsWith('Bearer ') ? header.slice(7) : '';
  const authorized =
    (cronSecret && bearer === cronSecret) || (adminPassword && bearer === adminPassword);
  if (!authorized) {
    json(res, 401, { error: 'unauthorized' });
    return;
  }
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    json(res, 503, { error: 'not_configured' });
    return;
  }
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    json(res, 503, { error: 'vapid_not_configured' });
    return;
  }
  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'https://repo-eight-bay.vercel.app',
    publicKey,
    privateKey,
  );

  const content = dailyContent(todayInMorocco());
  const payload = JSON.stringify({
    title: '🌅 آية وحديث وحكمة اليوم',
    body: `📖 ${content.verse.text}\n🕌 ${content.hadith.text}\n💡 ${content.wisdom.text}`,
    url: '/#/wisdom',
    tag: 'madrasati-daily',
  });

  const members = (await kv.smembers(SUBSCRIPTIONS_KEY)) as string[];
  let sent = 0;
  let failed = 0;
  const stale: string[] = [];
  await Promise.all(
    members.map(async (member) => {
      try {
        const subscription = JSON.parse(member) as StoredSubscription;
        await webPush.sendNotification(subscription, payload);
        sent += 1;
      } catch (error: any) {
        const statusCode = error?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          stale.push(member);
        } else {
          failed += 1;
        }
      }
    }),
  );
  if (stale.length > 0) await kv.srem(SUBSCRIPTIONS_KEY, ...stale);
  json(res, 200, { ok: true, sent, removed: stale.length, failed, subscriptions: members.length });
}
