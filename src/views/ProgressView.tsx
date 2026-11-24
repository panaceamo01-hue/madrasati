import type { Level } from '../types';
import { LESSONS, lessonsFor } from '../data';
import { GAMES } from '../data/games';
import { LEVEL_COLORS, LEVEL_NAMES, LEVELS } from '../data/subjects';
import { totalStars } from '../lib/store';
import { useProgress } from '../lib/useProgress';

interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  earned: boolean;
}

const RANKS = [
  { min: 0, title: 'مستكشف صغير', emoji: '🐣' },
  { min: 5, title: 'تلميذ نشيط', emoji: '🐛' },
  { min: 15, title: 'بطل التعلّم', emoji: '🦋' },
  { min: 30, title: 'قائد المغامرة', emoji: '🚀' },
  { min: 50, title: 'نجم مدرستي', emoji: '🏆' },
];

export function ProgressView() {
  const progress = useProgress();
  const stars = totalStars(progress.stars);
  const completed = Object.keys(progress.stars).length;
  const gamesPlayed = Object.keys(progress.gameBest).length;
  const perfect = Object.values(progress.stars).filter((value) => value === 3).length;

  const allOfLevel = (level: Level) =>
    lessonsFor(level).every((lesson) => (progress.stars[lesson.id] ?? 0) > 0);
  const mathDone = LESSONS.filter((lesson) => lesson.subject === 'math').every(
    (lesson) => (progress.stars[lesson.id] ?? 0) > 0,
  );
  const highScore = Math.max(0, ...Object.values(progress.gameBest));

  const rank = [...RANKS].reverse().find((item) => completed >= item.min) ?? RANKS[0];
  const nextRank = RANKS.find((item) => item.min > completed);

  const badges: Badge[] = [
    { id: 'first', icon: '🌱', name: 'البداية', description: 'أكمل درسًا واحدًا', earned: completed >= 1 },
    { id: 'five', icon: '📖', name: 'قارئ نشيط', description: 'أكمل 5 دروس', earned: completed >= 5 },
    { id: 'fifteen', icon: '🏅', name: 'مثابر', description: 'أكمل 15 درسًا', earned: completed >= 15 },
    { id: 'level1', icon: '🥇', name: 'بطل المستوى الأول', description: 'أكمل كل دروس المستوى الأول', earned: allOfLevel(1) },
    { id: 'math', icon: '🔢', name: 'عاشق الرياضيات', description: 'أكمل كل دروس الرياضيات', earned: mathDone },
    { id: 'gamer', icon: '🎮', name: 'لاعب محترف', description: 'احصل على 100 نقطة في لعبة', earned: highScore >= 100 },
    { id: 'perfect', icon: '🌟', name: 'نجم الكمال', description: 'احصل على 3 نجوم في 10 دروس', earned: perfect >= 10 },
    { id: 'stars100', icon: '💫', name: 'نجم النجوم', description: 'اجمع 100 نجمة', earned: stars >= 100 },
  ];

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="avatar" aria-hidden="true">
          🦸
          <span className="avatar-glow" />
        </div>
        <div className="profile-copy">
          <p className="eyebrow">ملفي الشخصي</p>
          <h1>{rank.title}</h1>
          <p className="profile-sub">
            {rank.emoji} رتبتك الآن · {completed} درسًا من {LESSONS.length}
          </p>
          {nextRank && (
            <p className="profile-next">
              تبقّى {nextRank.min - completed} درسًا للوصول إلى «{nextRank.title}»
            </p>
          )}
          <div className="profile-links">
            <a className="btn ghost small" href="#/games">
              🎮 ألعابي
            </a>
            <a className="btn ghost small" href="#/settings">
              ⚙️ الإعدادات
            </a>
          </div>
        </div>
      </section>

      <div className="summary-strip kid-stats">
        <div className="summary-tile">
          <div className="value">⭐ {stars}</div>
          <div className="label">نجمة محصّلة</div>
        </div>
        <div className="summary-tile">
          <div className="value">{completed}</div>
          <div className="label">درسًا مكتملًا</div>
        </div>
        <div className="summary-tile">
          <div className="value">{perfect}</div>
          <div className="label">درسًا بثلاث نجوم</div>
        </div>
        <div className="summary-tile">
          <div className="value">
            {gamesPlayed}/{GAMES.length * LEVELS.length}
          </div>
          <div className="label">لعبة بمستوى</div>
        </div>
      </div>

      <div className="section-head">
        <h2>🗺️ تقدّمي حسب المستوى</h2>
      </div>
      <div className="progress-grid">
        {LEVELS.map((level) => {
          const levelLessons = lessonsFor(level);
          const levelStars = levelLessons.reduce((sum, lesson) => sum + (progress.stars[lesson.id] ?? 0), 0);
          const max = levelLessons.length * 3;
          const percent = max ? Math.round((levelStars / max) * 100) : 0;
          return (
            <a className="progress-card" href={`#/level/${level}`} key={level} style={{ color: 'inherit' }}>
              <h3>
                <span>{LEVEL_NAMES[level]}</span>
                <span className="num">{percent}%</span>
              </h3>
              <div className="progress candy">
                <span style={{ width: `${percent}%`, background: LEVEL_COLORS[level] }} />
              </div>
            </a>
          );
        })}
      </div>

      <div className="section-head">
        <h2>🏅 الأوسمة</h2>
        <p>
          فُتح منها {badges.filter((badge) => badge.earned).length} من {badges.length}
        </p>
      </div>
      <div className="badge-grid">
        {badges.map((badge) => (
          <div className={`badge${badge.earned ? ' earned' : ''}`} key={badge.id}>
            <span className="icon" aria-hidden="true">
              {badge.icon}
            </span>
            <strong>{badge.name}</strong>
            <small>{badge.description}</small>
          </div>
        ))}
      </div>

      <p className="profile-note">🔒 كل تقدمك محفوظ على جهازك فقط، بدون حساب ولا إنترنت.</p>
    </div>
  );
}
