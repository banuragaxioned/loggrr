import { Status } from "@prisma/client";
import { create } from "zustand";

// Define the interface of the Global state
interface ClientState {
  clients: {
    id: number,
    name: string,
    status: Status
  }[];
  fetch: (team: string) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  fetch: async (team) => {
    const response = await fetch(`/api/team/client/get?team=${team}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    set({ clients: response });
  },
}));
