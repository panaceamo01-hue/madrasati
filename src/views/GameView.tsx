import { useCallback, useState } from 'react';
import type { GameId, Level } from '../types';
import { gameById } from '../data/games';
import { LIFE_SKILL_STAGES, lifeSkillStageUnlocked } from '../data/lifeskills';
import { LEVEL_NAMES } from '../data/subjects';
import { saveGameScore } from '../lib/store';
import { useProgress } from '../lib/useProgress';
import { MemoryGame } from '../games/MemoryGame';
import { MathSprint } from '../games/MathSprint';
import { WordBuilder } from '../games/WordBuilder';
import { MatchingGame } from '../games/MatchingGame';
import { OrderingGame } from '../games/OrderingGame';
import { ValuesGame } from '../games/ValuesGame';
import { LifeSkillsGame } from '../games/LifeSkillsGame';

export function GameView({ gameId, level }: { gameId: GameId; level: Level }) {
  const meta = gameById(gameId);
  const progress = useProgress();
  const [attempt, setAttempt] = useState(0);
  const best = progress.gameBest[`${gameId}:${level}`] ?? 0;

  const handleFinish = useCallback(
    (score: number) => saveGameScore(gameId, level, score),
    [gameId, level],
  );
  const onReplay = useCallback(() => setAttempt((value) => value + 1), []);
  const props = { level, best, onFinish: handleFinish, onReplay };

  // القفل يسري أيضا على الرابط المباشر: لا يكفي إخفاء المرحلة في قائمة الألعاب.
  if (gameId === 'lifeskills' && !lifeSkillStageUnlocked(level, progress.gameBest)) {
    const stage = LIFE_SKILL_STAGES[level];
    return (
      <div className="game-shell">
        <div className="locked-page">
          <span className="locked-emoji" aria-hidden="true">
            🔒
          </span>
          <h1>
            {stage.emoji} {stage.name}
          </h1>
          <p>هذه المرحلة مقفلة. أكمل المرحلة السابقة واجتزها (40 نقطة على الأقل) لتفتحها.</p>
          <a className="btn primary" href="#/games">
            العودة إلى الألعاب
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="game-shell">
      <div className="page-head">
        <a className="back-link" href="#/games">
          → الألعاب
        </a>
        <div className="page-title">
          <h1>
            {gameId === 'lifeskills'
              ? `${LIFE_SKILL_STAGES[level].emoji} ${LIFE_SKILL_STAGES[level].name}`
              : `${meta.emoji} ${meta.name}`}
          </h1>
          <p>
            {gameId === 'lifeskills'
              ? `المهارات الحياتية · المرحلة ${level} من 6 · ${meta.skill}`
              : `${LEVEL_NAMES[level]} · ${meta.skill}`}
            {best ? ` · أفضل نتيجة: ${best}` : ''}
          </p>
        </div>
      </div>

      {gameId === 'memory' && <MemoryGame key={`memory-${attempt}`} {...props} />}
      {gameId === 'math' && <MathSprint key={`math-${attempt}`} {...props} />}
      {gameId === 'words' && <WordBuilder key={`words-${attempt}`} {...props} />}
      {gameId === 'matching' && <MatchingGame key={`matching-${attempt}`} {...props} />}
      {gameId === 'ordering' && <OrderingGame key={`ordering-${attempt}`} {...props} />}
      {gameId === 'values' && <ValuesGame key={`values-${attempt}`} {...props} />}
      {gameId === 'lifeskills' && <LifeSkillsGame key={`lifeskills-${attempt}`} {...props} />}
    </div>
  );
}
