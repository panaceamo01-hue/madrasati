import type { CSSProperties } from 'react';
import { LESSONS, lessonsFor } from '../data';
import { GAMES } from '../data/games';
import { LEVEL_AGES, LEVEL_COLORS, LEVEL_NAMES, LEVEL_SOFT } from '../data/subjects';
import type { Level } from '../types';
import { totalStars, todayKey } from '../lib/store';
import { useProgress } from '../lib/useProgress';
import { levelUnlocked, levelStatus, nextLessonFor, visibleLevels } from '../lib/unlock';

const LEVEL_EMOJI: Record<Level, string> = {
  1: '🐣',
  2: '🐛',
  3: '🦋',
  4: '🚀',
  5: '🌟',
  6: '🏆',
};

const DAILY_ITEMS = [
  { id: 'teach', emoji: '📘', label: 'الشرح' },
  { id: 'practice', emoji: '✏️', label: 'التمارين' },
  { id: 'game', emoji: '🎮', label: 'لعبة' },
  { id: 'wisdom', emoji: '💡', label: 'حكمة اليوم' },
];

export function Home() {
  const progress = useProgress();
  const stars = totalStars(progress.stars);
  const levels = visibleLevels(progress.settings);
  const activeLevel: Level =
    progress.settings.parentLock && progress.settings.childLevel
      ? progress.settings.childLevel
      : (levels.find((level) => levelUnlocked(level, progress.stars, progress.exams, progress.settings) && levelStatus(level, progress.stars).done < lessonsFor(level).length) ??
        levels[0]);
  const weekLesson = nextLessonFor(activeLevel, progress.stars);
  const daily = progress.daily;
  const today = todayKey();
  const todayItems = daily.lastDate === today ? daily.today : [];
  const dailyDone = DAILY_ITEMS.filter((item) => todayItems.includes(item.id)).length;
  const greeting = progress.settings.childName
    ? `مرحبًا ${progress.settings.childName}`
    : 'مرحبًا يا بطل';

  return (
    <>
      <section className="hero kid-hero">
        <div className="hero-copy">
          <p className="eyebrow">{greeting} 👋</p>
          <h1>
            هيّا نتعلّم <span className="wobble">ونلعب</span>!
          </h1>
          <p className="lede">
            درس هذا الأسبوع + أربع حصص يومية قصيرة: شرح، تمارين، لعبة، وحكمة اليوم.
          </p>
          <div className="hero-actions">
            <a className="btn primary big" href={weekLesson ? `#/lesson/${encodeURIComponent(weekLesson.id)}` : `#/level/${activeLevel}`}>
              {weekLesson ? 'أكمل درس الأسبوع 🚀' : 'راجع مستوى هذا الأسبوع 🚀'}
            </a>
            <a className="btn ghost big" href="#/games">
              🎮 ألعاب الذكاء
            </a>
          </div>
          <div className="hero-facts">
            <span>
              <strong>{LESSONS.length}</strong> درسًا
            </span>
            <span>
              <strong>{GAMES.length}</strong> ألعاب
            </span>
            <span>
              <strong>{stars}</strong> نجمة
            </span>
            <span>🔥 <strong>{daily.streak}</strong> يوم تتابع</span>
          </div>
        </div>
        <div className="hero-art kid-art" aria-hidden="true">
          <span className="sticker s1">📖</span>
          <span className="sticker s2">🔢</span>
          <span className="sticker s3">🧠</span>
          <span className="sticker s4">🎨</span>
          <span className="sticker s5">⚽</span>
          <span className="sticker s6">⭐</span>
          <span className="blob" />
        </div>
      </section>

      <section className="daily-plan" aria-label="حصة اليوم">
        <div className="daily-head">
          <div>
            <p className="eyebrow">🗓️ حصة اليوم</p>
            <h2>{dailyDone === DAILY_ITEMS.length ? 'أتممت حصتك اليوم 🎉' : `بقيت ${DAILY_ITEMS.length - dailyDone} من ${DAILY_ITEMS.length} أنشطة`}</h2>
          </div>
          <span className="streak-pill">🔥 {daily.streak} يوم</span>
        </div>
        <div className="daily-items">
          {DAILY_ITEMS.map((item) => (
            <span key={item.id} className={`daily-item${todayItems.includes(item.id) ? ' done' : ''}`}>
              <span aria-hidden="true">{item.emoji}</span> {item.label}
              {todayItems.includes(item.id) && <span aria-hidden="true"> ✓</span>}
            </span>
          ))}
        </div>
        <p className="daily-hint">
          درس الأسبوع: <strong>{weekLesson ? weekLesson.title : 'راجع دروسك المنجزة'}</strong> — أكمله على مدى
          الأسبوع، وكل يوم نشاط صغير واحد. لا ينتقل التطبيق إلى درس جديد قبل إتمام التمارين.
        </p>
      </section>

      <div className="section-head">
        <h2>{progress.settings.parentLock && progress.settings.childLevel ? '📚 مستوى ابني' : '🗺️ رحلتك عبر المستويات'}</h2>
        <a href="#/progress" className="cta">
          ملفي الشخصي ←
        </a>
      </div>

      <section className="level-grid kid-levels">
        {levels.map((level) => {
          const status = levelStatus(level, progress.stars);
          const unlocked = levelUnlocked(level, progress.stars, progress.exams, progress.settings);
          const style = {
            '--level-color': LEVEL_COLORS[level],
            '--level-soft': LEVEL_SOFT[level],
          } as CSSProperties;
          if (!unlocked) {
            return (
              <div className="level-card kid-level locked" style={style} key={level} aria-disabled="true">
                <span className="level-emoji" aria-hidden="true">
                  {LEVEL_EMOJI[level]}
                </span>
                <div className="level-top">
                  <span className="level-num">🔒</span>
                  <div>
                    <h3>{LEVEL_NAMES[level]}</h3>
                    <span className="age">{LEVEL_AGES[level]}</span>
                  </div>
                </div>
                <p className="locked-note">أكمل كل دروس {LEVEL_NAMES[(level - 1) as Level]} أولًا.</p>
              </div>
            );
          }
          return (
            <a className="level-card kid-level" href={`#/level/${level}`} style={style} key={level}>
              <span className="level-emoji" aria-hidden="true">
                {LEVEL_EMOJI[level]}
              </span>
              <div className="level-top">
                <span className="level-num">{level}</span>
                <div>
                  <h3>{LEVEL_NAMES[level]}</h3>
                  <span className="age">{LEVEL_AGES[level]}</span>
                </div>
              </div>
              <div className="level-meta">
                <span>{status.done} / {status.lessons.length} درسًا</span>
                <span>·</span>
                <span>{status.stars} ⭐</span>
              </div>
              <div className="progress candy">
                <span style={{ width: `${status.percent}%` }} />
              </div>
              <div className="progress-label">
                <span>{status.complete ? '🎉 مكتمل' : `${status.percent}%`}</span>
              </div>
            </a>
          );
        })}
      </section>

      {!progress.settings.parentLock && (
        <a className="parent-teaser" href="#/parent">
          <span className="parent-teaser-emoji" aria-hidden="true">👨‍👩‍👧</span>
          <span>
            <strong>نافذة ولي الأمر</strong>
            <small>اختر مستوى ابنك، ويكتفي التطبيق به وحده.</small>
          </span>
          <span className="cta">افتح ←</span>
        </a>
      )}

      <a className="wisdom-teaser" href="#/wisdom">
        <span className="wisdom-teaser-emoji" aria-hidden="true">
          💡
        </span>
        <span>
          <strong>حكمة اليوم وآية وحديث</strong>
          <small>حكمة وآية وحديث مع معناها — وتحدّي الحفظ</small>
        </span>
        <span className="cta">افتح ←</span>
      </a>

      <div className="section-head">
        <h2>🎮 ألعاب سريعة</h2>
        <a href="#/games" className="cta">
          كل الألعاب ←
        </a>
      </div>

      <section className="game-strip">
        {GAMES.map((game) => (
          <a className="mini-game" href={`#/game/${game.id}/1`} key={game.id}>
            <span className="emoji" aria-hidden="true">
              {game.emoji}
            </span>
            <span>
              <strong>{game.name}</strong>
              <small>{game.skill}</small>
            </span>
          </a>
        ))}
      </section>
    </>
  );
}
