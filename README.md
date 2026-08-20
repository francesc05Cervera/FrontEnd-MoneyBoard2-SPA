# MoneyBoard 2.0 – Frontend Angular

Frontend moderno e responsive per MoneyBoard 2.0, sviluppato in Angular 17+ con UI mobile-first.

## 📁 Struttura

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Modelli TypeScript
│   │   ├── services/        # Servizi HTTP
│   │   ├── guards/          # Guard per rotte protette
│   │   └── interceptors/    # Interceptor per gestione errori
│   └── pages/
│       ├── login/           # Login/Registrazione
│       ├── home/            # Elenco sezioni
│       ├── dettaglio-sezione/  # Dettaglio con transazioni
│       └── crea-transazione/   # Form nuova transazione
├── environments/            # Configurazione ambiente (API URL)
└── styles.scss              # Stili globali e variabili CSS
```

## 🔌 Backend

Il frontend punta a: `https://backend-moneyboard2-0.onrender.com/api`

## 🚀 Sviluppo locale

```bash
cd FrontEnd-MoneyBoard2-SPA
npm install
npm start
```

## 📦 Build per produzione

```bash
npm run build
```

Output in `dist/FrontEnd-MoneyBoard2-SPA/browser/`.

## ☁️ Deploy su Render (Static Site)

1. Crea un nuovo **Static Site** su Render
2. Collega questa repository GitHub
3. Imposta:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist/FrontEnd-MoneyBoard2-SPA/browser`

## 🎨 Features UI

- ✅ Login/Registrazione con gradiente moderno
- ✅ Home con griglia card responsive
- ✅ Saldo in verde ben visibile
- ✅ Dettaglio sezione con 4 bottoni colorati
- ✅ Toggle moderno Entrata/Uscita
- ✅ Data fissa a oggi (non modificabile)
- ✅ Mobile-first (responsive da 320px)
