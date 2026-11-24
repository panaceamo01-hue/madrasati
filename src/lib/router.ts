import type { GameId, Level } from '../types';

export type Route =
  | { name: 'home' }
  | { name: 'level'; level: Level }
  | { name: 'lesson'; id: string }
  | { name: 'games' }
  | { name: 'game'; id: GameId; level: Level }
  | { name: 'progress' }
  | { name: 'settings' }
  | { name: 'wisdom' }
  | { name: 'parent' }
  | { name: 'examLesson'; id: string }
  | { name: 'examLevel'; level: Level }
  | { name: 'review'; id: string }
  | { name: 'certificate'; level: Level | 'all' };

const GAME_IDS: GameId[] = ['memory', 'math', 'words', 'matching', 'ordering', 'values'];

function toLevel(value: string | undefined): Level | null {
  const level = Number(value);
  return Number.isInteger(level) && level >= 1 && level <= 6 ? (level as Level) : null;
}

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'home' };

  if (parts[0] === 'level') {
    const level = toLevel(parts[1]);
    if (level) return { name: 'level', level };
  }
  if (parts[0] === 'lesson' && parts[1]) return { name: 'lesson', id: decodeURIComponent(parts[1]) };
  if (parts[0] === 'games') return { name: 'games' };
  if (parts[0] === 'game' && GAME_IDS.includes(parts[1] as GameId)) {
    const level = toLevel(parts[2]);
    if (level) return { name: 'game', id: parts[1] as GameId, level };
  }
  if (parts[0] === 'progress') return { name: 'progress' };
  if (parts[0] === 'settings') return { name: 'settings' };
  if (parts[0] === 'wisdom') return { name: 'wisdom' };
  if (parts[0] === 'parent') return { name: 'parent' };
  if (parts[0] === 'exam' && parts[1] === 'lesson' && parts[2]) {
    return { name: 'examLesson', id: decodeURIComponent(parts[2]) };
  }
  if (parts[0] === 'exam' && parts[1] === 'level') {
    const level = toLevel(parts[2]);
    if (level) return { name: 'examLevel', level };
  }
  if (parts[0] === 'review' && parts[1]) return { name: 'review', id: decodeURIComponent(parts[1]) };
  if (parts[0] === 'certificate' && parts[1] === 'all') return { name: 'certificate', level: 'all' };
  if (parts[0] === 'certificate') {
    const level = toLevel(parts[1]);
    if (level) return { name: 'certificate', level };
  }
  return { name: 'home' };
}

export function navClass(current: Route['name'], ...names: Route['name'][]): string {
  return names.includes(current) ? 'active' : '';
}
