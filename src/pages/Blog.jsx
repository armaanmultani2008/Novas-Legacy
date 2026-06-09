import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

const B = 'https://novaslegacy.com/wp-content/uploads/2022/08/'

const POSTS = [
  {
    slug: 'cuccioli-ghepardo-amira',
    tag: 'Notizie',
    date: '15 Maggio 2025',
    title: "Nuovi cuccioli di ghepardo nati a Nova's Legacy",
    excerpt: "Grande gioia nella riserva: la nostra femmina Amira ha dato alla luce tre cuccioli sani. Il team veterinario li monitora 24 ore su 24.",
    img: '/img/nova-madre-cucciolo.png',
    body: [
      { type: 'text', content: "Nelle prime ore del 12 maggio 2025, la nostra femmina di ghepardo Amira ha dato alla luce tre cuccioli sani: due maschi e una femmina. La nascita è avvenuta nella zona dedicata alla riproduzione della riserva, sotto la supervisione costante del nostro team veterinario." },
      { type: 'text', content: "Ogni nascita di ghepardo rappresenta una vittoria per la conservazione della specie. Il ghepardo (Acinonyx jubatus) è classificato come vulnerabile dalla IUCN, con una popolazione selvatica stimata in circa 7.000 individui. I cuccioli nati in ambienti controllati e responsabili come Nova's Legacy possono partecipare, in futuro, a programmi di reintroduzione nelle aree protette." },
      { type: 'img', src: '/img/volontari-gruppo.png', caption: 'Il team durante il monitoraggio notturno degli animali nel Waterberg' },
      { type: 'h2', content: 'Il periodo di monitoraggio' },
      { type: 'text', content: "I tre cuccioli vengono pesati e controllati ogni 48 ore per le prime tre settimane. Il team registra peso, lunghezza, frequenza cardiaca e comportamento di allattamento. Amira dimostra capacità materne eccellenti: pulisce i cuccioli regolarmente, li allatta ogni 2–3 ore e li mantiene al caldo durante le notti fredde del Waterberg." },
      { type: 'quote', content: "Amira è una madre straordinaria. Fin dal primo momento ha mostrato tutti gli istinti materni necessari. I cuccioli sono forti e stanno crescendo bene.", author: "Kim Hiltrop, fondatrice di Nova's Legacy" },
      { type: 'text', content: "Nei prossimi mesi pubblicheremo aggiornamenti regolari. Seguici su Facebook e Instagram, oppure scrivi a kim@novaslegacy.co.za per ricevere gli aggiornamenti direttamente." },
    ],
  },
  {
    slug: 'testimonianza-marco-torino',
    tag: 'Volontariato',
    date: '3 Aprile 2025',
    title: 'Sei settimane nel bush: la testimonianza di Marco',
    excerpt: 'Marco, 24 anni, studente di biologia da Torino, ci racconta la sua esperienza. "Ho imparato cose che non troverei mai in un libro di testo."',
    img: '/img/volontari-lavoro.png',
    body: [
      { type: 'text', content: "Marco Ferretti, 24 anni, studentessa magistrale di biologia della conservazione all'Università di Torino, ha trascorso sei settimane come volontario a Nova's Legacy nell'estate del 2024. Gli abbiamo chiesto di raccontarci la sua esperienza." },
      { type: 'h2', content: 'Com\'era una giornata tipo?' },
      { type: 'quote', content: "Sveglia alle 5:45, prima del sole. Preparazione del cibo per gli animali, poi alimentazione. Ogni ghepardo ha la sua personalità, il suo ritmo. Ho imparato a riconoscerli uno per uno: il modo in cui Kibo si avvicina al cancello, come Zara preferisce mangiare da sola. Cose che non troverò mai su un libro di testo.", author: 'Marco, volontario da Torino' },
      { type: 'img', src: '/img/volontarie-ghepardo.png', caption: 'Volontari durante la sessione mattutina di alimentazione' },
      { type: 'h2', content: 'Il momento più bello' },
      { type: 'text', content: "Marco descrive il Cheetah Run come il momento che lo ha cambiato per sempre: \"Quando il ghepardo ha iniziato a correre, ho corso anch'io. Non riuscivo a stare al passo — ovviamente — ma per quei venti secondi ho sentito qualcosa di primitivo, di autentico. Come se il bush ti ricordasse che sei ancora parte della natura.\"" },
      { type: 'img', src: '/img/ghepardo-corsa-erba-gialla.png', caption: 'La savana del Waterberg al tramonto, vista dalla riserva' },
      { type: 'h2', content: 'Il consiglio per chi vuole venire' },
      { type: 'quote', content: "Venite con aspettative giuste. Non è una vacanza con gli animali, è lavoro vero. Vi sporcherete le mani, farete cose difficili, sentirete puzze terribili — e amerete ogni secondo di tutto questo.", author: 'Marco' },
      { type: 'text', content: "Se vuoi vivere un'esperienza simile a quella di Marco, visita la sezione Volontariato del nostro sito o scrivi direttamente a kim@novaslegacy.co.za." },
    ],
  },
  {
    slug: 'ghepardo-piu-rischio-leone',
    tag: 'Conservazione',
    date: '18 Marzo 2025',
    title: 'Perché il ghepardo è più a rischio del leone',
    excerpt: "Un approfondimento sui fattori che rendono il ghepardo particolarmente vulnerabile: dalla bassa diversità genetica al conflitto con gli allevatori.",
    img: '/img/ghepardo-erba.png',
    body: [
      { type: 'text', content: "Il leone domina l'immaginario della savana africana, eppure è il ghepardo a trovarsi in una situazione più critica. Capire perché richiede di guardare oltre le cifre di popolazione e considerare la biologia, l'ecologia e la storia evolutiva di questa specie straordinaria." },
      { type: 'h2', content: 'Il collo di bottiglia genetico' },
      { type: 'text', content: "Circa 10.000 anni fa, un evento catastrofico — probabilmente una glaciazione — ha ridotto la popolazione mondiale di ghepardi a pochissimi individui. Questa riduzione drammatica ha causato quello che i biologi chiamano 'collo di bottiglia genetico': tutta la specie discende da un numero ristrettissimo di antenati, risultando in una diversità genetica estremamente bassa." },
      { type: 'text', content: "Le conseguenze pratiche sono gravi: il sistema immunitario dei ghepardi è meno efficace nel combattere nuovi patogeni, la fertilità maschile è ridotta (oltre il 70% degli spermatozoi ha morfologia anomala), e la specie è più vulnerabile a malattie che decimerebbero popolazioni con maggiore variabilità genetica." },
      { type: 'img', src: B + '20201128_175257-1-scaled.jpg', caption: 'Nova, la gheparda che ha dato il nome alla riserva — monitorata quotidianamente dal team' },
      { type: 'h2', content: 'Il conflitto con gli allevatori' },
      { type: 'text', content: "Il ghepardo non ruggisce. Non ha la taglia del leopardo né la forza del leone. Ma è abbastanza grande da rappresentare una minaccia per i vitelli e i caprioli degli allevatori. Il risultato: in molte regioni dell'Africa subsahariana, i ghepardi vengono uccisi dagli allevatori in difesa del bestiame." },
      { type: 'text', content: "A Nova's Legacy lavoriamo per costruire ponti con le comunità locali, dimostrando che la coesistenza è possibile e che la conservazione porta benefici economici tangibili attraverso il turismo responsabile e i programmi educativi." },
      { type: 'h2', content: 'Cosa puoi fare tu' },
      { type: 'text', content: "Adottare un ghepardo, partecipare come volontario, o semplicemente condividere questi contenuti: ogni azione conta. La sopravvivenza del ghepardo dipende dalla consapevolezza globale e dal sostegno diretto a realtà come la nostra." },
    ],
  },
  {
    slug: 'spirit-cavallo-salvato',
    tag: 'Progetto Cavalli',
    date: '7 Febbraio 2025',
    title: 'Spirit trova casa: la storia di un cavallo salvato',
    excerpt: "Spirit è arrivato da noi in condizioni precarie. Sei mesi dopo, trotta libero nella riserva. La storia della sua riabilitazione.",
    img: '/img/cavallo-puledro.png',
    body: [
      { type: 'text', content: "Spirit è arrivato a Nova's Legacy nell'agosto del 2024 in condizioni che avrebbero scoraggiato chiunque. Denutrito, con ferite alle zampe e un profondo diffidenza verso gli esseri umani, sembrava improbabile che potesse recuperare completamente. Sei mesi dopo, trotta libero nella riserva e accetta le carezze dei volontari." },
      { type: 'img', src: '/img/chalet-esterno-2.png', caption: 'La riserva di Nova\'s Legacy, con le montagne del Waterberg sullo sfondo' },
      { type: 'h2', content: 'I primi mesi: fiducia passo dopo passo' },
      { type: 'text', content: "La riabilitazione di un cavallo traumatizzato non si misura in giorni ma in gesti. I volontari del programma cavalli hanno passato settimane semplicemente stando vicini a Spirit, senza cercare di toccarlo, permettendogli di abituarsi alla presenza umana ai suoi ritmi. Il cibo è diventato il primo punto di contatto: lentamente, Spirit ha iniziato ad avvicinarsi durante i pasti." },
      { type: 'quote', content: "Con i cavalli, la pazienza non è una virtù — è l'unico metodo che funziona. Spirit ci ha insegnato più di qualsiasi manuale di equitazione.", author: "Kim Hiltrop" },
      { type: 'h2', content: 'Il progetto cavalli di Nova\'s Legacy' },
      { type: 'text', content: "Il programma cavalli è una delle componenti fondamentali di Nova's Legacy. Accogliamo animali in difficoltà, li riabilitiamo con l'aiuto dei volontari, e offriamo esperienze di equitazione nel bush agli ospiti. I volontari del programma apprendono tecniche di natural horsemanship e partecipano attivamente alla cura quotidiana degli animali." },
      { type: 'text', content: "Se sei interessato a partecipare al programma cavalli come volontario, contattaci a kim@novaslegacy.co.za." },
    ],
  },
  {
    slug: '200-bambini-bela-bela',
    tag: 'Educazione',
    date: '22 Gennaio 2025',
    title: '200 bambini in visita dalla scuola di Bela-Bela',
    excerpt: "Il nostro programma educativo ha accolto 200 studenti locali. Per molti di loro, era la prima volta che vedevano un ghepardo da vicino.",
    img: '/img/volontari-gruppo.png',
    body: [
      { type: 'text', content: "Ogni anno, Nova's Legacy apre le sue porte alle scuole della regione di Limpopo. In gennaio, 200 studenti delle scuole primarie di Bela-Bela hanno partecipato al nostro programma educativo — per molti di loro, la prima volta nella vita a vedere un ghepardo da così vicino." },
      { type: 'img', src: '/img/chalet-esterno.png', caption: 'Il paesaggio del Waterberg che circonda la riserva' },
      { type: 'h2', content: 'Conservazione che inizia dalle comunità locali' },
      { type: 'text', content: "La conservazione sostenibile non può prescindere dalle comunità che vivono accanto alla fauna selvatica. Il nostro programma educativo è progettato per creare un legame emotivo tra i bambini locali e la natura che li circonda — un legame che diventerà, nel tempo, consapevolezza e impegno." },
      { type: 'text', content: "Durante la visita, i bambini partecipano a sessioni guidate sul comportamento del ghepardo, imparano a distinguere le orme degli animali della savana, e assistono alla preparazione del cibo per i residenti della riserva. Alla fine, la maggior parte di loro vuole tornare." },
      { type: 'quote', content: "Un bambino che ha visto un ghepardo in vita, che ha capito perché è in pericolo, diventerà un adulto che vota per la conservazione. Questo è il nostro investimento a lungo termine.", author: "Kim Hiltrop" },
      { type: 'img', src: '/img/ghepardo-erba-alta.png', caption: 'Uno dei residenti della riserva, fotografato durante le ore mattutine' },
      { type: 'text', content: "Le scuole interessate a organizzare una visita educativa possono contattarci a kim@novaslegacy.co.za. Le visite per gruppi scolastici locali sono offerte a tariffe ridotte o gratuite, in base alle possibilità della scuola." },
    ],
  },
  {
    slug: 'cheetah-run-come-funziona',
    tag: 'Cheetah Run',
    date: '10 Gennaio 2025',
    title: 'Il Cheetah Run: tutto quello che devi sapere',
    excerpt: "Come funziona, come prepararsi, cosa aspettarsi. La guida completa all'esperienza più adrenalinica del Sudafrica.",
    img: '/img/ghepardo-corsa-recinzione.png',
    body: [
      { type: 'text', content: "Il Cheetah Run di Nova's Legacy è una delle esperienze più uniche al mondo: correre — o almeno provarci — accanto al ghepardo più veloce del pianeta. Ecco tutto quello che devi sapere prima di prenotare." },
      { type: 'h2', content: 'Come funziona' },
      { type: 'text', content: "L'esperienza si svolge in un'area dedicata all'interno della riserva. Un ghepardo adulto abituato alla presenza umana viene portato nella zona di partenza. Al segnale, l'animale inizia a correre seguendo uno stimolo visivo — e tu corri con lui. Il ghepardo raggiunge velocità fino a 110 km/h: saranno i secondi più veloci e indimenticabili della tua vita." },
      { type: 'img', src: '/img/ghepardo-corsa-2.png', caption: 'Il ghepardo in piena corsa nel Waterberg' },
      { type: 'h2', content: 'Quanto dura e quando si prenota' },
      { type: 'text', content: "L'esperienza completa dura circa 45 minuti, inclusi briefing, incontro con il ghepardo e il run vero e proprio. È disponibile tutti i giorni mattina e pomeriggio, su prenotazione. Si consiglia di prenotare con almeno 48 ore di anticipo, soprattutto nei periodi di alta stagione (luglio–settembre e dicembre–gennaio)." },
      { type: 'quote', content: "Non è solo adrenalina. In quei secondi capisci visceralmente perché questo animale deve essere protetto. È un incontro che ti cambia.", author: "Sofia, visitatrice da Milano" },
      { type: 'h2', content: 'Cose pratiche' },
      { type: 'text', content: "Indossa scarpe da corsa e abbigliamento comodo. Porta la macchina fotografica — ma assicurati che sia al sicuro (cinghia o marsupio). Età minima: 12 anni. Non è richiesta esperienza atletica particolare: l'importante è essere in forma per una corsa breve. Per prenotare, scrivi a kim@novaslegacy.co.za o chiama il +27 82 352 0940." },
    ],
  },
  {
    slug: 'nova-storia-gheparda-fondatrice',
    tag: 'Storie',
    date: '12 Dicembre 2024',
    title: "Nova: la storia della gheparda che ha ispirato tutto",
    excerpt: "Ogni grande progetto nasce da un incontro. Il nostro è nato da Nova — una cucciola di ghepardo trovata sola nel bush nel 2019.",
    img: '/img/nova-primo-piano.png',
    body: [
      { type: 'text', content: "C'è una foto che Kim Hiltrop porta sempre con sé. La scatta il 14 marzo 2019, nella savana del Limpopo: una cucciola di ghepardo, quattro settimane di vita, sola. La madre è morta, non si sa come. La cucciola si chiamerà Nova." },
      { type: 'img', src: '/img/nova-primo-piano.png', caption: 'Nova, la gheparda fondatrice — fotografata nella sua area della riserva' },
      { type: 'h2', content: 'I primi mesi' },
      { type: 'text', content: "Nova arriva a Kim in condizioni critiche: disidratata, sottopeso, con segni di insolazione. Kim non ha un centro di recupero. Ha un terreno, una passione immensa per gli animali, e la determinazione di chi sa che non si può girare dall'altra parte. Inizia a nutrirla ogni due ore, di giorno e di notte." },
      { type: 'quote', content: "Non avevo un piano. Avevo solo Nova che aveva bisogno di cure. Il resto è venuto da solo, giorno per giorno.", author: "Kim Hiltrop" },
      { type: 'text', content: "In pochi mesi, Nova si riprende completamente. È una gheparda in piena salute, curiosa, vivace. Ma non può essere reintrodotta in natura — è troppo abituata alla presenza umana per sopravvivere da sola. Kim decide: Nova non sarà un'eccezione, sarà l'inizio di qualcosa." },
      { type: 'h2', content: "Nova's Legacy: un nome, una promessa" },
      { type: 'text', content: "La riserva prende il nome da lei. Nova non è solo un animale: è il simbolo di tutto quello che la riserva vuole essere — un posto dove ogni vita conta, dove la cura è concreta e quotidiana, dove la conservazione non è una parola ma una pratica. Oggi Nova vive nella sua area della riserva, osservata e amata da centinaia di visitatori ogni anno." },
      { type: 'img', src: '/img/volontari-gruppo.png', caption: "Il team di Nova's Legacy al lavoro nelle prime ore del mattino" },
    ],
  },
  {
    slug: 'cani-selvatici-africani',
    tag: 'Fauna Selvatica',
    date: '8 Novembre 2024',
    title: "Cani selvatici africani: i nostri ospiti più rari",
    excerpt: "Il Lycaon pictus è uno dei carnivori più minacciati d'Africa. A Nova's Legacy ospitiamo un piccolo branco. Ecco la loro storia.",
    img: '/img/licaone.png',
    body: [
      { type: 'text', content: "Il cane selvatico africano (Lycaon pictus) è uno dei predatori più efficienti e sociali della savana — e uno dei più minacciati. Con meno di 7.000 individui rimasti in natura, è più raro del leopardo e del leone. A Nova's Legacy ospitiamo un piccolo branco di quattro esemplari, parte di un programma di conservazione ex-situ." },
      { type: 'h2', content: "Una biologia straordinaria" },
      { type: 'text', content: "I cani selvatici africani vivono in branchi altamente organizzati con strutture sociali complesse. Il tasso di successo della caccia supera l'80% — più alto di qualsiasi altro grande predatore africano. Comunicano attraverso un repertorio vocale ricco e mostrano comportamenti altruistici rari nel regno animale, come il rigurgito del cibo per gli anziani e i malati del branco." },
      { type: 'img', src: '/img/licaone.png', caption: "Uno dei membri del branco durante le ore mattutine" },
      { type: 'h2', content: "Le minacce principali" },
      { type: 'text', content: "Le cause del declino sono molteplici: perdita dell'habitat, frammentazione delle popolazioni, conflitti con gli allevatori, malattie trasmesse dai cani domestici (in particolare il cimurro e la rabbia). Il Lycaon ha bisogno di vasti territori — fino a 1.500 km² per un branco — che la pressione umana riduce ogni anno." },
      { type: 'quote', content: "Ogni individuo conta. Con popolazioni così piccole, perdere anche un solo animale per una causa evitabile è una sconfitta per tutta la specie.", author: "Kim Hiltrop" },
      { type: 'img', src: '/img/ghepardo-erba-alta.png', caption: "La riserva offre habitat sicuro per diverse specie minacciate" },
      { type: 'text', content: "I visitatori di Nova's Legacy possono osservare il branco durante i game drive mattutini, in condizioni controllate che garantiscono sicurezza per gli animali e per le persone. Per saperne di più, visita la sezione Conservazione del sito." },
    ],
  },
  {
    slug: 'volontariato-faq',
    tag: 'Volontariato',
    date: '15 Ottobre 2024',
    title: 'Diventare volontario: le domande più frequenti',
    excerpt: "Devo avere esperienza con gli animali? Quanto costa? Dove si dorme? Rispondiamo a tutte le domande che ci arrivano ogni settimana.",
    img: '/img/volontarie-ghepardo.png',
    body: [
      { type: 'text', content: "Ogni settimana riceviamo decine di email da persone che vogliono venire a fare volontariato a Nova's Legacy. Le domande sono quasi sempre le stesse — il che ci ha convinto a raccoglierle tutte in un articolo." },
      { type: 'h2', content: "Devo avere esperienza con gli animali?" },
      { type: 'text', content: "No. La maggior parte dei nostri volontari non ha mai lavorato con animali selvatici prima di arrivare qui. Quello che conta è la motivazione, la disponibilità a imparare e la capacità di fare lavoro fisico. Il team ti insegnerà tutto quello che ti serve." },
      { type: 'h2', content: "Quanto dura il periodo minimo?" },
      { type: 'text', content: "Il minimo è due settimane. Ma ti diciamo subito: due settimane bastano per innamorarsi del posto, non per capirlo davvero. Il tempo ideale è tra le quattro e le otto settimane. Molti volontari che arrivano per due settimane finiscono per restare due mesi." },
      { type: 'img', src: '/img/volontari-gruppo.png', caption: "I volontari diventano parte del team quotidiano della riserva" },
      { type: 'h2', content: "Dove si dorme e cosa si mangia?" },
      { type: 'text', content: "I volontari alloggiano negli chalet della riserva o in sistemazioni condivise, a seconda della disponibilità. I pasti sono tre al giorno, preparati in comune. La cucina è semplice e abbondante — hai bisogno di energia per alzarti alle sei ogni mattina." },
      { type: 'h2', content: "Quanto costa?" },
      { type: 'text', content: "Il programma ha un costo che copre alloggio, pasti e supervisione professionale. Variamo le tariffe in base alla durata del soggiorno e al periodo dell'anno. Scrivici a kim@novaslegacy.co.za con le tue date e ti mandiamo un preventivo dettagliato." },
      { type: 'quote', content: "Il costo del volontariato non è una spesa — è un investimento nella conservazione e nella tua crescita personale. Ogni rand che paghi va direttamente alla cura degli animali.", author: "Kim Hiltrop" },
      { type: 'img', src: '/img/volontarie-ghepardo.png', caption: "Una mattina tipica: alimentazione e cura degli animali con il team" },
      { type: 'h2', content: "Come ci si candida?" },
      { type: 'text', content: "Scrivi un'email a kim@novaslegacy.co.za presentandoti: chi sei, cosa studi o fai, perché vuoi venire e le date che hai in mente. Rispondiamo entro 48 ore con disponibilità, tariffe e information pack completo." },
    ],
  },
]

function ArticleBody({ blocks }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      {blocks.map((b, i) => {
        if (b.type === 'text') return (
          <p key={i} style={{ fontSize: '1.02rem', lineHeight: '1.95', color: '#444', fontWeight: 300, marginBottom: '1.5rem' }}>
            {b.content}
          </p>
        )
        if (b.type === 'h2') return (
          <h2 key={i} style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', color: 'var(--dark)', margin: '2.5rem 0 1rem', fontWeight: 700, lineHeight: 1.2 }}>
            {b.content}
          </h2>
        )
        if (b.type === 'img') return (
          <figure key={i} style={{ margin: '2.5rem 0' }}>
            <div style={{ overflow: 'hidden', borderRadius: '2px' }}>
              <img
                src={b.src}
                alt={b.caption}
                style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {b.caption && (
              <figcaption style={{ fontSize: '0.78rem', color: '#999', marginTop: '0.6rem', fontStyle: 'italic', letterSpacing: '0.03em' }}>
                {b.caption}
              </figcaption>
            )}
          </figure>
        )
        if (b.type === 'quote') return (
          <blockquote key={i} style={{
            borderLeft: '4px solid var(--gold)',
            background: 'var(--off-white)',
            padding: '1.5rem 2rem',
            margin: '2rem 0',
            borderRadius: '0 4px 4px 0',
          }}>
            <p style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', fontStyle: 'italic', lineHeight: '1.7', color: 'var(--dark)', margin: 0, marginBottom: b.author ? '0.8rem' : 0 }}>
              &ldquo;{b.content}&rdquo;
            </p>
            {b.author && (
              <cite style={{ fontSize: '0.78rem', fontStyle: 'normal', color: 'var(--gray)', fontWeight: 600, letterSpacing: '0.05em' }}>
                — {b.author}
              </cite>
            )}
          </blockquote>
        )
        return null
      })}
    </div>
  )
}

function Blog({ goTo }) {
  useScrollReveal()
  const [open, setOpen] = useState(null)

  if (open) {
    const post = POSTS.find(p => p.slug === open)
    return (
      <div style={{ background: 'var(--white)', minHeight: '100vh' }}>
        {/* Article hero */}
        <div style={{ height: '50vh', minHeight: '340px', position: 'relative', overflow: 'hidden', background: 'var(--dark)' }}>
          <img
            src={post.img}
            alt={post.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 3rem 3rem', maxWidth: '820px' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-light)', background: 'rgba(200,136,10,0.15)', border: '1px solid rgba(200,136,10,0.3)', padding: '0.25rem 0.75rem' }}>
                {post.tag}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{post.date}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,3rem)', color: 'var(--white)', lineHeight: 1.1, fontWeight: 700 }}>
              {post.title}
            </h1>
          </div>
        </div>

        {/* Article content */}
        <div style={{ maxWidth: '740px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
          <button
            onClick={() => setOpen(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '2.5rem', padding: 0 }}
          >
            ← Torna al Blog
          </button>

          <p style={{ fontSize: '1.1rem', lineHeight: '1.85', color: '#666', fontWeight: 300, borderBottom: '1px solid #EDE5D8', paddingBottom: '1.5rem', marginBottom: 0 }}>
            {post.excerpt}
          </p>

          <ArticleBody blocks={post.body} />

          <div style={{ borderTop: '1px solid #EDE5D8', marginTop: '3rem', paddingTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="mailto:kim@novaslegacy.co.za" className="btn btn-dark">
              Contattaci
            </a>
            <button className="btn btn-outline-dark" onClick={() => setOpen(null)}>
              ← Altri articoli
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── HERO ── */}
      <div className="page-hero-img">
        <img src={B + 'IMG-20210918-WA0026.jpg'} alt="Blog Nova's Legacy" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">~ Dal Campo ~</span>
          <h1>News &amp; <em>Storie</em></h1>
          <p>Aggiornamenti, notizie e storie dal cuore del Waterberg.</p>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="page-content" style={{ background: 'var(--off-white)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 3rem' }}>
          <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.8rem', marginTop: '0.5rem' }}>
            {POSTS.map((p, i) => (
              <article
                key={p.slug}
                className="rv"
                style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
                onClick={() => setOpen(p.slug)}
              >
                <div style={{ background: 'var(--white)', border: '1px solid #EDE5D8', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.09)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Cover photo */}
                  <div style={{ height: '210px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={p.img}
                      alt={p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)', filter: 'brightness(0.88)' }}
                      onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.filter = 'brightness(1)'; }}
                      onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.filter = 'brightness(0.88)'; }}
                    />
                    {/* Tag badge on photo */}
                    <div style={{ position: 'absolute', top: '0.8rem', left: '0.8rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--dark)', background: 'var(--gold-light)', padding: '0.25rem 0.65rem', borderRadius: '50px' }}>
                      {p.tag}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.4rem 1.5rem 1.8rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#AAA', marginBottom: '0.6rem' }}>{p.date}</div>
                    <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', lineHeight: '1.3', marginBottom: '0.7rem', color: 'var(--dark)' }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#777', lineHeight: '1.65', fontWeight: 300, marginBottom: '1.2rem' }}>
                      {p.excerpt}
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                      Leggi tutto <span>→</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA bottom */}
          <div style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid #EDE5D8' }}>
            <span className="label">~ Vuoi far parte della storia? ~</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,3vw,2.6rem)', color: 'var(--dark)', marginBottom: '1.5rem' }}>
              Unisciti alla <em style={{ fontStyle: 'italic', color: 'var(--gold)', fontWeight: 400 }}>Coalition</em>
            </h2>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-dark" onClick={() => goTo('volunteer')}>Diventa Volontario</button>
              <button className="btn btn-outline-dark" onClick={() => goTo('internship')}>Programma Internship</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Blog
