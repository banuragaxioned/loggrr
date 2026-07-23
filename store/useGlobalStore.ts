import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useEffect, useState } from "react";

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

// Persist needs a storage object even during SSR; without it zustand skips attaching `.persist`.
function getSSRSafeStorage() {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return localStorage;
}

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
        storage: createJSONStorage(getSSRSafeStorage),
      },
    ),
  );
};

export const useGlobalState = createGlobalState("global-state");

/** True only after persisted preferences (e.g. logBoardView) are loaded from localStorage. */
export function useGlobalStateHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const persistApi = useGlobalState.persist;
    if (!persistApi) {
      setHasHydrated(true);
      return;
    }
    if (persistApi.hasHydrated()) {
      setHasHydrated(true);
      return;
    }
    return persistApi.onFinishHydration(() => setHasHydrated(true));
  }, []);

  return hasHydrated;
}
