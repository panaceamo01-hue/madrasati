import { useSyncExternalStore } from 'react';
import { getProfilesState, subscribe, type ChildProfile } from './store';

export interface ProfilesSnapshot {
  activeId: string;
  profiles: ChildProfile[];
}

export function useProfiles(): ProfilesSnapshot {
  return useSyncExternalStore(subscribe, getProfilesState, getProfilesState);
}
