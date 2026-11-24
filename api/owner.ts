import { timingSafeEqual } from 'node:crypto';

/**
 * دخول المالك: يتحقق من كلمة سر الإدارة (متغير البيئة ADMIN_PASSWORD)
 * ويعيد ‏{ok:true}‏ عند صحتها. كلمة السر نفسها لا تُحفظ في الجهاز ولا
 * في المستودع؛ التطبيق يحفظ محليًا فقط علامة «مالك» (انظر lib/license.ts).
 * المقارنة آمنة زمنيًا حتى لا يتسرب طول كلمة السر من زمن الرد.
 */

function json(res: any, status: number, body: unknown): void {
  res.status(status).json(body);
}

function passwordsEqual(supplied: unknown, expected: string): boolean {
  if (typeof supplied !== 'string' || supplied.length === 0) return false;
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'method_not_allowed' });
    return;
  }
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    json(res, 503, { error: 'not_configured' });
    return;
  }
  if (!passwordsEqual(req.body?.password, adminPassword)) {
    json(res, 401, { error: 'unauthorized' });
    return;
  }
  json(res, 200, { ok: true });
}
