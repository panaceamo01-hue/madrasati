import type { Lesson, Level, SubjectId } from '../types';
import { level1 } from './level1';
import { level2 } from './level2';
import { level3 } from './level3';
import { level4 } from './level4';
import { level5 } from './level5';
import { level6 } from './level6';
import { extras } from './extras';

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
  ...level6,
  ...extras[6],
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
