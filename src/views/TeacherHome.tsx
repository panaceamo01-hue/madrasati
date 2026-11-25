import { useMemo, useState } from 'react';
import { lessonsFor } from '../data';
import { OFFICIAL_FICHES } from '../data/teacher-fiches';
import { LEVEL_NAMES, LEVELS, SUBJECTS } from '../data/subjects';
import type { Level, SubjectId } from '../types';

/** مساحة الأستاذ(ة): تصفح الدروس حسب المادة والمستوى، وفتح جذاذة كل درس أو لعبته. */
export function TeacherHome() {
  const [level, setLevel] = useState<Level>(6);
  const [subject, setSubject] = useState<SubjectId | 'all'>('all');
  const [query, setQuery] = useState('');

  const lessons = useMemo(() => {
    const base = lessonsFor(level, subject === 'all' ? undefined : subject);
    const text = query.trim();
    if (!text) return base;
    return base.filter((lesson) => lesson.title.includes(text));
  }, [level, subject, query]);

  return (
    <>
      <div className="page-head">
        <div className="page-title">
          <h1>👩‍🏫 مساحة الأستاذ(ة)</h1>
          <p>
            جذاذات وألعاب خفيفة للدروس — اختر المادة والمستوى، ثم افتح جذاذة الدرس أو العب
            لعبته في القسم.
          </p>
        </div>
      </div>

      <div className="level-tabs" role="tablist" aria-label="مستوى الدرس">
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

      <div className="parent-levels" role="group" aria-label="المادة">
        <button
          className={`parent-level${subject === 'all' ? ' active' : ''}`}
          onClick={() => setSubject('all')}
          aria-pressed={subject === 'all'}
        >
          <strong>كل المواد</strong>
        </button>
        {SUBJECTS.map((item) => (
          <button
            key={item.id}
            className={`parent-level${subject === item.id ? ' active' : ''}`}
            onClick={() => setSubject(item.id)}
            aria-pressed={subject === item.id}
          >
            <strong>
              {item.emoji} {item.name}
            </strong>
          </button>
        ))}
      </div>

      <label className="field teacher-search" htmlFor="teacher-search">
        <span>ابحث عن درس</span>
        <input
          id="teacher-search"
          className="license-input"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="مثال: نصب المضارع"
          aria-label="ابحث عن درس"
        />
      </label>

      <p className="license-note">
        {lessons.length} درسًا في {LEVEL_NAMES[level]}
        {subject !== 'all' ? ` · ${SUBJECTS.find((item) => item.id === subject)?.name}` : ''}
      </p>

      <div className="teacher-lessons">
        {lessons.map((lesson) => {
          const meta = SUBJECTS.find((item) => item.id === lesson.subject);
          return (
            <div className="teacher-lesson" key={lesson.id}>
              <span className="emoji" aria-hidden="true">
                {lesson.emoji}
              </span>
              <div className="teacher-lesson-info">
                <strong>{lesson.title}</strong>
                <small>
                  {meta?.emoji} {meta?.name} · {LEVEL_NAMES[lesson.level]}
                </small>
                {OFFICIAL_FICHES[lesson.id] && (
                  <span className="fiche-official-badge">📖 جذاذة رسمية</span>
                )}
              </div>
              <div className="teacher-lesson-actions">
                <a className="btn ghost small" href={`#/teacher/lesson/${lesson.id}`}>
                  📄 الجذاذة
                </a>
                <a className="btn primary small" href={`#/teacher/game/${lesson.id}`}>
                  🎮 لعبة الدرس
                </a>
              </div>
            </div>
          );
        })}
        {lessons.length === 0 && (
          <p className="license-note">لا توجد دروس مطابقة لهذا البحث.</p>
        )}
      </div>
    </>
  );
}
