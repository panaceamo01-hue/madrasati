import type { UserRole } from '../lib/role';

/** بطاقتا اختيار الدور: ولي أمر أو أستاذ(ة). */
export function RoleChoice({ onChoose }: { onChoose: (role: UserRole) => void }) {
  return (
    <div className="role-choice">
      <p className="license-lede">من أنت؟ اختر دورك أولًا.</p>
      <div className="role-cards">
        <button type="button" className="role-card" onClick={() => onChoose('parent')}>
          <span className="role-emoji" aria-hidden="true">
            👨‍👩‍👧
          </span>
          <strong>أنا ولي أمر</strong>
          <span>أتابع أبنائي في دروسهم وألعابهم</span>
        </button>
        <button type="button" className="role-card" onClick={() => onChoose('teacher')}>
          <span className="role-emoji" aria-hidden="true">
            👩‍🏫
          </span>
          <strong>أنا أستاذ(ة)</strong>
          <span>جذاذات وألعاب الدروس لقسمي</span>
        </button>
      </div>
    </div>
  );
}

/** شاشة اختيار الدور لمن فعّل التطبيق من قبل بلا دور محفوظ. */
export function RoleView({ onChoose }: { onChoose: (role: UserRole) => void }) {
  return (
    <div className="license-page">
      <div className="license-hero" aria-hidden="true">
        🎒
      </div>
      <div className="page-head license-head">
        <div className="page-title">
          <h1>من أنت؟</h1>
          <p>«مدرستي» صارت فيها مساحة للأستاذ(ة) ومساحة لولي الأمر.</p>
        </div>
      </div>
      <div className="license-card">
        <RoleChoice onChoose={onChoose} />
        <p className="license-note">يمكنك تغيير الدور لاحقًا من الإعدادات.</p>
      </div>
    </div>
  );
}
