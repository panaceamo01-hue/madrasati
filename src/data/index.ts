import type { Lesson, Level, SubjectId } from '../types';
import { level1 } from './level1';
import { level2 } from './level2';
import { level3 } from './level3';
import { level4 } from './level4';
import { level5 } from './level5';
import { level6 } from './level6';
import { extras } from './extras';
import { l6ExamMath } from './l6-exam-math';
import { l6ExamArabic } from './l6-exam-arabic';
import { l6ExamFrench } from './l6-exam-french';
import { l6RestScience } from './l6-rest-science';
import { l6RestIslamic } from './l6-rest-islamic';
import { l6RestSocial } from './l6-rest-social';
import { l6ArabicTarkib } from './l6-arabic-tarkib';
import { l6ArabicSarf } from './l6-arabic-sarf';
import { l6ArabicImla } from './l6-arabic-imla';
import { l6FrenchGrammaire } from './l6-french-grammaire';
import { l6FrenchConjugaison } from './l6-french-conjugaison';
import { l6FrenchOrthographe } from './l6-french-orthographe';
import { l6MathGeometrie } from './l6-math-geometrie';
import { l6IslamicIbadat } from './l6-islamic-ibadat';
import { l6IslamicSira } from './l6-islamic-sira';
import { l6SocialGeo } from './l6-social-geo';
import { l6SocialHistory } from './l6-social-history';
import { l6SocialCivics } from './l6-social-civics';

export const LESSONS: Lesson[] = [
  ...level1,
  ...extras[1],
  ...level2,
  ...extras[2],
  ...level3,
  ...extras[3],
  ...level4,
  ...extras[4],
  ...level5,
  ...extras[5],
  // قواعد العربية للسادس حسب التوزيع السنوي الرسمي — أولًا في ترتيب المستوى.
  ...l6ArabicTarkib,
  ...l6ArabicSarf,
  ...l6ArabicImla,
  // قواعد وتصريف وإملاء الفرنسية للسادس حسب التوزيع السنوي الرسمي — بعد العربية.
  ...l6FrenchGrammaire,
  ...l6FrenchConjugaison,
  ...l6FrenchOrthographe,
  // الهندسة للسادس حسب التوزيع السنوي الرسمي — بعد الفرنسية.
  ...l6MathGeometrie,
  // التربية الإسلامية للسادس حسب التوزيع السنوي الرسمي — بعد الهندسة.
  ...l6IslamicIbadat,
  ...l6IslamicSira,
  // الاجتماعيات للسادس حسب التوزيع السنوي الرسمي — بعد الإسلامية.
  ...l6SocialGeo,
  ...l6SocialHistory,
  ...l6SocialCivics,
  ...level6,
  ...extras[6],
  ...l6ExamMath,
  ...l6ExamArabic,
  ...l6ExamFrench,
  ...l6RestScience,
  ...l6RestIslamic,
  ...l6RestSocial,
];

export const LESSON_BY_ID: Record<string, Lesson> = LESSONS.reduce((acc, lesson) => {
  acc[lesson.id] = lesson;
  return acc;
}, {} as Record<string, Lesson>);

export function lessonsFor(level: Level, subject?: SubjectId): Lesson[] {
  return LESSONS.filter((lesson) => lesson.level === level && (!subject || lesson.subject === subject));
}

export function nextLesson(current: Lesson): Lesson | undefined {
  const sameLevel = lessonsFor(current.level);
  const index = sameLevel.findIndex((lesson) => lesson.id === current.id);
  return sameLevel[index + 1];
}

export function lessonCountForSubject(level: Level, subject: SubjectId): number {
  return lessonsFor(level, subject).length;
}
