import { Utente } from './utente.model';
import { SezioneRisparmio } from './sezione.model';

export interface Transazione {
  id: number;
  titolo: string;
  descrizione: string;
  importo: number;
  entrata: boolean;
  data: string;
  sezione: SezioneRisparmio;
  utente: Utente;
}

export interface CreateTransactionRequest {
  titolo: string;
  descrizione: string;
  importo: number;
  entrata: boolean;
  data: string;
  sezione: { nome: string };
  utente: { id: number };
}