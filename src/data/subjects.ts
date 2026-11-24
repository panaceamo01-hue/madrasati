import type { Level, SubjectId, SubjectMeta } from '../types';

export const LEVELS: Level[] = [1, 2, 3, 4, 5, 6];

export const LEVEL_NAMES: Record<Level, string> = {
  1: 'المستوى الأول',
  2: 'المستوى الثاني',
  3: 'المستوى الثالث',
  4: 'المستوى الرابع',
  5: 'المستوى الخامس',
  6: 'المستوى السادس',
};

export const LEVEL_AGES: Record<Level, string> = {
  1: '6 - 7 سنوات',
  2: '7 - 8 سنوات',
  3: '8 - 9 سنوات',
  4: '9 - 10 سنوات',
  5: '10 - 11 سنة',
  6: '11 - 12 سنة',
};

export const SUBJECTS: SubjectMeta[] = [
  { id: 'arabic', name: 'اللغة العربية', emoji: '📖', color: '#b23b3b', soft: '#fbeaea' },
  { id: 'math', name: 'الرياضيات', emoji: '🔢', color: '#2d6cb5', soft: '#e8f0fb' },
  { id: 'islamic', name: 'التربية الإسلامية', emoji: '🕌', color: '#1f6f5c', soft: '#e3f1ea' },
  { id: 'science', name: 'النشاط العلمي', emoji: '🔬', color: '#6f8f1f', soft: '#eef4dd' },
  { id: 'social', name: 'الاجتماعيات', emoji: '🗺️', color: '#c0762a', soft: '#fbf0e3' },
  { id: 'french', name: 'اللغة الفرنسية', emoji: '🇫🇷', color: '#6b4fa3', soft: '#f0eafb' },
];

export const LEVEL_COLORS: Record<Level, string> = {
  1: '#1f6f5c',
  2: '#2d6cb5',
  3: '#b23b3b',
  4: '#c0762a',
  5: '#6b4fa3',
  6: '#2f7f8a',
};

export const LEVEL_SOFT: Record<Level, string> = {
  1: '#e3f1ea',
  2: '#e8f0fb',
  3: '#fbeaea',
  4: '#fbf0e3',
  5: '#f0eafb',
  6: '#e4f1f3',
};

export const SUBJECT_BY_ID: Record<SubjectId, SubjectMeta> = SUBJECTS.reduce(
  (acc, subject) => {
    acc[subject.id] = subject;
    return acc;
  },
  {} as Record<SubjectId, SubjectMeta>,
);
