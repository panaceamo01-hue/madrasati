interface Props {
  emoji: string;
  title: string;
  score: number;
  best: number;
  newBest: boolean;
  onReplay: () => void;
}

export function GameResult({ emoji, title, score, best, newBest, onReplay }: Props) {
  return (
    <div className="result-screen">
      <span className="emoji" aria-hidden="true">
        {emoji}
      </span>
      <h2>{title}</h2>
      <div className="big-score">{score}</div>
      <p>{newBest ? '🎉 رقم قياسي جديد!' : `أفضل نتيجة لك: ${best}`}</p>
      <div className="game-actions">
        <button className="btn primary" onClick={onReplay}>
          أعد المحاولة
        </button>
        <a className="btn ghost" href="#/games">
          ألعاب أخرى
        </a>
      </div>
    </div>
  );
}
