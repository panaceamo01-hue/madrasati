export function NotFound() {
  return (
    <div className="step-card" style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '2.4rem', margin: 0 }}>🔍</p>
      <h1 style={{ fontSize: '1.4rem' }}>لم نجد هذه الصفحة</h1>
      <p style={{ color: 'var(--muted)' }}>ربما تغيّر الرابط أو حُذف المحتوى.</p>
      <a className="btn primary" href="#/">
        العودة إلى الرئيسية
      </a>
    </div>
  );
}
