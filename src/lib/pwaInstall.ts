/**
 * زر تحميل التطبيق (تثبيت PWA على الشاشة الرئيسية).
 *
 * كيف يعمل: المتصفح يطلق حدث beforeinstallprompt عندما يستوفي التطبيق
 * شروط التثبيت (ملف manifest وأيقونات وعامل خدمة). نلتقط الحدث ونمنع
 * النافذة التلقائية، حتى يضغط ولي الأمر زر «حمّل التطبيق» فيطلقها بنفسه.
 * في المتصفحات التي لا تطلق الحدث (مثل سفاري على آيفون) نعرض تعليمات
 * التثبيت اليدوي من قائمة المتصفح.
 */

export type InstallStatus = 'installed' | 'available' | 'unavailable';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

export function isStandalone(): boolean {
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  return (
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function getInstallStatus(): InstallStatus {
  if (installed || isStandalone()) return 'installed';
  if (deferredPrompt) return 'available';
  return 'unavailable';
}

export function onInstallStatusChange(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function isIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) &&
    !(window as unknown as { MSStream?: unknown }).MSStream
  );
}

/** تُستدعى مرة واحدة عند بدء التطبيق (في main.tsx). */
export function initPwaInstall(): void {
  if (isStandalone()) installed = true;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    deferredPrompt = null;
    notify();
  });
}

/**
 * يطلق نافذة التثبيت إن توفرت؛ يعيد true إن قَبِل المستخدم التثبيت،
 * وfalse إن رفض أو لم تتوفر النافذة (حينها تُعرض التعليمات اليدوية).
 */
export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;
  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  await promptEvent.prompt();
  const choice = await promptEvent.userChoice;
  if (choice.outcome === 'accepted') {
    installed = true;
    notify();
    return true;
  }
  notify();
  return false;
}
