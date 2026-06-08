function Visit({ goTo }) {
  return (
    <>
      <div className="page-hero page-hero-warm" style={{ background: 'linear-gradient(135deg, var(--sky-warm), var(--earth-deep))' }}>
        <p className="section-tag" style={{ color: 'var(--sand-light)' }}>~ Stay With Us ~</p>
        <h2 className="section-title">Visits &amp; <em>Accommodation</em></h2>
        <p className="intro">Experience the Waterberg in comfort. Stunning views, unforgettable wildlife encounters, and African hospitality.</p>
      </div>

      <div className="page-body">
        <div className="container">
          <span className="back-link" onClick={() => goTo('home', 'experience')}>← Back to Experiences</span>

          <h2>Your Home in the <em>Bush</em></h2>
          <p>Not everyone can commit to a full volunteer programme — and that&apos;s perfectly fine. We welcome day visitors, overnight guests, and short-stay travellers who want to experience what we do, meet our animals up close, and enjoy the breathtaking beauty of the Waterberg region.</p>
          <p>Our accommodation is clean, comfortable, and surrounded by nature. Wake up to birdsong, have breakfast while watching giraffes pass by, and end your day with a sunset that will stay with you forever. We&apos;re in a malaria-free zone, making it safe and accessible for families too.</p>

          <div className="highlight-box">
            <p><strong>Activities during your stay:</strong> Guided tours of the centre, cheetah feeding experiences, game drives through our 865-hectare reserve, photo safaris, and educational talks. We&apos;ll tailor your experience to your interests.</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a className="btn btn-primary" onClick={() => goTo('home', 'contact')}>Book Your Stay</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Visit
