export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export type SubjectId = 'arabic' | 'math' | 'islamic' | 'science' | 'social' | 'french';

export interface TeachStep {
  kind: 'teach';
  title: string;
  body: string;
  visual?: string;
  tip?: string;
}

export interface QuizStep {
  kind: 'quiz';
  question: string;
  options: string[];
  answer: number;
  hint?: string;
  visual?: string;
}

export interface OrderStep {
  kind: 'order';
  question: string;
  /** العناصر بالترتيب الصحيح. */
  items: string[];
  hint?: string;
}

export interface BuildStep {
  kind: 'build';
  question: string;
  word: string;
  hint?: string;
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
