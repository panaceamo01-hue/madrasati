import { useEffect, useMemo, useRef, useState } from 'react';
import type { Level } from '../types';
import { MATCHING } from '../data/games';
import { playCorrect, playWin, playWrong } from '../lib/sound';
import { shuffle } from '../lib/shuffle';
import { GameResult } from './GameResult';

interface Props {
  level: Level;
  best: number;
  onFinish: (score: number) => boolean;
  onReplay: () => void;
}

export function MatchingGame({ level, best, onFinish, onReplay }: Props) {
  const pairs = MATCHING[level];
  const rightOrder = useMemo(
    () => shuffle(pairs.map((pair, index) => ({ ...pair, index }))),
    [pairs],
  );

  const [selected, setSelected] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [errorRight, setErrorRight] = useState<number | null>(null);
  const [result, setResult] = useState<{ score: number; newBest: boolean } | null>(null);
  const errorTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimer.current) window.clearTimeout(errorTimer.current);
    };
  }, []);

  useEffect(() => {
    if (result || matched.length !== pairs.length || pairs.length === 0) return;
    const score = Math.max(10, pairs.length * 10 - mistakes * 4);
    const newBest = onFinish(score);
    setResult({ score, newBest });
    playWin();
  }, [matched, result, pairs.length, mistakes, onFinish]);

  function clickLeft(index: number) {
    if (matched.includes(index) || result) return;
    setSelected(index);
  }

  function clickRight(index: number) {
    if (matched.includes(index) || result) return;
    if (selected === null) return;
    if (selected === index) {
      setMatched((value) => [...value, index]);
      setSelected(null);
      playCorrect();
    } else {
      setMistakes((value) => value + 1);
      setErrorRight(index);
      playWrong();
      if (errorTimer.current) window.clearTimeout(errorTimer.current);
      errorTimer.current = window.setTimeout(() => setErrorRight(null), 500);
      setSelected(null);
    }
  }

  if (result) {
    return (
      <GameResult
        emoji="🔗"
        title="أتممت التوصيل"
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
        <span className="hud-pill">
          الأزواج: {matched.length} / {pairs.length}
        </span>
        <span className="hud-pill score">الأخطاء: {mistakes}</span>
        <span className="spacer" />
        <span className="hud-pill">اضغط بطاقة ثم ما يناسبها</span>
      </div>
      <div className="game-board">
        <div className="match-columns">
          <div className="match-col">
            {pairs.map((pair, index) => (
              <button
                key={pair.left}
                className={`match-item${selected === index ? ' selected' : ''}${
                  matched.includes(index) ? ' matched' : ''
                }`}
                onClick={() => clickLeft(index)}
                disabled={matched.includes(index)}
              >
                {pair.left}
              </button>
            ))}
          </div>
          <div className="match-col">
            {rightOrder.map((pair) => (
              <button
                key={pair.right}
                className={`match-item${errorRight === pair.index ? ' err' : ''}${
                  matched.includes(pair.index) ? ' matched' : ''
                }`}
                onClick={() => clickRight(pair.index)}
                disabled={matched.includes(pair.index)}
              >
                {pair.right}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
