import { useMemo, useState } from 'react';
import { EXAM_PAPERS, type ExamPaper } from '../data/exam-papers';
import { LEVEL_NAMES, SUBJECT_BY_ID } from '../data/subjects';
import type { Level, SubjectId } from '../types';
import { useProgress } from '../lib/useProgress';

const CYCLE_LABEL: Record<1 | 2, string> = {
  1: 'الدورة الأولى',
  2: 'الدورة الثانية',
};

const SUBJECT_ORDER: SubjectId[] = ['arabic', 'french', 'math', 'science', 'islamic', 'social'];

function formatSize(sizeKB: number): string {
  return sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
}

function PaperCard({
  paper,
  onOpen,
}: {
  paper: ExamPaper;
  onOpen: (paper: ExamPaper) => void;
}) {
  const url = `/exams/${paper.file}`;
  return (
    <div className="paper-card">
      <div className="paper-title">{paper.title}</div>
      <div className="paper-meta">
        <span className="hud-pill">{SUBJECT_BY_ID[paper.subject].name}</span>
        <span className="hud-pill">{CYCLE_LABEL[paper.cycle]}</span>
        {paper.year !== null && <span className="hud-pill">{paper.year}</span>}
        <span className="hud-pill">{paper.pages} {paper.pages === 1 ? 'صفحة' : 'صفحات'}</span>
        <span className="hud-pill">{formatSize(paper.sizeKB)}</span>
      </div>
      <div className="paper-actions">
        <button className="btn primary small" onClick={() => onOpen(paper)}>
          📄 عرض الورقة
        </button>
        <a className="btn ghost small" href={url} download={paper.file}>
          ⬇️ تحميل PDF
        </a>
      </div>
      <p className="paper-source">المصدر: {paper.source}</p>
    </div>
  );
}

/** خانة نماذج الفروض والامتحانات: أوراق PDF حقيقية حسب المستوى والمادة. */
export function ExamsView() {
  const progress = useProgress();
  const defaultLevel: Level =
    progress.settings.parentLock && progress.settings.childLevel
      ? progress.settings.childLevel
      : 6;
  const [level, setLevel] = useState<Level>(defaultLevel);
  const [subject, setSubject] = useState<SubjectId | 'all'>('all');
  const [open, setOpen] = useState<ExamPaper | null>(null);

  const levelPapers = useMemo(() => EXAM_PAPERS.filter((paper) => paper.level === level), [level]);
  const subjectsInLevel = useMemo(
    () => SUBJECT_ORDER.filter((id) => levelPapers.some((paper) => paper.subject === id)),
    [levelPapers],
  );
  const visible = useMemo(
    () => (subject === 'all' ? levelPapers : levelPapers.filter((paper) => paper.subject === subject)),
    [levelPapers, subject],
  );
  const furud = visible.filter((paper) => paper.kind === 'fard');
  const mahalli = visible.filter((paper) => paper.kind === 'muwahad-mahalli');
  const iqlimi = visible.filter((paper) => paper.kind === 'muwahad-iqlimi');

  const bySubject = (papers: ExamPaper[]) =>
    subjectsInLevel
      .map((id) => ({ id, papers: papers.filter((paper) => paper.subject === id) }))
      .filter((group) => group.papers.length > 0);

  return (
    <div className="game-shell">
      <div className="page-head">
        <a className="back-link" href="#/">
          → الرئيسية
        </a>
        <div className="page-title">
          <h1>📝 نماذج الفروض والامتحانات</h1>
          <p>
            أوراق حقيقية بصيغة PDF — {EXAM_PAPERS.length} نموذجًا: فروض لكل مستوى،
            وامتحانات موحدة (محلية وإقليمية) للمستوى السادس.
          </p>
        </div>
      </div>

      {open && (
        <section className="pdf-viewer" aria-label={`عرض: ${open.title}`}>
          <div className="pdf-viewer-head">
            <strong>{open.title}</strong>
            <div className="game-actions">
              <a className="btn ghost small" href={`/exams/${open.file}`} download={open.file}>
                ⬇️ تحميل
              </a>
              <a
                className="btn ghost small"
                href={`/exams/${open.file}`}
                target="_blank"
                rel="noreferrer"
              >
                فتح في تبويب جديد ↗
              </a>
              <button className="btn ghost small" onClick={() => setOpen(null)}>
                ✕ إغلاق
              </button>
            </div>
          </div>
          <iframe
            className="pdf-frame"
            src={`/exams/${open.file}`}
            title={`ورقة: ${open.title}`}
          />
        </section>
      )}

      <div className="exams-tabs" role="tablist" aria-label="اختر المستوى">
        {([1, 2, 3, 4, 5, 6] as Level[]).map((value) => {
          const count = EXAM_PAPERS.filter((paper) => paper.level === value).length;
          return (
            <button
              key={value}
              role="tab"
              aria-selected={level === value}
              className={`lesson-tab${level === value ? ' active' : ''}`}
              onClick={() => {
                setLevel(value);
                setSubject('all');
                setOpen(null);
              }}
            >
              {LEVEL_NAMES[value]}
              <small>{count}</small>
            </button>
          );
        })}
      </div>

      <div className="exams-filter" aria-label="تصفية حسب المادة">
        <button
          className={`hud-pill${subject === 'all' ? ' active' : ''}`}
          onClick={() => setSubject('all')}
        >
          كل المواد ({levelPapers.length})
        </button>
        {subjectsInLevel.map((id) => (
          <button
            key={id}
            className={`hud-pill${subject === id ? ' active' : ''}`}
            onClick={() => setSubject(id)}
          >
            {SUBJECT_BY_ID[id].name} ({levelPapers.filter((paper) => paper.subject === id).length})
          </button>
        ))}
      </div>

      {furud.length > 0 && (
        <section aria-label="فروض">
          <div className="section-head">
            <h2>📝 فروض {LEVEL_NAMES[level]}</h2>
          </div>
          {bySubject(furud).map((group) => (
            <div key={group.id} className="exams-group">
              <h3 style={{ borderInlineStart: `5px solid ${SUBJECT_BY_ID[group.id].color}` }}>
                {SUBJECT_BY_ID[group.id].name} ({group.papers.length})
              </h3>
              <div className="papers-grid">
                {group.papers.map((paper) => (
                  <PaperCard key={paper.file} paper={paper} onOpen={setOpen} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {(mahalli.length > 0 || iqlimi.length > 0) && (
        <section aria-label="امتحانات موحدة">
          <div className="section-head">
            <h2>🏛️ امتحانات موحدة — {LEVEL_NAMES[level]}</h2>
          </div>
          {mahalli.length > 0 && (
            <div className="exams-group">
              <h3>الامتحان الموحد المحلي — دورة يناير ({mahalli.length})</h3>
              <div className="papers-grid">
                {mahalli.map((paper) => (
                  <PaperCard key={paper.file} paper={paper} onOpen={setOpen} />
                ))}
              </div>
            </div>
          )}
          {iqlimi.length > 0 && (
            <div className="exams-group">
              <h3>الامتحان الموحد الإقليمي — دورة يونيو ({iqlimi.length})</h3>
              <div className="papers-grid">
                {iqlimi.map((paper) => (
                  <PaperCard key={paper.file} paper={paper} onOpen={setOpen} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {visible.length === 0 && (
        <p className="license-note">لا توجد نماذج بهذا التصفية بعد.</p>
      )}

      <p className="license-note">
        نماذج حقيقية منشورة (المصادر: babobi.ma وarchive.org وغيرهما). تُفتح الأوراق عند
        الطلب وتُحفظ بعدها للعمل دون إنترنت.
      </p>
    </div>
  );
}
