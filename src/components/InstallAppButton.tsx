import { useEffect, useState } from 'react';
import {
  getInstallStatus,
  isIOS,
  onInstallStatusChange,
  promptInstall,
  type InstallStatus,
} from '../lib/pwaInstall';

interface Props {
  className?: string;
}

/**
 * زر تحميل التطبيق: يثبّت التطبيق كأيقونة على الشاشة الرئيسية.
 * يختفي تلقائيًا إن كان التطبيق مثبّتًا أصلًا. في المتصفحات بلا نافذة
 * تثبيت (مثل سفاري على آيفون) يعرض تعليمات التثبيت اليدوي.
 */
export function InstallAppButton({ className = 'btn ghost small' }: Props) {
  const [status, setStatus] = useState<InstallStatus>(() => getInstallStatus());
  const [showHelp, setShowHelp] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => onInstallStatusChange(() => setStatus(getInstallStatus())), []);

  if (status === 'installed') return null;

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    const accepted = await promptInstall();
    setBusy(false);
    if (!accepted) setShowHelp((visible) => !visible);
  }

  return (
    <span className="install-wrap">
      <button
        type="button"
        className={className}
        onClick={() => void handleClick()}
        disabled={busy}
      >
        {busy ? 'جارٍ التثبيت…' : '⬇️ حمّل التطبيق'}
      </button>
      {showHelp && (
        <small className="install-help" role="status">
          {isIOS()
            ? 'في سفاري: اضغط زر المشاركة ثم اختر «إضافة إلى الشاشة الرئيسية».'
            : 'من قائمة المتصفح (⋮) اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».'}
        </small>
      )}
    </span>
  );
}
