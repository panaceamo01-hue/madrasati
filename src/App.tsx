import { useEffect, useState } from 'react';
import { parseRoute, type Route } from './lib/router';
import { useProgress } from './lib/useProgress';
import { totalStars, addMinutes } from './lib/store';
import { loadLicense, revalidateLicense } from './lib/license';
import { clearSetupDone, isSetupDone, markSetupDone } from './lib/setup';
import { LESSON_BY_ID } from './data';
import { BottomNav } from './components/BottomNav';
import { UpdateBanner } from './components/UpdateBanner';
import { Home } from './views/Home';
import { LevelView } from './views/LevelView';
import { LessonPlayer } from './views/LessonPlayer';
import { GamesView } from './views/GamesView';
import { GameView } from './views/GameView';
import { ProgressView } from './views/ProgressView';
import { SettingsView } from './views/SettingsView';
import { WisdomView } from './views/WisdomView';
import { ParentView } from './views/ParentView';
import { ExamView } from './views/ExamView';
import { ReviewView } from './views/ReviewView';
import { CertificateView } from './views/CertificateView';
import { QuranView } from './views/QuranView';
import { SurahView } from './views/SurahView';
import { LeaderboardView } from './views/LeaderboardView';
import { ActivationView } from './views/ActivationView';
import { SetupView } from './views/SetupView';
import { AdminView } from './views/AdminView';
import { NotFound } from './views/NotFound';

function currentRoute(): Route {
  return parseRoute(window.location.hash);
}

export function App() {
  const [route, setRoute] = useState<Route>(currentRoute);
  const progress = useProgress();
  const stars = totalStars(progress.stars);
  /** هل فُعّل التطبيق بكود على هذا الجهاز؟ (الترخيص محفوظ محليًا فيبقى بعد التحديثات.) */
  const [licensed, setLicensed] = useState<boolean>(() => loadLicense() !== null);
  /** إعداد حسابات الأبناء لأول مرة: يظهر المعالج مرة واحدة بعد التفعيل. */
  const [setupDone, setSetupDone] = useState<boolean>(() => isSetupDone());
  const [setupOpen, setSetupOpen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      setRoute(currentRoute());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  // إعادة التحقق من الترخيص في الخادم عند التشغيل (مرة كل 24 ساعة)؛
  // إن أكد الخادم أن الترخيص لم يعد صالحًا نعود إلى شاشة التفعيل.
  useEffect(() => {
    if (!licensed) return;
    let cancelled = false;
    void revalidateLicense().then((ok) => {
      if (!cancelled && !ok) setLicensed(false);
    });
    return () => {
      cancelled = true;
    };
  }, [licensed]);

  // إتاحة الوصول: تُطبق خيارات الابن النشط على الصفحة كلها.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('a11y-font-large', progress.settings.fontSize === 'large');
    root.classList.toggle('a11y-font-xl', progress.settings.fontSize === 'xl');
    root.classList.toggle('a11y-contrast', progress.settings.highContrast);
    root.classList.toggle('a11y-reduce-motion', progress.settings.reduceMotion);
  }, [progress.settings.fontSize, progress.settings.highContrast, progress.settings.reduceMotion]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route]);

  useEffect(() => {
    const learning =
      route.name === 'lesson' ||
      route.name === 'examLesson' ||
      route.name === 'examLevel' ||
      route.name === 'review' ||
      route.name === 'surah';
    if (!learning) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') addMinutes(0.5);
    }, 30000);
    return () => window.clearInterval(timer);
  }, [route.name]);

  const lesson = route.name === 'lesson' ? LESSON_BY_ID[route.id] : undefined;

  // إدارة الأكواد لا تحتاج ترخيصًا (لصاحب التطبيق).
  if (route.name === 'admin') {
    return (
      <div className="app-shell">
        <UpdateBanner />
        <main className="app-main" id="main" tabIndex={-1}>
          <div className="container">
            <AdminView />
          </div>
        </main>
      </div>
    );
  }

  // بلا ترخيص: شاشة التفعيل بدل التطبيق كاملًا (بلا شريط علوي ولا تنقل سفلي).
  if (!licensed) {
    return (
      <div className="app-shell">
        <UpdateBanner />
        <main className="app-main" id="main" tabIndex={-1}>
          <div className="container">
            <ActivationView
              onActivated={() => {
                setLicensed(true);
                window.location.hash = '#/';
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  // بعد التفعيل مباشرة: معالج إعداد حسابات الأبناء (عدد الأبناء ومستوى كل
  // واحد)، يظهر مرة واحدة، ويمكن إعادة فتحه من مساحة ولي الأمر.
  if (licensed && (!setupDone || setupOpen)) {
    return (
      <div className="app-shell">
        <UpdateBanner />
        <main className="app-main" id="main" tabIndex={-1}>
          <div className="container">
            <SetupView
              onDone={() => {
                markSetupDone();
                setSetupDone(true);
                setSetupOpen(false);
                window.location.hash = '#/';
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <UpdateBanner />
      <a className="skip-link" href="#main">
        تخطَّ إلى المحتوى
      </a>
      <header className="topbar">
        <div className="container topbar-inner">
          <a className="brand" href="#/">
            <span className="brand-mark" aria-hidden="true">
              🎒
            </span>
            <span className="brand-text">
              مدرستي
              <small>تعلّم والعب · دون إنترنت</small>
            </span>
          </a>
          <span className="stars-pill" title="مجموع النجوم">
            <span aria-hidden="true">⭐</span> {stars}
          </span>
        </div>
      </header>

      <main className="app-main" id="main" tabIndex={-1}>
        <div className="container">
          {route.name === 'home' && <Home />}
          {route.name === 'level' && <LevelView level={route.level} />}
          {route.name === 'lesson' &&
            (lesson ? <LessonPlayer key={lesson.id} lesson={lesson} /> : <NotFound />)}
          {route.name === 'games' && <GamesView />}
          {route.name === 'game' && <GameView gameId={route.id} level={route.level} />}
          {route.name === 'progress' && <ProgressView />}
          {route.name === 'settings' && <SettingsView />}
          {route.name === 'wisdom' && <WisdomView />}
          {route.name === 'parent' && (
            <ParentView
              onReopenSetup={() => {
                clearSetupDone();
                setSetupDone(false);
                setSetupOpen(true);
                window.location.hash = '#/';
              }}
            />
          )}
          {route.name === 'examLesson' && <ExamView key={route.id} lessonId={route.id} />}
          {route.name === 'examLevel' && <ExamView key={`level-${route.level}`} level={route.level} />}
          {route.name === 'review' && <ReviewView key={route.id} lessonId={route.id} />}
          {route.name === 'certificate' && (
            <CertificateView key={route.level === 'all' ? 'all' : `level-${route.level}`} level={route.level} />
          )}
          {route.name === 'quran' && <QuranView />}
          {route.name === 'surah' && <SurahView key={route.id} surahId={route.id} />}
          {route.name === 'leaderboard' && <LeaderboardView />}
          {route.name === 'activate' && <Home />}
        </div>
      </main>

      <BottomNav current={route.name} />
    </div>
  );
}
