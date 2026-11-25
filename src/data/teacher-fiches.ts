import type { OfficialFiche } from '../types';
import { OFFICIAL_FICHES_MATH6_A } from './fiches-l6-math-a';
import { OFFICIAL_FICHES_MATH6_B } from './fiches-l6-math-b';
import { OFFICIAL_FICHES_MATH6_C } from './fiches-l6-math-c';
import { OFFICIAL_FICHES_MATH6_D } from './fiches-l6-math-d';
import { OFFICIAL_FICHES_ARABIC6_A } from './fiches-l6-arabic-a';
import { OFFICIAL_FICHES_ARABIC6_B } from './fiches-l6-arabic-b';
import { OFFICIAL_FICHES_ARABIC6_C } from './fiches-l6-arabic-c';
import { OFFICIAL_FICHES_ARABIC6_D } from './fiches-l6-arabic-d';
import { OFFICIAL_FICHES_ARABIC6_E } from './fiches-l6-arabic-e';
import { OFFICIAL_FICHES_SCIENCE6_A } from './fiches-l6-science-a';
import { OFFICIAL_FICHES_SCIENCE6_B } from './fiches-l6-science-b';
import { OFFICIAL_FICHES_SOCIAL6_A } from './fiches-l6-social-a';
import { OFFICIAL_FICHES_SOCIAL6_B } from './fiches-l6-social-b';
import { OFFICIAL_FICHES_SOCIAL6_C } from './fiches-l6-social-c';

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
    ...OFFICIAL_FICHES_ARABIC6_A,
    ...OFFICIAL_FICHES_ARABIC6_B,
    ...OFFICIAL_FICHES_ARABIC6_C,
    ...OFFICIAL_FICHES_ARABIC6_D,
    ...OFFICIAL_FICHES_ARABIC6_E,
    ...OFFICIAL_FICHES_SCIENCE6_A,
    ...OFFICIAL_FICHES_SCIENCE6_B,
    ...OFFICIAL_FICHES_SOCIAL6_A,
    ...OFFICIAL_FICHES_SOCIAL6_B,
    ...OFFICIAL_FICHES_SOCIAL6_C,
  ].map((fiche) => [fiche.lessonId, fiche]),
);
