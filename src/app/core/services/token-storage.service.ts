import { Injectable, signal } from '@angular/core';
import { Utente } from '../models/utente.model';

const TOKEN_KEY = 'moneyboard2_token';
const EMAIL_KEY = 'moneyboard2_email';
const LEGACY_KEY = 'moneyboard2_utente';

interface JwtPayload {
  sub?: string;
  exp?: number;
}

/**
 * Unico punto di accesso al localStorage per la sessione.
 * Non dipende da HttpClient, così può essere usato dall'interceptor senza dipendenze circolari.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  readonly utente = signal<Utente | null>(this.costruisciUtente());

  /** Legge il token dal localStorage (chiamato a ogni richiesta HTTP). */
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  salva(token: string, email: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(EMAIL_KEY, email);
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* localStorage non disponibile */
    }
    this.utente.set(this.costruisciUtente());
  }

  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EMAIL_KEY);
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* ignore */
    }
    this.utente.set(null);
  }

  /** true se il token manca, è illeggibile o la scadenza (exp) è passata. */
  isScaduto(token: string | null = this.getToken()): boolean {
    if (!token) return true;
    const payload = this.decodifica(token);
    if (!payload?.exp) return true;
    return payload.exp * 1000 <= Date.now();
  }

  private costruisciUtente(): Utente | null {
    const token = this.getToken();
    if (!token || this.isScaduto(token)) return null;
    const id = Number(this.decodifica(token)?.sub);
    if (!Number.isFinite(id)) return null;
    let email = '';
    try {
      email = localStorage.getItem(EMAIL_KEY) ?? '';
    } catch {
      /* ignore */
    }
    return { id, email };
  }

  private decodifica(token: string): JwtPayload | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      return JSON.parse(atob(padded)) as JwtPayload;
    } catch {
      return null;
    }
  }
}
