import { kv } from '@vercel/kv';
import {
  createCipheriv,
  createECDH,
  createPrivateKey,
  hkdfSync,
  randomBytes,
  sign,
} from 'node:crypto';

/**
 * إرسال إشعار الصباح اليومي (آية وحديث وحكمة اليوم) إلى كل الأجهزة
 * المشتركة. تستدعيه مهمة Vercel المجدولة كل يوم 07:00 UTC (08:00
 * بتوقيت المغرب)؛ ويمكن لصاحب التطبيق تشغيله يدويًا بترويسة التفويض
 * نفسها (CRON_SECRET أو كلمة سر الإدارة) للاختبار.
 *
 * الاشتراكات المنتهية (404/410 من خدمة الدفع) تُحذف تلقائيًا.
 *
 * ملاحظة بنيوية: هذه الواجهة مكتفية ذاتيًا عمدًا (لا تستورد أي ملف
 * نسبي): واجهات Vercel في هذا المشروع تعطّلت (500) عند استيراد ملفات
 * نسبية من api/، فأُدرج هنا محتوى اليوم (النصوص فقط) وتشفير الدفع.
 * محتوى اليوم الكامل (مع المعاني) في src/data/daily.ts، وأي تغيير
 * في النصوص أو ترتيبها يجب أن يُنسخ هنا أيضًا حتى يطابق الإشعار
 * صفحة حكمة اليوم في التطبيق.
 */

const SUBSCRIPTIONS_KEY = 'push:subscriptions';

/* ---- محتوى اليوم: النصوص فقط، بنفس ترتيب src/data/daily.ts ---- */

const VERSE_TEXTS: string[] = [
  'وَقُل رَّبِّ زِدْنِي عِلْمًا',
  'وَاللَّهُ يُحِبُّ الصَّابِرِينَ',
  'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
  'وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ',
  'وَبِالْوَالِدَيْنِ إِحْسَانًا',
  'إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ',
];

const HADITH_TEXTS: string[] = [
  'إنَّما الأعمالُ بالنِّيَّاتِ.',
  'مَن لا يَرحَمْ لا يُرحَمْ.',
  'تَبَسُّمُكَ في وَجهِ أخيكَ صدقةٌ.',
  'خيرُكم مَن تعلَّمَ القرآنَ وعلَّمَهُ.',
  'مَن سلَكَ طريقًا يلتمِسُ فيهِ عِلمًا سهَّلَ اللهُ لهُ طريقًا إلى الجنَّةِ.',
  'أحبُّ الأعمالِ إلى اللهِ أدومُها وإن قَلَّ.',
  'الدِّينُ النَّصيحةُ.',
];

const WISDOM_TEXTS: string[] = [
  'العِلمُ في الصِّغَرِ كالنَّقشِ على الحَجَر.',
  'اطلبوا العلمَ من المهدِ إلى اللحد.',
  'في التأنّي السلامة، وفي العجلة الندامة.',
  'المؤمن للمؤمن كالبنيان يشدّ بعضه بعضًا.',
  'قطرة فوق قطرة تصنع بحرًا.',
  'خيرُ الناسِ أنفعُهم للناس.',
  'العقلُ السليم في الجسمِ السليم.',
  'من جدّ وجد، ومن زرع حصد.',
  'الكلمة الطيبة صدقة.',
  'الوقت كالسيف، إن لم تقطعه قطعك.',
  'مفتاح النجاح المثابرة.',
  'لا يرهب ابنَ عبّاسٍ بحرٌ.',
  'النملة تجمع قوتها في الصيف استعدادًا للشتاء.',
  'من لم يكن له هدف، تعب في الطريق.',
  'بعد كل عاصفة يأتي الصفاء.',
  'خيرُ جليسٍ في الزمانِ كتاب.',
  'الصديق وقت الضيق.',
  'نظافةُ المكانِ من نظافةِ القلب.',
  'لا شيء مستحيل على من حاول.',
  'أحبُّ الأعمالِ إلى الله أدومُها وإن قلّ.',
  'العلمُ نورٌ، والجهلُ ظلام.',
  'تعلّموا السباحة من الدلفين: اصبروا وكرّروا.',
  'من زرع خيرًا حصد محبة.',
  'الوقت لا ينتظر أحدًا.',
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

/** التاريخ الحالي بتوقيت المغرب (الدار البيضاء)، ليطابق يوم ولي الأمر. */
function todayInMorocco(now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Casablanca',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return new Date(get('year'), get('month') - 1, get('day'), 12, 0, 0);
}

function dailyTexts(date: Date): { wisdom: string; verse: string; hadith: string } {
  const day = dayOfYear(date);
  return {
    wisdom: WISDOM_TEXTS[day % WISDOM_TEXTS.length],
    verse: VERSE_TEXTS[day % VERSE_TEXTS.length],
    hadith: HADITH_TEXTS[day % HADITH_TEXTS.length],
  };
}

/* ---- إرسال الدفع (Web Push: RFC 8291 aes128gcm + VAPID RFC 8292) ---- */

interface PushSubscriptionLike {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  expirationTime?: number | null;
}

function b64urlEncode(data: Buffer | string): string {
  const buffer = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(value: string): Buffer {
  return Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

/** رمز VAPID (JWT موقّع ES256) يعرّف خادمنا لدى خدمة الدفع. */
function createVapidJwt(
  audience: string,
  subject: string,
  publicKey: string,
  privateKey: string,
): string {
  const header = b64urlEncode(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const payload = b64urlEncode(
    JSON.stringify({ aud: audience, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: subject }),
  );
  const unsigned = `${header}.${payload}`;
  const publicBytes = b64urlDecode(publicKey);
  const jwk = {
    kty: 'EC',
    crv: 'P-256',
    x: b64urlEncode(publicBytes.subarray(1, 33)),
    y: b64urlEncode(publicBytes.subarray(33, 65)),
    d: b64urlEncode(b64urlDecode(privateKey)),
  };
  const key = createPrivateKey({ key: jwk, format: 'jwk' });
  const signature = sign('sha256', Buffer.from(unsigned, 'utf8'), {
    key,
    dsaEncoding: 'ieee-p1363',
  });
  return `${unsigned}.${b64urlEncode(signature)}`;
}

async function sendPush(
  subscription: PushSubscriptionLike,
  plaintext: string,
  vapid: { subject: string; publicKey: string; privateKey: string },
): Promise<{ ok: boolean; status: number; gone: boolean }> {
  const userPublicKey = b64urlDecode(subscription.keys.p256dh);
  const authSecret = b64urlDecode(subscription.keys.auth);
  const salt = randomBytes(16);

  const serverKey = createECDH('prime256v1');
  serverKey.generateKeys();
  const sharedSecret = serverKey.computeSecret(userPublicKey);
  const serverPublicKey = serverKey.getPublicKey();

  const keyInfo = Buffer.concat([
    Buffer.from('WebPush: info\0', 'utf8'),
    userPublicKey,
    serverPublicKey,
  ]);
  const ikm = hkdfSync('sha256', sharedSecret, authSecret, keyInfo, 32);
  const cek = hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: aes128gcm\0', 'utf8'), 16);
  const nonce = hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: nonce\0', 'utf8'), 12);

  const cipher = createCipheriv('aes-128-gcm', cek, nonce);
  const padded = Buffer.concat([Buffer.from(plaintext, 'utf8'), Buffer.from([0x02])]);
  const encrypted = Buffer.concat([cipher.update(padded), cipher.final(), cipher.getAuthTag()]);

  const recordSize = Buffer.alloc(4);
  recordSize.writeUInt32BE(4096, 0);
  const body = Buffer.concat([salt, recordSize, serverPublicKey, encrypted]);

  const audience = new URL(subscription.endpoint).origin;
  const jwt = createVapidJwt(audience, vapid.subject, vapid.publicKey, vapid.privateKey);
  const res = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      Encryption: `salt=${b64urlEncode(salt)}`,
      'Crypto-Key': `dh=${b64urlEncode(serverPublicKey)}`,
      Authorization: `vapid t=${jwt}, k=${vapid.publicKey}`,
      TTL: '86400',
    },
    body: body as unknown as BodyInit,
  });
  return { ok: res.ok, status: res.status, gone: res.status === 404 || res.status === 410 };
}

/* ---- المعالج ---- */

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
  const vapid = {
    subject: process.env.VAPID_SUBJECT || 'https://repo-eight-bay.vercel.app',
    publicKey,
    privateKey,
  };

  const content = dailyTexts(todayInMorocco());
  const payload = JSON.stringify({
    title: '🌅 آية وحديث وحكمة اليوم',
    body: `📖 ${content.verse}\n🕌 ${content.hadith}\n💡 ${content.wisdom}`,
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
        const subscription = JSON.parse(member) as PushSubscriptionLike;
        const result = await sendPush(subscription, payload, vapid);
        if (result.ok) {
          sent += 1;
        } else if (result.gone) {
          stale.push(member);
        } else {
          failed += 1;
        }
      } catch {
        failed += 1;
      }
    }),
  );
  if (stale.length > 0) await kv.srem(SUBSCRIPTIONS_KEY, ...stale);
  json(res, 200, { ok: true, sent, removed: stale.length, failed, subscriptions: members.length });
}
