import { create } from "zustand";

// Define the interface of the Global state
interface TimeEntryState {
  updateTime: number; // Show archived items
}

// Define the interface of the actions that can be performed
interface TimeEntryStateActions {
  setUpdateTime: () => void;
  reset: () => void;
}

// Initialize a default state
const INITIAL_STATE: TimeEntryState = {
  updateTime: 0,
};

// Create the store with Zustand, combining the status interface and actions
const createTimeEntryState = () => {
  return create<TimeEntryState & TimeEntryStateActions>()((set) => ({
    ...INITIAL_STATE,
    setUpdateTime() {
      set((state) => ({
        updateTime: state.updateTime + 1,
      }));
    },
    reset() {
      set(INITIAL_STATE);
    },
  }));
};

export const useTimeEntryState = createTimeEntryState();
