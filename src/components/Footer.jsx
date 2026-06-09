function Footer({ goTo }) {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="nav-logo" onClick={() => goTo('home')} style={{ cursor: 'pointer' }}>
            Nova&apos;s <em>Legacy</em>
          </div>
          <p>
            Progetto di allevamento e conservazione dei ghepardi nel cuore del Waterberg,
            Sudafrica. Fondata da Kim Hiltrop — infermiera veterinaria che ha allevato a mano
            Nova, una gheparda a tre zampe.
          </p>
          <div className="contact-small">
            <a href="mailto:kim@novaslegacy.co.za">kim@novaslegacy.co.za</a>
            <a href="tel:+27823520940">+27 82 352 0940</a>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
              431 Diepdrift, Bela-Bela, 0480, South Africa
            </span>
          </div>
        </div>

        <div className="footer-col">
          <h5>Il Progetto</h5>
          <a onClick={() => goTo('nova-story')}>Storia di Nova</a>
          <a onClick={() => goTo('cheetah-run')}>Cheetah Run</a>
          <a onClick={() => goTo('conservation')}>Conservazione</a>
          <a onClick={() => goTo('horses')}>Cavalli</a>
          <a onClick={() => goTo('blog')}>News &amp; Blog</a>
        </div>

        <div className="footer-col">
          <h5>Partecipa</h5>
          <a onClick={() => goTo('volunteer')}>Volontariato</a>
          <a onClick={() => goTo('internship')}>Internship</a>
          <a onClick={() => goTo('visit')}>Soggiorno</a>
          <a onClick={() => goTo('adopt')}>Adotta un Animale</a>
        </div>

        <div className="footer-col">
          <h5>Social</h5>
          <a href="https://facebook.com/Feracare" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://instagram.com/novaslegacycheetahproject" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
          <a onClick={() => goTo('merch')}>Shop</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; 2026 Nova&apos;s Legacy · Feracare Wildlife Centre · Bela-Bela, Limpopo</span>
        <span>PBO No. 930069839 · Reg. No. 2018/463513/08</span>
      </div>
    </footer>
  )
}

export default Footer
