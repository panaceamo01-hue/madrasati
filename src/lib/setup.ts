/**
 * إعداد حسابات الأبناء لأول مرة: يظهر المعالج مرة واحدة بعد التفعيل،
 * حتى يحدد ولي الأمر عدد الأبناء ومستوى كل واحد منهم. بعد إتمامه لا
 * يظهر المعالج مجددًا إلا من مساحة ولي الأمر (إعادة الإعداد).
 */

const SETUP_KEY = 'madrasati:setup:v1';

export function isSetupDone(): boolean {
  try {
    return localStorage.getItem(SETUP_KEY) === 'done';
  } catch {
    return false;
  }
}

export function markSetupDone(): void {
  try {
    localStorage.setItem(SETUP_KEY, 'done');
  } catch {
    /* نتجاهل: يبقى الإعداد في الجلسة الحالية. */
  }
}

export function clearSetupDone(): void {
  try {
    localStorage.removeItem(SETUP_KEY);
  } catch {
    /* نتجاهل. */
  }
}
