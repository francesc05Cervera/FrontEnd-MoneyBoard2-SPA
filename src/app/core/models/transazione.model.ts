import { SezioneRisparmio, UtenteRef } from './sezione.model';

/** Risposta di GET /api2/transazione e /api2/transazione/sezione/{id} */
export interface Transazione {
  id: number;
  titolo: string;
  descrizione: string;
  importo: number;
  isEntrata: boolean;
  data: string; // ISO yyyy-MM-dd
  sezione?: SezioneRisparmio;
  utente?: UtenteRef;
}

/**
 * Body di POST /api2/transazione/create.
 * Il backend deserializza: "entrata" (non isEntrata), "data" e "sezione.nome".
 * L'utente è ricavato dal token JWT.
 */
export interface CreateTransactionRequest {
  titolo: string;
  descrizione: string;
  importo: number;
  entrata: boolean;
  data: string;
  sezione: { nome: string };
}
