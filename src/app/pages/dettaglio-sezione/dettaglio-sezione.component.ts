import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SezioneService } from '../../core/services/sezione.service';
import { TransazioneService } from '../../core/services/transazione.service';
import { SezioneRisparmio } from '../../core/models/sezione.model';
import { Transazione } from '../../core/models/transazione.model';

@Component({
  selector: 'app-dettaglio-sezione',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dettaglio-sezione.component.html',
  styleUrl: './dettaglio-sezione.component.scss'
})
export class DettaglioSezioneComponent implements OnInit {
  sezioneId!: number;
  sezione = signal<SezioneRisparmio | null>(null);
  transazioni = signal<Transazione[]>([]);
  caricamentoSezione = signal(true);
  caricamentoTransazioni = signal(true);
  eliminazioneSezioneInCorso = signal(false);
  idTransazioneInEliminazione = signal<number | null>(null);
  errore = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private router: Router, private sezioneService: SezioneService, private transazioneService: TransazioneService) {}

  ngOnInit(): void { this.sezioneId = Number(this.route.snapshot.paramMap.get('id')); this.caricaTutto(); }
  caricaTutto(): void { this.caricaSezione(); this.aggiornaListaTransazioni(); }

  private caricaSezione(): void {
    this.caricamentoSezione.set(true);
    this.sezioneService.getSezioni().subscribe({
      next: (sezioni) => { const trovata = sezioni.find((s) => s.id === this.sezioneId) ?? null; this.sezione.set(trovata); this.caricamentoSezione.set(false); },
      error: (err) => { this.errore.set(err.message ?? 'Impossibile caricare la sezione.'); this.caricamentoSezione.set(false); }
    });
  }

  aggiornaListaTransazioni(): void {
    this.caricamentoTransazioni.set(true); this.errore.set(null);
    this.transazioneService.getTransazioniSezione(this.sezioneId).subscribe({
      next: (transazioni) => {
        this.transazioni.set(transazioni);
        this.caricamentoTransazioni.set(false);
      },
      error: (err) => { this.errore.set(err.message ?? 'Impossibile caricare le transazioni.'); this.caricamentoTransazioni.set(false); }
    });
  }

  vaiANuovaTransazione(): void { this.router.navigate(['/sezione', this.sezioneId, 'nuova-transazione']); }

  eliminaTransazione(transazione: Transazione): void {
    this.idTransazioneInEliminazione.set(transazione.id);
    this.transazioneService.elimina(transazione.id).subscribe({
      next: () => { this.idTransazioneInEliminazione.set(null); this.caricaTutto(); },
      error: (err) => { this.idTransazioneInEliminazione.set(null); this.errore.set(err.message ?? 'Impossibile eliminare la transazione.'); }
    });
  }

  eliminaSezione(): void {
    const sezione = this.sezione();
    if (!sezione) return;
    const confermato = confirm(`Eliminare definitivamente la sezione "${sezione.nome}"?`);
    if (!confermato) return;
    this.eliminazioneSezioneInCorso.set(true);
    this.sezioneService.elimina({ nome: sezione.nome }).subscribe({
      next: () => { this.eliminazioneSezioneInCorso.set(false); this.router.navigate(['/home']); },
      error: (err) => { this.eliminazioneSezioneInCorso.set(false); this.errore.set(err.message ?? 'Impossibile eliminare la sezione.'); }
    });
  }

  torna(): void { this.router.navigate(['/home']); }
}