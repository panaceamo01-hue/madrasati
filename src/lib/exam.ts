import type { Lesson, Level, QuizStep } from '../types';
import { LESSONS, lessonsFor } from '../data';
import { shuffle } from './shuffle';

export const PASS_PERCENT = 70;

export function examKeyLesson(lessonId: string): string {
  return `lesson:${lessonId}`;
}

export function examKeyLevel(level: Level): string {
  return `level:${level}`;
}

export function examPassed(exams: Record<string, number>, key: string): boolean {
  return (exams[key] ?? 0) >= PASS_PERCENT;
}

export interface ExamQuestion {
  question: string;
  options: string[];
  answer: number;
  visual?: string;
  hint?: string;
  lesson: string;
}

function fromQuiz(step: QuizStep, lesson: Lesson): ExamQuestion {
  const options = shuffle(
    step.options.map((text, index) => ({ text, correct: index === step.answer })),
  );
  return {
    question: step.question,
    options: options.map((option) => option.text),
    answer: options.findIndex((option) => option.correct),
    visual: step.visual,
    hint: step.hint,
    lesson: lesson.title,
  };
}

function quizzesOf(items: Lesson[]): ExamQuestion[] {
  return items.flatMap((lesson) =>
    lesson.steps
      .filter((step): step is QuizStep => step.kind === 'quiz')
      .map((step) => fromQuiz(step, lesson)),
  );
}

function fill(pool: ExamQuestion[], extra: Lesson[], count: number): ExamQuestion[] {
  const picked = [...pool];
  const seen = new Set(picked.map((question) => question.question));
  for (const question of shuffle(quizzesOf(extra))) {
    if (picked.length >= count) break;
    if (seen.has(question.question)) continue;
    seen.add(question.question);
    picked.push(question);
  }
  return picked.slice(0, count);
}

/** أسئلة اختبار الدرس: من تمارينه أولًا، ثم من دروس المادة نفسها في المستوى. */
export function buildLessonExam(lesson: Lesson): ExamQuestion[] {
  const sameSubject = lessonsFor(lesson.level).filter(
    (item) => item.id !== lesson.id && item.subject === lesson.subject,
  );
  const sameLevel = lessonsFor(lesson.level).filter((item) => item.id !== lesson.id);
  return fill(shuffle(quizzesOf([lesson])), [...sameSubject, ...sameLevel], 5);
}

/** أسئلة اختبار المستوى: من دروس المستوى كلها، ومعها أسئلة من المستوى السابق إن قلّت. */
export function buildLevelExam(level: Level): ExamQuestion[] {
  const own = quizzesOf(lessonsFor(level));
  const extra = level > 1 ? LESSONS.filter((lesson) => lesson.level === level - 1) : [];
  return fill(shuffle(own), extra, 10);
}
