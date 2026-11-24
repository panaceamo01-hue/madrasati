/**
 * ترخيص التطبيق بالكود (النسخة الرسمية الأولى).
 *
 * الكود صالح دائمًا (بلا تاريخ انتهاء)، ويعمل على جهازين كحد أقصى.
 * الترخيص محفوظ محليًا في localStorage فيبقى بعد تحديثات التطبيق،
 * ويُعاد التحقق منه في الخادم مرة كل 24 ساعة عند الاتصال بالإنترنت.
 * بلا إنترنت يبقى التطبيق مفعّلًا بالترخيص المحلي.
 */

export interface License {
  code: string;
  deviceId: string;
  activatedAt: number;
  lastCheck: number;
  /** دخول المالك بكلمة سر الإدارة: بلا كود ولا سجل في الخادم. */
  owner?: boolean;
}

const DEVICE_KEY = 'madrasati:deviceId:v1';
const LICENSE_KEY = 'madrasati:license:v1';
/** إعادة التحقق في الخادم بعد مرور هذه المدة على آخر تحقق. */
const REVALIDATE_AFTER_MS = 24 * 60 * 60 * 1000;

function makeDeviceId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `dev-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** معرّف ثابت لهذا الجهاز، يُنشأ مرة واحدة ويُحفظ. */
export function getDeviceId(): string {
  try {
    const existing = localStorage.getItem(DEVICE_KEY);
    if (existing) return existing;
    const id = makeDeviceId();
    localStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return makeDeviceId();
  }
}

/** الترخيص المحلي، أو null إن لم يفعّل التطبيق بعد. */
export function loadLicense(): License | null {
  try {
    const raw = localStorage.getItem(LICENSE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<License>;
    if (parsed.owner === true) {
      if (!parsed.deviceId) return null;
      return {
        code: 'OWNER',
        deviceId: parsed.deviceId,
        activatedAt: parsed.activatedAt ?? 0,
        lastCheck: parsed.lastCheck ?? 0,
        owner: true,
      };
    }
    if (!parsed.code || !parsed.deviceId) return null;
    return {
      code: parsed.code,
      deviceId: parsed.deviceId,
      activatedAt: parsed.activatedAt ?? 0,
      lastCheck: parsed.lastCheck ?? 0,
    };
  } catch {
    return null;
  }
}

export function saveLicense(license: License): void {
  try {
    localStorage.setItem(LICENSE_KEY, JSON.stringify(license));
  } catch {
    /* التخزين غير متاح: يبقى الترخيص في الجلسة الحالية. */
  }
}

export function clearLicense(): void {
  try {
    localStorage.removeItem(LICENSE_KEY);
  } catch {
    /* نتجاهل. */
  }
}

export type ActivateError =
  | 'invalid_code'
  | 'device_limit'
  | 'revoked'
  | 'not_configured'
  | 'offline'
  | 'unknown';

export type OwnerError = 'wrong_password' | 'not_configured' | 'offline' | 'unknown';

function normalizeCode(code: string): string {
  return code.toUpperCase().replace(/[\s-]/g, '');
}

async function readJson(res: Response): Promise<any | null> {
  try {
    return (await res.json()) as any;
  } catch {
    return null;
  }
}

/**
 * يفعّل التطبيق بكود. عند النجاح يحفظ الترخيص محليًا.
 * يعيد ‏{ok:true}‏ أو ‏{ok:false, error}‏.
 */
export async function activateLicense(code: string): Promise<{ ok: true } | { ok: false; error: ActivateError }> {
  const clean = normalizeCode(code);
  if (!clean) return { ok: false, error: 'invalid_code' };
  try {
    const res = await fetch('/api/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: clean, deviceId: getDeviceId() }),
    });
    const data = await readJson(res);
    if (res.ok && data?.ok) {
      const now = Date.now();
      saveLicense({ code: clean, deviceId: getDeviceId(), activatedAt: now, lastCheck: now });
      return { ok: true };
    }
    const error = data?.error;
    if (error === 'invalid_code' || error === 'device_limit' || error === 'revoked' || error === 'not_configured') {
      return { ok: false, error };
    }
    return { ok: false, error: 'unknown' };
  } catch {
    return { ok: false, error: 'offline' };
  }
}

/**
 * دخول المالك بكلمة سر الإدارة. عند النجاح يحفظ علامة «مالك» محليًا
 * (بلا كود) فيفتح التطبيق على هذا الجهاز دون حد للأجهزة ودون انتهاء.
 * يعيد ‏{ok:true}‏ أو ‏{ok:false, error}‏.
 */
export async function activateOwner(
  password: string,
): Promise<{ ok: true } | { ok: false; error: OwnerError }> {
  if (!password) return { ok: false, error: 'wrong_password' };
  try {
    const res = await fetch('/api/owner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await readJson(res);
    if (res.ok && data?.ok) {
      const now = Date.now();
      saveLicense({
        code: 'OWNER',
        deviceId: getDeviceId(),
        activatedAt: now,
        lastCheck: now,
        owner: true,
      });
      return { ok: true };
    }
    if (res.status === 401) return { ok: false, error: 'wrong_password' };
    if (data?.error === 'not_configured') return { ok: false, error: 'not_configured' };
    return { ok: false, error: 'unknown' };
  } catch {
    return { ok: false, error: 'offline' };
  }
}

/**
 * يعيد التحقق من الترخيص في الخادم إن مرت 24 ساعة على آخر تحقق
 * وكان الجهاز متصلًا. يعيد false فقط إن أكد الخادم أن الترخيص
 * لم يعد صالحًا (كود ملغى أو جهاز محذوف)؛ أما عند انقطاع الشبكة
 * أو خطأ عابر فيبقى الترخيص المحلي كما هو.
 */
export async function revalidateLicense(): Promise<boolean> {
  const license = loadLicense();
  if (!license) return false;
  // دخول المالك محلي فقط، بلا سجل في الخادم، فلا يحتاج إعادة تحقق.
  if (license.owner) return true;
  if (Date.now() - license.lastCheck < REVALIDATE_AFTER_MS) return true;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return true;
  try {
    const res = await fetch('/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: license.code, deviceId: license.deviceId }),
    });
    const data = await readJson(res);
    if (!res.ok || !data) return true;
    if (data.ok) {
      saveLicense({ ...license, lastCheck: Date.now() });
      return true;
    }
    clearLicense();
    return false;
  } catch {
    return true;
  }
}
