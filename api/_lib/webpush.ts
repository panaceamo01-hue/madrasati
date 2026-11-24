import * as crypto from 'node:crypto';

/**
 * إرسال إشعارات الدفع (Web Push) بلا أي اعتماد خارجي.
 *
 * لماذا بلا مكتبة: مكتبة web-push (CommonJS) كانت تعطل تجميع الواجهة
 * في Vercel (استيراد افتراضي غير موجود + require ديناميكي في شجرة
 * اعتمادها)، فصارت الواجهة ترد 500 قبل أن يعمل أي كود. هذا الملف
 * يطبق بروتوكول RFC 8291 (aes128gcm) وVAPID (RFC 8292) مباشرة
 * بـ node:crypto وfetch، فيعمل في أي تجميع.
 */

export interface PushSubscriptionLike {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  expirationTime?: number | null;
}

export interface VapidKeys {
  subject: string;
  publicKey: string;
  privateKey: string;
}

function b64urlEncode(data: Buffer | string): string {
  const buffer = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(value: string): Buffer {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(padded, 'base64');
}

function hkdf(ikm: Buffer, salt: Buffer, info: Buffer, length: number): Buffer {
  return crypto.hkdfSync('sha256', ikm, salt, info, length);
}

/**
 * رمز VAPID (JWT موقّع ES256) يعرّف خادمنا لدى خدمة الدفع.
 * المفتاح الخاص خام (32 بايت) والمفتاح العام نقطة غير مضغوطة (65 بايت).
 */
export function createVapidJwt(
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
  const key = crypto.createPrivateKey({ key: jwk, format: 'jwk' });
  const signature = crypto.sign('sha256', Buffer.from(unsigned, 'utf8'), {
    key,
    dsaEncoding: 'ieee-p1363',
  });
  return `${unsigned}.${b64urlEncode(signature)}`;
}

/**
 * يشفر الرسالة للمشترك (RFC 8291 aes128gcm): مفتاح ECDH مؤقت،
 * وسر auth المشترك ملح لاشتقاق مادة المفتاح، ثم AES-128-GCM.
 * يعيد جسم الطلب والترويسات اللازمة.
 */
export function encryptPush(
  subscription: PushSubscriptionLike,
  plaintext: string,
): { body: Buffer; salt: Buffer; serverPublicKey: Buffer } {
  const userPublicKey = b64urlDecode(subscription.keys.p256dh);
  const authSecret = b64urlDecode(subscription.keys.auth);
  const salt = crypto.randomBytes(16);

  const serverKey = crypto.createECDH('prime256v1');
  serverKey.generateKeys();
  const sharedSecret = serverKey.computeSecret(userPublicKey);
  const serverPublicKey = serverKey.getPublicKey();

  const keyInfo = Buffer.concat([
    Buffer.from('WebPush: info\0', 'utf8'),
    userPublicKey,
    serverPublicKey,
  ]);
  const ikm = hkdf(sharedSecret, authSecret, keyInfo, 32);
  const cek = hkdf(ikm, salt, Buffer.from('Content-Encoding: aes128gcm\0', 'utf8'), 16);
  const nonce = hkdf(ikm, salt, Buffer.from('Content-Encoding: nonce\0', 'utf8'), 12);

  const cipher = crypto.createCipheriv('aes-128-gcm', cek, nonce);
  const padded = Buffer.concat([Buffer.from(plaintext, 'utf8'), Buffer.from([0x02])]);
  const encrypted = Buffer.concat([cipher.update(padded), cipher.final(), cipher.getAuthTag()]);

  const recordSize = Buffer.alloc(4);
  recordSize.writeUInt32BE(4096, 0);
  const body = Buffer.concat([salt, recordSize, serverPublicKey, encrypted]);
  return { body, salt, serverPublicKey };
}

export interface SendResult {
  ok: boolean;
  status: number;
  /** الاشتراك منتهٍ (404/410): يجب حذفه. */
  gone: boolean;
}

/** يرسل إشعارًا واحدًا إلى مشترك. يعيد حالة HTTP من خدمة الدفع. */
export async function sendPush(
  subscription: PushSubscriptionLike,
  plaintext: string,
  vapid: VapidKeys,
): Promise<SendResult> {
  const { body, salt, serverPublicKey } = encryptPush(subscription, plaintext);
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
