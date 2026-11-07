import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

function messaggioDaStatus(status: number): string {
  switch (status) {
    case 0: return 'Server non raggiungibile. Riprova tra qualche istante.';
    case 400: return 'Richiesta non valida o dati già esistenti.';
    case 401: return 'Credenziali non valide o sessione scaduta.';
    case 403: return 'Accesso negato.';
    case 404: return 'Risorsa non trovata.';
    default: return 'Errore del server. Riprova più tardi.';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        // Errore già normalizzato (es. sessione scaduta dall'authInterceptor)
        return throwError(() => error);
      }
      // Il backend risponde con testo semplice (create/delete), oggetto JSON oppure body vuoto
      const body = error.error;
      const messaggio =
        (typeof body === 'string' && body.trim()) ||
        (body && typeof body === 'object' && typeof body.message === 'string' && body.message) ||
        messaggioDaStatus(error.status);
      console.error('[API ERROR]', error.status, messaggio);
      return throwError(() => new Error(messaggio));
    })
  );
};
