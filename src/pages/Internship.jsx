function Internship({ goTo }) {
  return (
    <>
      <div className="page-hero page-hero-warm" style={{ background: 'linear-gradient(135deg, var(--grass-dark), var(--earth-deep))' }}>
        <p className="section-tag" style={{ color: 'var(--grass-light)' }}>~ Academic Placements ~</p>
        <h2 className="section-title">University <em>Internships</em></h2>
        <p className="intro">Real-world conservation experience for veterinary, zoology, ecology, and wildlife management students.</p>
      </div>

      <div className="page-body">
        <div className="container">
          <span className="back-link" onClick={() => goTo('home', 'experience')}>← Back to Experiences</span>

          <h2>Field Experience That <em>Matters</em></h2>
          <p>Our internship programme offers accredited field placements for students who want more than textbooks. You&apos;ll work directly with exotic and domestic species, assist with health checks and veterinary procedures, collect behavioural data, and gain practical skills that will set you apart in your career.</p>
          <p>We&apos;ve hosted students from universities across Europe, North America, Australia, and Africa. Many return as volunteers, and some have gone on to build careers in conservation directly inspired by their time here.</p>

          <div className="highlight-box">
            <p><strong>Academic credit:</strong> We work with your university to ensure your placement meets their requirements. We provide structured reports, supervisor evaluations, and documentation for your academic portfolio.</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a className="btn btn-secondary" onClick={() => goTo('home', 'contact')}>Enquire About Internships</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Internship
