import { startOfToday } from "date-fns";
import { create } from "zustand";

// Define the interface of the Global state
interface TimeEntryState {
  updateTime: number;
  date: Date; //
}

// Define the interface of the actions that can be performed
interface TimeEntryStateActions {
  setUpdateTime: () => void;
  setDate: (date: Date) => void;
  resetTimeEntryStates: () => void;
}

// Initialize a default state
const INITIAL_STATE: TimeEntryState = {
  updateTime: 0,
  date: startOfToday(),
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
    setDate(input) {
      set(() => ({
        date: input,
      }));
    },
    resetTimeEntryStates() {
      set(INITIAL_STATE);
    },
  }));
};

export const useTimeEntryState = createTimeEntryState();
