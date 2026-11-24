import type { BuildStep, Lesson, LessonStep, OrderStep, QuizStep } from '../types';
import type { ExamAttempt } from './store';
import { shuffle } from './shuffle';

/**
 * التعلّم المتكيّف: عند التعثّر في درس، نعيد أسئلة المفهوم نفسه
 * بصور وأمثلة مختلفة قبل الاختبار — نبدأ بالأسئلة التي أخطأ فيها الطفل،
 * ثم بباقي تمارين الدرس، مع خلط ترتيب الخيارات في كل مراجعة.
 */

export interface ReviewItem {
  step: LessonStep;
  /** هل أخطأ الطفل في هذا السؤال من قبل؟ */
  weak: boolean;
}

/** خطوات التمارين في درس ما (شرح مستثنى). */
export function practiceStepsOf(lesson: Lesson): LessonStep[] {
  return lesson.steps.filter((step) => step.kind !== 'teach');
}

function mistakesOf(step: LessonStep, mistakes: Record<string, number>): number {
  return step.kind === 'quiz' ? (mistakes[step.question] ?? 0) : 0;
}

/**
 * ترتيب المراجعة: الأسئلة الضعيفة أولًا (الأكثر خطأ في المقدمة)،
 * ثم باقي أسئلة الاختيار، ثم تمارين الترتيب وبناء الكلمة.
 */
export function reviewSteps(lesson: Lesson, mistakes: Record<string, number>): ReviewItem[] {
  const steps = practiceStepsOf(lesson);
  const weak = steps
    .filter((step) => mistakesOf(step, mistakes) > 0)
    .sort((a, b) => mistakesOf(b, mistakes) - mistakesOf(a, mistakes));
  const rest = steps.filter((step) => mistakesOf(step, mistakes) === 0);
  const quizzes = rest.filter((step) => step.kind === 'quiz');
  const others = rest.filter((step) => step.kind !== 'quiz');
  return [
    ...weak.map((step) => ({ step, weak: true })),
    ...quizzes.map((step) => ({ step, weak: false })),
    ...others.map((step) => ({ step, weak: false })),
  ];
}

/** عدد الأسئلة الضعيفة في الدرس. */
export function weakCount(lesson: Lesson, mistakes: Record<string, number>): number {
  return practiceStepsOf(lesson).filter((step) => mistakesOf(step, mistakes) > 0).length;
}

/** هل يحتاج الدرس إلى مراجعة؟ خطأ مسجّل فيه، أو رسوب في آخر اختبار له. */
export function needsReview(
  lessonId: string,
  mistakes: Record<string, number>,
  examAttempts: ExamAttempt[],
): boolean {
  if ((mistakes[lessonId] ?? 0) > 0) return true;
  const key = `lesson:${lessonId}`;
  for (let index = examAttempts.length - 1; index >= 0; index -= 1) {
    const attempt = examAttempts[index];
    if (attempt.key !== key) continue;
    return !attempt.passed;
  }
  return false;
}

/** نسخة من سؤال اختيار بخيارات مخلوطة الترتيب، ليبدو السؤال مختلفًا في كل مراجعة. */
export function shuffledQuiz(step: QuizStep): QuizStep {
  const order = shuffle(step.options.map((text, index) => ({ text, correct: index === step.answer })));
  return {
    ...step,
    options: order.map((option) => option.text),
    answer: order.findIndex((option) => option.correct),
  };
}

export type { BuildStep, OrderStep, QuizStep };
