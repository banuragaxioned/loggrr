import { create } from "zustand";

// Define the interface of the Global state
interface CurrentUserState {
  currentUser: any;
  fetch: () => void;
  team: string;
  setTeam: (data: string) => void;
}

export const useCurrentUserStore = create<CurrentUserState>((set) => ({
  currentUser: {},
  team: '',
  setTeam(data) {
    set({ team: data })
  },
  fetch: async () => {
    const response = await fetch("/api/team/current", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    set({ currentUser: response });
  },
}));
