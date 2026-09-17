# BlinkyChess — Piano di restyle

> Documento di pianificazione, come `REBUILD_PLAN.md`. Nessun CSS/JSX viene toccato finché non approvi i punti — poi si esegue pagina per pagina, verificando ogni volta nel browser.

## Obiettivo

Un design **più chiaro e più nitido**, mantenendo le stesse tonalità già in uso:

- Light mode: lavanda (`--accent: rgb(200,200,255)`) su grigio chiaro
- Dark mode: verde acqua (`--accent: rgb(0,200,150)`) su blu navy scuro

Non si cambia la palette, si affina come viene usata: oggi diversi punti del sito hanno colori **hardcoded fuori dal design system** (variabili CSS in `general.css`), il che rende l'insieme meno coerente e meno "pulito" di quanto potrebbe essere. Il restyle sistema questo e migliora gerarchia visiva, spaziatura e stati interattivi (hover/focus), senza toccare la logica React.

## 0. Fondamenta (da fare prima, sblocca tutto il resto)

Prima di toccare le singole pagine, sistemare il livello condiviso:

- **Colori hardcoded → variabili**: la scacchiera (`#DED5C4` / `#2E2012`), i messaggi di risultato (`#1d9e75` win / `#d84545` lose), il toast di errore (`#b91c1c`) non usano i token del tema. Introdurre `--success`, `--danger`, `--board-light`, `--board-dark` accanto a quelli esistenti, con varianti per light/dark mode.
- **Stati interattivi**: bottoni/link hanno hover ma quasi nessun `:focus-visible` — importante sia per pulizia (outline coerente invece di quello di default del browser) sia per accessibilità da tastiera.
- **Scala di spaziatura**: oggi ogni componente inventa i propri valori (`clamp(14px, 2.5vw, 20px)`, `gap: 12px`, `padding: 10px 20px`, ecc.) senza una scala comune. Definire 4-5 step riutilizzabili (xs/sm/md/lg/xl) come variabili, così le card "respirano" in modo consistente ovunque.
- **Card ed elevazione**: unico stile piatto ovunque (`--shadow` fissa). Introdurre 1-2 livelli di elevazione (card normale vs. card "attiva"/in evidenza, es. la riga leaderboard dell'utente loggato) per dare più profondità senza uscire dai toni attuali.

## 1. Login

- Oggi è l'unica pagina con sfondo pieno colore accento e input a pillola (raggio 40px) — uno stile visivamente scollegato dal resto del sito (card scure su sfondo neutro). Deciso: **portarla dentro lo stesso linguaggio delle card** (sfondo neutro, form dentro una `ui-card` centrata), oppure — se si vuole mantenere il colore pieno come elemento distintivo delle pagine di auth — quantomeno allineare raggio bottoni/input alla stessa scala usata altrove (non più pillola isolata).
- Migliorare la leggibilità del placeholder (oggi `rgba(0,0,0,0.55)` fisso, pensato solo per lo sfondo chiaro accento — da verificare che regga anche in dark mode).
- Stato di errore più visibile sul campo (bordo rosso sull'input), non solo il toast in alto a destra.

## 2. Register

- Stessa base di Login (condividono già `.div-login`/`.inputbox`): il restyle dei due va fatto insieme per restare identici.
- La checkbox "Show password" è un controllo nativo minimale in mezzo a un form altrimenti curato — restyle con un toggle coerente con lo stile bottoni/input del resto del sito.

## 3. Home

- **Gerarchia**: oggi "Look for a game" (CTA), "Live games" e "Leaderboard" hanno lo stesso peso visivo fianco a fianco. Dare alla CTA principale più risalto (dimensione/contrasto) rispetto alle due liste informative.
- **Liste (Live games / Leaderboard)**: righe piatte senza divisori forti né stato hover — aggiungere hover sulla riga (soprattutto la leaderboard, dove si clicca sull'username) e migliorare lo scan verticale (numeri di classifica allineati, elo allineato a destra con peso tipografico più chiaro).
- Stato vuoto ("No games in progress right now.") oggi è testo semplice — potrebbe avere un'icona/illustrazione leggera per non sembrare un placeholder dimenticato.

## 4. Profile

- Le due card (statistiche + storico) affiancate su desktop hanno larghezze indipendenti che possono risultare sbilanciate — definire una griglia a due colonne più intenzionale (es. stats più stretta, storico più largo, dato che contiene più informazione per riga).
- "Score of Last 10 Games": righe di icone senza contesto (nessuna data/avversario a colpo d'occhio) — valutare un tooltip o etichetta minima al hover.
- Il titolo username con bordo inferiore (`border-bottom: 2px solid var(--accent)`) è l'unico punto del sito con questo trattamento — o lo si estende come pattern per tutti i titoli di sezione (coerenza) o si toglie in favore dello stile card standard.

## 5. Waiting (matchmaking)

- Pagina minimale (loader + messaggio + bottone Cancel) — bene così, ma il loader attuale è una barra generica che non comunica "sto cercando un avversario" in modo specifico. Un'animazione più mirata (es. pulsazione sui due lati "tu / avversario") comunicherebbe meglio senza appesantire.

## 6. Game (partita in corso)

- **Scacchiera**: colori marrone/crema generici, scollegati dalla palette del sito. Restyle con toni derivati dall'accento (es. variante chiara/scura della stessa tinta lavanda/verde acqua) così la scacchiera "appartiene" visivamente al sito invece di sembrare un widget esterno.
- **Evidenziazione mosse legali**: oggi un'immagine PNG semi-trasparente (`selected.png`) — valutare un indicatore più nitido (pallino/anello disegnato via CSS invece di un'immagine raster, più netto a tutte le risoluzioni).
- **PlayerInfo**: le due card (avversario sopra, tu sotto la scacchiera) sono identiche — dare un'indicazione visiva chiara di chi è di turno (bordo/glow sulla card attiva), utile soprattutto ora che l'orologio corretto mostra davvero un solo lato che scorre.
- **Move history**: lista compatta già funzionale (soprattutto ora con l'highlight della mossa corrente aggiunto per il replay) — solo da rifinire con lo stesso stile hover/focus del resto.

## 7. Replay

- Nasce come variante di Game, eredita la stessa scacchiera (vedi punto 6).
- I controlli (⏮ ◀ ▶ ⏭) sono bottoni "secondary" generici — valutare icone SVG invece dei caratteri unicode attuali (resa incoerente tra font/sistemi operativi) e uno stato "disabled" più leggibile.
- Il contatore "2 / 2 — e5" è testo piatto — potrebbe diventare una mini progress bar sopra i controlli, coerente con lo stile "loader" già usato altrove nel sito.

## Ordine di esecuzione proposto

1. Fondamenta (§0) — token colore/spaziatura/focus, senza cambiare nulla visivamente in modo drastico
2. Home + Profile (pagine più viste, maggior beneficio percepito)
3. Login + Register (condividono stile, si fanno insieme)
4. Game + Replay (condividono la scacchiera, si fanno insieme)
5. Waiting (piccolo tocco finale)

Ogni punto verificato nel browser (light + dark mode, desktop + mobile) prima di passare al successivo.
