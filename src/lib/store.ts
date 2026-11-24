import type { Level } from '../types';
import { LESSON_BY_ID } from '../data';

export interface ProgressSettings {
  speech: boolean;
  sound: boolean;
  /** اسم الطفل كما يدخله ولي الأمر. */
  childName: string;
  /** المستوى الدراسي الذي يختاره ولي الأمر، أو null لعرض كل المستويات. */
  childLevel: Level | null;
  /** عند التفعيل لا يظهر في التطبيق إلا مستوى الطفل. */
  parentLock: boolean;
  /** يبدأ الطفل من المستوى الأول: تُفتح المستويات من الأول حتى مستوى الطفل. */
  startFromFirst: boolean;
  /** هدف التعلم اليومي بالدقائق، يضبطه ولي الأمر (10 أو 15 أو 20 أو 30 أو 40). */
  dailyGoalMinutes: number;
  /** تفعيل التذكير اللطيف عند التأخر عن هدف اليوم. */
  reminderEnabled: boolean;
  /** إظهار فيديوهات الشرح (يوتيوب، تحتاج إلى الإنترنت) في الدروس التي لها فيديو. */
  videosEnabled: boolean;
  /** حجم الخط: عادي أو كبير أو كبير جدًا (إتاحة الوصول). */
  fontSize: 'normal' | 'large' | 'xl';
  /** تباين أعلى: نص أسود على خلفية بيضاء وحدود أوضح. */
  highContrast: boolean;
  /** تقليل الحركة: إيقاف الحركات والانتقالات. */
  reduceMotion: boolean;
}

/** خيارات هدف التعلم اليومي بالدقائق. */
export const DAILY_GOAL_OPTIONS: number[] = [10, 15, 20, 30, 40];

export interface DailyState {
  /** آخر يوم فيه نشاط بصيغة YYYY-MM-DD. */
  lastDate: string;
  /** عدد الأيام المتتالية. */
  streak: number;
  /** الأنشطة المنجزة اليوم: teach / practice / game / wisdom. */
  today: string[];
}

/** محاولة اختبار واحدة (درس أو مستوى). */
export interface ExamAttempt {
  /** "lesson:<id>" أو "level:<n>". */
  key: string;
  kind: 'lesson' | 'level';
  /** معرّف الدرس في اختبار الدرس، أو null في اختبار المستوى. */
  lessonId: string | null;
  /** رقم المستوى. */
  level: number;
  percent: number;
  passed: boolean;
  /** يوم المحاولة بصيغة YYYY-MM-DD. */
  date: string;
}

/** إتمام درس أول مرة: تاريخه وعدد نجومه. */
export interface LessonCompletion {
  date: string;
  stars: number;
}

/** حالة حفظ سورة: 1 = أحفظها الآن، 2 = حفظتها. */
export interface MemorizationStatus {
  status: 1 | 2;
  date: string;
}

/** نشاط يوم واحد. */
export interface DayActivity {
  /** دقائق التعلّم المقدرة (تُحتسب كل نصف دقيقة أثناء الدرس أو الاختبار). */
  minutes: number;
  /** دروس أُنجزت أول مرة. */
  lessons: number;
  /** اختبارات تُجتاز أول مرة. */
  exams: number;
  /** أرقام قياسية جديدة في الألعاب. */
  games: number;
}

const EMPTY_DAY: DayActivity = { minutes: 0, lessons: 0, exams: 0, games: 0 };

export interface Progress {
  /** معرّف الدرس ← عدد النجوم 1 إلى 3. */
  stars: Record<string, number>;
  /** "معرّف اللعبة:المستوى" ← أفضل نتيجة. */
  gameBest: Record<string, number>;
  settings: ProgressSettings;
  daily: DailyState;
  /** "lesson:<id>" أو "level:<n>" ← أفضل نسبة نجاح في الاختبار. */
  exams: Record<string, number>;
  /** "YYYY-MM-DD" ← النشاط اليومي. */
  activity: Record<string, DayActivity>;
  /** نص السؤال ← عدد مرات الخطأ. */
  mistakes: Record<string, number>;
  /** معرّف الدرس ← عدد مرات الخطأ في تمارينه واختباراته. */
  mistakeLessons: Record<string, number>;
  /** محاولات الاختبار بالترتيب الزمني (الأقدم أولًا)، بحد أقصى 200 محاولة. */
  examAttempts: ExamAttempt[];
  /** معرّف الدرس ← تاريخ إتمامه أول مرة ونجومه. */
  lessonCompletions: Record<string, LessonCompletion>;
  /** معرّف السورة ← حالة حفظها. */
  memorization: Record<string, MemorizationStatus>;
  /** آخر يوم ظهر فيه تذكير التأخر، بصيغة YYYY-MM-DD (مرة واحدة في اليوم كحد أقصى). */
  lastReminderDate: string;
}

const KEY = 'madrasati:progress:v1';

/** ملف تعريف ابن: اسمه وصورته الرمزية. التقدم نفسه محفوظ لكل ابن على حدة. */
export interface ChildProfile {
  id: string;
  name: string;
  emoji: string;
}

/** الصور الرمزية المتاحة للأبناء. */
export const PROFILE_EMOJIS: string[] = ['🦸', '🦊', '🐼', '🦁', '🐰', '🦄', '🐸', '🦉', '🐯', '🐵'];
/** أكبر عدد أبناء في العائلة. */
export const MAX_PROFILES = 6;

const PROFILES_KEY = 'madrasati:profiles:v1';
const progressKey = (profileId: string) => `${KEY}:${profileId}`;

interface ProfilesState {
  activeId: string;
  profiles: ChildProfile[];
}

const EMPTY_SETTINGS: ProgressSettings = {
  speech: true,
  sound: true,
  childName: '',
  childLevel: null,
  parentLock: false,
  startFromFirst: false,
  dailyGoalMinutes: 20,
  reminderEnabled: true,
  videosEnabled: true,
  fontSize: 'normal',
  highContrast: false,
  reduceMotion: false,
};

const EMPTY_DAILY: DailyState = { lastDate: '', streak: 0, today: [] };

export function todayKey(date = new Date()): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function yesterdayKey(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return todayKey(date);
}

function emptyProgress(): Progress {
  return { stars: {}, gameBest: {}, settings: { ...EMPTY_SETTINGS }, daily: { ...EMPTY_DAILY }, exams: {}, activity: {}, mistakes: {}, mistakeLessons: {}, examAttempts: [], lessonCompletions: {}, memorization: {}, lastReminderDate: '' };
}

function loadFor(key: string): Progress {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      stars: parsed.stars ?? {},
      gameBest: parsed.gameBest ?? {},
      settings: { ...EMPTY_SETTINGS, ...(parsed.settings ?? {}) },
      daily: { ...EMPTY_DAILY, ...(parsed.daily ?? {}) },
      exams: parsed.exams ?? {},
      activity: parsed.activity ?? {},
      mistakes: parsed.mistakes ?? {},
      mistakeLessons: parsed.mistakeLessons ?? {},
      examAttempts: parsed.examAttempts ?? [],
      lessonCompletions: parsed.lessonCompletions ?? {},
      memorization: parsed.memorization ?? {},
      lastReminderDate: parsed.lastReminderDate ?? '',
    };
  } catch {
    return emptyProgress();
  }
}

/**
 * يقرأ ملفات الأبناء، أو ينشئ أول ملف بترحيل التقدم الوحيد القديم
 * (المحفوظ في المفتاح القديم) إليه، فيبقى تقدم الابن الأول كما كان.
 */
function loadProfiles(): ProfilesState {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ProfilesState;
      if (parsed.profiles?.length && parsed.activeId) return parsed;
    }
  } catch {
    /* نكمل إلى الترحيل. */
  }
  const legacy = loadFor(KEY);
  const profile: ChildProfile = {
    id: 'child-1',
    name: legacy.settings.childName.trim() || 'ابني',
    emoji: '🦸',
  };
  const next: ProfilesState = { activeId: profile.id, profiles: [profile] };
  try {
    localStorage.setItem(progressKey(profile.id), JSON.stringify(legacy));
    localStorage.removeItem(KEY);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
  } catch {
    /* التخزين غير متاح: تبقى الملفات في الجلسة الحالية. */
  }
  return next;
}

let profilesState: ProfilesState = loadProfiles();
let state: Progress = loadFor(progressKey(profilesState.activeId));
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist() {
  try {
    localStorage.setItem(progressKey(profilesState.activeId), JSON.stringify(state));
  } catch {
    /* التخزين غير متاح (وضع خاص مثلًا): يبقى التقدم في الجلسة الحالية. */
  }
}

function persistProfiles() {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profilesState));
  } catch {
    /* نتجاهل: تبقى الملفات في الجلسة الحالية. */
  }
}

/** ملفات الأبناء والابن النشط (مرجع مستقر ما لم يتغيرا). */
export function getProfilesState(): ProfilesState {
  return profilesState;
}

export function getProfiles(): ChildProfile[] {
  return profilesState.profiles;
}

export function getActiveProfileId(): string {
  return profilesState.activeId;
}

export function getActiveProfile(): ChildProfile {
  return profilesState.profiles.find((profile) => profile.id === profilesState.activeId) ?? profilesState.profiles[0];
}

/** يبدّل الابن النشط (يحفظ تقدم الحالي تلقائيًا عبر persist السابقة). */
export function switchProfile(id: string): void {
  if (id === profilesState.activeId) return;
  if (!profilesState.profiles.some((profile) => profile.id === id)) return;
  profilesState = { ...profilesState, activeId: id };
  persistProfiles();
  state = loadFor(progressKey(id));
  emit();
}

/** ينشئ ابنًا جديدًا ويبدّل إليه. يعيد null إن كان الاسم فارغًا أو بلغ العدد الأقصى.
 *  عند تمرير مستوى يُقفل بقية المستويات (وضع ولي الأمر) منذ البداية. */
export function createProfile(name: string, emoji: string, level?: Level | null): ChildProfile | null {
  const clean = name.trim().slice(0, 20);
  if (!clean || profilesState.profiles.length >= MAX_PROFILES) return null;
  const profile: ChildProfile = {
    id: `child-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: clean,
    emoji,
  };
  profilesState = { ...profilesState, profiles: [...profilesState.profiles, profile], activeId: profile.id };
  persistProfiles();
  state = {
    ...emptyProgress(),
    settings: {
      ...EMPTY_SETTINGS,
      childName: clean,
      childLevel: level ?? null,
      parentLock: level != null,
      startFromFirst: false,
    },
  };
  persist();
  emit();
  return profile;
}

/** مستوى ابن (من إعداداته المحفوظة)، أو null إن لم يحدده ولي الأمر بعد. */
export function getProfileLevel(id: string): Level | null {
  if (id === profilesState.activeId) return state.settings.childLevel;
  return loadFor(progressKey(id)).settings.childLevel;
}

/** يحدد مستوى ابن ويقفل بقية المستويات (وضع ولي الأمر). */
export function setProfileLevel(id: string, level: Level): void {
  const patch = { childLevel: level, parentLock: true, startFromFirst: false };
  if (id === profilesState.activeId) {
    state = { ...state, settings: { ...state.settings, ...patch } };
    persist();
  } else {
    const other = loadFor(progressKey(id));
    try {
      localStorage.setItem(
        progressKey(id),
        JSON.stringify({ ...other, settings: { ...other.settings, ...patch } }),
      );
    } catch {
      /* نتجاهل: يبقى التغيير في الجلسة الحالية. */
    }
  }
  emit();
}

/** يغيّر اسم ابن أو صورته الرمزية. */
export function updateProfile(id: string, patch: Partial<Pick<ChildProfile, 'name' | 'emoji'>>): void {
  const name = patch.name?.trim().slice(0, 20);
  profilesState = {
    ...profilesState,
    profiles: profilesState.profiles.map((profile) =>
      profile.id === id
        ? { ...profile, ...(name ? { name } : {}), ...(patch.emoji ? { emoji: patch.emoji } : {}) }
        : profile,
    ),
  };
  persistProfiles();
  if (id === profilesState.activeId && name) {
    state = { ...state, settings: { ...state.settings, childName: name } };
    persist();
  }
  emit();
}

/** يحذف ابنًا وتقدمه. يعيد false إن كان الابن الوحيد. */
export function deleteProfile(id: string): boolean {
  if (profilesState.profiles.length <= 1) return false;
  const remaining = profilesState.profiles.filter((profile) => profile.id !== id);
  try {
    localStorage.removeItem(progressKey(id));
  } catch {
    /* نتجاهل. */
  }
  const wasActive = id === profilesState.activeId;
  profilesState = { activeId: wasActive ? remaining[0].id : profilesState.activeId, profiles: remaining };
  persistProfiles();
  if (wasActive) state = loadFor(progressKey(profilesState.activeId));
  emit();
  return true;
}

/** تقدم كل الأبناء (للوحة الترتيب): النشط من الذاكرة، والباقون من التخزين. */
export function getAllProfilesProgress(): { profile: ChildProfile; progress: Progress }[] {
  return profilesState.profiles.map((profile) => ({
    profile,
    progress: profile.id === profilesState.activeId ? state : loadFor(progressKey(profile.id)),
  }));
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProgress(): Progress {
  return state;
}

/** يسجّل نشاطًا في حصة اليوم ويحدّث سلسلة الأيام. */
export function touchDaily(item: string): void {
  const today = todayKey();
  const daily = state.daily;
  let next: DailyState;
  if (daily.lastDate === today) {
    if (daily.today.includes(item)) return;
    next = { ...daily, today: [...daily.today, item] };
  } else {
    const streak = daily.lastDate === yesterdayKey() ? daily.streak + 1 : 1;
    next = { lastDate: today, streak, today: [item] };
  }
  state = { ...state, daily: next };
  persist();
  emit();
}

function dayActivity(dateKey: string): DayActivity {
  return state.activity[dateKey] ?? EMPTY_DAY;
}

function changeActivity(dateKey: string, update: Partial<DayActivity>): void {
  const current = dayActivity(dateKey);
  state = {
    ...state,
    activity: { ...state.activity, [dateKey]: { ...current, ...update } },
  };
  persist();
  emit();
}

export function recordMistake(question: string, lessonId?: string): void {
  const mistakeLessons =
    lessonId != null
      ? { ...state.mistakeLessons, [lessonId]: (state.mistakeLessons[lessonId] ?? 0) + 1 }
      : state.mistakeLessons;
  state = {
    ...state,
    mistakes: { ...state.mistakes, [question]: (state.mistakes[question] ?? 0) + 1 },
    mistakeLessons,
  };
  persist();
  emit();
}

/**
 * أجاب الطفل صحيحًا في المراجعة عن سؤال كان يخطئ فيه:
 * ينقص عدد أخطائه فيه، فيخرج من قائمة الأسئلة الضعيفة عند إتقانه.
 */
export function resolveMistake(question: string, lessonId?: string): void {
  const current = state.mistakes[question] ?? 0;
  if (current === 0) return;
  const mistakes = { ...state.mistakes };
  if (current <= 1) delete mistakes[question];
  else mistakes[question] = current - 1;
  const mistakeLessons =
    lessonId != null
      ? {
          ...state.mistakeLessons,
          [lessonId]: Math.max(0, (state.mistakeLessons[lessonId] ?? 0) - 1),
        }
      : state.mistakeLessons;
  if (lessonId != null && mistakeLessons[lessonId] === 0) delete mistakeLessons[lessonId];
  state = { ...state, mistakes, mistakeLessons };
  persist();
  emit();
}

/** خطأ في تمرين بلا نص سؤال (ترتيب أو بناء كلمة): يُحسب على الدرس فقط. */
export function recordLessonMistake(lessonId: string): void {
  state = {
    ...state,
    mistakeLessons: { ...state.mistakeLessons, [lessonId]: (state.mistakeLessons[lessonId] ?? 0) + 1 },
  };
  persist();
  emit();
}

/** دقائق التعلم المحققة في يوم معين (اليوم الحالي افتراضًا). */
export function todayMinutes(activity: Record<string, DayActivity>, dateKey: string = todayKey()): number {
  return Math.round((activity[dateKey]?.minutes ?? 0) * 10) / 10;
}

/** يسجّل أن تذكير التأخر ظهر اليوم، حتى لا يتكرر في اليوم نفسه. */
export function markReminderShown(): void {
  state = { ...state, lastReminderDate: todayKey() };
  persist();
  emit();
}

/** يضيف دقائق تعلّم إلى اليوم الحالي. */
export function addMinutes(minutes: number): void {
  if (minutes <= 0) return;
  const dateKey = todayKey();
  const total = Math.round((dayActivity(dateKey).minutes + minutes) * 10) / 10;
  changeActivity(dateKey, { minutes: total });
}

/** يسجّل حدثًا منجزًا اليوم (درس، اختبار ناجح، رقم قياسي في لعبة). */
export function logActivity(kind: 'lessons' | 'exams' | 'games'): void {
  const dateKey = todayKey();
  changeActivity(dateKey, { [kind]: dayActivity(dateKey)[kind] + 1 });
}

export function saveLessonStars(lessonId: string, stars: number): void {
  touchDaily('practice');
  const current = state.stars[lessonId] ?? 0;
  if (stars <= current) return;
  const lessonCompletions =
    current === 0 && !state.lessonCompletions[lessonId]
      ? { ...state.lessonCompletions, [lessonId]: { date: todayKey(), stars: Math.min(3, stars) } }
      : state.lessonCompletions;
  state = {
    ...state,
    stars: { ...state.stars, [lessonId]: Math.min(3, stars) },
    lessonCompletions,
  };
  persist();
  emit();
  if (current === 0) logActivity('lessons');
}

export function saveGameScore(gameId: string, level: number, score: number): boolean {
  touchDaily('game');
  const key = `${gameId}:${level}`;
  const current = state.gameBest[key] ?? 0;
  if (score <= current) return false;
  state = { ...state, gameBest: { ...state.gameBest, [key]: score } };
  persist();
  emit();
  logActivity('games');
  return true;
}

export function saveExamResult(key: string, percent: number): boolean {
  const current = state.exams[key] ?? 0;
  const passed = percent >= 70;
  const lessonMatch = key.match(/^lesson:(.+)$/);
  const levelMatch = key.match(/^level:(\d+)$/);
  const attempt: ExamAttempt = {
    key,
    kind: lessonMatch ? 'lesson' : 'level',
    lessonId: lessonMatch ? lessonMatch[1] : null,
    level: lessonMatch
      ? (LESSON_BY_ID[lessonMatch[1]]?.level ?? 0)
      : levelMatch
        ? Number(levelMatch[1])
        : 0,
    percent,
    passed,
    date: todayKey(),
  };
  const examAttempts = [...state.examAttempts, attempt].slice(-200);
  if (percent <= current) {
    state = { ...state, examAttempts };
    persist();
    emit();
    return false;
  }
  state = { ...state, exams: { ...state.exams, [key]: percent }, examAttempts };
  persist();
  emit();
  if (passed && current < 70) logActivity('exams');
  return true;
}

export function setSetting<K extends keyof ProgressSettings>(key: K, value: ProgressSettings[K]): void {
  state = { ...state, settings: { ...state.settings, [key]: value } };
  persist();
  emit();
}

export function resetProgress(): void {
  state = {
    stars: {},
    gameBest: {},
    settings: { ...state.settings },
    daily: { ...EMPTY_DAILY },
    exams: {},
    activity: {},
    mistakes: {},
    mistakeLessons: {},
    examAttempts: [],
    lessonCompletions: {},
    memorization: {},
    lastReminderDate: '',
  };
  persist();
  emit();
}

/** يحدّد حالة حفظ سورة (1 = أحفظها، 2 = حفظتها)، أو null لإعادتها إلى البداية. */
export function setMemorizationStatus(surahId: string, status: 1 | 2 | null): void {
  const memorization = { ...state.memorization };
  if (status === null) delete memorization[surahId];
  else memorization[surahId] = { status, date: todayKey() };
  state = { ...state, memorization };
  persist();
  emit();
}

export function totalStars(stars: Record<string, number>): number {
  return Object.values(stars).reduce((sum, value) => sum + value, 0);
}
