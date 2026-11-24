import { kv } from '@vercel/kv';

/**
 * التحقق الدوري من ترخيص جهاز: POST ‏{code, deviceId}‏.
 * يعيد ‏{ok:true}‏ إن كان الكود موجودًا وغير ملغى والجهاز مسجلًا،
 * وإلا ‏{ok:false, reason}‏ حيث reason من:
 * invalid_code أو revoked أو not_registered.
 */

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
    json(res, 400, { ok: false, reason: 'invalid_code' });
    return;
  }

  const record = await kv.get<LicenseRecord>(`license:code:${code}`);
  if (!record) {
    json(res, 200, { ok: false, reason: 'invalid_code' });
    return;
  }
  if (record.revoked) {
    json(res, 200, { ok: false, reason: 'revoked' });
    return;
  }
  const devices: LicenseDevice[] = Array.isArray(record.devices) ? record.devices : [];
  if (!devices.some((device) => device.id === deviceId)) {
    json(res, 200, { ok: false, reason: 'not_registered' });
    return;
  }
  json(res, 200, { ok: true });
}
