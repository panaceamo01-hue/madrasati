/** دور مستعمل التطبيق: ولي أمر (مساحة الأطفال) أو أستاذ(ة) (مساحة الأستاذ). */
export type UserRole = 'parent' | 'teacher';

const KEY = 'madrasati:role:v1';

export function loadRole(): UserRole | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'parent' || value === 'teacher' ? value : null;
  } catch {
    return null;
  }
}

export function saveRole(role: UserRole): void {
  try {
    localStorage.setItem(KEY, role);
  } catch {
    /* التخزين غير متاح */
  }
}

export function clearRole(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* التخزين غير متاح */
  }
}
