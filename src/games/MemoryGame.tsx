import { useEffect, useMemo, useRef, useState } from 'react';
import type { Level } from '../types';
import { MEMORY } from '../data/games';
import { playCorrect, playWin, playWrong } from '../lib/sound';
import { shuffle } from '../lib/shuffle';
import { GameResult } from './GameResult';

interface Props {
  level: Level;
  best: number;
  onFinish: (score: number) => boolean;
  onReplay: () => void;
}

interface Card {
  id: string;
  pairId: number;
  face: string;
}

export function MemoryGame({ level, best, onFinish, onReplay }: Props) {
  const pairs = useMemo(() => MEMORY[level].slice(0, level <= 2 ? 6 : 8), [level]);
  const cards = useMemo<Card[]>(
    () =>
      shuffle(
        pairs.flatMap((pair, pairId) => [
          { id: `${pairId}-a`, pairId, face: pair.a },
          { id: `${pairId}-b`, pairId, face: pair.b },
        ]),
      ),
    [pairs],
  );

  const [opened, setOpened] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [result, setResult] = useState<{ score: number; newBest: boolean } | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => {
      list.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (result || cards.length === 0 || matched.length < cards.length) return;
    const score = Math.max(10, pairs.length * 100 - (moves - pairs.length) * 15);
    const newBest = onFinish(score);
    setResult({ score, newBest });
    playWin();
  }, [matched, result, cards.length, moves, pairs.length, onFinish]);

  function flip(card: Card) {
    if (opened.length === 2 || opened.includes(card.id) || matched.includes(card.id)) return;
    const next = [...opened, card.id];
    setOpened(next);
    if (next.length < 2) return;

    setMoves((value) => value + 1);
    const [first, second] = next.map((id) => cards.find((item) => item.id === id) as Card);
    if (first.pairId === second.pairId) {
      timers.current.push(
        window.setTimeout(() => {
          setMatched((value) => [...value, first.id, second.id]);
          setOpened([]);
          playCorrect();
        }, 380),
      );
    } else {
      timers.current.push(
        window.setTimeout(() => {
          setOpened([]);
          playWrong();
        }, 800),
      );
    }
  }

  if (result) {
    return (
      <GameResult
        emoji="🧠"
        title="أنهيت لعبة الذاكرة"
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
        <span className="hud-pill">الأزواج: {matched.length / 2} / {pairs.length}</span>
        <span className="hud-pill score">المحاولات: {moves}</span>
        <span className="spacer" />
        <span className="hud-pill timer">ابحث عن البطاقات المتشابهة</span>
      </div>
      <div className="game-board">
        <div className="memory-grid">
          {cards.map((card) => {
            const isOpen = opened.includes(card.id) || matched.includes(card.id);
            const isMatched = matched.includes(card.id);
            return (
              <button
                key={card.id}
                className={`mcard${isOpen ? ' flipped' : ''}${isMatched ? ' matched' : ''}`}
                onClick={() => flip(card)}
                aria-label={isOpen ? card.face : 'بطاقة مقلوبة'}
                disabled={isMatched}
              >
                <span className="mcard-inner">
                  <span className="mface back" aria-hidden="true">
                    ؟
                  </span>
                  <span className="mface front">{card.face}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
