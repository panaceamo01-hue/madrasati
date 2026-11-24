import type { Lesson, Level, SubjectId } from '../types';
import { LESSON_BY_ID, lessonsFor } from '../data';
import { SUBJECTS } from '../data/subjects';
import { todayKey, type DayActivity, type ExamAttempt, type LessonCompletion } from './store';

const WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export interface DayRow extends DayActivity {
  date: string;
  label: string;
}

const EMPTY: DayActivity = { minutes: 0, lessons: 0, exams: 0, games: 0 };

/** آخر سبعة أيام من الأقدم إلى اليوم، مع أسماء الأيام. */
export function weekReport(activity: Record<string, DayActivity>): DayRow[] {
  const rows: DayRow[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = todayKey(date);
    rows.push({
      ...EMPTY,
      ...(activity[key] ?? {}),
      date: key,
      label: offset === 0 ? 'اليوم' : WEEKDAYS[date.getDay()],
    });
  }
  return rows;
}

export function weekTotals(rows: DayRow[]) {
  return rows.reduce(
    (sum, row) => ({
      minutes: sum.minutes + row.minutes,
      lessons: sum.lessons + row.lessons,
      exams: sum.exams + row.exams,
      games: sum.games + row.games,
    }),
    { minutes: 0, lessons: 0, exams: 0, games: 0 },
  );
}

export interface SubjectProgress {
  id: SubjectId;
  name: string;
  emoji: string;
  done: number;
  total: number;
  percent: number;
}

function weekStartKey(days = 7): string {
  const date = new Date();
  date.setDate(date.getDate() - (days - 1));
  return todayKey(date);
}

/** الدروس المنجزة أول مرة في الأيام الأخيرة، من الأحدث إلى الأقدم. */
export function weekLessons(
  completions: Record<string, LessonCompletion>,
  days = 7,
): { lesson: Lesson; date: string; stars: number }[] {
  const start = weekStartKey(days);
  return Object.entries(completions)
    .filter(([, completion]) => completion.date >= start)
    .map(([lessonId, completion]) => ({ lesson: LESSON_BY_ID[lessonId], date: completion.date, stars: completion.stars }))
    .filter((row) => row.lesson)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export interface WeekSubject {
  id: SubjectId;
  name: string;
  emoji: string;
  lessons: number;
}

/** عدد الدروس المنجزة في الأسبوع حسب المادة. */
export function weekBySubject(completions: Record<string, LessonCompletion>, days = 7): WeekSubject[] {
  const counts = new Map<SubjectId, number>();
  for (const row of weekLessons(completions, days)) {
    counts.set(row.lesson.subject, (counts.get(row.lesson.subject) ?? 0) + 1);
  }
  return SUBJECTS.map((subject) => ({
    id: subject.id,
    name: subject.name,
    emoji: subject.emoji,
    lessons: counts.get(subject.id) ?? 0,
  }));
}

export interface StrugglingTopic {
  lesson: Lesson;
  mistakes: number;
  fails: number;
  score: number;
}

/**
 * أكثر المواضيع تعثرًا: أخطاء التمارين والاختبارات + رسوب اختبار الدرس.
 * كل رسوب يساوي خطأين في الترتيب، لأن الرسوب يعني تعثرًا في الدرس كله.
 */
export function strugglingTopics(
  mistakeLessons: Record<string, number>,
  examAttempts: ExamAttempt[],
  limit = 5,
): StrugglingTopic[] {
  const fails = new Map<string, number>();
  for (const attempt of examAttempts) {
    if (attempt.kind === 'lesson' && attempt.lessonId && !attempt.passed) {
      fails.set(attempt.lessonId, (fails.get(attempt.lessonId) ?? 0) + 1);
    }
  }
  const ids = new Set([...Object.keys(mistakeLessons), ...fails.keys()]);
  return [...ids]
    .map((lessonId) => {
      const mistakes = mistakeLessons[lessonId] ?? 0;
      const failCount = fails.get(lessonId) ?? 0;
      return { lesson: LESSON_BY_ID[lessonId], mistakes, fails: failCount, score: mistakes + 2 * failCount };
    })
    .filter((row) => row.lesson && row.score > 0)
    .sort((a, b) => b.score - a.score || b.fails - a.fails || b.mistakes - a.mistakes)
    .slice(0, limit);
}

export interface FailStreak {
  key: string;
  kind: 'lesson' | 'level';
  lessonId: string | null;
  level: number;
  count: number;
  lastDate: string;
}

/** عدد مرات الرسوب المتتالية الأخيرة في اختبار معيّن. */
export function trailingFails(attempts: ExamAttempt[], key: string): number {
  let count = 0;
  for (let index = attempts.length - 1; index >= 0; index -= 1) {
    const attempt = attempts[index];
    if (attempt.key !== key) continue;
    if (attempt.passed) break;
    count += 1;
  }
  return count;
}

/** تنبيهات الرسوب المتتالي (3 مرات فأكثر) في اختبار درس أو مستوى. */
export function failStreaks(attempts: ExamAttempt[], threshold = 3): FailStreak[] {
  const keys = [...new Set(attempts.map((attempt) => attempt.key))];
  return keys
    .map((key) => {
      const count = trailingFails(attempts, key);
      const last = [...attempts].reverse().find((attempt) => attempt.key === key);
      return {
        key,
        kind: last?.kind ?? 'lesson',
        lessonId: last?.lessonId ?? null,
        level: last?.level ?? 0,
        count,
        lastDate: last?.date ?? '',
      };
    })
    .filter((row) => row.count >= threshold)
    .sort((a, b) => b.count - a.count);
}

/** نسبة إتمام كل مادة في مستوى معيّن. */
export function subjectProgress(level: Level, stars: Record<string, number>): SubjectProgress[] {
  return SUBJECTS.map((subject) => {
    const lessons = lessonsFor(level).filter((lesson) => lesson.subject === subject.id);
    const done = lessons.filter((lesson) => (stars[lesson.id] ?? 0) > 0).length;
    return {
      id: subject.id,
      name: subject.name,
      emoji: subject.emoji,
      done,
      total: lessons.length,
      percent: lessons.length ? Math.round((done / lessons.length) * 100) : 0,
    };
  }).filter((subject) => subject.total > 0);
}
