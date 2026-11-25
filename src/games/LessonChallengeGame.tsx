import { useMemo, useState } from 'react';
import type { Lesson } from '../types';
import { playCorrect, playWin, playWrong } from '../lib/sound';
import { shuffle } from '../lib/shuffle';
import { GameResult } from './GameResult';

interface Question {
  question: string;
  visual?: string;
  hint?: string;
  options: { text: string; correct: boolean }[];
}

const BEST_KEY = 'madrasati:lesson-challenge-best:v1';

function loadBest(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) ?? '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

/** يحفظ أفضل نتيجة لهذا الدرس وحده، ويعيد true إن كانت جديدة. */
function saveBest(lessonId: string, score: number): boolean {
  const all = loadBest();
  if (score <= (all[lessonId] ?? 0)) return false;
  all[lessonId] = score;
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(all));
  } catch {
    // التخزين غير متاح: النتيجة تُعرض بلا حفظ.
  }
  return true;
}

/**
 * تحدي الدرس: تمارين الدرس نفسه (اختيار من متعدد) في شكل لعبة بالنقاط.
 * اللعبة هنا من محتوى الدرس حصرًا، لا من ألعاب عامة حسب المادة أو المستوى.
 */
export function LessonChallengeGame({ lesson }: { lesson: Lesson }) {
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ score: number; newBest: boolean } | null>(null);

  const questions = useMemo<Question[]>(() => {
    const quiz = lesson.steps.filter((step) => step.kind === 'quiz');
    return shuffle(quiz).map((step) => ({
      question: step.question,
      visual: step.visual,
      hint: step.hint,
      options: shuffle(
        step.options.map((text, optionIndex) => ({ text, correct: optionIndex === step.answer })),
      ),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, attempt]);

  const best = loadBest()[lesson.id] ?? 0;
  const question = questions[index];
  const isLast = index === questions.length - 1;
  const answeredCorrectly = picked !== null && question?.options[picked]?.correct;

  function replay() {
    setAttempt((value) => value + 1);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setResult(null);
  }

  function pick(optionIndex: number) {
    if (picked !== null) return;
    setPicked(optionIndex);
    if (question.options[optionIndex].correct) {
      setScore((value) => value + 10);
      playCorrect();
    } else {
      playWrong();
    }
  }

  function next() {
    if (picked === null) return;
    if (isLast) {
      const newBest = saveBest(lesson.id, score);
      setResult({ score, newBest });
      playWin();
      return;
    }
    setIndex((value) => value + 1);
    setPicked(null);
  }

  if (questions.length === 0) {
    return <p className="license-note">هذا الدرس بلا تمارين اختيار من متعدد، فلا تحدي له بعد.</p>;
  }

  if (result) {
    return (
      <GameResult
        emoji={lesson.emoji}
        title={`تحدي: ${lesson.title}`}
        score={result.score}
        best={Math.max(best, result.score)}
        newBest={result.newBest}
        onReplay={replay}
      />
    );
  }

  return (
    <>
      <div className="game-hud">
        <span className="hud-pill">
          السؤال: {index + 1} / {questions.length}
        </span>
        <span className="hud-pill score">النقاط: {score}</span>
        <span className="spacer" />
        {best > 0 && <span className="hud-pill">⭐ أفضل نتيجة: {best}</span>}
      </div>
      <div className="game-board">
        <div
          className="progress gold"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={index + 1}
        >
          <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="value-situation">{question.question}</p>
        {question.visual && (
          <div className="step-visual" aria-hidden="true">
            {question.visual}
          </div>
        )}
        <div className="value-options">
          {question.options.map((option, optionIndex) => {
            let className = 'answer-btn';
            if (picked !== null) {
              if (option.correct) className += ' ok';
              else if (picked === optionIndex) className += ' bad';
            }
            return (
              <button
                key={option.text}
                className={className}
                onClick={() => pick(optionIndex)}
                disabled={picked !== null}
              >
                {option.text}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className={`value-moral${answeredCorrectly ? ' good' : ''}`}>
            <strong>{answeredCorrectly ? '✅ أحسنت!' : '🤔 فكر قليلًا...'}</strong>
            {question.hint ? (
              <p>تلميح: {question.hint}</p>
            ) : (
              !answeredCorrectly && (
                <p>
                  الإجابة الصحيحة هي:{' '}
                  {question.options.find((option) => option.correct)?.text}
                </p>
              )
            )}
          </div>
        )}
        <div className="game-actions">
          <button className="btn primary" onClick={next} disabled={picked === null}>
            {isLast ? 'أنهِ التحدي' : 'السؤال التالي'}
          </button>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>
          أسئلة هذا الدرس نفسه — أعد اللعب وسيتغير ترتيب الأسئلة والاختيارات.
        </p>
      </div>
    </>
  );
}
