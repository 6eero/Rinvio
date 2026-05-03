import { getAllClimbs } from "@/db/climbsRepository";
import { Climb } from "@/types/climb";
import { create } from "zustand";

type ClimbsState = {
  climbs: Climb[];
  setClimbs: (climbs: Climb[]) => void;
  refresh: () => Promise<void>;
};

export const useClimbsStore = create<ClimbsState>((set) => ({
  climbs: [],
  setClimbs: (climbs) => set({ climbs }),
  refresh: async () => {
    const data = await getAllClimbs();
    set({ climbs: data });
  },
}));
