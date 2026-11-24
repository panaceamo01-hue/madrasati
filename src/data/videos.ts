/**
 * فيديوهات شرح مختارة باللغة العربية الفصحى، للدروس المهمة فقط
 * في الرياضيات والنشاط العلمي (20 درسا).
 *
 * المصدر: يوتيوب (تضمّن عبر youtube-nocookie، بلا تتبّع إضافي).
 * تحقّقنا من وجود كل فيديو وعنوانه عبر oEmbed في 2026-11-24.
 * تنبيه: الفيديو يحتاج إلى الإنترنت ولا يعمل دون اتصال،
 * بينما الشرح والتمارين في التطبيق يعملان دون إنترنت.
 * النطق المنطوق لم يُستمع إليه كاملا لكل فيديو؛
 * على ولي الأمر مشاهدة أي فيديو قبل اعتماده لطفله،
 * ويمكنه إيقاف الفيديوهات كلها من مساحة ولي الأمر.
 *
 * درس الجمع (l1-math-add) بلا فيديو مؤكد مناسب حتى الآن،
 * فبقي بلا تبويب فيديو إلى أن يوجد فيديو فصيح مناسب.
 */
export interface LessonVideo {
  /** معرّف فيديو يوتيوب. */
  id: string;
  /** ثانية البدء داخل الفيديو (للفيديوهات الطويلة التي يُستعمل منها مقطع). */
  start?: number;
  /** اسم القناة كما ظهر في التحقق، عند توفره. */
  channel?: string;
}

export const LESSON_VIDEOS: Record<string, LessonVideo> = {
  'l1-math-subtract': { id: 'oDk-S5BmqQY', channel: 'ألغاز ميرا وألمى' },
  'l2-math-multiply-intro': { id: 'uSRlMvzdUvI', start: 30, channel: 'Math Challenge Hub' },
  'l3-math-tables': { id: 'uSRlMvzdUvI', start: 300, channel: 'Math Challenge Hub' },
  'l3-math-division': { id: '8Vax4hkjh2s', channel: 'Prof yssf echayel - Maths' },
  'l4-math-fractions': { id: 'Z4VB_t3J3kI', channel: 'Mignon et mignonne for kids' },
  'l5-math-decimals': { id: 'iyfxQwWFMCo', channel: 'الأستاذ العيد شيخة' },
  'l6-math-percent': { id: 'AUuRMhFTy9c', channel: 'منال التويجري' },
  'l6-math-division': { id: 'P72KVCA7uQg', channel: 'نور الهدى التعليمية' },
  'l6-math-decimals': { id: 'UXdrDDRkDQ4', channel: 'Almotaaalim-المتعلم' },
  'l6-math-proportionality-1': { id: 'PUZcce2FNNA', channel: 'تقنية وتعليم' },
  'l6-math-big-numbers': { id: 'GZPqZxzywjg', channel: 'محمد علي التعليمية' },
  'l1-science-water': { id: 'kK-ui8Yqbu0', channel: 'حكايات صغار' },
  'l3-science-water': { id: 'niot5YFakP0', channel: 'حكاية ودعاء' },
  'l3-science-solar': { id: 'WqzwrbzSqyY', channel: 'Osratouna TV — قناة أسرتنا' },
  'l4-science-digestion': { id: 'LtNXaVv7X34', channel: 'رياض الأطفال' },
  'l5-science-electricity': { id: 'QFzQBkJN3UU', channel: 'المهندس الصغير' },
  'l6-science-matter-changes': { id: 'gLT65MYwePY', channel: 'المدرسة الرائدة' },
  'l6-science-nutrition-health': { id: 'sDXIzvKY2U8', channel: 'ميدوكس للتربية والتعليم' },
  'l6-science-solar-system': { id: 'vS7C5u4-Ir0', channel: 'كتب جيم Jeem Books' },
  'l6-science-rocks-minerals': { id: 'BE5TDlrRNpM', channel: 'عين دروس' },
};

export function lessonVideo(lessonId: string): LessonVideo | undefined {
  return LESSON_VIDEOS[lessonId];
}
