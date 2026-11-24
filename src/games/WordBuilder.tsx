import { useEffect, useMemo, useRef, useState } from 'react';
import type { Level } from '../types';
import { WORDS } from '../data/games';
import { playCorrect, playWin, playWrong } from '../lib/sound';
import { shuffle } from '../lib/shuffle';
import { GameResult } from './GameResult';

interface Props {
  level: Level;
  best: number;
  onFinish: (score: number) => boolean;
  onReplay: () => void;
}

export function WordBuilder({ level, best, onFinish, onReplay }: Props) {
  const words = useMemo(() => shuffle(WORDS[level]).slice(0, 5), [level]);
  const [roundIndex, setRoundIndex] = useState(0);
  const current = words[roundIndex];
  const letters = useMemo(() => shuffle(Array.from(current.word)), [current.word]);

  const [picked, setPicked] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'ok' | 'bad'>('idle');
  const [mistakes, setMistakes] = useState(0);
  const [result, setResult] = useState<{ score: number; newBest: boolean } | null>(null);
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  useEffect(() => {
    setPicked([]);
    setStatus('idle');
  }, [roundIndex]);

  function pick(position: number) {
    if (status === 'ok' || picked.includes(position)) return;
    const next = [...picked, position];
    setPicked(next);
    if (next.length < letters.length) {
      setStatus('idle');
      return;
    }

    const built = next.map((index) => letters[index]).join('');
    if (built === current.word) {
      setStatus('ok');
      playCorrect();
      advanceTimer.current = window.setTimeout(() => {
        if (roundIndex + 1 >= words.length) {
          const score = Math.max(10, words.length * 20 - mistakes * 3);
          const newBest = onFinish(score);
          setResult({ score, newBest });
          playWin();
        } else {
          setRoundIndex((value) => value + 1);
        }
      }, 800);
    } else {
      setStatus('bad');
      playWrong();
      setMistakes((value) => value + 1);
    }
  }

  function undo() {
    if (status === 'ok') return;
    setPicked((value) => value.slice(0, -1));
    setStatus('idle');
  }

  if (result) {
    return (
      <GameResult
        emoji="🔤"
        title="بنيت كل الكلمات"
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
          الكلمة {roundIndex + 1} / {words.length}
        </span>
        <span className="hud-pill score">الأخطاء: {mistakes}</span>
        <span className="spacer" />
        <span className="hud-pill">رتّب الحروف</span>
      </div>
      <div className="game-board">
        <div className="word-hint">
          💡 تلميح
          <strong>{current.hint}</strong>
        </div>
        <div className={`slots${status === 'bad' ? ' shake' : ''}`}>
          {picked.length === 0 && <span className="placeholder">اختر الحروف بالترتيب…</span>}
          {picked.map((letterIndex) => (
            <span className="slot" key={`${letterIndex}-${letters[letterIndex]}`}>
              {letters[letterIndex]}
            </span>
          ))}
        </div>
        <div className="bank" style={{ justifyContent: 'center' }}>
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
        <div className="game-actions">
          <button className="btn ghost small" onClick={undo} disabled={picked.length === 0 || status === 'ok'}>
            ← تراجع
          </button>
          {status === 'ok' && <span className="feedback ok" style={{ margin: 0 }}>✅ كلمة صحيحة!</span>}
          {status === 'bad' && (
            <span className="feedback no" style={{ margin: 0 }}>❌ ليست الكلمة الصحيحة، جرّب من جديد.</span>
          )}
        </div>
      </div>
    </>
  );
}
