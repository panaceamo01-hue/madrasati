import { useMemo, useState } from 'react';
import type { Level } from '../types';
import { VALUES } from '../data/values';
import { playCorrect, playWin, playWrong } from '../lib/sound';
import { shuffle } from '../lib/shuffle';
import { GameResult } from './GameResult';

interface Props {
  level: Level;
  best: number;
  onFinish: (score: number) => boolean;
  onReplay: () => void;
}

const SETTING_LABEL: Record<string, string> = {
  school: '🏫 في المدرسة',
  home: '🏠 في البيت',
  street: '🛣️ في الشارع',
};

interface Question {
  emoji: string;
  situation: string;
  setting: string;
  value: string;
  options: { text: string; correct: boolean }[];
  moral: string;
}

function makeQuestions(level: Level): Question[] {
  return shuffle(VALUES[level]).map((scenario) => ({
    emoji: scenario.emoji,
    situation: scenario.situation,
    setting: scenario.setting,
    value: scenario.value,
    moral: scenario.moral,
    options: shuffle(
      scenario.options.map((text, index) => ({ text, correct: index === scenario.answer })),
    ),
  }));
}

export function ValuesGame({ level, best, onFinish, onReplay }: Props) {
  const questions = useMemo(() => makeQuestions(level), [level]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ score: number; newBest: boolean } | null>(null);

  const question = questions[index];
  const isLast = index === questions.length - 1;

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
      <GameResult
        emoji="💖"
        title="قيم وأخلاق"
        score={result.score}
        best={Math.max(best, result.score)}
        newBest={result.newBest}
        onReplay={onReplay}
      />
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
        <span className="hud-pill">{SETTING_LABEL[question.setting] ?? ''}</span>
        <span className="hud-pill">قيمة: {question.value}</span>
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
              قيمة {question.value}: {question.moral}
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
