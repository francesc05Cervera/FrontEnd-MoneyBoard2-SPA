import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SezioneService } from '../../core/services/sezione.service';
import { TransazioneService } from '../../core/services/transazione.service';
import { SezioneRisparmio } from '../../core/models/sezione.model';
import { CreateTransactionRequest } from '../../core/models/transazione.model';

@Component({
  selector: 'app-crea-transazione',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crea-transazione.component.html',
  styleUrl: './crea-transazione.component.scss'
})
export class CreaTransazioneComponent implements OnInit {
  sezioneId!: number;
  sezione = signal<SezioneRisparmio | null>(null);
  caricamentoSezione = signal(true);
  titolo = '';
  descrizione = '';
  importo: number | null = null;
  entrata = true;
  dataOdierna = new Date().toISOString().slice(0, 10);
  creazioneInCorso = signal(false);
  errore = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private sezioneService: SezioneService,
    private transazioneService: TransazioneService
  ) {}

  ngOnInit(): void {
    this.sezioneId = Number(this.route.snapshot.paramMap.get('id'));
    this.caricaSezione();
  }

  private caricaSezione(): void {
    const utente = this.auth.utenteCorrente();
    if (!utente) {
      this.router.navigate(['/login']);
      return;
    }

    this.caricamentoSezione.set(true);
    this.sezioneService.getPerUtente(utente.id).subscribe({
      next: (sezioni) => {
        const sezione = sezioni.find((item) => item.id === this.sezioneId) ?? null;
        this.sezione.set(sezione);
        this.caricamentoSezione.set(false);
        if (!sezione) this.errore.set('Sezione non trovata. Torna alla Home e riprova.');
      },
      error: (err) => {
        this.caricamentoSezione.set(false);
        this.errore.set(err.message ?? 'Impossibile caricare la sezione.');
      }
    });
  }

  creaTransazione(): void {
    const utente = this.auth.utenteCorrente();
    const sezione = this.sezione();

    if (!utente || !sezione) {
      this.errore.set('Sezione non disponibile. Aggiorna la pagina e riprova.');
      return;
    }
    if (!utente.email) {
      this.errore.set('Email utente non disponibile. Esci ed effettua nuovamente il login.');
      return;
    }
    if (!this.titolo.trim() || this.importo === null || this.importo <= 0) {
      this.errore.set('Compila titolo e importo (deve essere maggiore di zero).');
      return;
    }

    this.creazioneInCorso.set(true);
    this.errore.set(null);

    const payload: CreateTransactionRequest = {
      titolo: this.titolo.trim(),
      descrizione: this.descrizione.trim(),
      importo: this.importo,
      entrata: this.entrata,
      data: this.dataOdierna,
      sezione,
      utente: { email: utente.email }
    };

    this.transazioneService.crea(payload).subscribe({
      next: () => {
        this.creazioneInCorso.set(false);
        this.router.navigate(['/sezione', this.sezioneId]);
      },
      error: (err) => {
        this.creazioneInCorso.set(false);
        this.errore.set(err.message ?? 'Creazione transazione non riuscita.');
      }
    });
  }

  annulla(): void {
    this.router.navigate(['/sezione', this.sezioneId]);
  }
}