import { useMemo, useState } from 'react';
import type { Level } from '../types';
import { LESSON_BY_ID, lessonsFor } from '../data';
import { LEVEL_NAMES } from '../data/subjects';
import { buildLevelExam, buildLessonExam, examKeyLesson, examKeyLevel, examPassed, PASS_PERCENT } from '../lib/exam';
import { trailingFails } from '../lib/report';
import { saveExamResult, recordMistake } from '../lib/store';
import { useProgress } from '../lib/useProgress';
import { lessonDone, levelStatus } from '../lib/unlock';
import { playCorrect, playWin, playWrong } from '../lib/sound';

interface Props {
  lessonId?: string;
  level?: Level;
}

export function ExamView({ lessonId, level }: Props) {
  const progress = useProgress();
  const stars = progress.stars;
  const exams = progress.exams ?? {};
  const lesson = lessonId ? LESSON_BY_ID[lessonId] : undefined;
  const examLevel = lesson ? lesson.level : level;
  const [attempt, setAttempt] = useState(0);

  const questions = useMemo(() => {
    if (lesson) return buildLessonExam(lesson);
    if (examLevel) return buildLevelExam(examLevel);
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, examLevel, attempt]);

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const key = lesson ? examKeyLesson(lesson.id) : examLevel ? examKeyLevel(examLevel) : '';
  const best = exams[key] ?? 0;

  const available = useMemo(() => {
    if (lesson) return lessonDone(stars, lesson);
    if (examLevel) return levelStatus(examLevel, stars).complete;
    return false;
  }, [lesson, examLevel, stars]);

  const allowedLevel =
    !examLevel ||
    examLevel === 1 ||
    progress.settings.childLevel === examLevel ||
    (progress.settings.startFromFirst &&
      progress.settings.childLevel !== null &&
      examLevel <= progress.settings.childLevel) ||
    examPassed(exams, examKeyLevel((examLevel - 1) as Level));

  if (!lesson && !examLevel) {
    return (
      <div className="locked-page">
        <p>لم أجد هذا الاختبار.</p>
        <a className="btn primary" href="#/">
          العودة للرئيسية
        </a>
      </div>
    );
  }

  if (!available || !allowedLevel) {
    return (
      <div className="locked-page">
        <span className="locked-emoji">🔒</span>
        <p>
          {lesson
            ? 'أكمل الدرس أولًا ثم عد إلى اختباره.'
            : 'اجتز كل دروس المستوى أولًا، ثم يأتي اختبار المستوى.'}
        </p>
        <a className="btn primary" href={lesson ? `#/lesson/${lesson.id}` : `#/level/${examLevel}`}>
          العودة
        </a>
      </div>
    );
  }

  const total = questions.length;
  if (total === 0) {
    return (
      <div className="locked-page">
        <p>لا توجد أسئلة كافية لهذا الاختبار بعد.</p>
        <a className="btn primary" href="#/">
          الرئيسية
        </a>
      </div>
    );
  }
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const passed = percent >= PASS_PERCENT;

  function choose(optionIndex: number) {
    if (picked !== null) return;
    setPicked(optionIndex);
    if (optionIndex === questions[index].answer) {
      setCorrect((value) => value + 1);
      playCorrect();
    } else {
      playWrong();
      // نربط الخطأ بالدرس صاحب السؤال، ليظهر في «أكثر المواضيع تعثرًا» عند ولي الأمر.
      const questionLessonId = lesson
        ? lesson.id
        : examLevel
          ? (lessonsFor(examLevel).find((item) => item.title === questions[index].lesson)?.id ?? undefined)
          : undefined;
      recordMistake(questions[index].question, questionLessonId);
    }
  }

  function next() {
    if (picked === null) return;
    if (index + 1 >= total) {
      const score = total ? Math.round((correct / total) * 100) : 0;
      const isPass = score >= PASS_PERCENT;
      saveExamResult(key, score);
      setFinished(true);
      if (isPass) playWin();
      return;
    }
    setIndex((value) => value + 1);
    setPicked(null);
  }

  function retry() {
    setAttempt((value) => value + 1);
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    setFinished(false);
  }

  function nextHref(): string | null {
    if (!passed) return null;
    if (lesson) {
      const siblings = lessonsFor(lesson.level);
      const position = siblings.findIndex((item) => item.id === lesson.id);
      const next = siblings[position + 1];
      return next ? `#/lesson/${next.id}` : null;
    }
    if (examLevel && examLevel < 6) return `#/level/${examLevel + 1}`;
    return null;
  }

  if (finished) {
    const href = nextHref();
    return (
      <div className="exam-page">
        <div className={`exam-result${passed ? ' pass' : ''}`}>
          <span className="exam-result-emoji">{passed ? '🏅' : '💪'}</span>
          <h1>{passed ? 'ناجح! مبروك' : 'لم تنجح هذه المرة'}</h1>
          <p className="exam-percent">
            {correct} من {total} · {percent}%
          </p>
          <p className="exam-note">
            {passed
              ? lesson
                ? 'اجتزت اختبار الدرس، وفتحت لك الدرس التالي.'
                : `اجتزت اختبار ${LEVEL_NAMES[examLevel as Level]}، وفتحت لك المستوى التالي.`
              : `تحتاج ${PASS_PERCENT}% للنجاح. راجع الشرح والتمارين ثم أعد المحاولة.`}
          </p>
          {best > 0 && <p className="exam-best">أفضل نتيجة لك: {Math.max(best, percent)}%</p>}
          {!passed && trailingFails(progress.examAttempts ?? [], key) >= 3 && (
            <p className="exam-alert">
              ⚠️ هذا ثالث رسوب متتالٍ في {lesson ? `اختبار درس «${lesson.title}»` : `اختبار ${LEVEL_NAMES[examLevel as Level]}`}.
              راجع الدرس بهدوء مع ولي أمرك قبل المحاولة من جديد.
            </p>
          )}
          <div className="game-actions">
            {passed && href && (
              <a className="btn primary" href={href}>
                {lesson ? 'الدرس التالي →' : 'المستوى التالي →'}
              </a>
            )}
            {!passed && (
              <button className="btn primary" onClick={retry}>
                أعد المحاولة
              </button>
            )}
            <a className="btn ghost" href={lesson ? `#/level/${lesson.level}` : `#/level/${examLevel}`}>
              العودة إلى الدروس
            </a>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[index];

  return (
    <div className="exam-page">
      <div className="page-head">
        <a className="back-link" href={lesson ? `#/level/${lesson.level}` : `#/level/${examLevel}`}>
          ← رجوع
        </a>
        <h1>🎯 {lesson ? 'اختبار الدرس' : `اختبار ${LEVEL_NAMES[examLevel as Level]}`}</h1>
        <p className="exam-sub">
          {lesson ? lesson.title : 'أسئلة من كل دروس المستوى'} · النجاح من {PASS_PERCENT}%
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
        {question.visual && <p className="exam-visual">{question.visual}</p>}
        <p className="exam-question">{question.question}</p>
        <div className="exam-options">
          {question.options.map((option, optionIndex) => {
            let className = 'answer-btn';
            if (picked !== null) {
              if (optionIndex === question.answer) className += ' ok';
              else if (picked === optionIndex) className += ' bad';
            }
            return (
              <button
                key={option}
                className={className}
                onClick={() => choose(optionIndex)}
                disabled={picked !== null}
              >
                {option}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className={`exam-feedback${picked === question.answer ? ' good' : ''}`}>
            {picked === question.answer ? '✅ إجابة صحيحة' : '❌ الإجابة الصحيحة مظللة'}
            {question.hint && <span className="exam-hint">💡 {question.hint}</span>}
          </div>
        )}
        <div className="game-actions">
          <button className="btn primary" onClick={next} disabled={picked === null}>
            {index + 1 >= total ? 'اعرض النتيجة' : 'السؤال التالي →'}
          </button>
        </div>
      </div>
    </div>
  );
}
