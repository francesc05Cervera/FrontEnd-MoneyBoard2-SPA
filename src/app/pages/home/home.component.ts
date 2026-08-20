import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SezioneService } from '../../core/services/sezione.service';
import { SezioneRisparmio } from '../../core/models/sezione.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  sezioni = signal<SezioneRisparmio[]>([]);
  caricamento = signal(true);
  errore = signal<string | null>(null);
  mostraModaleNuovaSezione = signal(false);
  creazioneInCorso = signal(false);
  nomeNuovaSezione = '';
  obiettivoNuovaSezione: number | null = null;

  constructor(public auth: AuthService, private sezioneService: SezioneService, private router: Router) {}

  ngOnInit(): void { this.caricaSezioni(); }

  caricaSezioni(): void {
    const utente = this.auth.utenteCorrente();
    if (!utente) return;
    this.caricamento.set(true); this.errore.set(null);
    this.sezioneService.getPerUtente(utente.id).subscribe({
      next: (sezioni) => { this.sezioni.set(sezioni); this.caricamento.set(false); },
      error: (err) => { this.errore.set(err.message ?? 'Impossibile caricare le sezioni.'); this.caricamento.set(false); }
    });
  }

  apriSezione(sezione: SezioneRisparmio): void { this.router.navigate(['/sezione', sezione.id]); }
  apriModaleNuovaSezione(): void { this.nomeNuovaSezione = ''; this.obiettivoNuovaSezione = null; this.mostraModaleNuovaSezione.set(true); }
  chiudiModale(): void { this.mostraModaleNuovaSezione.set(false); }

  creaSezione(): void {
    const utente = this.auth.utenteCorrente();
    if (!utente || !this.nomeNuovaSezione.trim() || this.obiettivoNuovaSezione === null) return;
    this.creazioneInCorso.set(true);
    this.sezioneService.crea({ nome: this.nomeNuovaSezione.trim(), obbiettivo: this.obiettivoNuovaSezione, utente: { id: utente.id } }).subscribe({
      next: () => { this.creazioneInCorso.set(false); this.mostraModaleNuovaSezione.set(false); this.caricaSezioni(); },
      error: (err) => { this.creazioneInCorso.set(false); this.errore.set(err.message ?? 'Creazione sezione non riuscita.'); }
    });
  }

  logout(): void { this.auth.logout(); this.router.navigate(['/login']); }
}