import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateTransactionRequest, Transazione } from '../models/transazione.model';

@Injectable({ providedIn: 'root' })
export class TransazioneService {
  private readonly baseUrl = `${environment.apiUrl}/transazioni`;
  constructor(private http: HttpClient) {}

  getPerUtenteESezione(utenteId: number, sezioneId: number): Observable<Transazione[]> {
    return this.http.get<Transazione[]>(`${this.baseUrl}/utente/${utenteId}/sezione/${sezioneId}`);
  }

  crea(payload: CreateTransactionRequest): Observable<Transazione> {
    return this.http.post<Transazione>(this.baseUrl, payload);
  }

  elimina(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}