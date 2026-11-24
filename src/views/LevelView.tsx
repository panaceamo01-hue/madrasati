import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Level, SubjectId } from '../types';
import { lessonsFor } from '../data';
import { lessonVideo } from '../data/videos';
import { GAMES } from '../data/games';
import {
  LEVEL_AGES,
  LEVEL_COLORS,
  LEVEL_NAMES,
  LEVEL_SOFT,
  SUBJECTS,
  SUBJECT_BY_ID,
} from '../data/subjects';
import { useProgress } from '../lib/useProgress';
import { lessonUnlocked, levelUnlocked } from '../lib/unlock';
import { examKeyLevel, examPassed } from '../lib/exam';
import { Stars } from '../components/Stars';

const LEVEL_EMOJI: Record<Level, string> = {
  1: '🐣',
  2: '🐛',
  3: '🦋',
  4: '🚀',
  5: '🌟',
  6: '🏆',
};

export function LevelView({ level }: { level: Level }) {
  const progress = useProgress();
  const [filter, setFilter] = useState<SubjectId | 'all'>('all');

  const lessons = useMemo(() => lessonsFor(level), [level]);
  const subjects = SUBJECTS.filter((subject) => lessons.some((lesson) => lesson.subject === subject.id));
  const visible = filter === 'all' ? lessons : lessons.filter((lesson) => lesson.subject === filter);

  const stars = lessons.reduce((sum, lesson) => sum + (progress.stars[lesson.id] ?? 0), 0);
  const max = lessons.length * 3;
  const percent = max ? Math.round((stars / max) * 100) : 0;
  const done = lessons.filter((lesson) => (progress.stars[lesson.id] ?? 0) > 0).length;

  const pageStyle = {
    '--level-color': LEVEL_COLORS[level],
    '--level-soft': LEVEL_SOFT[level],
  } as CSSProperties;

  const allowed =
    levelUnlocked(level, progress.stars, progress.exams, progress.settings) &&
    (!progress.settings.parentLock ||
      progress.settings.childLevel === null ||
      level <= progress.settings.childLevel);

  if (!allowed) {
    return (
      <div style={pageStyle} className="level-page">
        <div className="page-head">
          <a className="back-link" href="#/">
            ← المستويات
          </a>
        </div>
        <div className="locked-page">
          <span className="locked-emoji" aria-hidden="true">
            🔒
          </span>
          <h1>{LEVEL_NAMES[level]}</h1>
          <p>
            {progress.settings.parentLock && progress.settings.childLevel !== level
              ? 'هذا المستوى مخفي في وضع ولي الأمر. انتقل إلى مستوى ابنك.'
              : `يُفتح هذا المستوى بعد إتمام كل دروس ${LEVEL_NAMES[(level - 1) as Level]} والنجاح في اختباره.`}
          </p>
          <a className="btn primary" href="#/">
            العودة إلى المستويات
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle} className="level-page">
      <div className="page-head">
        <a className="back-link" href="#/">
          ← المستويات
        </a>
        <div className="page-title level-title">
          <span className="level-hero-emoji" aria-hidden="true">
            {LEVEL_EMOJI[level]}
          </span>
          <div>
            <h1>{LEVEL_NAMES[level]}</h1>
            <p>
              {LEVEL_AGES[level]} · {done} من {lessons.length} درسًا منجزة · {stars} من {max} نجمة
            </p>
          </div>
        </div>
      </div>

      <div className="progress candy" style={{ marginBottom: 6 }}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <div className="progress-label" style={{ marginBottom: 18 }}>
        <span>تقدّمك في هذا المستوى</span>
        <span>{percent}%</span>
      </div>

      <div className="chips" role="tablist" aria-label="المواد">
        <button
          className={`chip${filter === 'all' ? ' active' : ''}`}
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          كل المواد
        </button>
        {subjects.map((subject) => (
          <button
            key={subject.id}
            className={`chip${filter === subject.id ? ' active' : ''}`}
            onClick={() => setFilter(subject.id)}
            aria-pressed={filter === subject.id}
          >
            <span aria-hidden="true">{subject.emoji}</span>
            {subject.name}
          </button>
        ))}
      </div>

      <section className="lesson-grid kid-lessons">
        {visible.map((lesson, position) => {
          const meta = SUBJECT_BY_ID[lesson.subject];
          const earned = progress.stars[lesson.id] ?? 0;
          const unlocked = lessonUnlocked(lesson, progress.stars, progress.exams);
          const cardStyle = {
            '--subject-color': meta.color,
            '--subject-soft': meta.soft,
          } as CSSProperties;
          if (!unlocked) {
            return (
              <div className="lesson-card kid-lesson locked" key={lesson.id} style={cardStyle} aria-disabled="true">
                <span className="lesson-index" aria-hidden="true">
                  {position + 1}
                </span>
                <div className="lesson-top">
                  <span className="lesson-emoji" aria-hidden="true">
                    🔒
                  </span>
                  <div>
                    <span className="subject-tag">
                      {meta.emoji} {meta.name}
                    </span>
                    <h3>{lesson.title}</h3>
                  </div>
                </div>
                <p className="objective">أكمل الدرس السابق واجتز اختباره لتفتح هذا الدرس.</p>
              </div>
            );
          }
          return (
            <a
              className="lesson-card kid-lesson"
              href={`#/lesson/${encodeURIComponent(lesson.id)}`}
              key={lesson.id}
              style={cardStyle}
            >
              <span className="lesson-index" aria-hidden="true">
                {position + 1}
              </span>
              <div className="lesson-top">
                <span className="lesson-emoji" aria-hidden="true">
                  {lesson.emoji}
                </span>
                <div>
                  <span className="subject-tag">
                    {meta.emoji} {meta.name}
                  </span>
                  <h3>{lesson.title}</h3>
                </div>
              </div>
              <p className="objective">{lesson.objective}</p>
              <div className="lesson-foot">
                <Stars value={earned} />
                {lessonVideo(lesson.id) && progress.settings.videosEnabled && (
                  <span className="cta" title="هذا الدرس فيه فيديو شرح">🎥 فيديو</span>
                )}
                <span className="cta">{earned ? 'راجع ←' : 'ابدأ ←'}</span>
              </div>
            </a>
          );
        })}
      </section>

      {(() => {
        const complete = lessons.length > 0 && done === lessons.length;
        const certified = examPassed(progress.exams, examKeyLevel(level));
        if (complete) {
          return (
            <a className={`exam-card${certified ? ' certified' : ''}`} href={`#/exam/level/${level}`}>
              <span className="exam-card-emoji" aria-hidden="true">
                {certified ? '🏅' : '🎯'}
              </span>
              <span className="exam-card-text">
                <strong>{certified ? 'ناجح في اختبار المستوى' : 'اختبار المستوى جاهز'}</strong>
                <small>
                  {certified
                    ? `أفضل نتيجة: ${progress.exams[examKeyLevel(level)]}% · يمكنك الإعادة لتحسين النتيجة`
                    : `أكملت كل الدروس: اجتز الاختبار لتفتح ${level < 6 ? LEVEL_NAMES[(level + 1) as Level] : 'شهادة الصف السادس'}`}
                </small>
              </span>
              <span className="exam-card-cta">{certified ? 'أعد ←' : 'ابدأ ←'}</span>
            </a>
          );
        }
        return (
          <div className="exam-card locked-exam" aria-disabled="true">
            <span className="exam-card-emoji" aria-hidden="true">
              🔒
            </span>
            <span className="exam-card-text">
              <strong>اختبار المستوى</strong>
              <small>يُفتح بعد إكمال كل دروس المستوى ({done}/{lessons.length})، وهو شرط الانتقال إلى المستوى التالي.</small>
            </span>
          </div>
        );
      })()}

      <div className="section-head">
        <h2>🎮 العب في هذا المستوى</h2>
      </div>
      <section className="game-strip">
        {GAMES.map((game) => (
          <a className="mini-game" href={`#/game/${game.id}/${level}`} key={game.id}>
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
    </div>
  );
}
