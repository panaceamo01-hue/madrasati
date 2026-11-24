import { useSyncExternalStore } from 'react';
import { getProgress, subscribe, type Progress } from './store';

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getProgress, getProgress);
}
