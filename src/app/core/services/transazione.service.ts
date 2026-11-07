import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateTransactionRequest, Transazione } from '../models/transazione.model';

@Injectable({ providedIn: 'root' })
export class TransazioneService {
  private readonly baseUrl = `${environment.apiUrl}/transazione`;
  constructor(private http: HttpClient) {}

  /** GET /api2/transazione → tutte le transazioni dell'utente autenticato. */
  getTransazioni(): Observable<Transazione[]> {
    return this.http.get<Transazione[]>(this.baseUrl);
  }

  /** GET /api2/transazione/sezione/{sezioneId} */
  getTransazioniSezione(sezioneId: number): Observable<Transazione[]> {
    return this.http.get<Transazione[]>(`${this.baseUrl}/sezione/${sezioneId}`);
  }

  /** POST /api2/transazione/create → risposta in testo semplice. */
  crea(payload: CreateTransactionRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/create`, payload, { responseType: 'text' });
  }

  /** DELETE /api2/transazione/{id} → risposta in testo semplice. */
  elimina(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
