import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, Utente } from '../models/utente.model';

const STORAGE_KEY = 'moneyboard2_utente';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/utenti`;
  readonly utenteCorrente = signal<Utente | null>(this.leggiDaStorage());

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<Utente> {
    return this.http.post<Utente>(`${this.baseUrl}/login`, payload).pipe(
      tap((utente) => this.salvaSessione({
        id: utente.id,
        username: utente.username ?? null,
        email: utente.email ?? payload.email
      }))
    );
  }

  registra(payload: RegisterRequest): Observable<Utente> {
    return this.http.post<Utente>(this.baseUrl, payload);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.utenteCorrente.set(null);
  }

  isAutenticato(): boolean {
    return this.utenteCorrente() !== null;
  }

  private salvaSessione(utente: Utente): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(utente));
    this.utenteCorrente.set(utente);
  }

  private leggiDaStorage(): Utente | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Utente) : null;
  }
}