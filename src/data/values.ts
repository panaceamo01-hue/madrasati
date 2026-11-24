import type { Level } from '../types';
import { VALUES_L123 } from './values-l123';
import { VALUES_L456 } from './values-l456';

export type ValueSetting = 'school' | 'home' | 'street';

export interface ValueScenario {
  situation: string;
  emoji: string;
  /** مكان الموقف: المدرسة أو البيت أو الشارع. */
  setting: ValueSetting;
  /** القيمة التي يتعلمها الطفل من الموقف. */
  value: string;
  /** بالضبط 4 خيارات، واحد منها فقط صحيح. */
  options: string[];
  answer: number;
  moral: string;
}

/** مواقف لعبة القيم: 6 مواقف في كل مستوى (موقفان في كل مكان)، و4 خيارات في كل موقف. */
export const VALUES: Record<Level, ValueScenario[]> = {
  1: VALUES_L123[1],
  2: VALUES_L123[2],
  3: VALUES_L123[3],
  4: VALUES_L456[4],
  5: VALUES_L456[5],
  6: VALUES_L456[6],
};
