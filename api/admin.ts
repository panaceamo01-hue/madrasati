import { kv } from '@vercel/kv';

/**
 * إدارة الأكواد (لصاحب التطبيق فقط): كل الطلبات POST وتحمل الترويسة
 * `x-admin-password` التي تُقارن بمتغير البيئة ADMIN_PASSWORD.
 *
 * الأفعال عبر ‏{action}‏ في الجسم:
 * - create: يولّد كودًا جديدًا (12 حرفًا في 3 مجموعات من 4) ويعيده.
 * - list: يعيد كل الأكواد مع تاريخ الإنشاء والحالة وعدد الأجهزة وآخر ظهور.
 * - revoke_device ‏{code, deviceId}‏: يحذف جهازًا من كود.
 * - revoke_code ‏{code}‏: يلغي كودًا (يبقى في السجل لكنه مرفوض).
 * - restore_code ‏{code}‏: يعيد تفعيل كود ملغى.
 *
 * الأكواد محفوظة في KV: سجل كل كود في `license:code:<CODE>`،
 * وقائمة الأكواد كلها في المجموعة `license:codes`.
 */

const CODES_KEY = 'license:codes';

/** أحرف واضحة: بلا 0/O و1/I/l حتى لا يلتبس الكود عند قراءته. */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

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

function randomCode(): string {
  const chars: string[] = [];
  const cryptoObj = (globalThis as any).crypto;
  for (let i = 0; i < 12; i += 1) {
    let index: number;
    if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
      const bytes = new Uint8Array(1);
      cryptoObj.getRandomValues(bytes);
      index = bytes[0] % CODE_ALPHABET.length;
    } else {
      index = Math.floor(Math.random() * CODE_ALPHABET.length);
    }
    chars.push(CODE_ALPHABET[index]);
  }
  return `${chars.slice(0, 4).join('')}-${chars.slice(4, 8).join('')}-${chars.slice(8, 12).join('')}`;
}

function json(res: any, status: number, body: unknown): void {
  res.status(status).json(body);
}

async function loadRecord(code: string): Promise<LicenseRecord | null> {
  return kv.get<LicenseRecord>(`license:code:${code}`);
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
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    json(res, 503, { error: 'not_configured' });
    return;
  }
  const supplied = req.headers?.['x-admin-password'];
  if (supplied !== adminPassword) {
    json(res, 401, { error: 'unauthorized' });
    return;
  }

  const action = req.body?.action;
  if (action === 'create') {
    const display = randomCode();
    const code = display.replace(/-/g, '');
    const record: LicenseRecord = { createdAt: Date.now(), revoked: false, devices: [] };
    await kv.set(`license:code:${code}`, record);
    await kv.sadd(CODES_KEY, code);
    json(res, 200, { ok: true, code: display });
    return;
  }

  if (action === 'list') {
    const codes = (await kv.smembers(CODES_KEY)) as string[];
    const records = codes.length > 0 ? await kv.mget<LicenseRecord[]>(...codes.map((code) => `license:code:${code}`)) : [];
    const items = codes.map((code, index) => {
      const record = records[index];
      const devices: LicenseDevice[] = record && Array.isArray(record.devices) ? record.devices : [];
      const lastSeen = devices.reduce((max, device) => Math.max(max, device.lastSeen), 0);
      return {
        code,
        createdAt: record?.createdAt ?? 0,
        revoked: record?.revoked ?? false,
        devices: devices.map((device) => ({ id: device.id, firstSeen: device.firstSeen, lastSeen: device.lastSeen })),
        lastSeen,
      };
    });
    items.sort((a, b) => b.createdAt - a.createdAt);
    json(res, 200, { ok: true, codes: items });
    return;
  }

  const code = normalizeCode(req.body?.code);
  if (!code) {
    json(res, 400, { error: 'invalid_request' });
    return;
  }
  const key = `license:code:${code}`;

  if (action === 'revoke_device') {
    const deviceId = typeof req.body?.deviceId === 'string' ? req.body.deviceId.trim() : '';
    const record = await loadRecord(code);
    if (!record) {
      json(res, 404, { error: 'invalid_code' });
      return;
    }
    const devices = (record.devices ?? []).filter((device) => device.id !== deviceId);
    await kv.set(key, { ...record, devices });
    json(res, 200, { ok: true });
    return;
  }

  if (action === 'revoke_code' || action === 'restore_code') {
    const record = await loadRecord(code);
    if (!record) {
      json(res, 404, { error: 'invalid_code' });
      return;
    }
    await kv.set(key, { ...record, revoked: action === 'revoke_code' });
    json(res, 200, { ok: true });
    return;
  }

  json(res, 400, { error: 'unknown_action' });
}
