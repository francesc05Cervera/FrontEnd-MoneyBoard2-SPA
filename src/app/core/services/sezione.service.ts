import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeleteSezioneRequest, SectionCreateRequest, SezioneRisparmio } from '../models/sezione.model';

@Injectable({ providedIn: 'root' })
export class SezioneService {
  private readonly baseUrl = `${environment.apiUrl}/sezioni`;
  constructor(private http: HttpClient) {}

  getPerUtente(utenteId: number): Observable<SezioneRisparmio[]> {
    return this.http.get<SezioneRisparmio[]>(`${this.baseUrl}/utente/${utenteId}`);
  }

  crea(payload: SectionCreateRequest): Observable<SezioneRisparmio> {
    return this.http.post<SezioneRisparmio>(this.baseUrl, payload);
  }

  elimina(payload: DeleteSezioneRequest): Observable<void> {
    return this.http.delete<void>(this.baseUrl, { body: payload });
  }
}