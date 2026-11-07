import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/utente.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/user`;
  readonly utenteCorrente;

  constructor(private http: HttpClient, private storage: TokenStorageService) {
    this.utenteCorrente = this.storage.utente;
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, payload)
      .pipe(tap((res) => this.storage.salva(res.token, payload.email)));
  }

  registra(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, payload);
  }

  logout(): void {
    this.storage.clear();
  }

  isAutenticato(): boolean {
    return !this.storage.isScaduto();
  }
}
