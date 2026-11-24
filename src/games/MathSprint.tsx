import { useEffect, useRef, useState } from 'react';
import type { Level, MathConfig } from '../types';
import { MATH } from '../data/games';
import { playCorrect, playWin, playWrong } from '../lib/sound';
import { shuffle } from '../lib/shuffle';
import { GameResult } from './GameResult';

interface Props {
  level: Level;
  best: number;
  onFinish: (score: number) => boolean;
  onReplay: () => void;
}

interface Round {
  text: string;
  answer: number;
  options: number[];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeQuestion(config: MathConfig): { text: string; answer: number } {
  const op = config.ops[Math.floor(Math.random() * config.ops.length)];
  if (op === '+') {
    const a = randomBetween(1, config.max);
    const b = randomBetween(1, Math.max(2, Math.floor(config.max / 2)));
    return { text: `${a} + ${b}`, answer: a + b };
  }
  if (op === '-') {
    const a = randomBetween(3, config.max);
    const b = randomBetween(1, a - 1);
    return { text: `${a} − ${b}`, answer: a - b };
  }
  if (op === '×') {
    const a = randomBetween(2, 9);
    const b = randomBetween(2, 9);
    return { text: `${a} × ${b}`, answer: a * b };
  }
  const divisor = randomBetween(2, 9);
  const quotient = randomBetween(2, 9);
  return { text: `${divisor * quotient} ÷ ${divisor}`, answer: quotient };
}

function makeOptions(answer: number): number[] {
  const values = new Set<number>([answer]);
  [answer + 1, answer - 1, answer + 2, answer - 2, answer + 10, answer + 5].forEach((value) => {
    if (values.size < 4 && value >= 0) values.add(value);
  });
  while (values.size < 4) {
    const value = Math.max(0, answer + randomBetween(-5, 5));
    if (value !== answer) values.add(value);
  }
  return shuffle([...values]);
}

function newRound(config: MathConfig): Round {
  const question = makeQuestion(config);
  return { text: question.text, answer: question.answer, options: makeOptions(question.answer) };
}

export function MathSprint({ level, best, onFinish, onReplay }: Props) {
  const config = MATH[level];
  const [round, setRound] = useState<Round>(() => newRound(config));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.seconds);
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<{ score: number; newBest: boolean } | null>(null);
  const nextTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (nextTimer.current) window.clearTimeout(nextTimer.current);
    };
  }, []);

  useEffect(() => {
    if (result) return;
    if (timeLeft <= 0) {
      const newBest = onFinish(score);
      setResult({ score, newBest });
      playWin();
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [timeLeft, result, score, onFinish]);

  function answer(value: number) {
    if (picked !== null || result) return;
    const correct = value === round.answer;
    setPicked(value);
    if (correct) {
      setScore((current) => current + 10);
      playCorrect();
    } else {
      playWrong();
    }
    nextTimer.current = window.setTimeout(
      () => {
        setRound(newRound(config));
        setPicked(null);
      },
      correct ? 420 : 900,
    );
  }

  if (result) {
    return (
      <GameResult
        emoji="⚡"
        title="انتهى الوقت!"
        score={result.score}
        best={Math.max(best, result.score)}
        newBest={result.newBest}
        onReplay={onReplay}
      />
    );
  }

  return (
    <>
      <div className="game-hud">
        <span className="hud-pill score">النقاط: {score}</span>
        <span className="hud-pill timer">⏱ {timeLeft} ثانية</span>
        <span className="spacer" />
        <span className="hud-pill">كل إجابة صحيحة = 10 نقاط</span>
      </div>
      <div className="game-board">
        <div
          className="progress gold"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={config.seconds}
          aria-valuenow={timeLeft}
        >
          <span style={{ width: `${(timeLeft / config.seconds) * 100}%` }} />
        </div>
        <p className="math-question">{round.text}</p>
        <div className="answer-grid">
          {round.options.map((option) => {
            let className = 'answer-btn';
            if (picked !== null && option === round.answer) className += ' ok';
            else if (picked === option) className += ' bad';
            return (
              <button
                key={option}
                className={className}
                onClick={() => answer(option)}
                disabled={picked !== null}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
