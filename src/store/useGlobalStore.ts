import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the interface of the Global state
interface GlobalState {
  showArchived: boolean; // Show archived items
  team: string;
}

// Define the interface of the actions that can be performed
interface GlobalStateActions {
  toggleArchived: () => void;
  reset: () => void;
  setTeam: (data: string) => void;
}

// Initialize a default state
const INITIAL_STATE: GlobalState = {
  showArchived: false,
  team: ''
};

// Create the store with Zustand, combining the status interface and actions
const createGlobalState = (key: string) => {
  return create<GlobalState & GlobalStateActions>()(
    persist(
      (set) => ({
        ...INITIAL_STATE,
        toggleArchived() {
          set((state) => ({
            showArchived: !state.showArchived,
          }));
        },
        team: "",
        setTeam(data) {
          set({ team: data });
        },
        reset() {
          set(INITIAL_STATE);
        },
      }),
      {
        name: key,
      },
    ),
  );
};

export const useGlobalState = createGlobalState("global-state");
