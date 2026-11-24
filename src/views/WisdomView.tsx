import { useMemo, useState } from 'react';
import { speak } from '../lib/speech';
import { playCorrect } from '../lib/sound';
import { touchDaily } from '../lib/store';

import { HADITHS, VERSES, WISDOMS, dayOfYear } from '../data/daily';

export function WisdomView() {
  const today = useMemo(() => new Date(), []);
  const [offset, setOffset] = useState(0);
  const [checked, setChecked] = useState(false);
  const index = (dayOfYear(today) + offset) % WISDOMS.length;
  const wisdom = WISDOMS[index];
  const verse = VERSES[dayOfYear(today) % VERSES.length];
  const hadith = HADITHS[dayOfYear(today) % HADITHS.length];

  function next() {
    setOffset((value) => value + 1);
    setChecked(false);
  }

  return (
    <div className="wisdom-page">
      <div className="page-head">
        <div className="page-title">
          <p className="eyebrow">نافذة صغيرة كل يوم</p>
          <h1>💡 حكمة اليوم</h1>
          <p>حكمة أو مثل أو حديث، مع معناه المبسّط لأبطال مدرستي.</p>
        </div>
      </div>

      <article className="wisdom-card">
        <div className="wisdom-emoji" aria-hidden="true">
          {wisdom.emoji}
        </div>
        <blockquote>{wisdom.text}</blockquote>
        <cite>— {wisdom.source}</cite>
        <p className="wisdom-meaning">✨ {wisdom.meaning}</p>

        <div className="wisdom-actions">
          <button className="btn primary" onClick={() => speak(`${wisdom.text}. ${wisdom.meaning}`)}>
            🔊 استمع
          </button>
          <button className="btn ghost" onClick={next}>
            حكمة أخرى ↻
          </button>
        </div>
      </article>

      <section className="wisdom-task">
        <h2>تحدّي اليوم</h2>
        <p>احفظ الحكمة ثم اضغط الزر إن أتممت الحفظ:</p>
        <button
          className={`btn${checked ? ' ghost' : ' primary'} big`}
          onClick={() => {
            if (!checked) {
              setChecked(true);
              playCorrect();
              touchDaily('wisdom');
              speak('أحسنت! أنت بطل الحكمة.');
            } else {
              setChecked(false);
            }
          }}
          disabled={checked}
        >
          {checked ? '✅ أحسنت! حفظتها' : '🌟 حفظتُ الحكمة'}
        </button>
      </section>

      <section className="daily-duo">
        <article className="daily-card verse">
          <p className="eyebrow">📖 آية اليوم</p>
          <blockquote>{verse.text}</blockquote>
          <cite>{verse.source}</cite>
          <p className="daily-meaning">✨ {verse.meaning}</p>
          <button className="btn ghost small" onClick={() => speak(`${verse.text}. ${verse.meaning}`)}>
            🔊 استمع
          </button>
        </article>
        <article className="daily-card hadith">
          <p className="eyebrow">🕌 حديث اليوم</p>
          <blockquote>{hadith.text}</blockquote>
          <cite>{hadith.source}</cite>
          <p className="daily-meaning">✨ {hadith.meaning}</p>
          <button className="btn ghost small" onClick={() => speak(`${hadith.text}. ${hadith.meaning}`)}>
            🔊 استمع
          </button>
        </article>
      </section>
    </div>
  );
}
