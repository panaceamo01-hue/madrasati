import { kv } from '@vercel/kv';

/**
 * تفعيل كود على جهاز: POST ‏{code, deviceId}‏.
 *
 * سجل الكود في KV: المفتاح `license:code:<CODE>` وفيه
 * ‏{createdAt, revoked, devices: [{id, firstSeen, lastSeen}]}‏.
 * الكود صالح دائمًا (بلا تاريخ انتهاء)، ويعمل على جهازين كحد أقصى.
 * متغيرات KV_REST_API_URL وKV_REST_API_TOKEN يضيفهما Vercel
 * تلقائيًا عند ربط مخزن KV بالمشروع.
 */

const MAX_DEVICES = 2;

interface LicenseDevice {
  id: string;
  firstSeen: number;
  lastSeen: number;
}

interface LicenseRecord {
  createdAt: number;
  revoked?: boolean;
  devices?: LicenseDevice[];
}

function normalizeCode(code: unknown): string | null {
  if (typeof code !== 'string') return null;
  const clean = code.toUpperCase().replace(/[\s-]/g, '');
  return clean.length > 0 ? clean : null;
}

function json(res: any, status: number, body: unknown): void {
  res.status(status).json(body);
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
  const code = normalizeCode(req.body?.code);
  const deviceId =
    typeof req.body?.deviceId === 'string' && req.body.deviceId.trim()
      ? req.body.deviceId.trim()
      : null;
  if (!code || !deviceId) {
    json(res, 400, { error: 'invalid_request' });
    return;
  }

  const key = `license:code:${code}`;
  const record = await kv.get<LicenseRecord>(key);
  if (!record) {
    json(res, 404, { error: 'invalid_code' });
    return;
  }
  if (record.revoked) {
    json(res, 403, { error: 'revoked' });
    return;
  }

  const devices: LicenseDevice[] = Array.isArray(record.devices) ? record.devices : [];
  const now = Date.now();
  const existing = devices.find((device) => device.id === deviceId);
  if (existing) {
    existing.lastSeen = now;
    await kv.set(key, { ...record, devices });
    json(res, 200, { ok: true });
    return;
  }
  if (devices.length >= MAX_DEVICES) {
    json(res, 409, { error: 'device_limit' });
    return;
  }
  devices.push({ id: deviceId, firstSeen: now, lastSeen: now });
  await kv.set(key, { ...record, devices });
  json(res, 200, { ok: true });
}
