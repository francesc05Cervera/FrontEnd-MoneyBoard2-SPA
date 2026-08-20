import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const messaggio = (error.error && typeof error.error === 'object' && error.error.message) || (typeof error.error === 'string' && error.error) || error.message || 'Errore di comunicazione con il server';
      console.error('[API ERROR]', messaggio);
      return throwError(() => new Error(messaggio));
    })
  );
};