import { useEffect, useState } from 'react';
import {
  activateLicense,
  activateOwner,
  type ActivateError,
  type OwnerError,
} from '../lib/license';
import { saveRole, type UserRole } from '../lib/role';
import { RoleChoice } from './RoleView';

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

/** شاشة تفعيل التطبيق بكود، تظهر قبل استعمال التطبيق. يختار المستعمل دوره أولًا (ولي أمر أو أستاذ)، ثم يدخل الكود؛ والدور نفسه يسري على الأستاذ وولي الأمر. */
export function ActivationView({ onActivated }: Props) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<ActivateError | null>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [ownerMode, setOwnerMode] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState('');
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
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
      if (role) saveRole(role);
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
      if (role) saveRole(role);
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
        ) : role === null ? (
          <RoleChoice onChoose={setRole} />
        ) : (
          <>
            <p className="license-lede">
              أدخل الكود الذي أرسله لك صاحب التطبيق لتفعيله. الكود يعمل على جهازين فقط،
              ويبقى صالحًا دائمًا.
            </p>
            <p className="license-note">
              دورك: {role === 'teacher' ? 'أستاذ(ة)' : 'ولي أمر'} ·{' '}
              <button type="button" className="link-button" onClick={() => setRole(null)}>
                تغيير الدور
              </button>
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
      {!success && role !== null && (
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
                <div className="password-wrap">
                  <input
                    id="owner-password"
                    className="owner-input"
                    type={showOwnerPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
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
                  <button
                    type="button"
                    className="btn ghost small"
                    onClick={() => setShowOwnerPassword((value) => !value)}
                    aria-label={showOwnerPassword ? 'إخفاء كلمة السر' : 'إظهار كلمة السر'}
                  >
                    {showOwnerPassword ? '🙈 إخفاء' : '👁️ إظهار'}
                  </button>
                </div>
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
