import { create } from 'zustand';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import type { User } from 'firebase/auth'; // <-- We explicitly mark this as a type
import { auth } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null, isAuthenticated: false });
  },
  initialize: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, isAuthenticated: !!user, isLoading: false });
    });
  }
}));