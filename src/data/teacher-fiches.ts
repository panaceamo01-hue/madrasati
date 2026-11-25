import type { OfficialFiche } from '../types';
import { OFFICIAL_FICHES_MATH6_A } from './fiches-l6-math-a';
import { OFFICIAL_FICHES_MATH6_B } from './fiches-l6-math-b';
import { OFFICIAL_FICHES_MATH6_C } from './fiches-l6-math-c';
import { OFFICIAL_FICHES_MATH6_D } from './fiches-l6-math-d';

/**
 * الجذاذات الرسمية من دلائل الأستاذ المعتمدة، مفتاحها معرّف الدرس.
 * الدروس بلا جذاذة رسمية تعرض الجذاذة المولدة من محتوى الدرس نفسه.
 */
export const OFFICIAL_FICHES: Record<string, OfficialFiche> = Object.fromEntries(
  [
    ...OFFICIAL_FICHES_MATH6_A,
    ...OFFICIAL_FICHES_MATH6_B,
    ...OFFICIAL_FICHES_MATH6_C,
    ...OFFICIAL_FICHES_MATH6_D,
  ].map((fiche) => [fiche.lessonId, fiche]),
);
