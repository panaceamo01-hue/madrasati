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

export type GameId = 'memory' | 'math' | 'words' | 'matching' | 'ordering' | 'values';

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
