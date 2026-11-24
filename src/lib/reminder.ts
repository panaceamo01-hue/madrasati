import { getProgress, markReminderShown, todayKey, todayMinutes } from './store';

/**
 * التذكير اللطيف عند التأخر عن هدف اليوم.
 *
 * القواعد (حتى لا يتحول التذكير إلى ضغط على الطفل):
 * - يظهر مرة واحدة فقط في اليوم.
 * - يظهر بعد الساعة الرابعة مساء فقط.
 * - لا يظهر أبدًا إذا أكمل الطفل هدف اليوم.
 * - لا يخصم نقاطًا ولا يفقد نجومًا أبدًا.
 * - يمكن لولي الأمر إيقافه في أي وقت من مساحته.
 *
 * التطبيق يعمل دون خادم، لذلك لا توجد إشعارات دفع (Push) في الخلفية:
 * التذكير داخل التطبيق يظهر عند فتحه، وإشعار المتصفح الاختياري يظهر
 * إذا كان التطبيق مفتوحًا ومنح ولي الأمر الإذن.
 */

/** الساعة التي يبدأ بعدها التذكير (الرابعة مساء بالتوقيت المحلي). */
export const REMINDER_HOUR = 16;

export type NotificationState = 'granted' | 'denied' | 'default' | 'unsupported';

export function notificationPermission(): NotificationState {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission;
}

export async function requestReminderPermission(): Promise<NotificationState> {
  if (typeof Notification === 'undefined') return 'unsupported';
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

/** هل حان وقت التذكير اليوم؟ يقرأ التقدم الحالي مباشرة. */
export function reminderDue(now: Date = new Date()): boolean {
  const progress = getProgress();
  if (!progress.settings.reminderEnabled) return false;
  if (now.getHours() < REMINDER_HOUR) return false;
  if (progress.lastReminderDate === todayKey(now)) return false;
  const minutes = todayMinutes(progress.activity, todayKey(now));
  return minutes < progress.settings.dailyGoalMinutes;
}

/** يعرض إشعار متصفح لطيفًا، إذا كان الإذن ممنوحًا. يعيد true عند عرضه. */
export function showReminderNotification(): boolean {
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission !== 'granted') return false;
  const progress = getProgress();
  const minutes = Math.round(todayMinutes(progress.activity));
  const goal = progress.settings.dailyGoalMinutes;
  try {
    const notification = new Notification('مدرستي — حصة اليوم', {
      body: `لم نكمل هدف اليوم بعد (${minutes} من ${goal} دقيقة). درس قصير يكفي، ولا ضغط أبدًا.`,
      icon: '/icon-192.png',
      tag: 'madrasati-reminder',
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    return true;
  } catch {
    return false;
  }
}

/**
 * يظهر التذكير مرة واحدة: يعرض إشعار المتصفح إن أمكن، ويسجّل ظهوره
 * اليوم حتى لا يتكرر. يعيد true إذا كان التذكير مستحقًا.
 */
export function triggerReminder(now: Date = new Date()): boolean {
  if (!reminderDue(now)) return false;
  showReminderNotification();
  markReminderShown();
  return true;
}
