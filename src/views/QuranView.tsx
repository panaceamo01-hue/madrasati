import type { Level } from '../types';
import { MEMORIZATION_SURAHS } from '../data/quran';
import { LEVEL_NAMES, LEVELS } from '../data/subjects';
import { useProgress } from '../lib/useProgress';

const STATUS_LABEL: Record<number, string> = {
  1: '📖 أحفظها',
  2: '✅ حفظتها',
};

/** قائمة سور الحفظ المقررة مع عدّاد الحفظ. */
export function QuranView() {
  const progress = useProgress();
  const memorization = progress.memorization ?? {};
  const memorized = MEMORIZATION_SURAHS.filter((surah) => memorization[surah.id]?.status === 2).length;
  const learning = MEMORIZATION_SURAHS.filter((surah) => memorization[surah.id]?.status === 1).length;
  const total = MEMORIZATION_SURAHS.length;
  const percent = total ? Math.round((memorized / total) * 100) : 0;

  return (
    <div className="quran-page">
      <div className="page-head">
        <a className="back-link" href="#/">
          ← الرئيسية
        </a>
        <h1>📖 حفظ القرآن</h1>
        <p>سور الحفظ المقررة في المنهاج المغربي — استمع، وردّد، وسجّل تلاوتك.</p>
      </div>

      <section className="quran-counter">
        <div className="quran-count">
          <strong>
            {memorized} / {total}
          </strong>
          <small>سورة محفوظة</small>
        </div>
        <div className="progress candy">
          <span style={{ width: `${percent}%` }} />
        </div>
        <p>
          {learning > 0 && `${learning} ${learning === 1 ? 'سورة' : 'سور'} قيد الحفظ · `}
          {memorized === total
            ? 'مبارك! حفظت كل السور المقررة 🎉'
            : 'كل سورة تحفظها تقرّبك من إتمام المصحف الصغير.'}
        </p>
      </section>

      {LEVELS.map((level: Level) => {
        const surahs = MEMORIZATION_SURAHS.filter((surah) => surah.level === level);
        if (!surahs.length) return null;
        return (
          <section className="quran-level" key={level}>
            <h2>
              {LEVEL_NAMES[level]} · {surahs.length} {surahs.length === 1 ? 'سورة' : 'سور'}
            </h2>
            <ul className="quran-list">
              {surahs.map((surah) => {
                const status: 0 | 1 | 2 = memorization[surah.id]?.status ?? 0;
                const isLearning = status === 1;
                const isMemorized = status === 2;
                return (
                  <li key={surah.id}>
                    <a href={`#/quran/${surah.id}`}>
                      <span className="quran-name">
                        <span className="quran-num" aria-hidden="true">
                          {surah.number}
                        </span>
                        سورة {surah.name}
                      </span>
                      <small>
                        {surah.verses.length} {surah.verses.length === 1 ? 'آية' : 'آيات'}
                      </small>
                      <span className={`quran-status${isMemorized ? ' done' : isLearning ? ' learning' : ''}`}>
                        {isMemorized ? STATUS_LABEL[2] : isLearning ? STATUS_LABEL[1] : 'لم أبدأ'}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <p className="quran-note">
        التلاوة في المنهاج المغربي برواية ورش عن نافع. القراءة الصوتية في التطبيق من صوت جهازك،
        فاستمع وراجع تلاوتك مع معلمك أو ولي أمرك.
      </p>
    </div>
  );
}
