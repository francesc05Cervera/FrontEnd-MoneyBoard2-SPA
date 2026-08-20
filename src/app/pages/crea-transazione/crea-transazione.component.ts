import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TransazioneService } from '../../core/services/transazione.service';
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
  titolo = ''; descrizione = ''; importo: number | null = null; entrata = true;
  dataOdierna = new Date().toISOString().slice(0, 10);
  creazioneInCorso = signal(false); errore = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService, private transazioneService: TransazioneService) {}

  ngOnInit(): void { this.sezioneId = Number(this.route.snapshot.paramMap.get('id')); }

  creaTransazione(): void {
    const utente = this.auth.utenteCorrente();
    if (!utente || !this.titolo.trim() || this.importo === null || this.importo <= 0) { this.errore.set('Compila titolo e importo (deve essere > 0).'); return; }
    this.creazioneInCorso.set(true); this.errore.set(null);
    const payload: CreateTransactionRequest = { titolo: this.titolo.trim(), descrizione: this.descrizione.trim(), importo: this.importo, entrata: this.entrata, data: this.dataOdierna, sezione: { nome: 'Sezione' }, utente: { id: utente.id } };
    this.transazioneService.crea(payload).subscribe({
      next: () => { this.creazioneInCorso.set(false); this.router.navigate(['/sezione', this.sezioneId]); },
      error: (err) => { this.creazioneInCorso.set(false); this.errore.set(err.message ?? 'Creazione transazione non riuscita.'); }
    });
  }

  annulla(): void { this.router.navigate(['/sezione', this.sezioneId]); }
}