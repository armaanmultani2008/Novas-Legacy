function Horses({ goTo }) {
  return (
    <>
      <div className="page-hero-img">
        <img
          src="https://novaslegacy.com/wp-content/uploads/2022/05/vol-4-1024x768.jpg"
          alt="Progetto Cavalli"
        />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">~ Rescue &amp; Riabilitazione ~</span>
          <h1>Il Progetto <em>Cavalli</em></h1>
          <p>
            Una seconda possibilità per cavalli salvati da situazioni difficili.
            Riabilitazione, cura e connessione umana.
          </p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

          <h2>Chi sono i <em>nostri cavalli</em></h2>
          <p>
            Il progetto cavalli di Nova&apos;s Legacy nasce dalla stessa filosofia
            che guida tutto il nostro lavoro: ogni animale merita rispetto, cura e
            la possibilità di vivere una vita dignitosa.
          </p>
          <p>
            I cavalli che ospitiamo provengono da situazioni di abbandono, maltrattamento
            o impossibilità di mantenimento. Vengono valutati da veterinari,
            trattati per eventuali problemi fisici e gradualmente riabilitati
            attraverso un programma di rieducazione relazionale.
          </p>

          <div className="highlight">
            <p>
              La riabilitazione equina è un processo lento che richiede pazienza,
              coerenza e rispetto. I volontari partecipano attivamente a questo percorso —
              imparando allo stesso tempo le basi dell&apos;equitazione e della comunicazione non verbale.
            </p>
          </div>

          <h2>Cosa fanno i <em>volontari</em></h2>
          <p>
            I volontari che scelgono di lavorare con i cavalli seguono un programma
            specifico che include: pulizia e manutenzione delle stalle, somministrazione
            di pasti e integratori, sessioni di grooming, lavoro al longe e,
            per chi ha esperienza, sessioni di monta supervisionata.
          </p>
          <p>
            Non è necessaria esperienza pregressa con i cavalli. Il team insegna tutto
            dall&apos;inizio, in totale sicurezza. L&apos;importante è l&apos;atteggiamento giusto:
            calma, rispetto e apertura all&apos;apprendimento.
          </p>

          <h2>Parte di un <em>ecosistema più grande</em></h2>
          <p>
            I cavalli di Nova&apos;s Legacy vivono nella stessa riserva di ghepardi,
            cani selvatici, giraffe e zebre. Questo crea un ambiente straordinariamente
            ricco, dove ogni mattina è una scoperta diversa.
          </p>
          <p>
            Molti volontari dicono che il momento più memorabile del loro soggiorno
            è stato vedere un ghepardo e un cavallo separati solo dalla recinzione,
            guardarsi con reciproca curiosità.
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-dark" onClick={() => goTo('volunteer')}>
              Fai Volontariato
            </button>
            <button className="btn btn-outline-dark" onClick={() => goTo('conservation')}>
              Scopri la Conservazione
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Horses
