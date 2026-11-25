import { useMemo, useRef, useState } from 'react';
import { LESSON_BY_ID } from '../data';
import { LESSON_HTML_GAMES } from '../data/lesson-games';
import { LEVEL_NAMES, SUBJECT_BY_ID } from '../data/subjects';
import { playCorrect, playWin, playWrong } from '../lib/sound';
import { shuffle } from '../lib/shuffle';
import { GameResult } from '../games/GameResult';
import { NotFound } from './NotFound';

interface Question {
  question: string;
  hint?: string;
  options: { text: string; correct: boolean }[];
}

/** لعبة الدرس الخفيفة للأستاذ(ة): تمارين الدرس نفسها في شكل لعبة بالنقاط، للعب في القسم. */
export function TeacherGameView({ id }: { id: string }) {
  const lesson = LESSON_BY_ID[id];
  const htmlGame = LESSON_HTML_GAMES[id];
  const [mode, setMode] = useState<'html' | 'quiz'>(htmlGame ? 'html' : 'quiz');
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = useMemo<Question[]>(() => {
    if (!lesson) return [];
    const quiz = lesson.steps.filter((step) => step.kind === 'quiz');
    return shuffle(quiz).map((step) => ({
      question: step.question,
      hint: step.hint,
      options: shuffle(
        step.options.map((text, optionIndex) => ({ text, correct: optionIndex === step.answer })),
      ),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, attempt]);

  if (!lesson) return <NotFound />;

  const subject = SUBJECT_BY_ID[lesson.subject];
  const question = questions[index];
  const isLast = index === questions.length - 1;
  const answeredCorrectly = picked !== null && question?.options[picked]?.correct;

  function replay() {
    setAttempt((value) => value + 1);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
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
      setFinished(true);
      playWin();
      return;
    }
    setIndex((value) => value + 1);
    setPicked(null);
  }

  return (
    <div className="game-shell">
      <div className="page-head">
        <a className="back-link" href={`#/teacher/lesson/${lesson.id}`}>
          → جذاذة الدرس
        </a>
        <div className="page-title">
          <h1>
            🎮 {lesson.emoji} {lesson.title}
          </h1>
          <p>
            لعبة الدرس · {subject.name} · {LEVEL_NAMES[lesson.level]}
          </p>
        </div>
      </div>

      {htmlGame && mode === 'html' ? (
        <>
          <div className="game-actions" style={{ justifyContent: 'center' }}>
            <button
              className="btn primary"
              onClick={() => frameRef.current?.requestFullscreen?.()}
            >
              ⛶ ملء الشاشة (للعرض على التلاميذ)
            </button>
            <button className="btn ghost" onClick={() => setMode('quiz')}>
              ❓ لعبة الأسئلة بدلًا من ذلك
            </button>
          </div>
          <iframe
            ref={frameRef}
            className="html-game-frame"
            src={htmlGame}
            title={`لعبة الدرس: ${lesson.title}`}
            sandbox="allow-scripts"
            allowFullScreen
          />
        </>
      ) : (
        <>
          {htmlGame && (
            <div className="game-actions" style={{ justifyContent: 'center' }}>
              <button className="btn ghost" onClick={() => setMode('html')}>
                🎮 لعبة الدرس الكاملة بدلًا من ذلك
              </button>
            </div>
          )}
          {questions.length === 0 ? (
        <p className="license-note">هذا الدرس بلا تمارين اختيار من متعدد، فلا لعبة له بعد.</p>
      ) : finished ? (
        <>
          <GameResult
            emoji={lesson.emoji}
            title={lesson.title}
            score={score}
            best={score}
            newBest={false}
            onReplay={replay}
          />
          <div className="game-actions" style={{ justifyContent: 'center' }}>
            <a className="btn ghost" href={`#/teacher/lesson/${lesson.id}`}>
              📄 العودة إلى الجذاذة
            </a>
            <a className="btn ghost" href="#/teacher">
              دروس أخرى
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="game-hud">
            <span className="hud-pill">
              السؤال: {index + 1} / {questions.length}
            </span>
            <span className="hud-pill score">النقاط: {score}</span>
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
                {question.hint && <p>تلميح: {question.hint}</p>}
              </div>
            )}
            <div className="game-actions">
              <button className="btn primary" onClick={next} disabled={picked === null}>
                {isLast ? 'أنهِ اللعبة' : 'السؤال التالي'}
              </button>
            </div>
          </div>
        </>
      )}
        </>
      )}
    </div>
  );
}
