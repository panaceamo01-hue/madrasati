/**
 * تحديث التطبيق داخل التطبيق.
 *
 * كيف يعمل: عند نشر نسخة جديدة يكتشف المتصفح عامل خدمة (service worker)
 * جديدًا، فيثبّته ويبقيه في حالة الانتظار (waiting) دون أن يمسّ الصفحة
 * المفتوحة. هذا الملف يراقب ذلك، ويُعلم لافتة التحديث (UpdateBanner)،
 * وعندما يضغط المستخدم «حدّث الآن» يطلب من العامل الجديد تولّي السيطرة
 * ثم يعيد تحميل الصفحة على النسخة الجديدة — بلا إعادة تحميل من المتجر
 * ولا فقدان للتقدم (التقدم محفوظ في localStorage).
 */

export type UpdateCheckResult = 'up-to-date' | 'available' | 'unsupported';

type UpdateListener = () => void;

let registration: ServiceWorkerRegistration | null = null;
let waitingWorker: ServiceWorker | null = null;
let available = false;
const listeners = new Set<UpdateListener>();

function notify() {
  listeners.forEach((listener) => listener());
}

function markAvailable(worker: ServiceWorker) {
  waitingWorker = worker;
  if (!available) {
    available = true;
    notify();
  }
}

/** تتبّع عامل جديد حتى يصل إلى حالة installed (أي صار جاهزًا). */
function trackWorker(worker: ServiceWorker) {
  if (worker.state === 'installed') {
    // عامل جديد بلا متحكم قديم يعني أول تثبيت، لا تحديث.
    if (navigator.serviceWorker.controller) markAvailable(worker);
    return;
  }
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed' && navigator.serviceWorker.controller) {
      markAvailable(worker);
    }
  });
}

/**
 * تُستدعى مرة واحدة بعد تسجيل عامل الخدمة (في main.tsx).
 * تراقب توفر تحديث، وتفحص دوريًا كل 60 دقيقة وعند عودة الصفحة للواجهة.
 */
export function initSwUpdate(reg: ServiceWorkerRegistration): void {
  registration = reg;
  // عامل في الانتظار مع متحكم قديم يعني تحديثًا حقيقيًا؛
  // بلا متحكم فهو أول تثبيت، وليس تحديثًا، فلا نظهر اللافتة.
  if (reg.waiting && navigator.serviceWorker.controller) markAvailable(reg.waiting);
  reg.addEventListener('updatefound', () => {
    if (reg.installing) trackWorker(reg.installing);
  });
  window.setInterval(() => {
    void reg.update().catch(() => {
      /* بلا شبكة: نعيد المحاولة في الفحص التالي. */
    });
  }, 60 * 60 * 1000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      void reg.update().catch(() => {
        /* بلا شبكة: نعيد المحاولة لاحقًا. */
      });
    }
  });
}

export function isUpdateAvailable(): boolean {
  return available;
}

/**
 * الاشتراك في حدث توفر التحديث. يُستدعى المستمع فورًا إن كان التحديث
 * متوفرًا أصلًا، ويعيد دالة لإلغاء الاشتراك.
 */
export function onUpdateAvailable(callback: UpdateListener): () => void {
  listeners.add(callback);
  if (available) callback();
  return () => {
    listeners.delete(callback);
  };
}

/** فحص فوري: هل توجد نسخة جديدة؟ */
export async function checkForUpdate(): Promise<UpdateCheckResult> {
  if (!('serviceWorker' in navigator)) return 'unsupported';
  if (available) return 'available';
  const reg =
    registration ??
    (await navigator.serviceWorker.getRegistration().catch(() => undefined));
  if (!reg) return 'unsupported';
  registration = reg;
  if (reg.waiting && navigator.serviceWorker.controller) {
    markAvailable(reg.waiting);
    return 'available';
  }
  try {
    await reg.update();
  } catch {
    /* بلا شبكة: لا يمكن التأكد، ونفترض أن النسخة الحالية هي الأحدث. */
    return 'up-to-date';
  }
  if (reg.waiting && navigator.serviceWorker.controller) {
    markAvailable(reg.waiting);
    return 'available';
  }
  return 'up-to-date';
}

/**
 * تطبيق التحديث: يطلب من العامل الجديد تولّي السيطرة، ثم يعيد تحميل
 * الصفحة مرة واحدة عندما يتغير المتحكم (أو بعد 5 ثوانٍ كحد أقصى).
 */
export function applyUpdate(): void {
  if (!('serviceWorker' in navigator)) {
    window.location.reload();
    return;
  }
  let reloaded = false;
  const reloadOnce = () => {
    if (reloaded) return;
    reloaded = true;
    window.location.reload();
  };
  navigator.serviceWorker.addEventListener('controllerchange', reloadOnce, {
    once: true,
  });
  const worker = waitingWorker ?? registration?.waiting ?? null;
  if (worker) {
    worker.postMessage({ type: 'SKIP_WAITING' });
    window.setTimeout(reloadOnce, 5000);
    return;
  }
  // لا عامل بانتظار: ربما تولّى العامل الجديد السيطرة فعلًا.
  reloadOnce();
}
