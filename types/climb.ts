export type ClimbOutcome = "success" | "failure" | "hangdog";
export type ClimbMode = "onsight" | "flash" | "redpoint";
export type ClimbStyle = "lead" | "follow";

export interface Climb {
  id: number;
  date: string;
  crag: string;
  routeName: string;
  grade: string;
  outcome: ClimbOutcome;
  attempts: number;
  mode: ClimbMode;
  style: ClimbStyle;
  difficulty: number;
  notes: string;
}

export type ClimbInput = Omit<Climb, "id">;
