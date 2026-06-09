function Cheetah({ goTo }) {
  return (
    <>
      <div className="page-hero-img">
        <img
          src="/img/nova-madre-cucciolo.png"
          alt="Ghepardo Nova's Legacy"
        />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">~ Il Progetto Ghepardi ~</span>
          <h1>Breeding <em>&amp; Cheetah Run</em></h1>
          <p>
            Allevamento responsabile, conservazione del patrimonio genetico
            e un&apos;esperienza unica per conoscere il felino più veloce del mondo.
          </p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

          <h2>La storia di <em>Nova</em></h2>
          <p>
            Nova era una gheparda a tre zampe, salvata da una situazione disperata
            e allevata a mano da Kim Hiltrop — infermiera veterinaria con un cuore grande
            come l&apos;Africa. Nova non poteva sopravvivere in natura, ma ha dato vita
            a qualcosa di straordinario: un intero progetto di conservazione che porta il suo nome.
          </p>
          <p>
            Oggi Nova&apos;s Legacy è molto più di un rifugio. È un centro di allevamento
            certificato, un punto di riferimento per la conservazione del ghepardo
            nel Waterberg, e una casa per decine di animali selvatici.
          </p>

          <div className="highlight">
            <p>
              <strong>Il ghepardo è la specie felina più a rischio in Africa.</strong>
              Meno di 7.000 esemplari vivono ancora allo stato selvatico — l&apos;80% del declino
              è avvenuto negli ultimi 100 anni. Il bracconaggio, la perdita di habitat
              e il conflitto con i pastori sono le cause principali.
            </p>
          </div>

          <h2>Il <em>Cheetah Run</em></h2>
          <p>
            Il Cheetah Run è l&apos;esperienza più adrenalinica che puoi fare a Nova&apos;s Legacy.
            Corri su una pista di 60 metri accanto a un ghepardo vivo, senti la sua
            accelerazione esplosiva, guardalo toccare i 112 km/h. Non è uno spettacolo —
            è una finestra sulla natura che ti cambia per sempre.
          </p>
          <p>
            Disponibile per visitatori, gruppi e volontari. La durata dell&apos;esperienza
            è di circa 15–20 minuti incluso il briefing di sicurezza.
            Contattaci via email o WhatsApp per prenotare.
          </p>

          <h2>Il Programma di <em>Breeding</em></h2>
          <p>
            Il nostro programma di riproduzione è sviluppato in collaborazione con
            esperti di conservazione internazionali. Ogni accoppiamento è pianificato
            per massimizzare la diversità genetica della popolazione captiva,
            riducendo la consanguineità e aumentando la vitalità degli esemplari.
          </p>
          <p>
            I cuccioli nati a Nova&apos;s Legacy vengono monitorati fin dai primi giorni.
            Dove possibile, vengono avviate procedure per il reinserimento in natura
            tramite programmi di rewilding in collaborazione con riserve partner.
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-dark" onClick={() => goTo('volunteer')}>
              Diventa Volontario
            </button>
            <button className="btn btn-outline-dark" onClick={() => goTo('adopt')}>
              Adotta un Ghepardo
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cheetah
