import { create } from 'zustand';

interface ProfileState {
  selectedProfileId: string | null;
  setSelectedProfileId: (id: string) => void;
  clearSelectedProfileId: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  selectedProfileId: null,
  setSelectedProfileId: (id: string) => set({ selectedProfileId: id }),
  clearSelectedProfileId: () => set({ selectedProfileId: null }),
}));