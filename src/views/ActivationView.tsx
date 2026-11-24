import { useEffect, useState } from 'react';
import {
  activateLicense,
  activateOwner,
  type ActivateError,
  type OwnerError,
} from '../lib/license';

const ERROR_TEXT: Record<ActivateError, string> = {
  invalid_code: 'الكود غير صحيح. تأكد من الكود وأعد المحاولة.',
  device_limit: 'هذا الكود مستعمل في جهازين. تواصل مع صاحب التطبيق لإلغاء جهاز قديم.',
  revoked: 'هذا الكود ملغى. تواصل مع صاحب التطبيق.',
  not_configured: 'خدمة التفعيل غير مفعّلة بعد. حاول لاحقًا.',
  offline: 'تحقق من اتصالك بالإنترنت وحاول مرة أخرى.',
  unknown: 'حدث خطأ غير متوقع. حاول مرة أخرى.',
};

const OWNER_ERROR_TEXT: Record<OwnerError, string> = {
  wrong_password: 'كلمة السر غير صحيحة.',
  not_configured: 'خدمة التفعيل غير مفعّلة بعد. حاول لاحقًا.',
  offline: 'تحقق من اتصالك بالإنترنت وحاول مرة أخرى.',
  unknown: 'حدث خطأ غير متوقع. حاول مرة أخرى.',
};

interface Props {
  onActivated: () => void;
}

/** شاشة تفعيل التطبيق بكود، تظهر لولي الأمر قبل استعمال التطبيق. */
export function ActivationView({ onActivated }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<ActivateError | null>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [ownerMode, setOwnerMode] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerError, setOwnerError] = useState<OwnerError | null>(null);

  // بعد رسالة النجاح نفتح التطبيق تلقائيًا بعد ثانيتين ونصف.
  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(onActivated, 2500);
    return () => window.clearTimeout(timer);
  }, [success, onActivated]);

  async function submit() {
    if (busy || success) return;
    const clean = code.trim();
    if (!clean) {
      setError('invalid_code');
      return;
    }
    setBusy(true);
    setError(null);
    const result = await activateLicense(clean);
    setBusy(false);
    if (result.ok) {
      setSuccessMessage('مبروك تم تفعيل الكود الخاص بك صالح مدى الحياة');
      setSuccess(true);
      return;
    }
    setError(result.error);
  }

  async function submitOwner() {
    if (busy || success) return;
    setBusy(true);
    setOwnerError(null);
    const result = await activateOwner(ownerPassword);
    setBusy(false);
    if (result.ok) {
      setSuccessMessage('مرحبًا بك، تم الدخول كمالك للتطبيق');
      setSuccess(true);
      return;
    }
    setOwnerError(result.error);
  }

  return (
    <div className="license-page">
      <div className="license-hero" aria-hidden="true">
        🎒
      </div>
      <div className="page-head license-head">
        <div className="page-title">
          <h1>فعّل التطبيق</h1>
          <p>«مدرستي» تطبيق تعليمي للتعليم الابتدائي في المغرب.</p>
        </div>
      </div>
      <div className="license-card">
        {success ? (
          <div className="gate-success" role="status">
            <p className="gate-success-emoji" aria-hidden="true">
              🎉
            </p>
            <p>{successMessage}</p>
            <p className="license-note">جارٍ فتح التطبيق…</p>
          </div>
        ) : (
          <>
            <p className="license-lede">
              أدخل الكود الذي أرسله لك صاحب التطبيق لتفعيله. الكود يعمل على جهازين فقط،
              ويبقى صالحًا دائمًا.
            </p>
        <label className="field" htmlFor="activation-code">
          <span>كود التفعيل</span>
          <input
            id="activation-code"
            className="license-input"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            dir="ltr"
            value={code}
            onChange={(event) => {
              setCode(event.target.value.toUpperCase());
              setError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void submit();
            }}
            placeholder="K7Q2-9X4P-3M8D"
            aria-label="كود التفعيل"
          />
        </label>
        {error && (
          <p className="gate-error" role="alert">
            {ERROR_TEXT[error]}
          </p>
        )}
        <button className="btn primary big" onClick={() => void submit()} disabled={busy}>
          {busy ? 'جارٍ التفعيل…' : 'تفعيل'}
        </button>
        <p className="license-note">
          تحتاج إلى الإنترنت مرة واحدة للتفعيل، ثم يعمل التطبيق دون إنترنت. إن لم يصلك كود
          بعد، تواصل مع صاحب التطبيق.
        </p>
          </>
        )}
      </div>
      {!success && (
        <div className="license-owner">
          {!ownerMode ? (
            <button
              type="button"
              className="link-button"
              onClick={() => setOwnerMode(true)}
            >
              أنا صاحب التطبيق
            </button>
          ) : (
            <div className="license-card owner-card">
              <label className="field" htmlFor="owner-password">
                <span>كلمة سر الإدارة</span>
                <input
                  id="owner-password"
                  className="license-input"
                  type="password"
                  autoComplete="current-password"
                  dir="ltr"
                  value={ownerPassword}
                  onChange={(event) => {
                    setOwnerPassword(event.target.value);
                    setOwnerError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') void submitOwner();
                  }}
                  placeholder="كلمة السر"
                  aria-label="كلمة سر الإدارة"
                />
              </label>
              {ownerError && (
                <p className="gate-error" role="alert">
                  {OWNER_ERROR_TEXT[ownerError]}
                </p>
              )}
              <button
                className="btn primary big"
                onClick={() => void submitOwner()}
                disabled={busy}
              >
                {busy ? 'جارٍ التحقق…' : 'دخول كمالك'}
              </button>
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setOwnerMode(false);
                  setOwnerError(null);
                }}
              >
                رجوع إلى التفعيل بالكود
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
