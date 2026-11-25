import { useMemo, useState } from 'react';
import type { Level } from '../types';
import { LIFE_SKILLS, LIFE_SKILLS_PASS_SCORE, LIFE_SKILL_STAGES } from '../data/lifeskills';
import { playCorrect, playWin, playWrong } from '../lib/sound';
import { shuffle } from '../lib/shuffle';
import { GameResult } from './GameResult';

interface Props {
  level: Level;
  best: number;
  onFinish: (score: number) => boolean;
  onReplay: () => void;
}

interface Question {
  emoji: string;
  situation: string;
  setting: string;
  skill: string;
  options: { text: string; correct: boolean }[];
  moral: string;
}

function makeQuestions(level: Level): Question[] {
  return shuffle(LIFE_SKILLS[level]).map((scenario) => ({
    emoji: scenario.emoji,
    situation: scenario.situation,
    setting: scenario.setting,
    skill: scenario.skill,
    moral: scenario.moral,
    options: shuffle(
      scenario.options.map((text, index) => ({ text, correct: index === scenario.answer })),
    ),
  }));
}

export function LifeSkillsGame({ level, best, onFinish, onReplay }: Props) {
  const stage = LIFE_SKILL_STAGES[level];
  const questions = useMemo(() => makeQuestions(level), [level]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ score: number; newBest: boolean } | null>(null);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const passed = (result?.score ?? 0) >= LIFE_SKILLS_PASS_SCORE;
  const nextStage = (level + 1) as Level;

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
      const newBest = onFinish(score);
      setResult({ score, newBest });
      playWin();
      return;
    }
    setIndex((value) => value + 1);
    setPicked(null);
  }

  if (result) {
    return (
      <>
        <GameResult
          emoji={stage.emoji}
          title={stage.name}
          score={result.score}
          best={Math.max(best, result.score)}
          newBest={result.newBest}
          onReplay={onReplay}
        />
        <div className="game-actions" style={{ justifyContent: 'center' }}>
          {passed ? (
            level < 6 ? (
              <a className="btn primary" href={`#/game/lifeskills/${nextStage}`}>
                🎉 فُتحت المرحلة التالية: {LIFE_SKILL_STAGES[nextStage].name}
              </a>
            ) : (
              <p>🎉 أحسنت! أكملت كل مراحل المهارات الحياتية.</p>
            )
          ) : (
            <p>
              تحتاج {LIFE_SKILLS_PASS_SCORE} نقطة على الأقل (4 مواقف صحيحة من 6) لفتح المرحلة
              التالية — حاول مرة أخرى.
            </p>
          )}
        </div>
      </>
    );
  }

  const answeredCorrectly = picked !== null && question.options[picked].correct;

  return (
    <>
      <div className="game-hud">
        <span className="hud-pill">
          الموقف: {index + 1} / {questions.length}
        </span>
        <span className="hud-pill score">النقاط: {score}</span>
        <span className="spacer" />
        <span className="hud-pill">{question.setting}</span>
        <span className="hud-pill">مهارة: {question.skill}</span>
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
        <p className="value-situation">
          <span className="value-emoji" aria-hidden="true">
            {question.emoji}
          </span>
          {question.situation}
        </p>
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
            <p>
              مهارة {question.skill}: {question.moral}
            </p>
          </div>
        )}
        <div className="game-actions">
          <button className="btn primary" onClick={next} disabled={picked === null}>
            {isLast ? 'أنهِ اللعبة' : 'الموقف التالي'}
          </button>
        </div>
      </div>
    </>
  );
}
