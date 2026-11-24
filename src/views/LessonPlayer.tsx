import { useEffect, useMemo, useState } from 'react';
import type { BuildStep, GameId, Lesson, OrderStep, QuizStep, SubjectId, TeachStep } from '../types';
import { DIFFICULTY_LABEL } from '../types';
import { nextLesson } from '../data';
import { lessonVideo } from '../data/videos';
import { LEVEL_NAMES, SUBJECT_BY_ID } from '../data/subjects';
import { saveGameScore, saveLessonStars, touchDaily } from '../lib/store';
import { useProgress } from '../lib/useProgress';
import { examKeyLesson, examPassed } from '../lib/exam';
import { playCorrect, playWin, playWrong } from '../lib/sound';
import { speak, stopSpeaking } from '../lib/speech';
import { shuffle } from '../lib/shuffle';
import { MemoryGame } from '../games/MemoryGame';
import { MathSprint } from '../games/MathSprint';
import { WordBuilder } from '../games/WordBuilder';
import { MatchingGame } from '../games/MatchingGame';
import { OrderingGame } from '../games/OrderingGame';

const GAME_FOR_SUBJECT: Record<SubjectId, GameId> = {
  arabic: 'words',
  math: 'math',
  islamic: 'matching',
  science: 'memory',
  social: 'matching',
  french: 'matching',
};

type Tab = 'teach' | 'video' | 'practice' | 'play';

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const teachSteps = useMemo(
    () => lesson.steps.filter((step): step is TeachStep => step.kind === 'teach'),
    [lesson],
  );
  const practiceSteps = useMemo(
    () => lesson.steps.filter((step) => step.kind !== 'teach'),
    [lesson],
  );

  const [tab, setTab] = useState<Tab>(teachSteps.length ? 'teach' : 'practice');
  const [teachIndex, setTeachIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);

  const progress = useProgress();
  const video = lessonVideo(lesson.id);
  const showVideo = Boolean(video && progress.settings.videosEnabled);
  const subject = SUBJECT_BY_ID[lesson.subject];
  const following = nextLesson(lesson);
  const gameId = GAME_FOR_SUBJECT[lesson.subject];
  const gameBest = progress.gameBest[`${gameId}:${lesson.level}`] ?? 0;

  const teachStep = teachSteps[teachIndex];
  const practiceStep = practiceSteps[practiceIndex];
  const isLastPractice = practiceIndex === practiceSteps.length - 1;

  useEffect(() => {
    setSolved(false);
    stopSpeaking();
    if (tab === 'teach') touchDaily('teach');
    if (tab === 'video') touchDaily('video');
  }, [practiceIndex, teachIndex, tab]);

  useEffect(() => () => stopSpeaking(), []);

  function finish() {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    saveLessonStars(lesson.id, stars);
    setFinished(stars);
    playWin();
  }

  function nextPractice() {
    if (isLastPractice) finish();
    else setPracticeIndex((value) => value + 1);
  }

  function restart() {
    setFinished(null);
    setPracticeIndex(0);
    setMistakes(0);
    setSolved(false);
    setTab('practice');
  }

  const addMistake = () => setMistakes((value) => value + 1);

  const doneCount = Object.keys(progress.stars).length;

  return (
    <div className="lesson-shell">
      <div className="lesson-bar kid-bar">
        <a className="back-link" href={`#/level/${lesson.level}`} aria-label="العودة إلى المستوى">
          → {LEVEL_NAMES[lesson.level]}
        </a>
        <span className="title">
          {lesson.emoji} {lesson.title}
        </span>
        <span className="count" title="دروس منجزة في التطبيق">
          ⭐ {doneCount}
        </span>
      </div>

      <div className="lesson-tabs" role="tablist" aria-label="أقسام الدرس">
        <button
          role="tab"
          aria-selected={tab === 'teach'}
          className={`lesson-tab${tab === 'teach' ? ' active' : ''}`}
          onClick={() => setTab('teach')}
          disabled={teachSteps.length === 0}
        >
          📘 الشرح
          <small>{teachSteps.length}</small>
        </button>
        {showVideo && (
          <button
            role="tab"
            aria-selected={tab === 'video'}
            className={`lesson-tab${tab === 'video' ? ' active' : ''}`}
            onClick={() => setTab('video')}
          >
            🎥 فيديو
            <small>شرح</small>
          </button>
        )}
        <button
          role="tab"
          aria-selected={tab === 'practice'}
          className={`lesson-tab${tab === 'practice' ? ' active' : ''}`}
          onClick={() => setTab('practice')}
        >
          ✏️ التمارين
          <small>{practiceSteps.length}</small>
        </button>
        <button
          role="tab"
          aria-selected={tab === 'play'}
          className={`lesson-tab${tab === 'play' ? ' active' : ''}`}
          onClick={() => setTab('play')}
        >
          🎮 اللعب
          <small>لعبة</small>
        </button>
      </div>

      <div className="lesson-objective">
        <span>🎯 {lesson.objective}</span>
        <button className="btn-icon" onClick={() => speak(lesson.objective)} aria-label="استمع إلى هدف الدرس">
          🔊
        </button>
      </div>

      {tab === 'teach' && (
        <>
          {teachStep ? (
            <div className="step-card" style={{ borderTop: `5px solid ${subject.color}` }}>
              <div className="step-tag">شرح {teachIndex + 1} / {teachSteps.length}</div>
              <TeachView key={`teach-${teachIndex}`} step={teachStep} />
              <div className="lesson-actions">
                <button
                  className="btn ghost small"
                  onClick={() => setTeachIndex((value) => Math.max(0, value - 1))}
                  disabled={teachIndex === 0}
                >
                  → السابق
                </button>
                <button
                  className="btn primary"
                  onClick={() => {
                    if (teachIndex + 1 < teachSteps.length) setTeachIndex((value) => value + 1);
                    else setTab('practice');
                  }}
                >
                  {teachIndex + 1 < teachSteps.length ? 'التالي →' : 'إلى التمارين ✏️'}
                </button>
              </div>
            </div>
          ) : (
            <div className="step-card">
              <p className="step-body">هذا الدرس تمارين فقط. انتقل إلى نافذة «التمارين».</p>
              <button className="btn primary" onClick={() => setTab('practice')}>
                إلى التمارين ✏️
              </button>
            </div>
          )}
        </>
      )}

      {tab === 'video' && showVideo && video && (
        <div className="step-card" style={{ borderTop: `5px solid ${subject.color}` }}>
          <div className="step-tag">🎥 فيديو الشرح</div>
          <div className="video-frame">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0${video.start ? `&start=${video.start}` : ''}`}
              title={`فيديو شرح: ${lesson.title}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="step-body">
            شاهد الفيديو، ثم انتقل إلى التمارين لتتدرّب على ما تعلّمته.
            {video.channel ? ` المصدر: قناة ${video.channel} على يوتيوب.` : ''}
          </p>
          <p className="tip">
            <span aria-hidden="true">📶</span>
            <span>
              الفيديو يحتاج إلى الإنترنت. إذا لم يظهر، تأكّد من الاتصال بالإنترنت؛
              الشرح والتمارين في هذا الدرس يعملان دون إنترنت.
            </span>
          </p>
          <div className="lesson-actions">
            <a
              className="btn ghost small"
              href={`https://www.youtube.com/watch?v=${video.id}${video.start ? `&t=${video.start}s` : ''}`}
              target="_blank"
              rel="noreferrer"
            >
              فتح الفيديو في يوتيوب ↗
            </a>
            <button className="btn primary" onClick={() => setTab('practice')}>
              إلى التمارين ✏️
            </button>
          </div>
        </div>
      )}

      {tab === 'practice' && (
        <>
          {practiceSteps.length > 0 && (
            <div
              className="lesson-progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={practiceSteps.length}
              aria-valuenow={practiceIndex}
            >
              <span style={{ width: `${(practiceIndex / practiceSteps.length) * 100}%` }} />
            </div>
          )}

          {finished !== null ? (
            <div className="result-card kid-result">
              <div className="big-stars" aria-label={`${finished} من 3 نجوم`}>
                {[0, 1, 2].map((position) => (
                  <span key={position} style={{ opacity: position < finished ? 1 : 0.22 }}>
                    ⭐
                  </span>
                ))}
              </div>
              <h2>{lesson.title}</h2>
              <p>
                {finished === 3
                  ? 'ممتاز! أكملت الدرس بلا أخطاء.'
                  : finished === 2
                    ? 'عمل رائع! أعد التمارين لتحصل على ثلاث نجوم.'
                    : 'أكملت الدرس. راجعه مرة أخرى لتتحسّن نتيجتك.'}
              </p>
              <div className="lesson-actions" style={{ justifyContent: 'center' }}>
                <a className="btn ghost" href={`#/level/${lesson.level}`}>
                  العودة إلى المستوى
                </a>
                <button className="btn ghost" onClick={restart}>
                  إعادة التمارين
                </button>
                <button className="btn secondary" onClick={() => setTab('play')}>
                  🎮 العب
                </button>
                {following && examPassed(progress.exams ?? {}, examKeyLesson(lesson.id)) && (
                  <a className="btn ghost" href={`#/lesson/${encodeURIComponent(following.id)}`}>
                    الدرس التالي ←
                  </a>
                )}
                <a className="btn primary" href={`#/exam/lesson/${encodeURIComponent(lesson.id)}`}>
                  🎯 اختبار الدرس
                </a>
              </div>
            </div>
          ) : practiceStep ? (
            <div className="step-card" style={{ borderTop: `5px solid ${subject.color}` }}>
              <div className="step-tag">
                تمرين {practiceIndex + 1} / {practiceSteps.length}
                {practiceStep.difficulty ? ` · ${DIFFICULTY_LABEL[practiceStep.difficulty]}` : ''}
                {practiceStep.difficulty === 3 ? ' · تحدٍّ! 💪' : ''}
              </div>
              {practiceStep.kind === 'quiz' && (
                <QuizView key={`quiz-${practiceIndex}`} step={practiceStep} onSolved={() => setSolved(true)} onMistake={addMistake} />
              )}
              {practiceStep.kind === 'order' && (
                <OrderView key={`order-${practiceIndex}`} step={practiceStep} onSolved={() => setSolved(true)} onMistake={addMistake} />
              )}
              {practiceStep.kind === 'build' && (
                <BuildView key={`build-${practiceIndex}`} step={practiceStep} onSolved={() => setSolved(true)} onMistake={addMistake} />
              )}

              <div className="lesson-actions">
                <button className="btn ghost small" onClick={() => speak(lesson.objective)}>
                  🔊 استمع للهدف
                </button>
                <button className="btn primary" onClick={nextPractice} disabled={!solved}>
                  {isLastPractice ? 'إنهاء الدرس ✓' : 'التالي →'}
                </button>
              </div>
            </div>
          ) : (
            <div className="step-card">
              <p className="step-body">لا توجد تمارين في هذا الدرس، جرّب اللعبة.</p>
              <button className="btn primary" onClick={() => setTab('play')}>
                🎮 العب
              </button>
            </div>
          )}
        </>
      )}

      {tab === 'play' && (
        <div className="lesson-game">
          <div className="lesson-game-head">
            <h2>🎮 لعبة مرتبطة بالدرس</h2>
            <p>لعبة المستوى {LEVEL_NAMES[lesson.level]}، نتيجتها تُحفظ في ملفك.</p>
          </div>
          <div className="game-embed" key={`${gameId}-${attempt}`}>
            {gameId === 'memory' && (
              <MemoryGame
                level={lesson.level}
                best={gameBest}
                onFinish={(score) => saveGameScore(gameId, lesson.level, score)}
                onReplay={() => setAttempt((value) => value + 1)}
              />
            )}
            {gameId === 'math' && (
              <MathSprint
                level={lesson.level}
                best={gameBest}
                onFinish={(score) => saveGameScore(gameId, lesson.level, score)}
                onReplay={() => setAttempt((value) => value + 1)}
              />
            )}
            {gameId === 'words' && (
              <WordBuilder
                level={lesson.level}
                best={gameBest}
                onFinish={(score) => saveGameScore(gameId, lesson.level, score)}
                onReplay={() => setAttempt((value) => value + 1)}
              />
            )}
            {gameId === 'matching' && (
              <MatchingGame
                level={lesson.level}
                best={gameBest}
                onFinish={(score) => saveGameScore(gameId, lesson.level, score)}
                onReplay={() => setAttempt((value) => value + 1)}
              />
            )}
            {gameId === 'ordering' && (
              <OrderingGame
                level={lesson.level}
                best={gameBest}
                onFinish={(score) => saveGameScore(gameId, lesson.level, score)}
                onReplay={() => setAttempt((value) => value + 1)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TeachView({ step }: { step: TeachStep }) {
  return (
    <>
      {step.hook && (
        <div className="tip">
          <span aria-hidden="true">🎈</span>
          <span>{step.hook}</span>
        </div>
      )}
      {step.visual && (
        <div className="step-visual" aria-hidden="true">
          {step.visual}
        </div>
      )}
      <div className="quiz-question">
        <span>{step.title}</span>
        <button
          className="btn-icon"
          onClick={() => speak(`${step.title}. ${step.body}`)}
          aria-label="استمع إلى الشرح"
          title="استمع"
        >
          🔊
        </button>
      </div>
      <p className="step-body">{step.body}</p>
      {step.tip && (
        <div className="tip">
          <span aria-hidden="true">💡</span>
          <span>{step.tip}</span>
        </div>
      )}
    </>
  );
}

interface StepProps<T> {
  step: T;
  onSolved: () => void;
  onMistake: () => void;
}

function QuizView({ step, onSolved, onMistake }: StepProps<QuizStep>) {
  const [chosen, setChosen] = useState<number | null>(null);
  const answered = chosen !== null;
  const isCorrect = chosen === step.answer;

  function pick(option: number) {
    if (answered) return;
    setChosen(option);
    if (option === step.answer) playCorrect();
    else {
      playWrong();
      onMistake();
    }
    onSolved();
  }

  return (
    <>
      {step.visual && (
        <div className="step-visual" aria-hidden="true">
          {step.visual}
        </div>
      )}
      <div className="quiz-question">
        <span>{step.question}</span>
        <button
          className="btn-icon"
          onClick={() => speak(step.question)}
          aria-label="استمع إلى السؤال"
          title="استمع"
        >
          🔊
        </button>
      </div>
      <div className="quiz-options">
        {step.options.map((option, position) => {
          let className = 'option';
          if (answered && position === step.answer) className += ' correct';
          else if (answered && position === chosen) className += ' wrong';
          return (
            <button key={option} className={className} onClick={() => pick(position)} disabled={answered}>
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`feedback ${isCorrect ? 'ok' : 'no'}`}>
          {isCorrect ? '✅ أحسنت! إجابة صحيحة.' : `❌ ليست الإجابة الصحيحة. الصواب: ${step.options[step.answer]}.`}
          {!isCorrect && step.hint ? ` ${step.hint}` : ''}
        </div>
      )}
    </>
  );
}

function OrderView({ step, onSolved, onMistake }: StepProps<OrderStep>) {
  const shuffled = useMemo(() => shuffle(step.items), [step.items]);
  const [picked, setPicked] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'ok' | 'bad'>('idle');

  function pick(item: string) {
    if (status === 'ok' || picked.includes(item)) return;
    if (item === step.items[picked.length]) {
      const next = [...picked, item];
      setPicked(next);
      if (next.length === step.items.length) {
        setStatus('ok');
        playCorrect();
        onSolved();
      } else {
        setStatus('idle');
      }
    } else {
      setStatus('bad');
      playWrong();
      onMistake();
    }
  }

  function reset() {
    setPicked([]);
    setStatus('idle');
  }

  return (
    <>
      <p className="quiz-question">{step.question}</p>
      {step.hint && <p className="seq-progress">💡 {step.hint}</p>}
      <div className={`slots${status === 'bad' ? ' shake' : ''}`}>
        {picked.length === 0 && <span className="placeholder">اضغط العناصر بالترتيب الصحيح…</span>}
        {picked.map((item) => (
          <span className="slot" key={item}>
            {item}
          </span>
        ))}
      </div>
      <div className="bank">
        {shuffled.map((item) => (
          <button
            key={item}
            className="tile"
            onClick={() => pick(item)}
            disabled={picked.includes(item) || status === 'ok'}
          >
            {item}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn ghost small" onClick={reset} disabled={picked.length === 0}>
          ↺ إعادة الترتيب
        </button>
        {status === 'ok' && <span className="feedback ok" style={{ margin: 0 }}>✅ ترتيب صحيح!</span>}
        {status === 'bad' && <span className="feedback no" style={{ margin: 0 }}>❌ هذا العنصر ليس في مكانه.</span>}
      </div>
    </>
  );
}

function BuildView({ step, onSolved, onMistake }: StepProps<BuildStep>) {
  const letters = useMemo(() => shuffle(Array.from(step.word)), [step.word]);
  const [picked, setPicked] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'ok' | 'bad'>('idle');

  function pick(position: number) {
    if (status === 'ok' || picked.includes(position)) return;
    const next = [...picked, position];
    setPicked(next);
    if (next.length === letters.length) {
      const built = next.map((letterIndex) => letters[letterIndex]).join('');
      if (built === step.word) {
        setStatus('ok');
        playCorrect();
        onSolved();
      } else {
        setStatus('bad');
        playWrong();
        onMistake();
      }
    } else {
      setStatus('idle');
    }
  }

  function undo() {
    if (status === 'ok') return;
    setPicked((value) => value.slice(0, -1));
    setStatus('idle');
  }

  function reset() {
    setPicked([]);
    setStatus('idle');
  }

  return (
    <>
      <p className="quiz-question">{step.question}</p>
      {step.hint && <p className="seq-progress">💡 {step.hint}</p>}
      <div className={`slots${status === 'bad' ? ' shake' : ''}`}>
        {picked.length === 0 && <span className="placeholder">اختر الحروف بالترتيب…</span>}
        {picked.map((letterIndex) => (
          <span className="slot" key={`${letterIndex}-${letters[letterIndex]}`}>
            {letters[letterIndex]}
          </span>
        ))}
      </div>
      <div className="bank">
        {letters.map((letter, position) => (
          <button
            key={`${position}-${letter}`}
            className={`tile${picked.includes(position) ? ' used' : ''}`}
            onClick={() => pick(position)}
            disabled={picked.includes(position) || status === 'ok'}
          >
            {letter}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn ghost small" onClick={undo} disabled={picked.length === 0 || status === 'ok'}>
          ← تراجع
        </button>
        <button className="btn ghost small" onClick={reset} disabled={picked.length === 0}>
          ↺ إعادة
        </button>
        {status === 'ok' && <span className="feedback ok" style={{ margin: 0 }}>✅ كلمة صحيحة!</span>}
        {status === 'bad' && (
          <span className="feedback no" style={{ margin: 0 }}>❌ ليست الكلمة الصحيحة، جرّب ترتيبًا آخر.</span>
        )}
      </div>
    </>
  );
}
