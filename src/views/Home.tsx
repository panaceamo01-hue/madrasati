import { useEffect, useState, type CSSProperties } from 'react';
import { LESSONS, lessonsFor } from '../data';
import { GAMES } from '../data/games';
import { LEVEL_AGES, LEVEL_COLORS, LEVEL_NAMES, LEVEL_SOFT } from '../data/subjects';
import type { Level } from '../types';
import { switchProfile, todayMinutes, totalStars, todayKey } from '../lib/store';
import { triggerReminder } from '../lib/reminder';
import { useProgress } from '../lib/useProgress';
import { useProfiles } from '../lib/useProfiles';
import { InstallAppButton } from '../components/InstallAppButton';
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
  const { profiles, activeId } = useProfiles();
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
  const activeProfile = profiles.find((profile) => profile.id === activeId);
  const greetingName = progress.settings.childName || activeProfile?.name || '';
  const greeting = greetingName ? `مرحبًا ${greetingName}` : 'مرحبًا يا بطل';
  const dailyGoal = progress.settings.dailyGoalMinutes;
  const minutesToday = Math.round(todayMinutes(progress.activity));
  const goalReached = minutesToday >= dailyGoal;
  const goalPercent = Math.min(100, Math.round((minutesToday / dailyGoal) * 100));
  const [reminderVisible, setReminderVisible] = useState(false);

  // التذكير اللطيف: مرة واحدة في اليوم، بعد الرابعة مساء، فقط إذا لم
  // يكتمل هدف اليوم. يُسجَّل ظهوره فورًا حتى لا يتكرر في اليوم نفسه.
  useEffect(() => {
    if (triggerReminder()) setReminderVisible(true);
  }, []);

  return (
    <>
      {profiles.length > 1 && (
        <div className="profile-switcher" role="group" aria-label="من يتعلم الآن؟">
          <span className="profile-switcher-label">من يتعلم الآن؟</span>
          {profiles.map((profile) => (
            <button
              key={profile.id}
              className={`profile-chip${profile.id === activeId ? ' active' : ''}`}
              onClick={() => switchProfile(profile.id)}
              aria-pressed={profile.id === activeId}
            >
              <span aria-hidden="true">{profile.emoji}</span> {profile.name}
            </button>
          ))}
          <a className="profile-chip" href="#/leaderboard">
            🏆 الترتيب
          </a>
        </div>
      )}
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
            <InstallAppButton className="btn ghost big" />
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

      {reminderVisible && (
        <section className="reminder-banner" role="status" aria-label="تذكير لطيف بحصة اليوم">
          <span className="reminder-emoji" aria-hidden="true">
            🌤️
          </span>
          <div className="reminder-copy">
            <strong>حصة اليوم تنتظرك بلطف</strong>
            <p>
              لم نكمل هدف اليوم بعد ({minutesToday} من {dailyGoal} دقيقة). درس قصير يكفي، ولا ضغط أبدًا.
            </p>
          </div>
          <div className="reminder-actions">
            <a
              className="btn primary small"
              href={weekLesson ? `#/lesson/${encodeURIComponent(weekLesson.id)}` : `#/level/${activeLevel}`}
            >
              هيا نتعلم 🚀
            </a>
            <button className="btn ghost small" onClick={() => setReminderVisible(false)}>
              ليس الآن
            </button>
          </div>
        </section>
      )}

      <section className="daily-plan" aria-label="حصة اليوم">
        <div className="daily-head">
          <div>
            <p className="eyebrow">🗓️ حصة اليوم</p>
            <h2>{dailyDone === DAILY_ITEMS.length ? 'أتممت حصتك اليوم 🎉' : `بقيت ${DAILY_ITEMS.length - dailyDone} من ${DAILY_ITEMS.length} أنشطة`}</h2>
          </div>
          <span className="streak-pill">🔥 {daily.streak} يوم</span>
        </div>
        <div className="goal-box" aria-label="هدف التعلم اليومي">
          <div className="goal-head">
            <span>⏱️ هدف اليوم</span>
            <strong>
              {minutesToday} / {dailyGoal} دقيقة
            </strong>
          </div>
          <div className="progress candy goal-bar">
            <span style={{ width: `${goalPercent}%` }} />
          </div>
          <p className="goal-note">
            {goalReached
              ? 'أتممت هدف اليوم، أحسنت! 🎉'
              : `بقيت ${Math.max(0, dailyGoal - minutesToday)} دقيقة لإتمام هدف اليوم. خذ وقتك، كل دقيقة تعلم تُحسب.`}
          </p>
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

      <a className="wisdom-teaser" href="#/quran">
        <span className="wisdom-teaser-emoji" aria-hidden="true">
          📖
        </span>
        <span>
          <strong>حفظ القرآن</strong>
          <small>سور الحفظ المقررة — استمع، وردّد، وسجّل تلاوتك</small>
        </span>
        <span className="cta">افتح ←</span>
      </a>

      <a className="wisdom-teaser" href="#/leaderboard">
        <span className="wisdom-teaser-emoji" aria-hidden="true">
          🏆
        </span>
        <span>
          <strong>لوحة ترتيب العائلة</strong>
          <small>قارن نجوم الأبناء — وأضف ابنًا جديدًا من مساحة ولي الأمر</small>
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
