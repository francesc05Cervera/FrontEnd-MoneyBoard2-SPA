import { Utente } from './utente.model';

export interface SezioneRisparmio {
  id: number;
  nome: string;
  obiettivo: number;
  saldo: number;
  utente: Utente;
}

export interface SectionCreateRequest {
  nome: string;
  obbiettivo: number;
  utente: { id: number };
}

export interface DeleteSezioneRequest {
  nome: string;
}