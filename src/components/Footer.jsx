function Footer({ goTo }) {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <a className="nav-logo" onClick={() => goTo('home')} style={{ cursor: 'pointer' }}>
            Nova&apos;s <span>Legacy</span>
          </a>
          <p>Saving cheetahs, one spot at a time. A breeding centre and conservation project in the heart of the Waterberg, South Africa.</p>
        </div>

        <div className="footer-col">
          <h5>Explore</h5>
          <a onClick={() => goTo('home', 'about')}>About Us</a>
          <a onClick={() => goTo('cheetah')}>Cheetah Project</a>
          <a onClick={() => goTo('conservation')}>Conservation</a>
          <a onClick={() => goTo('horses')}>Horse Project</a>
        </div>

        <div className="footer-col">
          <h5>Get Involved</h5>
          <a onClick={() => goTo('volunteer')}>Volunteer</a>
          <a onClick={() => goTo('internship')}>Internships</a>
          <a onClick={() => goTo('visit')}>Visit &amp; Stay</a>
          <a onClick={() => goTo('adopt')}>Adopt an Animal</a>
        </div>

        <div className="footer-col">
          <h5>Connect</h5>
          <a onClick={() => goTo('home', 'contact')}>Contact Us</a>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; 2026 Nova&apos;s Legacy · Feracare Wildlife Centre · Bela Bela, Limpopo</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>Facebook</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>Instagram</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>YouTube</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
