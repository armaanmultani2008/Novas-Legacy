function Cheetah({ goTo }) {
  return (
    <>
      <div className="page-hero page-hero-warm">
        <p className="section-tag" style={{ color: 'var(--sunset-glow)' }}>~ Our Core Mission ~</p>
        <h2 className="section-title">Cheetah <em>Breeding</em> Project</h2>
        <p className="intro">Building a genetically diverse captive population to give cheetahs a fighting chance in a world running out of space.</p>
      </div>

      <div className="page-body">
        <div className="container">
          <span className="back-link" onClick={() => goTo('home', 'projects')}>← Back to Projects</span>

          <div className="page-img-placeholder" style={{ background: 'linear-gradient(135deg, #8B6B3D, #3D2B1F)' }}>
            <span style={{ fontSize: '6rem' }}>🐆</span>
            <div className="caption">Our cheetahs at the Waterberg centre</div>
          </div>

          <h2>Why Cheetah <em>Breeding</em> Matters</h2>
          <p>Cheetahs are Africa&apos;s most endangered big cat. With fewer than 7,000 remaining in the wild and a gene pool that&apos;s dangerously narrow, captive breeding isn&apos;t just helpful — it&apos;s essential for the survival of the species.</p>
          <p>At Nova&apos;s Legacy, we breed cheetahs with careful genetic planning, ensuring maximum diversity. Our goal is not to keep cheetahs in captivity forever, but to build a strong gene pool that can one day help repopulate the African plains when safe, wild habitat is available.</p>

          <div className="highlight-box">
            <p><strong>King Cheetahs:</strong> We are one of the few centres in the world that houses king cheetahs — a rare genetic variant with large, blotched markings instead of the typical spots. Their presence in our programme adds invaluable genetic diversity.</p>
          </div>

          <h2>Our <em>Approach</em></h2>
          <p>Every breeding decision is guided by studbook data and genetic analysis. We work with other centres and conservation bodies to ensure our programme contributes to the broader species survival plan. Cubs born here are raised with careful socialisation protocols that prepare them for possible future reintroduction.</p>
          <p>We also run a comprehensive educational programme that teaches visitors, volunteers, and local communities about the challenges cheetahs face — from habitat loss to human-wildlife conflict — and what can be done to help.</p>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a className="btn btn-primary" onClick={() => goTo('volunteer')}>Volunteer with Our Cheetahs</a>
            <a className="btn btn-outline-dark" onClick={() => goTo('adopt')} style={{ marginLeft: '0.5rem' }}>Adopt a Cheetah</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cheetah
