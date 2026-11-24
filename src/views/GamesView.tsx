import { useState } from 'react';
import type { Level } from '../types';
import { GAMES } from '../data/games';
import { LEVEL_NAMES, LEVELS } from '../data/subjects';
import { useProgress } from '../lib/useProgress';

export function GamesView() {
  const [level, setLevel] = useState<Level>(1);
  const progress = useProgress();

  return (
    <>
      <div className="page-head">
        <div className="page-title">
          <h1>الألعاب التربوية</h1>
          <p>خمس ألعاب لتقوية الحساب واللغة والذاكرة والمنطق — بمستويات متدرّجة.</p>
        </div>
      </div>

      <div className="level-tabs" role="tablist" aria-label="مستوى اللعبة">
        {LEVELS.map((item) => (
          <button
            key={item}
            className={`level-tab${level === item ? ' active' : ''}`}
            onClick={() => setLevel(item)}
            aria-pressed={level === item}
          >
            {LEVEL_NAMES[item]}
          </button>
        ))}
      </div>

      <div className="games-grid">
        {GAMES.map((game) => {
          const best = progress.gameBest[`${game.id}:${level}`] ?? 0;
          return (
            <div className="game-card" key={game.id}>
              <span className="emoji" aria-hidden="true">
                {game.emoji}
              </span>
              <h3>{game.name}</h3>
              <p>{game.tagline}</p>
              <span className="best">{best ? `⭐ أفضل نتيجة: ${best}` : 'جديد — العب الآن'}</span>
              <a className="btn primary small" href={`#/game/${game.id}/${level}`}>
                ابدأ اللعب
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
}
