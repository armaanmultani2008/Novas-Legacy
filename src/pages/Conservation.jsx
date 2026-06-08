function Conservation({ goTo }) {
  return (
    <>
      <div className="page-hero-img">
        <img
          src="https://novaslegacy.com/wp-content/uploads/2022/05/Gallery-41.jpg"
          alt="Conservazione"
        />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">~ Conservazione &amp; Educazione ~</span>
          <h1>Proteggere il <em>Futuro</em></h1>
          <p>
            Lavoriamo ogni giorno per cambiare la narrativa sul ghepardo —
            dai predatori temuti agli ambasciatori di un ecosistema sano.
          </p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

          <h2>La nostra <em>Missione</em></h2>
          <p>
            Nova&apos;s Legacy opera con un mandato chiaro: impedire l&apos;estinzione del ghepardo
            in Sud Africa attraverso l&apos;allevamento responsabile, l&apos;educazione delle comunità locali
            e la ricerca scientifica. Siamo registrati come organizzazione non-profit
            (PBO No. 930069839) e collaboriamo con istituzioni nazionali e internazionali.
          </p>

          <div className="highlight">
            <p>
              In cento anni abbiamo perso il <strong>90% dei ghepardi del mondo</strong>.
              Meno di 7.000 sopravvivono in natura. Il Sudafrica ospita circa 1.300 esemplari —
              uno dei numeri più alti del continente, ma comunque critico.
            </p>
          </div>

          <h2>Educazione <em>Ambientale</em></h2>
          <p>
            Il programma educativo di Nova&apos;s Legacy accoglie gruppi scolastici, università
            e tour operator per sessioni guidate nella riserva. Ogni visita include
            un tour degli enclosure, un incontro ravvicinato con gli animali (dove sicuro)
            e una presentazione sulla biologia e la conservazione del ghepardo.
          </p>
          <p>
            Crediamo che l&apos;educazione sia il vero antidoto all&apos;estinzione: un bambino
            che ha visto un ghepardo da vicino non lo dimentica mai.
            E da adulto, se ne fa custode.
          </p>

          <h2>Ricerca <em>Scientifica</em></h2>
          <p>
            Collaboriamo con studenti universitari e ricercatori internazionali per raccogliere
            dati comportamentali, genetici e sanitari sui nostri animali.
            I dati raccolti vengono condivisi con la comunità scientifica per contribuire
            alla comprensione della biologia del ghepardo in cattività e in natura.
          </p>

          <h2>Coesistenza <em>Umano-Fauna</em></h2>
          <p>
            Uno dei principali motivi di declino del ghepardo è il conflitto con gli allevatori
            locali. I ghepardi uccidono il bestiame — e gli allevatori li uccidono in risposta.
            Lavoriamo con le comunità del Waterberg per trovare soluzioni di coesistenza:
            cani da guardia, recinti elettrificati, compensazioni per le perdite.
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-dark" onClick={() => goTo('volunteer')}>
              Partecipa al Progetto
            </button>
            <button className="btn btn-outline-dark" onClick={() => goTo('internship')}>
              Internship Universitario
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Conservation
