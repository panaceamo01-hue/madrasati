import { useEffect, useState } from 'react';
import { resetProgress, setSetting } from '../lib/store';
import { useProgress } from '../lib/useProgress';
import { speechAvailable } from '../lib/speech';
import { checkForUpdate } from '../lib/swUpdate';

type OfflineState = 'checking' | 'ready' | 'dev' | 'insecure' | 'unsupported';
type UpdateState = 'idle' | 'checking' | 'up-to-date' | 'available' | 'unsupported';

export function SettingsView() {
  const progress = useProgress();
  const [offline, setOffline] = useState<OfflineState>('checking');
  const [updateState, setUpdateState] = useState<UpdateState>('idle');

  async function handleCheckUpdate() {
    setUpdateState('checking');
    const result = await checkForUpdate();
    setUpdateState(result);
  }

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('caches' in window)) {
      setOffline(window.isSecureContext === false ? 'insecure' : 'unsupported');
      return;
    }
    if (!import.meta.env.PROD) {
      setOffline('dev');
      return;
    }

    let cancelled = false;
    let attempts = 0;

    async function check() {
      attempts += 1;
      try {
        await navigator.serviceWorker.ready;
        const keys = await caches.keys();
        if (cancelled) return;
        if (keys.some((key) => key.startsWith('madrasati-'))) {
          setOffline('ready');
          return;
        }
      } catch {
        /* نعيد المحاولة */
      }
      if (!cancelled && attempts < 5) window.setTimeout(check, 1200);
      else if (!cancelled) setOffline('checking');
    }

    void check();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleReset() {
    const confirmed = window.confirm('هل تريد مسح كل التقدم والنجوم والنتائج؟ لا يمكن التراجع.');
    if (confirmed) resetProgress();
  }

  const offlineText: Record<OfflineState, { title: string; body: string; pending: boolean }> = {
    ready: {
      title: 'جاهز للعمل دون إنترنت',
      body: 'حُفظت الدروس والألعاب كاملة على جهازك. يمكنك الآن قطع الاتصال وفتح التطبيق من الشاشة الرئيسية.',
      pending: false,
    },
    checking: {
      title: 'جارٍ حفظ التطبيق على جهازك…',
      body: 'افتح الصفحة مرة واحدة وأنت متصل بالشبكة. يتم الحفظ تلقائيًا في الخلفية.',
      pending: true,
    },
    dev: {
      title: 'التخزين الدائم يُفعّل في النسخة النهائية',
      body: 'أنت الآن في وضع التطوير. في النسخة المنشورة تُحفظ ملفات التطبيق تلقائيًا للعمل دون إنترنت.',
      pending: true,
    },
    unsupported: {
      title: 'المتصفح لا يدعم العمل دون إنترنت',
      body: 'استعمل متصفحًا حديثًا مثل Chrome أو Safari أو Edge، ثم أضف التطبيق إلى الشاشة الرئيسية.',
      pending: true,
    },
    insecure: {
      title: 'العمل دون إنترنت يحتاج اتصالًا آمنًا (https)',
      body: 'افتح التطبيق عبر عنوان https ثم أضفه إلى الشاشة الرئيسية. بعد أول فتح يُحفظ كاملًا ويعمل دون شبكة.',
      pending: true,
    },
  };

  const info = offlineText[offline];

  return (
    <>
      <div className="page-head">
        <div className="page-title">
          <h1>الإعدادات</h1>
          <p>الصوت والقراءة والتخزين على هذا الجهاز.</p>
        </div>
      </div>

      <a className="parent-teaser" href="#/parent">
        <span className="parent-teaser-emoji" aria-hidden="true">👨‍👩‍👧</span>
        <span>
          <strong>مساحة ولي الأمر</strong>
          <small>مستوى ابنك، وإخفاء بقية المستويات، وشرح نظام الأسابيع والأقفال.</small>
        </span>
        <span className="cta">افتح ←</span>
      </a>

      <div className={`offline-box${info.pending ? ' pending' : ''}`}>
        <span className="dot" aria-hidden="true" />
        <div>
          <strong>{info.title}</strong>
          <p>{info.body}</p>
        </div>
      </div>

      <div className="settings-card">
        <div className="setting-row">
          <div>
            <p>الصوت</p>
            <small>نغمات قصيرة عند الإجابة الصحيحة أو الخاطئة.</small>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={progress.settings.sound}
              onChange={(event) => setSetting('sound', event.target.checked)}
              aria-label="تشغيل الصوت"
            />
            <span />
          </label>
        </div>
        <div className="setting-row">
          <div>
            <p>القراءة بصوت عالٍ</p>
            <small>
              {speechAvailable()
                ? 'قراءة السؤال أو الشرح بصوت جهازك (يتوفر إذا كان صوت عربي مثبتًا).'
                : 'متصفحك لا يوفر قراءة صوتية. يبقى التطبيق صالحًا للاستخدام.'}
            </small>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={progress.settings.speech}
              onChange={(event) => setSetting('speech', event.target.checked)}
              aria-label="تشغيل القراءة الصوتية"
              disabled={!speechAvailable()}
            />
            <span />
          </label>
        </div>
        <div className="setting-row">
          <div>
            <p>مسح التقدم</p>
            <small>حذف النجوم ونتائج الألعاب من هذا الجهاز.</small>
          </div>
          <button className="btn ghost small" onClick={handleReset}>
            مسح
          </button>
        </div>
      </div>

      <div className="settings-card">
        <h2 className="settings-title">♿ إتاحة الوصول</h2>
        <p className="settings-note">تُحفظ هذه الخيارات لكل ابن على حدة، وتُطبق فورًا على التطبيق كله.</p>
        <div className="setting-row">
          <div>
            <p>حجم الخط</p>
            <small>تكبير النص ليسهل قراءته على الشاشة.</small>
          </div>
          <div className="parent-levels" role="group" aria-label="حجم الخط">
            {(
              [
                ['normal', 'عادي'],
                ['large', 'كبير'],
                ['xl', 'كبير جدًا'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                className={`parent-level${progress.settings.fontSize === value ? ' active' : ''}`}
                onClick={() => setSetting('fontSize', value)}
                aria-pressed={progress.settings.fontSize === value}
              >
                <strong>{label}</strong>
              </button>
            ))}
          </div>
        </div>
        <div className="setting-row">
          <div>
            <p>تباين أعلى</p>
            <small>نص أغمق على خلفية بيضاء وحدود أوضح وروابط مسطّرة.</small>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={progress.settings.highContrast}
              onChange={(event) => setSetting('highContrast', event.target.checked)}
              aria-label="تفعيل التباين الأعلى"
            />
            <span />
          </label>
        </div>
        <div className="setting-row">
          <div>
            <p>تقليل الحركة</p>
            <small>إيقاف الحركات والانتقالات في التطبيق.</small>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={progress.settings.reduceMotion}
              onChange={(event) => setSetting('reduceMotion', event.target.checked)}
              aria-label="تفعيل تقليل الحركة"
            />
            <span />
          </label>
        </div>
        <div className="setting-row">
          <div>
            <p>التصفح بلوحة المفاتيح</p>
            <small>
              استعمل Tab للتنقل بين الأزرار والروابط، وEnter لفتحها. رابط «تخطَّ إلى المحتوى» في
              أعلى الصفحة يقفز بك مباشرة إلى الدرس أو القائمة.
            </small>
          </div>
        </div>
      </div>

      <div className="settings-card">
        <h2 className="settings-title">🔄 تحديث التطبيق</h2>
        <div className="setting-row">
          <div>
            <p>تحقق من وجود تحديث</p>
            <small>
              {updateState === 'up-to-date' && 'التطبيق محدّث، لديك أحدث نسخة.'}
              {updateState === 'available' &&
                'يوجد تحديث جديد. ستظهر لك لافتة التحديث أعلى الصفحة.'}
              {updateState === 'unsupported' && 'التحديث غير مدعوم في هذا المتصفح.'}
              {updateState === 'checking' && 'جارٍ التحقق من وجود تحديث…'}
              {updateState === 'idle' &&
                'تصل التحديثات إلى جهازك تلقائيًا، ويمكنك التحقق منها هنا.'}
            </small>
          </div>
          <button
            className="btn ghost small"
            onClick={handleCheckUpdate}
            disabled={updateState === 'checking'}
          >
            تحقق من وجود تحديث
          </button>
        </div>
      </div>

      <div className="settings-card">
        <div className="setting-row">
          <div>
            <p>عن التطبيق</p>
            <small>
              «مدرستي» تطبيق تعليمي للتعليم الابتدائي في المغرب: دروس تفاعلية وألعاب تربوية
              للمستويات من الأول إلى السادس في العربية والرياضيات والتربية الإسلامية والنشاط
              العلمي والاجتماعيات والفرنسية.
            </small>
          </div>
        </div>
        <div className="setting-row">
          <div>
            <p>الإصدار</p>
            <small>1.0.0 · يعمل دون إنترنت بعد أول فتح · لا يجمع أي بيانات</small>
          </div>
        </div>
      </div>
    </>
  );
}
