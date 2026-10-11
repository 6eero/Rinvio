import * as repo from "@/db/climbsRepository";
import { Climb, ClimbInput } from "@/domain/climb";
import { create } from "zustand";

/**
 * In-memory copy of the climbs table. Every write goes through these actions,
 * which update the database and then reload the list, so screens never have
 * to remember to refresh.
 */
type ClimbsState = {
  climbs: Climb[];
  refresh: () => Promise<void>;
  addClimb: (input: ClimbInput) => Promise<void>;
  addClimbs: (inputs: ClimbInput[]) => Promise<void>;
  updateClimb: (id: number, input: ClimbInput) => Promise<void>;
  deleteClimb: (id: number) => Promise<void>;
  replaceAll: (inputs: ClimbInput[]) => Promise<void>;
};

export const useClimbsStore = create<ClimbsState>((set, get) => ({
  climbs: [],
  refresh: async () => {
    set({ climbs: await repo.getAllClimbs() });
  },
  addClimb: async (input) => {
    await repo.insertClimb(input);
    await get().refresh();
  },
  addClimbs: async (inputs) => {
    await repo.insertClimbs(inputs);
    await get().refresh();
  },
  updateClimb: async (id, input) => {
    await repo.updateClimb(id, input);
    await get().refresh();
  },
  deleteClimb: async (id) => {
    await repo.deleteClimb(id);
    await get().refresh();
  },
  replaceAll: async (inputs) => {
    await repo.replaceAllClimbs(inputs);
    await get().refresh();
  },
}));
