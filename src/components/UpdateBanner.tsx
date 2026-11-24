import { useEffect, useState } from 'react';
import { applyUpdate, onUpdateAvailable } from '../lib/swUpdate';

/**
 * لافتة التحديث داخل التطبيق: تظهر ثابتة أعلى الصفحة عندما تتوفر نسخة
 * جديدة، فيضغط المستخدم «حدّث الآن» فيتحدث التطبيق دون إعادة تحميل من
 * المتجر. يركّبها الوكيل الرئيسي في App.tsx.
 */
export function UpdateBanner() {
  const [visible, setVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => onUpdateAvailable(() => setVisible(true)), []);

  if (!visible) return null;

  return (
    <div className="update-banner" role="status" aria-live="polite">
      <span className="update-banner-emoji" aria-hidden="true">
        🎉
      </span>
      <p>يوجد تحديث جديد لتطبيق مدرستي</p>
      <div className="update-banner-actions">
        <button
          className="btn primary small"
          onClick={() => {
            setUpdating(true);
            applyUpdate();
          }}
          disabled={updating}
        >
          {updating ? 'جارٍ التحديث…' : 'حدّث الآن'}
        </button>
        <button
          className="btn ghost small"
          onClick={() => setVisible(false)}
          disabled={updating}
        >
          لاحقًا
        </button>
      </div>
    </div>
  );
}
