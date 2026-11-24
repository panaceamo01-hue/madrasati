/**
 * إشعار الصباح اليومي (آية وحديث وحكمة اليوم) كإشعار دفع.
 *
 * كيف يعمل: المتصفح يشترك في خدمة الدفع (Push) بمفتاح VAPID العام،
 * فيرسل اشتراكه إلى الخادم الذي يحفظه في KV. كل صباح يرسل الخادم
 * (عبر مهمة مجدولة في Vercel) إشعارًا واحدًا لكل المشتركين، فيعرضه
 * عامل الخدمة حتى لو كان التطبيق مغلقًا. الضغط على الإشعار يفتح
 * صفحة حكمة اليوم. على آيفون يلزم تثبيت التطبيق على الشاشة الرئيسية
 * أولًا (شرط نظام iOS للإشعارات).
 *
 * المفتاح العام هنا علني بطبيعته (يُشارك مع كل متصفح)؛ أما المفتاح
 * الخاص فيبقى متغير بيئة في Vercel فقط (VAPID_PRIVATE_KEY) ولا يدخل
 * المستودع أبدًا.
 */

/** المفتاح العام VAPID (علني). */
export const VAPID_PUBLIC_KEY =
  'BEiU2ZnJLcTs_6bu2YqkAkKTItICnxbOQBQO5R9EOyZK2aarsnBZV33UEwykYRx1vOnJdWd8h4qxIffqmua9vdU';

const FLAG_KEY = 'madrasati:dailyPush:v1';

export type DailyPushState = 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed' | 'error';

export function pushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const decoded = window.atob(base64.replace(/-/g, '+').replace(/_/g, '/') + padding);
  return Uint8Array.from(decoded, (char) => char.charCodeAt(0));
}

async function getSubscription(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}

/** حالة إشعار اليوم على هذا الجهاز. */
export async function getDailyPushState(): Promise<DailyPushState> {
  if (!pushSupported()) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  const subscription = await getSubscription();
  if (subscription) return 'subscribed';
  try {
    return localStorage.getItem(FLAG_KEY) === 'on' ? 'error' : 'unsubscribed';
  } catch {
    return 'unsubscribed';
  }
}

function setFlag(on: boolean): void {
  try {
    if (on) localStorage.setItem(FLAG_KEY, 'on');
    else localStorage.removeItem(FLAG_KEY);
  } catch {
    /* نتجاهل. */
  }
}

/**
 * يفعّل إشعار اليوم: يطلب إذن الإشعارات، ثم يشترك في الدفع ويرسل
 * الاشتراك إلى الخادم. يعيد الحالة الجديدة.
 */
export async function subscribeDailyPush(): Promise<DailyPushState> {
  if (!pushSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return 'denied';
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
    const res = await fetch('/api/push-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'subscribe', subscription: subscription.toJSON() }),
    });
    if (!res.ok) return 'error';
    setFlag(true);
    return 'subscribed';
  } catch {
    return 'error';
  }
}

/** يوقف إشعار اليوم ويلغي الاشتراك من الخادم. */
export async function unsubscribeDailyPush(): Promise<DailyPushState> {
  try {
    const subscription = await getSubscription();
    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe().catch(() => {
        /* نكمل إلى حذف الاشتراك من الخادم. */
      });
      await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unsubscribe', endpoint }),
      }).catch(() => {
        /* نتجاهل: الاشتراك المحلي أُلغي أصلًا. */
      });
    }
  } catch {
    /* نتجاهل. */
  }
  setFlag(false);
  return 'unsubscribed';
}
