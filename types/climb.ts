export type ClimbStyle = "lead" | "follow";
export type ClimbMode =
  | "lead_onsight"
  | "lead_flash"
  | "lead_redpoint"
  | "lead_hangdog"
  | "lead_failure"
  | "follow_success"
  | "follow_failure";

export interface Climb {
  id: number;
  date: string;
  crag: string;
  route: string;
  grade: string;
  style: ClimbStyle;
  mode: ClimbMode;
  attempts: number;
  difficulty: number;
  notes: string;
}

export type ClimbInput = Omit<Climb, "id">;
