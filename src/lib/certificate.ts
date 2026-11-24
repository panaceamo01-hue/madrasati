import type { Level } from '../types';
import { lessonsFor } from '../data';
import { LEVELS } from '../data/subjects';
import { examKeyLevel, examPassed } from './exam';
import type { Progress } from './store';

export interface CertificateInfo {
  /** هل اجتاز الطفل اختبار المستوى؟ */
  earned: boolean;
  /** تاريخ آخر نجاح في الاختبار بصيغة YYYY-MM-DD، أو '' إن لم يوجد. */
  date: string;
  /** أفضل نسبة في اختبار المستوى. */
  percent: number;
  /** النجوم المحصلة في دروس المستوى. */
  stars: number;
  /** الدروس المنجزة في المستوى. */
  lessons: number;
  /** عدد دروس المستوى. */
  total: number;
}

/** معلومات شهادة مستوى معيّن. */
export function levelCertificate(level: Level, progress: Progress): CertificateInfo {
  const lessons = lessonsFor(level);
  const done = lessons.filter((lesson) => (progress.stars[lesson.id] ?? 0) > 0).length;
  const stars = lessons.reduce((sum, lesson) => sum + (progress.stars[lesson.id] ?? 0), 0);
  const key = examKeyLevel(level);
  const lastPass = [...(progress.examAttempts ?? [])]
    .reverse()
    .find((attempt) => attempt.key === key && attempt.passed);
  return {
    earned: examPassed(progress.exams ?? {}, key),
    date: lastPass?.date ?? '',
    percent: progress.exams?.[key] ?? 0,
    stars,
    lessons: done,
    total: lessons.length,
  };
}

/** هل اجتاز الطفل اختبارات المستويات الستة كلها؟ */
export function allLevelsCertified(progress: Progress): boolean {
  return LEVELS.every((level) => examPassed(progress.exams ?? {}, examKeyLevel(level)));
}

/** تاريخ آخر شهادة مستوى حصل عليها الطفل. */
export function lastCertificateDate(progress: Progress): string {
  const dates = LEVELS.map((level) => levelCertificate(level, progress).date).filter(Boolean);
  return dates.sort().at(-1) ?? '';
}

/** تنسيق تاريخ YYYY-MM-DD بالعربية (مثال: 24 نوفمبر 2026). */
export function formatArabicDate(dateKey: string): string {
  if (!dateKey) return '';
  const date = new Date(`${dateKey}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;
  return date.toLocaleDateString('ar-MA', { day: 'numeric', month: 'long', year: 'numeric' });
}
