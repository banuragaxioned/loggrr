import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the interface of the Global state
interface GlobalState {
  showArchived: boolean; // Show archived items
  logBoardView: boolean; // Use the new click-to-select board for logging time (false = classic form)
}

// Define the interface of the actions that can be performed
interface GlobalStateActions {
  toggleArchived: () => void;
  setLogBoardView: (value: boolean) => void;
  toggleLogBoardView: () => void;
  reset: () => void;
}

// Initialize a default state
const INITIAL_STATE: GlobalState = {
  showArchived: false,
  logBoardView: false,
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
        setLogBoardView(value: boolean) {
          set(() => ({ logBoardView: value }));
        },
        toggleLogBoardView() {
          set((state) => ({ logBoardView: !state.logBoardView }));
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
