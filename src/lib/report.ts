import type { Level, SubjectId } from '../types';
import { lessonsFor } from '../data';
import { SUBJECTS } from '../data/subjects';
import { todayKey, type DayActivity } from './store';

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
