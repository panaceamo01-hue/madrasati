import { useEffect, useState } from 'react';
import { parseRoute, type Route } from './lib/router';
import { useProgress } from './lib/useProgress';
import { totalStars, addMinutes } from './lib/store';
import { LESSON_BY_ID } from './data';
import { BottomNav } from './components/BottomNav';
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
import { NotFound } from './views/NotFound';

function currentRoute(): Route {
  return parseRoute(window.location.hash);
}

export function App() {
  const [route, setRoute] = useState<Route>(currentRoute);
  const progress = useProgress();
  const stars = totalStars(progress.stars);

  useEffect(() => {
    const onChange = () => {
      setRoute(currentRoute());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

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

  return (
    <div className="app-shell">
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

      <main className="app-main">
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
          {route.name === 'parent' && <ParentView />}
          {route.name === 'examLesson' && <ExamView key={route.id} lessonId={route.id} />}
          {route.name === 'examLevel' && <ExamView key={`level-${route.level}`} level={route.level} />}
          {route.name === 'review' && <ReviewView key={route.id} lessonId={route.id} />}
          {route.name === 'certificate' && (
            <CertificateView key={route.level === 'all' ? 'all' : `level-${route.level}`} level={route.level} />
          )}
          {route.name === 'quran' && <QuranView />}
          {route.name === 'surah' && <SurahView key={route.id} surahId={route.id} />}
        </div>
      </main>

      <BottomNav current={route.name} />
    </div>
  );
}
