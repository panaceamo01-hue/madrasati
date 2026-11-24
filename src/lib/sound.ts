import { getProgress } from './store';

let audioContext: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    audioContext ??= new AudioContext();
    if (audioContext.state === 'suspended') void audioContext.resume();
    return audioContext;
  } catch {
    return null;
  }
}

/** نغمة قصيرة بدل ملفات صوتية، لتبقى كل الأصوات داخل التطبيق دون إنترنت. */
export function playTone(frequency: number, duration = 0.14, type: OscillatorType = 'sine', volume = 0.06): void {
  if (!getProgress().settings.sound) return;
  const ctx = context();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

export function playCorrect(): void {
  playTone(660, 0.12, 'triangle');
  window.setTimeout(() => playTone(880, 0.16, 'triangle'), 110);
}

export function playWrong(): void {
  playTone(220, 0.22, 'sawtooth', 0.04);
}

export function playWin(): void {
  [523, 659, 784, 1046].forEach((freq, index) => {
    window.setTimeout(() => playTone(freq, 0.18, 'triangle'), index * 130);
  });
}
