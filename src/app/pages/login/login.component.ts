import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  modalitaRegistrazione = signal(false);
  caricamento = signal(false);
  errore = signal<string | null>(null);
  username = ''; email = ''; password = '';

  constructor(private auth: AuthService, private router: Router) {}

  cambiaModalita(): void {
    this.modalitaRegistrazione.set(!this.modalitaRegistrazione());
    this.errore.set(null);
  }

  submit(): void {
    this.errore.set(null);
    if (!this.email.trim() || !this.password.trim() || (this.modalitaRegistrazione() && !this.username.trim())) {
      this.errore.set('Compila tutti i campi richiesti.'); return;
    }
    this.caricamento.set(true);
    if (this.modalitaRegistrazione()) {
      this.auth.registra({ username: this.username.trim(), email: this.email.trim(), password: this.password }).subscribe({
        next: () => { this.caricamento.set(false); this.modalitaRegistrazione.set(false); this.password = ''; this.errore.set('Registrazione completata! Ora accedi.'); },
        error: (err) => { this.caricamento.set(false); this.errore.set(err.message ?? 'Registrazione non riuscita.'); }
      });
    } else {
      this.auth.login({ email: this.email.trim(), password: this.password }).subscribe({
        next: () => { this.caricamento.set(false); this.router.navigate(['/home']); },
        error: (err) => { this.caricamento.set(false); this.errore.set(err.message ?? 'Credenziali non valide.'); }
      });
    }
  }
}