import type { Level } from '../types';
import { LESSONS } from '../data';
import { LEVEL_NAMES, LEVELS } from '../data/subjects';
import { allLevelsCertified, formatArabicDate, lastCertificateDate, levelCertificate } from '../lib/certificate';
import { totalStars } from '../lib/store';
import { useProgress } from '../lib/useProgress';

interface Props {
  level: Level | 'all';
}

/**
 * شهادة قابلة للطباعة عند إنهاء مستوى (أو المستويات الستة كلها).
 * تُطبع من المتصفح بزر «طباعة» — تنسيق الطباعة في kid-theme.css
 * يُخفي كل شيء إلا الشهادة نفسها.
 */
export function CertificateView({ level }: Props) {
  const progress = useProgress();
  const childName = progress.settings.childName.trim();
  const displayName = childName || 'تلميذنا العزيز';

  if (level === 'all') {
    const earned = allLevelsCertified(progress);
    if (!earned) {
      const done = LEVELS.filter(
        (item) => levelCertificate(item, progress).earned,
      ).length;
      return (
        <div className="locked-page">
          <span className="locked-emoji">🏆</span>
          <p>
            شهادة «بطل مدرستي» تُمنح بعد إتمام المستويات الستة كلها. أنجزت حتى الآن {done} من 6
            مستويات.
          </p>
          <a className="btn primary" href="#/progress">
            العودة إلى ملفي
          </a>
        </div>
      );
    }
    const stars = totalStars(progress.stars);
    return (
      <CertificateSheet
        title="بطل مدرستي"
        subtitle="أتمّ المستويات الستة كلها بنجاح"
        name={displayName}
        detail={`${LESSONS.length} درسًا · ${stars} نجمة`}
        date={formatArabicDate(lastCertificateDate(progress))}
        backHref="#/progress"
      />
    );
  }

  const info = levelCertificate(level, progress);
  if (!info.earned) {
    return (
      <div className="locked-page">
        <span className="locked-emoji">📜</span>
        <p>
          شهادة {LEVEL_NAMES[level]} تُمنح بعد اجتياز اختبار المستوى. أكملت حتى الآن{' '}
          {info.lessons} من {info.total} دروس.
        </p>
        <a className="btn primary" href={`#/level/${level}`}>
          العودة إلى الدروس
        </a>
      </div>
    );
  }

  return (
    <CertificateSheet
      title="شهادة تقدير"
      subtitle={`أتمّ ${LEVEL_NAMES[level]} بنجاح`}
      name={displayName}
      detail={`${info.total} دروس · ${info.stars} نجمة · نتيجة الاختبار ${info.percent}%`}
      date={formatArabicDate(info.date)}
      backHref={`#/level/${level}`}
    />
  );
}

function CertificateSheet({
  title,
  subtitle,
  name,
  detail,
  date,
  backHref,
}: {
  title: string;
  subtitle: string;
  name: string;
  detail: string;
  date: string;
  backHref: string;
}) {
  return (
    <div className="certificate-page">
      <div className="certificate-sheet">
        <div className="certificate-inner">
          <p className="certificate-brand">🎒 مدرستي · تعلّم والعب</p>
          <span className="certificate-medal" aria-hidden="true">
            🏅
          </span>
          <h1>{title}</h1>
          <p className="certificate-text">تشهد إدارة تطبيق مدرستي بأن التلميذ(ة)</p>
          <p className="certificate-name">{name}</p>
          <p className="certificate-text certificate-subtitle">{subtitle}</p>
          <p className="certificate-detail">{detail}</p>
          {date && <p className="certificate-date">بتاريخ {date}</p>}
          <p className="certificate-foot">مدرستي — تطبيق تعليمي مغربي للتعليم الابتدائي</p>
        </div>
      </div>
      <div className="certificate-actions">
        <button className="btn primary big" onClick={() => window.print()}>
          🖨️ طباعة الشهادة
        </button>
        <a className="btn ghost" href={backHref}>
          ← رجوع
        </a>
      </div>
      <p className="certificate-hint">
        تُطبع الشهادة من المتصفح: اختر «حفظ بصيغة PDF» إن أردت نسخة إلكترونية.
      </p>
    </div>
  );
}
