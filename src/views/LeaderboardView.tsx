import { MEMORIZATION_SURAHS } from '../data/quran';
import { getAllProfilesProgress, totalStars } from '../lib/store';
import { useProgress } from '../lib/useProgress';

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

/** لوحة ترتيب العائلة: الأبناء مرتبون حسب النجوم، ثم الدروس، ثم السور المحفوظة. */
export function LeaderboardView() {
  // الاشتراك في تقدم الابن النشط حتى تتحدث اللوحة عند تغيره.
  useProgress();
  const rows = getAllProfilesProgress()
    .map(({ profile, progress }) => {
      const memorized = MEMORIZATION_SURAHS.filter(
        (surah) => progress.memorization?.[surah.id]?.status === 2,
      ).length;
      return {
        profile,
        stars: totalStars(progress.stars),
        lessons: Object.keys(progress.stars).length,
        memorized,
        streak: progress.daily.streak,
      };
    })
    .sort((a, b) => b.stars - a.stars || b.lessons - a.lessons || b.memorized - a.memorized);

  return (
    <div className="leaderboard-page">
      <div className="page-head">
        <a className="back-link" href="#/">
          ← الرئيسية
        </a>
        <h1>🏆 لوحة ترتيب العائلة</h1>
        <p>من يجمع أكبر عدد من النجوم هذا الأسبوع؟ التعلّم منافسة جميلة بين الإخوة.</p>
      </div>

      {rows.length === 0 ? (
        <p>لا أبناء بعد — أضف أبناءك من مساحة ولي الأمر.</p>
      ) : (
        <ol className="leaderboard-list">
          {rows.map((row, index) => (
            <li className={`leaderboard-row${index === 0 ? ' first' : ''}`} key={row.profile.id}>
              <span className="leaderboard-rank" aria-hidden="true">
                {RANK_MEDALS[index] ?? `${index + 1}`}
              </span>
              <span className="leaderboard-avatar" aria-hidden="true">
                {row.profile.emoji}
              </span>
              <span className="leaderboard-name">
                <strong>{row.profile.name}</strong>
                <small>
                  {row.lessons} {row.lessons === 1 ? 'درس' : 'دروس'} · {row.memorized} سورة محفوظة · سلسلة {row.streak}{' '}
                  {row.streak === 1 ? 'يوم' : 'أيام'}
                </small>
              </span>
              <span className="leaderboard-stars">⭐ {row.stars}</span>
            </li>
          ))}
        </ol>
      )}

      <p className="leaderboard-note">
        الترتيب حسب النجوم أولًا، ثم عدد الدروس، ثم السور المحفوظة. كل ابن يرى تقدمه الخاص
        عند تبديل الحساب من الرئيسية.
      </p>
      <a className="btn ghost" href="#/parent">
        👨‍👩‍👧‍👦 إدارة الأبناء
      </a>
    </div>
  );
}
