import type { Level, LifeSkillScenario } from '../types';
import { LIFE_SKILLS_ROAD } from './lifeskills-road';
import { LIFE_SKILLS_MONEY } from './lifeskills-money';
import { LIFE_SKILLS_JOBS } from './lifeskills-jobs';

/** مراحل لعبة المهارات الحياتية: 6 مراحل مقفلة بالتسلسل. */
export const LIFE_SKILL_STAGES: Record<Level, { name: string; emoji: string; tagline: string }> = {
  1: {
    name: 'السلامة الطرقية: الأساسيات',
    emoji: '🚦',
    tagline: 'اعبر الطريق بأمان واعرف لوحات التشوير',
  },
  2: {
    name: 'السلامة الطرقية: أخطار الطريق والوقاية',
    emoji: '⚠️',
    tagline: 'تجنب الأخطار وساعد غيرك في الطريق',
  },
  3: {
    name: 'المال: الحاجات والرغبات والادخار',
    emoji: '💰',
    tagline: 'ميّز بين الحاجة والرغبة وادخر لمشروعك',
  },
  4: {
    name: 'المال: ميزانية مشروع والضرائب والمقاولة',
    emoji: '🏪',
    tagline: 'خطط لمشروعك واعرف دور الضرائب',
  },
  5: { name: 'استكشاف المهن', emoji: '👷', tagline: 'تعرف على المهن وقدّرها جميعًا' },
  6: { name: 'المشروع الشخصي', emoji: '🎯', tagline: 'اكتشف نقاط قوتك وارسم مشروعك' },
};

/** مواقف اللعبة: 6 مواقف في كل مرحلة. */
export const LIFE_SKILLS: Record<Level, LifeSkillScenario[]> = {
  1: LIFE_SKILLS_ROAD[1],
  2: LIFE_SKILLS_ROAD[2],
  3: LIFE_SKILLS_MONEY[3],
  4: LIFE_SKILLS_MONEY[4],
  5: LIFE_SKILLS_JOBS[5],
  6: LIFE_SKILLS_JOBS[6],
};

/** النجاح في مرحلة: 4 مواقف صحيحة من 6 (10 نقاط لكل موقف). */
export const LIFE_SKILLS_PASS_SCORE = 40;

/** المرحلة الأولى مفتوحة دائمًا، وكل مرحلة تُفتح بالنجاح في التي قبلها. */
export function lifeSkillStageUnlocked(stage: Level, gameBest: Record<string, number>): boolean {
  if (stage === 1) return true;
  return (gameBest[`lifeskills:${(stage - 1) as Level}`] ?? 0) >= LIFE_SKILLS_PASS_SCORE;
}
