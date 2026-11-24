import { getProgress } from './store';

let voices: SpeechSynthesisVoice[] = [];

function refreshVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  voices = window.speechSynthesis.getVoices();
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

export function speechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * قراءة النص بصوت الجهاز. تعتمد على الأصوات المثبتة في المتصفح،
 * فإن لم يتوفر صوت عربي لا يحدث شيء (لا اتصال بالشبكة في كل الأحوال).
 */
export function speak(text: string): void {
  if (!speechAvailable() || !getProgress().settings.speech) return;
  try {
    window.speechSynthesis.cancel();
    if (!voices.length) refreshVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    const arabic = voices.find((voice) => voice.lang.toLowerCase().startsWith('ar'));
    if (arabic) utterance.voice = arabic;
    window.speechSynthesis.speak(utterance);
  } catch {
    /* الصوت ميزة إضافية: نتجاهل أي خطأ. */
  }
}

export function stopSpeaking(): void {
  if (speechAvailable()) window.speechSynthesis.cancel();
}
