import { createContext, useContext } from 'react';
import type { User } from '@/lib/types';
import type { Actor } from './storage';

export interface ActingAsValue {
  actor: Actor | null;
  chooseUser: (user: Pick<User, '_id' | 'fullName'>) => void;
  clearActor: () => void;
  openPicker: () => void;
}

export const ActingAsContext = createContext<ActingAsValue | null>(null);

export function useActingAs() {
  const value = useContext(ActingAsContext);
  if (!value) throw new Error('useActingAs needs an ActingAsProvider above it');
  return value;
}
