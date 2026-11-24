import { useMemo, useRef, useState } from 'react';
import { LESSON_BY_ID } from '../data';
import { SUBJECT_BY_ID } from '../data/subjects';
import { reviewSteps, shuffledQuiz, weakCount } from '../lib/adaptive';
import { recordLessonMistake, recordMistake, resolveMistake, touchDaily } from '../lib/store';
import { useProgress } from '../lib/useProgress';
import { lessonUnlocked, levelUnlocked } from '../lib/unlock';
import { BuildView, OrderView, QuizView } from './LessonPlayer';

interface Props {
  lessonId: string;
}

/**
 * جلسة مراجعة متكيفة: نعيد أسئلة الدرس نفسه، بدءًا بالأسئلة التي تعثّر
 * فيها الطفل، مع خلط ترتيب الخيارات في كل مرة. الإجابة الصحيحة عن سؤال
 * ضعيف تُخرجه من قائمة التعثّر، فيتكيّف الدرس مع تقدّم الطفل.
 */
export function ReviewView({ lessonId }: Props) {
  const progress = useProgress();
  const lesson = LESSON_BY_ID[lessonId];
  const unlocked =
    lesson !== undefined &&
    levelUnlocked(lesson.level, progress.stars, progress.exams, progress.settings) &&
    lessonUnlocked(lesson, progress.stars, progress.exams);
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const stepWrong = useRef(false);

  const items = useMemo(
    () => (lesson ? reviewSteps(lesson, progress.mistakes ?? {}) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lesson?.id, attempt],
  );

  const total = items.length;

  if (!lesson) {
    return (
      <div className="locked-page">
        <p>لم أجد هذا الدرس.</p>
        <a className="btn primary" href="#/">
          العودة للرئيسية
        </a>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="locked-page">
        <span className="locked-emoji" aria-hidden="true">
          🔒
        </span>
        <p>أكمل الدرس السابق واجتز اختباره لتفتح مراجعة هذا الدرس.</p>
        <a className="btn primary" href={`#/level/${lesson.level}`}>
          العودة إلى المستوى
        </a>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="locked-page">
        <p>لا توجد تمارين في هذا الدرس بعد.</p>
        <a className="btn primary" href={`#/lesson/${lesson.id}`}>
          العودة إلى الدرس
        </a>
      </div>
    );
  }

  const item = items[index];
  const weak = weakCount(lesson, progress.mistakes ?? {});
  const subject = SUBJECT_BY_ID[lesson.subject];

  function onSolvedStep() {
    if (solved) return;
    touchDaily('practice');
    // أجاب صحيحًا دون خطأ في هذه المحاولة.
    if (!stepWrong.current) {
      setCorrect((value) => value + 1);
      if (item.step.kind === 'quiz') resolveMistake(item.step.question, lesson.id);
    }
    setSolved(true);
  }

  function onMistakeStep() {
    stepWrong.current = true;
    if (item.step.kind === 'quiz') recordMistake(item.step.question, lesson.id);
    else recordLessonMistake(lesson.id);
  }

  function next() {
    if (!solved) return;
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    stepWrong.current = false;
    setIndex((value) => value + 1);
    setSolved(false);
  }

  function retry() {
    setAttempt((value) => value + 1);
    setIndex(0);
    setSolved(false);
    setCorrect(0);
    setFinished(false);
    stepWrong.current = false;
  }

  if (finished) {
    return (
      <div className="exam-page">
        <div className="exam-result pass">
          <span className="exam-result-emoji">🔁</span>
          <h1>أكملت المراجعة!</h1>
          <p className="exam-percent">
            أجبت صحيحًا عن {correct} من {total} من أول محاولة
          </p>
          <p className="exam-note">
            {correct === total
              ? 'ممتاز! أتقنت كل أسئلة الدرس، وأنت جاهز للاختبار.'
              : 'أحسنت! الأسئلة التي ما زلت تخطئ فيها ستبقى في مقدمة المراجعة القادمة.'}
          </p>
          <div className="game-actions">
            <a className="btn primary" href={`#/exam/lesson/${encodeURIComponent(lesson.id)}`}>
              🎯 أعد الاختبار
            </a>
            <button className="btn ghost" onClick={retry}>
              راجع من جديد
            </button>
            <a className="btn ghost" href={`#/lesson/${lesson.id}`}>
              العودة إلى الدرس
            </a>
          </div>
        </div>
      </div>
    );
  }

  // خلط الخيارات مرة واحدة لكل سؤال في كل جولة مراجعة، ليبدو السؤال مختلفًا.
  const quizStep = useMemo(
    () => (item.step.kind === 'quiz' ? shuffledQuiz(item.step) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, attempt],
  );

  return (
    <div className="exam-page">
      <div className="page-head">
        <a className="back-link" href={`#/lesson/${lesson.id}`}>
          ← رجوع إلى الدرس
        </a>
        <h1>🔁 مراجعة: {lesson.title}</h1>
        <p className="exam-sub">
          {subject?.emoji} {subject?.name} · نبدأ بالأسئلة التي تعثّرت فيها
          {weak > 0 ? ` (${weak} ${weak === 1 ? 'سؤال' : 'أسئلة'})` : ' — هذه مراجعة عامة'}
        </p>
      </div>
      <div className="game-board exam-board">
        <div className="game-hud">
          <span className="hud-pill">
            سؤال {index + 1} / {total}
          </span>
          <span className="hud-pill score">✅ {correct}</span>
        </div>
        <div
          className="progress gold"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={index + 1}
        >
          <span style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
        {item.weak && <p className="review-weak">🔁 سؤال تعثّرت فيه من قبل — ركّز جيّدًا!</p>}
        <div className="step-card">
          {quizStep && (
            <QuizView
              key={`quiz-${index}-${attempt}`}
              step={quizStep}
              onSolved={onSolvedStep}
              onMistake={onMistakeStep}
            />
          )}
          {item.step.kind === 'order' && (
            <OrderView
              key={`order-${index}-${attempt}`}
              step={item.step}
              onSolved={onSolvedStep}
              onMistake={onMistakeStep}
            />
          )}
          {item.step.kind === 'build' && (
            <BuildView
              key={`build-${index}-${attempt}`}
              step={item.step}
              onSolved={onSolvedStep}
              onMistake={onMistakeStep}
            />
          )}
        </div>
        <div className="game-actions">
          <button className="btn primary" onClick={next} disabled={!solved}>
            {index + 1 >= total ? 'اعرض النتيجة' : 'السؤال التالي →'}
          </button>
        </div>
      </div>
    </div>
  );
}
