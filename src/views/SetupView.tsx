import { useState } from 'react';
import { LEVEL_AGES, LEVEL_NAMES, LEVELS } from '../data/subjects';
import type { Level } from '../types';
import {
  MAX_PROFILES,
  PROFILE_EMOJIS,
  createProfile,
  getProfileLevel,
  getProfiles,
  setProfileLevel,
  switchProfile,
  updateProfile,
} from '../lib/store';
import { markSetupDone } from '../lib/setup';

interface Props {
  onDone: () => void;
}

interface ChildDraft {
  name: string;
  emoji: string;
  level: Level;
}

const ORDINALS = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];

function defaultName(index: number): string {
  return `ابني ${ORDINALS[index] ?? ''}`.trim();
}

/**
 * معالج إعداد حسابات الأبناء لأول مرة، يظهر بعد التفعيل مباشرة:
 * الخطوة الأولى: كم عدد الأبناء؟ ثم لكل ابن: الاسم والمستوى الدراسي.
 * عند الانتهاء يدخل ولي الأمر إلى التطبيق فيجد مستوى كل ابن وحده ظاهرًا
 * (بقية المستويات مخفية)، ويبدّل بين الأبناء من الرئيسية.
 */
export function SetupView({ onDone }: Props) {
  const existing = getProfiles();
  const [step, setStep] = useState<1 | 2>(1);
  const [count, setCount] = useState(existing.length || 1);
  const [drafts, setDrafts] = useState<ChildDraft[]>(() =>
    Array.from({ length: existing.length || 1 }, (_, index) => {
      const profile = existing[index];
      return {
        name: profile?.name ?? '',
        emoji: profile?.emoji ?? PROFILE_EMOJIS[index % PROFILE_EMOJIS.length],
        level: (profile ? getProfileLevel(profile.id) : null) ?? 1,
      };
    }),
  );

  function changeCount(next: number): void {
    setCount(next);
    setDrafts((current) =>
      Array.from({ length: next }, (_, index) => {
        if (index < current.length) return current[index];
        const profile = existing[index];
        return {
          name: profile?.name ?? '',
          emoji: profile?.emoji ?? PROFILE_EMOJIS[index % PROFILE_EMOJIS.length],
          level: (profile ? getProfileLevel(profile.id) : null) ?? 1,
        };
      }),
    );
  }

  function updateDraft(index: number, patch: Partial<ChildDraft>): void {
    setDrafts((current) => current.map((draft, i) => (i === index ? { ...draft, ...patch } : draft)));
  }

  function finish(): void {
    const profiles = getProfiles();
    drafts.forEach((draft, index) => {
      const name = draft.name.trim() || defaultName(index);
      if (index < profiles.length) {
        const profile = profiles[index];
        updateProfile(profile.id, { name, emoji: draft.emoji });
        setProfileLevel(profile.id, draft.level);
      } else {
        createProfile(name, draft.emoji, draft.level);
      }
    });
    const first = getProfiles()[0];
    if (first) switchProfile(first.id);
    markSetupDone();
    onDone();
  }

  function skip(): void {
    markSetupDone();
    onDone();
  }

  return (
    <div className="setup-page">
      <div className="page-head">
        <h1>🎒 أهلًا بك في مدرستي</h1>
        <p>لنجهّز التطبيق لأبنائك في دقيقة واحدة.</p>
      </div>

      {step === 1 ? (
        <div className="setup-card">
          <h2>كم عدد أبنائك؟</h2>
          <p className="start-hint">لكل ابن حسابه الخاص: دروسه ونجومه ومستواه الدراسي.</p>
          <div className="setup-count" role="group" aria-label="عدد الأبناء">
            {Array.from({ length: MAX_PROFILES }, (_, index) => index + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={`setup-count-btn${count === n ? ' active' : ''}`}
                onClick={() => changeCount(n)}
                aria-pressed={count === n}
              >
                <span className="setup-count-num">{n}</span>
                <span>{n === 1 ? 'ابن واحد' : n === 2 ? 'ابنان' : `${n} أبناء`}</span>
              </button>
            ))}
          </div>
          <button className="btn primary big" onClick={() => setStep(2)}>
            التالي ←
          </button>
          <button type="button" className="link-button setup-skip" onClick={skip}>
            تخطَّ الإعداد الآن
          </button>
        </div>
      ) : (
        <div className="setup-card">
          <h2>من أبناؤك؟ ومستوى كل واحد؟</h2>
          <p className="start-hint">
            بعد الدخول سيظهر لكل ابن مستواه الدراسي وحده، فتختفي بقية المستويات ليركز على مستواه.
          </p>
          {drafts.map((draft, index) => (
            <section key={index} className="setup-child" aria-label={`الابن ${ORDINALS[index]}`}>
              <div className="setup-child-head">
                <span className="setup-child-avatar" aria-hidden="true">
                  {draft.emoji}
                </span>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(event) => updateDraft(index, { name: event.target.value })}
                  placeholder={defaultName(index)}
                  aria-label={`اسم الابن ${ORDINALS[index]}`}
                  maxLength={20}
                />
              </div>
              <div className="profile-manage-emojis setup-emojis" role="group" aria-label="اختر صورة رمزية">
                {PROFILE_EMOJIS.slice(0, 6).map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`emoji-pick${draft.emoji === emoji ? ' active' : ''}`}
                    onClick={() => updateDraft(index, { emoji })}
                    aria-label={`الصورة ${emoji}`}
                    aria-pressed={draft.emoji === emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="setup-levels" role="group" aria-label={`مستوى الابن ${ORDINALS[index]}`}>
                {LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`setup-level-btn${draft.level === level ? ' active' : ''}`}
                    onClick={() => updateDraft(index, { level })}
                    aria-pressed={draft.level === level}
                  >
                    <strong>{LEVEL_NAMES[level]}</strong>
                    <small>{LEVEL_AGES[level]}</small>
                  </button>
                ))}
              </div>
            </section>
          ))}
          <div className="setup-actions">
            <button className="btn ghost" onClick={() => setStep(1)}>
              → رجوع
            </button>
            <button className="btn primary big" onClick={finish}>
              ابدأ التعلم 🚀
            </button>
          </div>
          <button type="button" className="link-button setup-skip" onClick={skip}>
            تخطَّ الإعداد الآن
          </button>
        </div>
      )}
    </div>
  );
}
