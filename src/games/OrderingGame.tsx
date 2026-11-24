import { useEffect, useMemo, useRef, useState } from 'react';
import type { Level } from '../types';
import { ORDERING } from '../data/games';
import { playCorrect, playWin, playWrong } from '../lib/sound';
import { shuffle } from '../lib/shuffle';
import { GameResult } from './GameResult';

interface Props {
  level: Level;
  best: number;
  onFinish: (score: number) => boolean;
  onReplay: () => void;
}

export function OrderingGame({ level, best, onFinish, onReplay }: Props) {
  const sequences = useMemo(() => shuffle(ORDERING[level]).slice(0, 3), [level]);
  const [roundIndex, setRoundIndex] = useState(0);
  const current = sequences[roundIndex];
  const shuffled = useMemo(() => shuffle(current.items), [current]);

  const [picked, setPicked] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'ok' | 'bad'>('idle');
  const [mistakes, setMistakes] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [result, setResult] = useState<{ score: number; newBest: boolean } | null>(null);
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  function pick(item: string) {
    if (status === 'ok' || picked.includes(item)) return;
    if (item === current.items[picked.length]) {
      const next = [...picked, item];
      setPicked(next);
      if (next.length < current.items.length) {
        setStatus('idle');
        return;
      }
      setStatus('ok');
      playCorrect();
      const nextCompleted = completedCount + 1;
      setCompletedCount(nextCompleted);
      advanceTimer.current = window.setTimeout(() => {
        if (roundIndex + 1 >= sequences.length) {
          const score = Math.max(10, nextCompleted * 50 - mistakes * 5);
          const newBest = onFinish(score);
          setResult({ score, newBest });
          playWin();
        } else {
          setRoundIndex((value) => value + 1);
          setPicked([]);
          setStatus('idle');
        }
      }, 900);
    } else {
      setStatus('bad');
      playWrong();
      setMistakes((value) => value + 1);
    }
  }

  if (result) {
    return (
      <GameResult
        emoji="🪜"
        title="رتّبت كل السلاسل"
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
          السلسلة {roundIndex + 1} / {sequences.length}
        </span>
        <span className="hud-pill score">الأخطاء: {mistakes}</span>
        <span className="spacer" />
        <span className="hud-pill">{current.items.length} عناصر</span>
      </div>
      <div className="game-board">
        <p className="sequence-title">{current.title}</p>
        <p className="seq-progress">اضغط العناصر بالترتيب الصحيح.</p>
        <div className={`slots${status === 'bad' ? ' shake' : ''}`}>
          {picked.length === 0 && <span className="placeholder">الترتيب يبدأ من هنا…</span>}
          {picked.map((item) => (
            <span className="slot" key={item}>
              {item}
            </span>
          ))}
        </div>
        <div className="bank" style={{ justifyContent: 'center' }}>
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
        <div className="game-actions">
          <button
            className="btn ghost small"
            onClick={() => {
              setPicked([]);
              setStatus('idle');
            }}
            disabled={picked.length === 0 || status === 'ok'}
          >
            ↺ إعادة الترتيب
          </button>
          {status === 'ok' && <span className="feedback ok" style={{ margin: 0 }}>✅ ترتيب صحيح!</span>}
          {status === 'bad' && <span className="feedback no" style={{ margin: 0 }}>❌ ليس في مكانه.</span>}
        </div>
      </div>
    </>
  );
}
