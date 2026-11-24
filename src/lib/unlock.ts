import type { Lesson, Level } from '../types';
import { lessonsFor } from '../data';
import { LEVELS } from '../data/subjects';
import { examKeyLevel, examKeyLesson, examPassed } from './exam';
import type { ProgressSettings } from './store';

export function lessonDone(stars: Record<string, number>, lesson: Lesson): boolean {
  return (stars[lesson.id] ?? 0) > 0;
}

/** المستوى الأول مفتوح دائمًا، ومستوى الطفل مفتوح، وكل مستوى يُفتح بإتمام دروس الذي قبله والنجاح في اختباره. */
export function levelUnlocked(
  level: Level,
  stars: Record<string, number>,
  exams: Record<string, number>,
  settings?: ProgressSettings,
): boolean {
  if (level === 1) return true;
  if (settings?.childLevel === level) return true;
  if (settings?.startFromFirst && settings.childLevel && level < settings.childLevel) return true;
  const previous = lessonsFor((level - 1) as Level);
  const completed = previous.length > 0 && previous.every((lesson) => lessonDone(stars, lesson));
  return completed && examPassed(exams, examKeyLevel((level - 1) as Level));
}

/** الدروس تُفتح بالتسلسل داخل المستوى، بعد النجاح في اختبار الدرس السابق. */
export function lessonUnlocked(
  lesson: Lesson,
  stars: Record<string, number>,
  exams: Record<string, number>,
): boolean {
  const siblings = lessonsFor(lesson.level);
  const index = siblings.findIndex((item) => item.id === lesson.id);
  if (index <= 0) return true;
  const previous = siblings[index - 1];
  return lessonDone(stars, previous) && examPassed(exams, examKeyLesson(previous.id));
}

/** المستويات المعروضة: عند تفعيل وضع ولي الأمر تظهر المستويات من الأول حتى مستوى الطفل، أو مستواه وحده. */
export function visibleLevels(settings: ProgressSettings): Level[] {
  if (settings.parentLock && settings.childLevel) {
    if (settings.startFromFirst) return LEVELS.filter((level) => level <= settings.childLevel!);
    return [settings.childLevel];
  }
  return LEVELS;
}

/** أول درس غير مكتمل في المستوى (أو أول درس غير مفتوح). */
export function nextLessonFor(level: Level, stars: Record<string, number>): Lesson | undefined {
  const lessons = lessonsFor(level);
  return lessons.find((lesson) => !lessonDone(stars, lesson));
}

export function levelStatus(level: Level, stars: Record<string, number>) {
  const lessons = lessonsFor(level);
  const done = lessons.filter((lesson) => lessonDone(stars, lesson)).length;
  const starsTotal = lessons.reduce((sum, lesson) => sum + (stars[lesson.id] ?? 0), 0);
  const percent = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  return { lessons, done, stars: starsTotal, percent, complete: lessons.length > 0 && done === lessons.length };
}
