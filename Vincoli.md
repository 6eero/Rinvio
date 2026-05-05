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

0. Se sono in edit: data e crag sempre disabilitati.
1. Se per la date selezionata esiste già un'altra via salvata: il campo crag si autocompila con il nome della falesia di quel giorno e diventa disabilitato.

2. Se style="follow" o attempts > 1: mode="redpoint" e disabilitato, outcome="success" disabilitato

3. Se outcome="success" e mode è "onsight" o "flash": attempts viene forzato a 1 e disabilitato.
4. Se outcome="hamgdog": nasconde la modalità
5. Se outcome="failure": nasconde la modalità, imposta la difficoltà percepita a 5 e disabilita il campo
