import { CurrenUserProps } from "@/types";
import { create } from "zustand";

// Define the interface of the Global state
interface CurrentUserState {
  currentUser: CurrenUserProps | undefined;
  team: string;
  setTeam: (data: string) => void;
  setCurrentUser: (data: any) => void;
}

export const useCurrentUserStore = create<CurrentUserState>((set) => ({
  currentUser: undefined,
  team: '',
  setTeam(data) {
    set({ team: data })
  },
  setCurrentUser(data) {
    set({ currentUser: data })
  },
}));
