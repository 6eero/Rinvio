Sto sviluppando un app per tracciare le vie fatte in falesia. ho un form in cui aggiungo la via che ha questi campi:

```typescript
type ClimbStyle = "lead" | "follow";
type ClimbOutcome = "success" | "hangdog" | "failure";
type ClimbMode = "onsight" | "flash" | "redpoint";

interface Climb {
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
```

Voglio implementare i seguenti vincoli:

lead:
onsight - vai su da primo senza sapere niente e chiudi senza appenderti
flash - vai su da primo avendo studiato la via e chiudi senza appenderti
redpoint - vai su da primo avendo gia provato la via e chiudi senza appenderti
hangdog - vai su da primo appendnendoti (sia che tui abbia studiato la via che non)
failure - via non chiusa

follow:
success - via chiusa
failure - via non chiusa

```typescript
type ClimbStyle = "lead" | "follow";
type ClimbMode =
  | "lead_onsight"
  | "lead_flash"
  | "lead_redpoint"
  | "lead_hangdog"
  | "lead_failure"
  | "follow_success"
  | "follow_failure";

interface Climb {
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
```
