import { useEffect, useRef, useState } from 'react';
import { BASMALA, LESSON_FOR_SURAH, SURAHS_BY_ID } from '../data/quran';
import { LEVEL_NAMES } from '../data/subjects';
import { deleteRecording, loadRecording, recordingSupported, saveRecording, startRecording, type ActiveRecording } from '../lib/recording';
import { speak, speechAvailable, stopSpeaking } from '../lib/speech';
import { setMemorizationStatus } from '../lib/store';
import { useProgress } from '../lib/useProgress';

interface Props {
  surahId: string;
}

/**
 * صفحة السورة: نص الآيات بالرسم العثماني، استماع (صوت الجهاز)،
 * تسجيل تلاوة الطفل وحفظها على الجهاز، وعدّاد الحفظ.
 */
export function SurahView({ surahId }: Props) {
  const progress = useProgress();
  const surah = SURAHS_BY_ID[surahId];
  const [recording, setRecording] = useState<ActiveRecording | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [savedNote, setSavedNote] = useState('');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<number | null>(null);

  const status: 0 | 1 | 2 = progress.memorization?.[surahId]?.status ?? 0;
  const isLearning = status === 1;
  const isMemorized = status === 2;

  useEffect(() => {
    let alive = true;
    loadRecording(surahId).then((blob) => {
      if (!alive || !blob) return;
      setAudioUrl(URL.createObjectURL(blob));
      setHasSaved(true);
    });
    return () => {
      alive = false;
    };
  }, [surahId]);

  useEffect(
    () => () => {
      stopSpeaking();
      if (timer.current !== null) window.clearInterval(timer.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!surah) {
    return (
      <div className="locked-page">
        <p>لم أجد هذه السورة.</p>
        <a className="btn primary" href="#/quran">
          العودة إلى قائمة الحفظ
        </a>
      </div>
    );
  }

  const fullText = [...surah.verses].join(' ');
  const lessonId = LESSON_FOR_SURAH[surah.id];

  async function beginRecording() {
    setError('');
    setSavedNote('');
    try {
      const active = await startRecording();
      setRecording(active);
      setSeconds(0);
      timer.current = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    } catch {
      setError('تعذّر الوصول إلى الميكروفون. اسمح للتطبيق باستعماله من إعدادات المتصفح، ثم أعد المحاولة.');
    }
  }

  async function finishRecording() {
    if (!recording) return;
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    const blob = await recording.stop();
    setRecording(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    const saved = await saveRecording(surah.id, blob);
    setHasSaved(saved);
    setSavedNote(
      saved
        ? '✅ حُفظ تسجيلك على هذا الجهاز، ويمكنك الاستماع إليه في أي وقت.'
        : 'تم التسجيل، لكن تعذّر حفظه على الجهاز — يبقى متاحًا في هذه الجلسة فقط.',
    );
  }

  async function removeRecording() {
    await deleteRecording(surah.id);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setHasSaved(false);
    setSavedNote('حُذف تسجيلك.');
  }

  return (
    <div className="surah-page">
      <div className="page-head">
        <a className="back-link" href="#/quran">
          ← قائمة الحفظ
        </a>
        <h1>سورة {surah.name}</h1>
        <p>
          {LEVEL_NAMES[surah.level]} · {surah.verses.length} {surah.verses.length === 1 ? 'آية' : 'آيات'}
          {lessonId && (
            <>
              {' · '}
              <a href={`#/lesson/${lessonId}`}>درس السورة ←</a>
            </>
          )}
        </p>
      </div>

      <div className="surah-actions">
        <button
          className="btn primary"
          onClick={() => speak(`${surah.name}. ${fullText}`)}
          disabled={!speechAvailable()}
        >
          🔊 استمع إلى السورة
        </button>
        <button className="btn ghost" onClick={stopSpeaking}>
          ⏹ إيقاف الصوت
        </button>
      </div>

      <section className="surah-text" lang="ar" dir="rtl">
        {surah.id !== 'fatiha' && <p className="basmala">{BASMALA}</p>}
        {surah.verses.map((verse, index) => (
          <p className="ayah" key={index}>
            <span className="ayah-text">{verse}</span>
            <button
              className="ayah-listen"
              onClick={() => speak(verse)}
              disabled={!speechAvailable()}
              aria-label={`استمع إلى الآية ${index + 1}`}
              title="استمع إلى الآية"
            >
              🔊
            </button>
            <span className="ayah-num" aria-hidden="true">
              {index + 1}
            </span>
          </p>
        ))}
      </section>

      <section className="record-box">
        <h2>🎙️ سجّل تلاوتك</h2>
        <p>استمع إلى السورة أولًا، ثم سجّل تلاوتك واستمع إلى نفسك وقارن.</p>
        {!recordingSupported() ? (
          <p className="record-note">متصفحك لا يدعم تسجيل الصوت. جرّب متصفحًا حديثًا على الهاتف أو الحاسوب.</p>
        ) : recording ? (
          <div className="record-live">
            <span className="record-dot" aria-hidden="true" />
            <strong>يسجّل الآن… {seconds} ثانية</strong>
            <button className="btn primary" onClick={finishRecording}>
              ⏹ إيقاف وحفظ
            </button>
          </div>
        ) : (
          <button className="btn primary big" onClick={beginRecording}>
            🎙️ ابدأ التسجيل
          </button>
        )}
        {error && <p className="record-error">{error}</p>}
        {audioUrl && (
          <div className="record-playback">
            <audio controls src={audioUrl} />
            <div className="record-links">
              <a className="btn ghost small" href={audioUrl} download={`تلاوتي-سورة-${surah.name}.webm`}>
                ⬇️ نزّل تسجيلي
              </a>
              <button className="btn ghost small" onClick={removeRecording}>
                🗑️ احذف تسجيلي
              </button>
            </div>
          </div>
        )}
        {savedNote && <p className="record-note">{savedNote}</p>}
        {hasSaved && !audioUrl && <p className="record-note">لك تسجيل محفوظ لهذه السورة.</p>}
      </section>

      <section className="memorize-box">
        <h2>📖 عدّاد الحفظ</h2>
        <p>
          حالتك الآن:{' '}
          <strong>{isMemorized ? '✅ حفظتها' : isLearning ? '📖 أحفظها' : 'لم أبدأ بعد'}</strong>
        </p>
        <div className="memorize-actions">
          <button
            className={`btn${isLearning ? ' primary' : ' ghost'}`}
            onClick={() => setMemorizationStatus(surah.id, 1)}
          >
            📖 أحفظها الآن
          </button>
          <button
            className={`btn${isMemorized ? ' primary' : ' ghost'}`}
            onClick={() => setMemorizationStatus(surah.id, 2)}
          >
            ✅ حفظتها
          </button>
          {(isLearning || isMemorized) && (
            <button className="btn ghost" onClick={() => setMemorizationStatus(surah.id, null)}>
              أعدها إلى البداية
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
