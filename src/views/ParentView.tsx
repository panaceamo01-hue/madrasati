import { useState } from 'react';
import { LEVEL_AGES, LEVEL_NAMES, LEVELS } from '../data/subjects';
import type { Level } from '../types';
import { DAILY_GOAL_OPTIONS, setSetting } from '../lib/store';
import {
  notificationPermission,
  requestReminderPermission,
  type NotificationState,
} from '../lib/reminder';
import { useProgress } from '../lib/useProgress';
import { subjectProgress, weekReport, weekTotals } from '../lib/report';

export function ParentView() {
  const progress = useProgress();
  const settings = progress.settings;
  const [gate, setGate] = useState('');
  const [verified, setVerified] = useState(false);
  const [name, setName] = useState(settings.childName);
  const [level, setLevel] = useState<Level | null>(settings.childLevel);
  const [locked, setLocked] = useState(settings.parentLock);
  const [fromFirst, setFromFirst] = useState(settings.startFromFirst);
  const [goal, setGoal] = useState(settings.dailyGoalMinutes);
  const [reminder, setReminder] = useState(settings.reminderEnabled);
  const [notifState, setNotifState] = useState<NotificationState>(() => notificationPermission());
  const [saved, setSaved] = useState(false);

  if (!verified) {
    return (
      <div className="parent-page">
        <div className="page-head">
          <a className="back-link" href="#/">
            ← الرئيسية
          </a>
          <h1>👨‍👩‍👧 مساحة ولي الأمر</h1>
          <p>هذه النافذة مخصصة للآباء والأمهات. أجب عن السؤال للمتابعة.</p>
        </div>
        <div className="parent-gate">
          <p>كم يساوي 7 + 5 ؟</p>
          <div className="gate-row">
            <input
              type="number"
              inputMode="numeric"
              value={gate}
              onChange={(event) => setGate(event.target.value)}
              aria-label="ناتج 7 زائد 5"
              placeholder="الجواب"
            />
            <button
              className="btn primary"
              onClick={() => {
                if (Number(gate) === 12) setVerified(true);
              }}
            >
              دخول
            </button>
          </div>
          {gate !== '' && Number(gate) !== 12 && <p className="gate-error">الجواب غير صحيح.</p>}
        </div>
      </div>
    );
  }

  function save() {
    setSetting('childName', name.trim());
    setSetting('childLevel', level);
    setSetting('parentLock', locked && level !== null);
    setSetting('startFromFirst', fromFirst && level !== null);
    setSetting('dailyGoalMinutes', goal);
    setSetting('reminderEnabled', reminder);
    setSaved(true);
  }

  return (
    <div className="parent-page">
      <div className="page-head">
        <a className="back-link" href="#/">
          ← الرئيسية
        </a>
        <h1>👨‍👩‍👧 مساحة ولي الأمر</h1>
        <p>حدّد مستوى ابنك الدراسي، فيكتفي التطبيق به وحده ويعرض دروسه بالتسلسل.</p>
      </div>

      <section className="parent-card">
        <label className="field">
          <span>اسم الطفل (اختياري)</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="مثال: يوسف"
          />
        </label>

        <div className="field">
          <span>المستوى الدراسي</span>
          <div className="parent-levels">
            {LEVELS.map((item) => (
              <button
                key={item}
                className={`parent-level${level === item ? ' active' : ''}`}
                onClick={() => setLevel(item)}
                aria-pressed={level === item}
              >
                <strong>{item}</strong>
                <small>{LEVEL_NAMES[item]}</small>
                <small>{LEVEL_AGES[item]}</small>
              </button>
            ))}
          </div>
        </div>

        {level !== null && (
          <div className="start-choice">
            <p className="start-title">هل يريد ابنك أن يبدأ من المستوى الأول؟</p>
            <p className="start-hint">
              {fromFirst
                ? `ستُفتح له المستويات 1 ← ${level} واحدًا بعد الآخر، مع بقاء دروس كل مستوى بالتسلسل.`
                : `سيدخل مباشرة إلى ${LEVEL_NAMES[level]} دون المستويات السابقة.`}
            </p>
            <div className="start-options">
              <button
                className={`start-opt${fromFirst ? '' : ' active'}`}
                onClick={() => setFromFirst(false)}
                aria-pressed={!fromFirst}
              >
                <strong>دروس مستواه فقط</strong>
                <small>يبدأ من مستوى {level}</small>
              </button>
              <button
                className={`start-opt${fromFirst ? ' active' : ''}`}
                onClick={() => setFromFirst(true)}
                aria-pressed={fromFirst}
              >
                <strong>نعم، من المستوى الأول</strong>
                <small>تُفتح المستويات 1 ← {level}</small>
              </button>
            </div>
          </div>
        )}

        <label className="switch-row">
          <input
            type="checkbox"
            checked={locked}
            onChange={(event) => setLocked(event.target.checked)}
            disabled={level === null}
          />
          <span>
            <strong>القصر على مستوى ابني</strong>
            <small>عند التفعيل لا تظهر إلا مستويات ابنك: من الأول حتى مستواه إن اخترت البدء من الأول، أو مستواه وحده.</small>
          </span>
        </label>

        <div className="field">
          <span>⏱️ هدف التعلم اليومي</span>
          <p className="start-hint">
            تُحسب الدقائق فقط أثناء الدرس أو الاختبار، وتتوقف عند إخفاء الصفحة. الهدف للتشجيع،
            وليس للضغط.
          </p>
          <div className="parent-levels">
            {DAILY_GOAL_OPTIONS.map((minutes) => (
              <button
                key={minutes}
                className={`parent-level${goal === minutes ? ' active' : ''}`}
                onClick={() => setGoal(minutes)}
                aria-pressed={goal === minutes}
              >
                <strong>{minutes}</strong>
                <small>دقيقة في اليوم</small>
              </button>
            ))}
          </div>
        </div>

        <label className="switch-row">
          <input
            type="checkbox"
            checked={reminder}
            onChange={(event) => setReminder(event.target.checked)}
          />
          <span>
            <strong>تذكير لطيف عند التأخر</strong>
            <small>
              مرة واحدة في اليوم، بعد الساعة الرابعة مساء، فقط إذا لم يكتمل هدف اليوم. لا يظهر
              أبدًا إذا أكمل الطفل هدفه.
            </small>
          </span>
        </label>

        {reminder && (
          <div className="field">
            <span>إشعار المتصفح (اختياري)</span>
            <p className="start-hint">
              التذكير داخل التطبيق يظهر عند فتحه بعد الرابعة مساء. ولإظهار إشعار من المتصفح أيضًا،
              فعّله من هنا. التطبيق يعمل دون خادم، لذلك لا تصل إشعارات والتطبيق مغلق تمامًا.
            </p>
            <div className="parent-actions">
              <button
                className="btn ghost"
                onClick={async () => {
                  const permission = await requestReminderPermission();
                  setNotifState(permission);
                }}
              >
                تفعيل إشعارات المتصفح
              </button>
            </div>
            <p className="start-hint">
              {notifState === 'granted'
                ? '✅ إشعارات المتصفح مفعّلة.'
                : notifState === 'denied'
                  ? 'إشعارات المتصفح مرفوضة من المتصفح. يمكن تغييرها من إعدادات الموقع في المتصفح.'
                  : notifState === 'unsupported'
                    ? 'متصفحك لا يدعم إشعارات المتصفح. يبقى التذكير داخل التطبيق يعمل.'
                    : 'لم تُفعَّل إشعارات المتصفح بعد. التذكير داخل التطبيق يعمل دونها.'}
            </p>
          </div>
        )}

        <div className="goal-rules">
          <strong>قواعد واضحة حتى لا يتحول التذكير إلى ضغط:</strong>
          <ul>
            <li>لا خصم نقاط ولا فقدان نجوم أبدًا.</li>
            <li>تذكير واحد فقط في اليوم، ويمكن إيقافه في أي وقت من هنا.</li>
            <li>إذا أكمل الطفل هدفه، لا يظهر أي تذكير.</li>
            <li>يكفي درس قصير لإتمام جزء من الهدف؛ لا يشترط إتمامه دفعة واحدة.</li>
          </ul>
        </div>

        <div className="parent-actions">
          <button className="btn primary big" onClick={save}>
            💾 حفظ
          </button>
          {locked && level !== null && (
            <button
              className="btn ghost"
              onClick={() => {
                setLocked(false);
                setSetting('parentLock', false);
                setSaved(true);
              }}
            >
              إظهار كل المستويات
            </button>
          )}
        </div>
        {saved && <p className="save-note">✅ حُفظت التغييرات على هذا الجهاز.</p>}
      </section>

      {(() => {
        const rows = weekReport(progress.activity ?? {});
        const totals = weekTotals(rows);
        const shownLevel = level ?? progress.settings.childLevel ?? 1;
        const subjects = subjectProgress(shownLevel, progress.stars);
        const weakest = [...subjects].sort((a, b) => a.percent - b.percent).slice(0, 3);
        const maxMinutes = Math.max(10, ...rows.map((row) => row.minutes));
        return (
          <section className="parent-report">
            <div className="report-head">
              <h2>📊 تقرير آخر 7 أيام</h2>
              <span className="report-pill">{Math.round(totals.minutes)} دقيقة</span>
            </div>
            <div className="report-stats">
              <div>
                <strong>{totals.lessons}</strong>
                <small>درس جديد</small>
              </div>
              <div>
                <strong>{totals.exams}</strong>
                <small>اختبار ناجح</small>
              </div>
              <div>
                <strong>{totals.games}</strong>
                <small>رقم في لعبة</small>
              </div>
              <div>
                <strong>🔥 {progress.daily.streak}</strong>
                <small>يوم متتابع</small>
              </div>
            </div>
            <div className="week-bars" aria-label="دقائق التعلّم في الأيام السبعة الأخيرة">
              {rows.map((row) => (
                <div className="week-col" key={row.date} title={`${row.date}: ${Math.round(row.minutes)} دقيقة`}>
                  <div className="week-track">
                    <span style={{ height: `${Math.round((row.minutes / maxMinutes) * 100)}%` }} />
                  </div>
                  <small>{row.label}</small>
                </div>
              ))}
            </div>
            <h3 className="report-sub">إتمام المواد — {LEVEL_NAMES[shownLevel]}</h3>
            <div className="subject-list">
              {weakest.map((subject) => (
                <div className="subject-row" key={subject.id}>
                  <span className="subject-name">
                    {subject.emoji} {subject.name}
                  </span>
                  <span className="subject-track">
                    <i style={{ width: `${subject.percent}%` }} />
                  </span>
                  <small>
                    {subject.done}/{subject.total}
                  </small>
                </div>
              ))}
            </div>
            <p className="report-note">نعرض المواد الأقل إتمامًا، فهي أولى ما يحتاج انتباهك.</p>
            {(() => {
              const hardest = Object.entries(progress.mistakes ?? {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);
              if (!hardest.length) return null;
              return (
                <div className="mistake-box">
                  <h3 className="report-sub">🧠 أسئلة تحتاج مراجعة</h3>
                  <ul className="mistake-list">
                    {hardest.map(([question, count]) => (
                      <li key={question}>
                        <span>{question}</span>
                        <small>{count} مرة خطأ</small>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </section>
        );
      })()}

      <section className="parent-notes">
        <h2>كيف يعمل التطبيق؟</h2>
        <ul>
          <li>كل درس موزّع على أسبوع: شرح، تمارين، لعبة، وآية/حكمة يومية.</li>
          <li>لا يُفتح درس جديد قبل اجتياز اختبار الدرس السابق، ولا مستوى قبل اختبار المستوى.</li>
          <li>كل التقدم والنجوم والاختبارات محفوظة على الجهاز دون حساب أو إنترنت.</li>
        </ul>
      </section>
    </div>
  );
}
