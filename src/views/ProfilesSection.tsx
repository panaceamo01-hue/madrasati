import { useState } from 'react';
import {
  MAX_PROFILES,
  PROFILE_EMOJIS,
  createProfile,
  deleteProfile,
  switchProfile,
  updateProfile,
} from '../lib/store';
import { useProfiles } from '../lib/useProfiles';

/** إدارة حسابات الأبناء (داخل مساحة ولي الأمر): إضافة وتسمية وحذف وتبديل. */
export function ProfilesSection() {
  const { profiles, activeId } = useProfiles();
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState(PROFILE_EMOJIS[0]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function add() {
    const created = createProfile(newName, newEmoji);
    if (created) {
      setNewName('');
      setNewEmoji(PROFILE_EMOJIS[0]);
    }
  }

  return (
    <section className="parent-card">
      <h2>👨‍👩‍👧‍👦 الأبناء ({profiles.length}/{MAX_PROFILES})</h2>
      <p className="start-hint">
        لكل ابن حسابه الخاص: دروسه ونجومه وسوره المحفوظة وشهاداته. بدّل الحساب من الرئيسية،
        وقارن بينهم في لوحة الترتيب.
      </p>

      <ul className="profile-manage-list">
        {profiles.map((profile) => (
          <li key={profile.id} className="profile-manage-row">
            <span className="profile-manage-avatar" aria-hidden="true">
              {profile.emoji}
            </span>
            <input
              type="text"
              value={profile.name}
              onChange={(event) => updateProfile(profile.id, { name: event.target.value })}
              aria-label="اسم الابن"
              maxLength={20}
            />
            <span className="profile-manage-emojis">
              {PROFILE_EMOJIS.slice(0, 5).map((emoji) => (
                <button
                  key={emoji}
                  className={`emoji-pick${profile.emoji === emoji ? ' active' : ''}`}
                  onClick={() => updateProfile(profile.id, { emoji })}
                  aria-label={`الصورة ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </span>
            {profile.id === activeId ? (
              <span className="profile-active-tag">النشط الآن</span>
            ) : (
              <button className="btn ghost small" onClick={() => switchProfile(profile.id)}>
                بدّل إليه
              </button>
            )}
            {profiles.length > 1 &&
              (confirmDelete === profile.id ? (
                <button
                  className="btn danger small"
                  onClick={() => {
                    deleteProfile(profile.id);
                    setConfirmDelete(null);
                  }}
                >
                  تأكيد الحذف؟
                </button>
              ) : (
                <button className="btn ghost small" onClick={() => setConfirmDelete(profile.id)}>
                  🗑️
                </button>
              ))}
          </li>
        ))}
      </ul>

      {profiles.length < MAX_PROFILES ? (
        <div className="profile-add">
          <input
            type="text"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="اسم الابن الجديد"
            aria-label="اسم الابن الجديد"
            maxLength={20}
          />
          <span className="profile-manage-emojis">
            {PROFILE_EMOJIS.slice(0, 5).map((emoji) => (
              <button
                key={emoji}
                className={`emoji-pick${newEmoji === emoji ? ' active' : ''}`}
                onClick={() => setNewEmoji(emoji)}
                aria-label={`الصورة ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </span>
          <button className="btn primary" onClick={add} disabled={!newName.trim()}>
            ＋ أضف ابنًا
          </button>
        </div>
      ) : (
        <p className="start-hint">بلغت الحد الأقصى ({MAX_PROFILES} أبناء).</p>
      )}
      <p className="start-hint">حذف ابن يحذف كل تقدمه نهائيًا من هذا الجهاز.</p>
      <a className="btn ghost" href="#/leaderboard">
        🏆 لوحة ترتيب العائلة
      </a>
    </section>
  );
}
