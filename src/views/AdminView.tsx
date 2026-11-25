import { useCallback, useEffect, useState } from 'react';

const PASSWORD_KEY = 'madrasati:adminPassword:v1';

interface AdminDevice {
  id: string;
  firstSeen: number;
  lastSeen: number;
}

interface AdminCode {
  code: string;
  createdAt: number;
  revoked: boolean;
  devices: AdminDevice[];
  lastSeen: number;
}

function formatCode(code: string): string {
  return code.replace(/(.{4})(?=.)/g, '$1-');
}

function formatDate(timestamp: number): string {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleString('ar-MA', { dateStyle: 'medium', timeStyle: 'short' });
}

async function adminCall(
  password: string,
  action: string,
  body: Record<string, unknown> = {},
): Promise<any> {
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
    body: JSON.stringify({ action, ...body }),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) throw new Error(data?.error ?? 'unknown');
  return data;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* ننتقل إلى البديل */
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    return true;
  } catch {
    return false;
  }
}

/** صفحة إدارة أكواد التفعيل (لصاحب التطبيق فقط). */
export function AdminView() {
  const [password, setPassword] = useState(() => {
    try {
      return sessionStorage.getItem(PASSWORD_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [gateError, setGateError] = useState('');
  const [gateBusy, setGateBusy] = useState(false);
  const [codes, setCodes] = useState<AdminCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newCode, setNewCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadCodes = useCallback(
    async (pw: string) => {
      setLoading(true);
      setError('');
      try {
        const data = await adminCall(pw, 'list');
        setCodes((data?.codes ?? []) as AdminCode[]);
      } catch {
        setError('تعذر تحميل الأكواد. تحقق من الاتصال وحاول مرة أخرى.');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  async function login(pw: string) {
    if (!pw.trim() || gateBusy) return;
    setGateBusy(true);
    setGateError('');
    try {
      await adminCall(pw.trim(), 'list');
      try {
        sessionStorage.setItem(PASSWORD_KEY, pw.trim());
      } catch {
        /* نتجاهل */
      }
      setPassword(pw.trim());
      setAuthed(true);
      await loadCodes(pw.trim());
    } catch (err) {
      if (err instanceof Error && err.message === 'unauthorized') {
        setGateError('كلمة السر غير صحيحة.');
      } else if (err instanceof Error && err.message === 'not_configured') {
        setGateError('خدمة الإدارة غير مفعّلة بعد في الخادم.');
      } else {
        setGateError('تعذر الاتصال بالخادم. تحقق من الإنترنت وحاول مرة أخرى.');
      }
    } finally {
      setGateBusy(false);
    }
  }

  useEffect(() => {
    if (password && !authed) void login(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createCode() {
    if (creating) return;
    setCreating(true);
    setError('');
    try {
      const data = await adminCall(password, 'create');
      setNewCode(String(data?.code ?? ''));
      setCopied(false);
      await loadCodes(password);
    } catch {
      setError('تعذر توليد كود جديد. حاول مرة أخرى.');
    } finally {
      setCreating(false);
    }
  }

  async function runAction(action: string, body: Record<string, unknown>, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setError('');
    try {
      await adminCall(password, action, body);
      await loadCodes(password);
    } catch {
      setError('تعذر تنفيذ الإجراء. حاول مرة أخرى.');
    }
  }

  if (!authed) {
    return (
      <div className="license-page">
        <div className="page-head license-head">
          <div className="page-title">
            <h1>إدارة الأكواد</h1>
            <p>هذه الصفحة لصاحب التطبيق فقط.</p>
          </div>
        </div>
        <div className="license-card">
          <label className="field" htmlFor="admin-password">
            <span>كلمة سر الإدارة</span>
            <div className="password-wrap">
              <input
                id="admin-password"
                className="owner-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                dir="ltr"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setGateError('');
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void login(password);
                }}
                placeholder="كلمة السر"
                aria-label="كلمة سر الإدارة"
              />
              <button
                type="button"
                className="btn ghost small"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'إخفاء كلمة السر' : 'إظهار كلمة السر'}
              >
                {showPassword ? '🙈 إخفاء' : '👁️ إظهار'}
              </button>
            </div>
          </label>
          {gateError && (
            <p className="gate-error" role="alert">
              {gateError}
            </p>
          )}
          <button className="btn primary big" onClick={() => void login(password)} disabled={gateBusy}>
            {gateBusy ? 'جارٍ التحقق…' : 'دخول'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="license-page admin-page">
      <div className="page-head license-head">
        <div className="page-title">
          <h1>إدارة الأكواد</h1>
          <p>ولّد أكواد التفعيل وتابع الأجهزة المستعملة لكل كود.</p>
        </div>
        <button
          className="btn ghost small"
          onClick={() => {
            try {
              sessionStorage.removeItem(PASSWORD_KEY);
            } catch {
              /* نتجاهل */
            }
            setAuthed(false);
            setPassword('');
            setCodes([]);
          }}
        >
          خروج
        </button>
      </div>

      <div className="license-card">
        <button className="btn primary big" onClick={() => void createCode()} disabled={creating}>
          {creating ? 'جارٍ التوليد…' : '➕ توليد كود جديد'}
        </button>
        {newCode && (
          <div className="admin-new-code">
            <p>الكود الجديد (أرسله لولي الأمر):</p>
            <strong className="license-code" dir="ltr">
              {newCode}
            </strong>
            <button
              className="btn ghost small"
              onClick={async () => {
                const ok = await copyText(newCode);
                setCopied(ok);
              }}
            >
              {copied ? '✓ نُسخ' : 'نسخ الكود'}
            </button>
          </div>
        )}
        <p className="license-note">كل كود يعمل على جهازين فقط، ويبقى صالحًا دائمًا ما لم تلغه.</p>
      </div>

      {error && (
        <p className="gate-error" role="alert">
          {error}
        </p>
      )}

      <div className="license-card">
        <div className="admin-head-row">
          <h2 className="settings-title">الأكواد</h2>
          <button className="btn ghost small" onClick={() => void loadCodes(password)} disabled={loading}>
            {loading ? 'جارٍ التحميل…' : 'تحديث القائمة'}
          </button>
        </div>
        {codes.length === 0 && !loading ? (
          <p className="license-note">لا توجد أكواد بعد. ولّد أول كود من الأعلى.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>الكود</th>
                  <th>تاريخ الإنشاء</th>
                  <th>الأجهزة</th>
                  <th>آخر ظهور</th>
                  <th>الحالة</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((item) => (
                  <tr key={item.code} className={item.revoked ? 'revoked' : ''}>
                    <td dir="ltr" className="admin-code-cell">
                      {formatCode(item.code)}
                    </td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{item.devices.length}/2</td>
                    <td>{formatDate(item.lastSeen)}</td>
                    <td>{item.revoked ? '⛔ ملغى' : '✅ فعّال'}</td>
                    <td>
                      <div className="admin-actions">
                        {item.devices.map((device) => (
                          <button
                            key={device.id}
                            className="btn ghost small"
                            onClick={() =>
                              void runAction(
                                'revoke_device',
                                { code: item.code, deviceId: device.id },
                                'هل تريد إلغاء هذا الجهاز؟ سيحتاج صاحبه إلى كود جديد أو إلى إعادة التفعيل من جهاز آخر.',
                              )
                            }
                          >
                            إلغاء جهاز {device.id.slice(0, 8)}…
                          </button>
                        ))}
                        {item.revoked ? (
                          <button
                            className="btn small"
                            onClick={() => void runAction('restore_code', { code: item.code })}
                          >
                            إعادة التفعيل
                          </button>
                        ) : (
                          <button
                            className="btn ghost small"
                            onClick={() =>
                              void runAction(
                                'revoke_code',
                                { code: item.code },
                                'هل تريد إلغاء هذا الكود؟ لن يعمل بعدها في أي جهاز.',
                              )
                            }
                          >
                            إلغاء الكود
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
