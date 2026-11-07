import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenStorageService } from '../services/token-storage.service';

const ENDPOINT_PUBBLICI = ['/user/login', '/user/register'];

/**
 * Il backend si aspetta il JWT "nudo" nell'header Authorization (senza prefisso "Bearer ").
 * Se in futuro il backend verrà adattato a "Bearer <token>", basta cambiare questa funzione.
 */
const costruisciHeader = (token: string) => token;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(TokenStorageService);
  const router = inject(Router);

  if (ENDPOINT_PUBBLICI.some((p) => req.url.includes(p))) {
    return next(req);
  }

  // Il token viene riletto dal localStorage a ogni richiesta
  const token = storage.getToken();

  if (!token || storage.isScaduto(token)) {
    storage.clear();
    router.navigate(['/login']);
    return throwError(() => new Error('Sessione scaduta, effettua di nuovo il login.'));
  }

  const richiesta = req.clone({ setHeaders: { Authorization: costruisciHeader(token) } });

  return next(richiesta).pipe(
    catchError((error) => {
      if (error?.status === 401 || error?.status === 403) {
        storage.clear();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
