import { LESSON_BY_ID } from '../data';
import { LEVEL_NAMES, SUBJECT_BY_ID } from '../data/subjects';
import { NotFound } from './NotFound';

/** جذاذة الدرس للأستاذ(ة): الهدف ووضعية الانطلاق وبناء التعلمات والتطبيق والتقويم، قابلة للطباعة. */
export function TeacherLessonView({ id }: { id: string }) {
  const lesson = LESSON_BY_ID[id];
  if (!lesson) return <NotFound />;

  const subject = SUBJECT_BY_ID[lesson.subject];
  const teach = lesson.steps.filter((step) => step.kind === 'teach');
  const quiz = lesson.steps.filter((step) => step.kind === 'quiz');
  const firstHook = teach[0]?.hook;

  return (
    <div className="fiche">
      <div className="no-print">
        <a className="back-link" href="#/teacher">
          → مساحة الأستاذ(ة)
        </a>
      </div>

      <div className="fiche-card">
        <div className="fiche-head">
          <div>
            <p className="fiche-kicker">
              {subject.emoji} {subject.name} · {LEVEL_NAMES[lesson.level]}
            </p>
            <h1>
              {lesson.emoji} {lesson.title}
            </h1>
            <p className="fiche-objective">
              <strong>الهدف:</strong> {lesson.objective}
            </p>
          </div>
        </div>

        <div className="game-actions no-print">
          <a className="btn primary" href={`#/teacher/game/${lesson.id}`}>
            🎮 لعبة الدرس
          </a>
          <button className="btn ghost" onClick={() => window.print()}>
            🖨️ طباعة الجذاذة
          </button>
        </div>

        <section className="fiche-section">
          <h2>وضعية الانطلاق</h2>
          {firstHook ? (
            <p>{firstHook}</p>
          ) : (
            <p>يفتتح الأستاذ(ة) الحصة بسؤال أو موقف من حياة التلاميذ يرتبط بعنوان الدرس.</p>
          )}
        </section>

        <section className="fiche-section">
          <h2>بناء التعلمات</h2>
          <ol className="fiche-steps">
            {teach.map((step, index) => (
              <li key={index}>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
                {step.visual && <p className="fiche-visual">{step.visual}</p>}
                {step.tip && (
                  <p className="fiche-tip">💡 تنبيه للأستاذ(ة): {step.tip}</p>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="fiche-section">
          <h2>التطبيق</h2>
          {quiz.length > 0 ? (
            <ol className="fiche-steps">
              {quiz.map((step, index) => (
                <li key={index}>
                  <p>{step.question}</p>
                  <ul className="fiche-options">
                    {step.options.map((option, optionIndex) => (
                      <li key={optionIndex} className={optionIndex === step.answer ? 'correct' : ''}>
                        {optionIndex === step.answer ? '✅ ' : ''}
                        {option}
                      </li>
                    ))}
                  </ul>
                  {step.hint && <p className="fiche-tip">تلميح: {step.hint}</p>}
                </li>
              ))}
            </ol>
          ) : (
            <p>هذا الدرس بلا تمارين اختيار من متعدد.</p>
          )}
        </section>

        <section className="fiche-section">
          <h2>التقويم</h2>
          <p>
            يقوّم الأستاذ(ة) التلاميذ بتمارين التطبيق أعلاه، ثم يتابع كل تلميذ اختبار الدرس
            في التطبيق وينال نجومه. عند التعثر يعيد الأستاذ(ة) شرح المفهوم بمثال آخر قبل
            الانتقال إلى الدرس التالي.
          </p>
        </section>
      </div>
    </div>
  );
}
