export type ClimbOutcome = "success" | "failure";
export type ClimbMode = "onsight" | "flash" | "redpoint";
export type ClimbStyle = "lead" | "follow";

export interface Climb {
  id: number;
  date: string;
  crag: string;
  routeName: string;
  grade: string;
  length: number | null;
  outcome: ClimbOutcome;
  attempts: number;
  mode: ClimbMode;
  style: ClimbStyle;
  difficulty: number;
  notes: string | null;
}

export type ClimbInput = Omit<Climb, "id">;
