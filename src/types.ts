export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export type SubjectId = 'arabic' | 'math' | 'islamic' | 'science' | 'social' | 'french';

/** مستوى صعوبة التمرين: 1 سهل، 2 متوسط، 3 صعب (تحدٍّ). */
export type Difficulty = 1 | 2 | 3;

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  1: 'سهل ⭐',
  2: 'متوسط ⭐⭐',
  3: 'صعب ⭐⭐⭐',
};

export interface TeachStep {
  kind: 'teach';
  title: string;
  body: string;
  visual?: string;
  tip?: string;
  /** سؤال أو موقف ممتع يفتتح الشرح ويجذب الطفل (جملة واحدة بالفصحى). */
  hook?: string;
}

export interface QuizStep {
  kind: 'quiz';
  question: string;
  options: string[];
  answer: number;
  hint?: string;
  visual?: string;
  difficulty?: Difficulty;
}

export interface OrderStep {
  kind: 'order';
  question: string;
  /** العناصر بالترتيب الصحيح. */
  items: string[];
  hint?: string;
  difficulty?: Difficulty;
}

export interface BuildStep {
  kind: 'build';
  question: string;
  word: string;
  hint?: string;
  difficulty?: Difficulty;
}

export type LessonStep = TeachStep | QuizStep | OrderStep | BuildStep;

export interface Lesson {
  id: string;
  level: Level;
  subject: SubjectId;
  title: string;
  emoji: string;
  objective: string;
  steps: LessonStep[];
}

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  emoji: string;
  color: string;
  soft: string;
}

export type GameId = 'memory' | 'math' | 'words' | 'matching' | 'ordering' | 'values' | 'lifeskills' | 'knowledge';

/** سؤال في تحدي المعرفة: 4 خيارات، والإجابة الصحيحة برقمها (0-3). */
export interface KnowledgeQuestion {
  question: string;
  options: [string, string, string, string];
  answer: number;
}

export interface MemoryPair {
  a: string;
  b: string;
}

export interface MathConfig {
  ops: Array<'+' | '-' | '×' | '÷'>;
  max: number;
  seconds: number;
}

export interface WordItem {
  word: string;
  hint: string;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface OrderSequence {
  title: string;
  items: string[];
}

export interface GameMeta {
  id: GameId;
  name: string;
  emoji: string;
  tagline: string;
  skill: string;
}

/** نشاط داخل حصة من جذاذة رسمية: عنوانه ووصفه كما في الدليل. */
export interface FicheActivity {
  title: string;
  description: string;
}

/** حصة من جذاذة رسمية: اسمها وكفاياتها وأنشطتها بالترتيب. */
export interface FicheSession {
  name: string;
  objective: string;
  activities: FicheActivity[];
}

/** الجذاذة الرسمية لدرس، من دليل الأستاذ المعتمد (مع السيناريو البيداغوجي مضمّنًا في الحصص وأنشطتها). */
export interface OfficialFiche {
  /** معرّف الدرس في التطبيق، مثل 'l6-math-big-numbers'. */
  lessonId: string;
  /** المصدر المعتمد، مثل «دليل الجديد في الرياضيات — المستوى السادس». */
  source: string;
  /** رقم الدرس في الدليل. */
  lessonNumber: number;
  sessions: FicheSession[];
}
export interface LifeSkillScenario {
  situation: string;
  emoji: string;
  /** مكان الموقف: الشارع أو البيت أو المدرسة أو السوق... */
  setting: string;
  /** المهارة التي يتعلمها الطفل من الموقف. */
  skill: string;
  /** بالضبط 4 خيارات، واحد منها فقط صحيح. */
  options: string[];
  answer: number;
  moral: string;
}
