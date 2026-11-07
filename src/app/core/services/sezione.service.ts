import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeleteSezioneRequest, SectionCreateRequest, SezioneRisparmio } from '../models/sezione.model';

@Injectable({ providedIn: 'root' })
export class SezioneService {
  private readonly baseUrl = `${environment.apiUrl}/sezione`;
  constructor(private http: HttpClient) {}

  /** GET /api2/sezione → sezioni dell'utente autenticato (id ricavato dal token). */
  getSezioni(): Observable<SezioneRisparmio[]> {
    return this.http.get<SezioneRisparmio[]>(this.baseUrl);
  }

  /** POST /api2/sezione/create → il backend risponde con testo semplice. */
  crea(payload: SectionCreateRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/create`, payload, { responseType: 'text' });
  }

  /** DELETE /api2/sezione con body { nome } → risposta in testo semplice. */
  elimina(payload: DeleteSezioneRequest): Observable<string> {
    return this.http.delete(this.baseUrl, { body: payload, responseType: 'text' });
  }
}
