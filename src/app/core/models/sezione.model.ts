/** Utente annidato nella risposta del backend (la password non viene mai usata dal frontend). */
export interface UtenteRef {
  id: number;
  username?: string | null;
  email?: string | null;
}

/** Risposta di GET /api2/sezione */
export interface SezioneRisparmio {
  id: number;
  nome: string;
  obiettivo: number;
  saldo: number;
  utente?: UtenteRef;
}

/** Body di POST /api2/sezione/create (l'utente è ricavato dal token JWT). Nota: "obbiettivo" con due b. */
export interface SectionCreateRequest {
  nome: string;
  obbiettivo: number;
}

/** Body di DELETE /api2/sezione (il backend legge solo "nome"). */
export interface DeleteSezioneRequest {
  nome: string;
}
