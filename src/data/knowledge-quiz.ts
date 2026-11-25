import type { KnowledgeQuestion } from '../types';
import { getActiveProfileId } from '../lib/store';
import { GENERAL_QUIZ } from './quiz-general';
import { TRANSLATION_QUIZ } from './quiz-translation';
import { RELIGION_QUIZ } from './quiz-religion';

export type KnowledgeBranch = 'general' | 'translation' | 'religion';

export const KNOWLEDGE_BRANCHES: {
  id: KnowledgeBranch;
  name: string;
  emoji: string;
  description: string;
}[] = [
  {
    id: 'general',
    name: 'ثقافة عامة',
    emoji: '🌍',
    description: 'المغرب والعالم والعلوم والحيوانات والرياضة',
  },
  {
    id: 'translation',
    name: 'ترجمة',
    emoji: '🔤',
    description: 'كلمات فرنسية وعربية — ترجمها إلى اللغة الأخرى',
  },
  {
    id: 'religion',
    name: 'أسئلة دينية',
    emoji: '🕌',
    description: 'أركان الإسلام والقرآن والأنبياء والأخلاق',
  },
];

export const KNOWLEDGE_BANKS: Record<KnowledgeBranch, KnowledgeQuestion[]> = {
  general: GENERAL_QUIZ,
  translation: TRANSLATION_QUIZ,
  religion: RELIGION_QUIZ,
};

/** عدد الأسئلة في كل جولة. */
export const KNOWLEDGE_ROUND_SIZE = 10;

const SEEN_KEY = 'madrasati:knowledge-seen:v1';

function loadSeen(): Record<string, number[]> {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) ?? '{}') as Record<string, number[]>;
  } catch {
    return {};
  }
}

function seenKey(branch: KnowledgeBranch): string {
  return `${getActiveProfileId()}:${branch}`;
}

/** عدد الأسئلة الجديدة التي لم تُعرض بعد على هذا الابن في هذا الفرع. */
export function knowledgeRemaining(branch: KnowledgeBranch): number {
  const bank = KNOWLEDGE_BANKS[branch];
  const seen = new Set(loadSeen()[seenKey(branch)] ?? []);
  return bank.length - seen.size;
}

/**
 * يسحب 10 أسئلة جديدة بلا تكرار لهذا الابن في هذا الفرع.
 * عندما تنفد الأسئلة غير المعروضة (بعد 10 جولات) تبدأ دورة جديدة مخلوطة.
 * السحب لا يسجّل الأسئلة كمستهلكة؛ التسجيل يتم عند الإجابة عن كل سؤال
 * (انظر markKnowledgeSeen)، حتى لا تضيع أسئلة جولة تُركت في منتصفها.
 * السحب يتم من معالج حدث (اختيار الفرع) لا من useMemo، لأن StrictMode
 * يستدعي useMemo مرتين في التطوير فيُسجَّل ضعف الأسئلة.
 */
export function drawKnowledgeQuestions(branch: KnowledgeBranch): {
  questions: KnowledgeQuestion[];
  indices: number[];
} {
  const bank = KNOWLEDGE_BANKS[branch];
  const key = seenKey(branch);
  const all = loadSeen();
  const seen = new Set(all[key] ?? []);
  let unseen = bank.map((_, index) => index).filter((index) => !seen.has(index));
  if (unseen.length < KNOWLEDGE_ROUND_SIZE) {
    unseen = bank.map((_, index) => index);
  }
  const picked: number[] = [];
  while (picked.length < KNOWLEDGE_ROUND_SIZE && unseen.length > 0) {
    const at = Math.floor(Math.random() * unseen.length);
    picked.push(unseen.splice(at, 1)[0]);
  }
  return { questions: picked.map((index) => bank[index]), indices: picked };
}

/** يسجّل الأسئلة التي أجاب عنها الطفل فعلًا، فيُستهلك السؤال عند الإجابة عنه لا عند بدء الجولة. */
export function markKnowledgeSeen(branch: KnowledgeBranch, indices: number[]): void {
  if (indices.length === 0) return;
  const key = seenKey(branch);
  const all = loadSeen();
  const seen = new Set(all[key] ?? []);
  indices.forEach((index) => seen.add(index));
  all[key] = [...seen];
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(all));
  } catch {
    // التخزين ممتلئ أو غير متاح: اللعبة تستمر بلا تتبع للأسئلة المعروضة.
  }
}
