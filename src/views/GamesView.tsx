import { useState } from 'react';
import type { Level } from '../types';
import { GAMES } from '../data/games';
import { LIFE_SKILL_STAGES, lifeSkillStageUnlocked } from '../data/lifeskills';
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
          <p>
            سبع ألعاب لتقوية الحساب واللغة والذاكرة والمنطق والمهارات الحياتية — بمستويات
            متدرّجة.
          </p>
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
          // المهارات الحياتية: تبويب المستوى هو رقم المرحلة، والمراحل مقفلة بالتسلسل.
          const isLifeSkills = game.id === 'lifeskills';
          const stage = isLifeSkills ? LIFE_SKILL_STAGES[level] : null;
          const locked = isLifeSkills && !lifeSkillStageUnlocked(level, progress.gameBest);
          return (
            <div className="game-card" key={game.id}>
              <span className="emoji" aria-hidden="true">
                {stage ? stage.emoji : game.emoji}
              </span>
              <h3>
                {locked ? '🔒 ' : ''}
                {stage ? stage.name : game.name}
              </h3>
              <p>{stage ? stage.tagline : game.tagline}</p>
              <span className="best">
                {locked
                  ? 'مقفلة — أكمل المرحلة السابقة أولًا'
                  : best
                    ? `⭐ أفضل نتيجة: ${best}`
                    : 'جديد — العب الآن'}
              </span>
              {locked ? (
                <span className="btn primary small" aria-disabled="true">
                  مقفلة 🔒
                </span>
              ) : (
                <a className="btn primary small" href={`#/game/${game.id}/${level}`}>
                  ابدأ اللعب
                </a>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
