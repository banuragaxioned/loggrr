import { create } from "zustand";

interface GlobalState {
  showAll: boolean; // Show all projects and clients lists
  showArchived: boolean; // Show archived items
  toggleShowAll: () => void;
  toggleArchived: () => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  showAll: false,
  showArchived: false,
  toggleShowAll: () =>
    set((state) => ({
      showAll: !state.showAll,
    })),
  toggleArchived: () =>
    set((state) => ({
      showArchived: !state.showArchived,
    })),
}));
