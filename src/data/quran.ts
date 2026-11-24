import type { Level } from '../types';
import { MEMORIZATION_SURAHS_L123 } from './quran-l123';
import { MEMORIZATION_SURAHS_L456 } from './quran-l456';

export interface MemSurah {
  /** معرّف السورة، مثال: 'fatiha'. */
  id: string;
  /** رقم السورة في المصحف. */
  number: number;
  /** اسم السورة. */
  name: string;
  /** المستوى الدراسي الذي تُحفظ فيه حسب المنهاج المغربي. */
  level: Level;
  /** نص الآيات بالرسم العثماني، دون البسملة (تُعرض سطرًا مستقلًا). */
  verses: string[];
}

/**
 * سور الحفظ المقررة في المنهاج المغربي للتعليم الابتدائي (39 سورة).
 * النص من مصدر موثوق (api.alquran.cloud، طبعة عثماني) — لا يُكتب من الذاكرة.
 */
export const MEMORIZATION_SURAHS: MemSurah[] = [
  ...MEMORIZATION_SURAHS_L123,
  ...MEMORIZATION_SURAHS_L456,
];

export const SURAHS_BY_ID: Record<string, MemSurah> = MEMORIZATION_SURAHS.reduce(
  (acc, surah) => ({ ...acc, [surah.id]: surah }),
  {},
);

/** البسملة كما تُعرض قبل آيات كل سورة (الفاتحة مستثناة لأن بسملتها آيتها الأولى). */
export const BASMALA = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

/** دروس التطبيق التي تدرّس السورة نفسها، حيث وجدت. */
export const LESSON_FOR_SURAH: Record<string, string> = {
  fatiha: 'l1-islamic-fatiha',
  ikhlas: 'l1-islamic-ikhlas',
  quraysh: 'l5-islamic-quraysh',
  takathur: 'l2-islamic-takathur',
  mulk: 'l6-islamic-mulk',
  qalam: 'l6-islamic-qalam',
  jinn: 'l6-islamic-jinn',
  mursalat: 'l6-islamic-mursalat',
};
