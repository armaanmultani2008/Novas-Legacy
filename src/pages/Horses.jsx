function Horses({ goTo }) {
  return (
    <>
      <div className="page-hero page-hero-warm" style={{ background: 'linear-gradient(135deg, #5C4033, #3D2B1F)' }}>
        <p className="section-tag" style={{ color: 'var(--sunset-glow)' }}>~ Rescue &amp; Rehabilitation ~</p>
        <h2 className="section-title">The Horse <em>Project</em></h2>
        <p className="intro">Giving rescued horses a second chance at life while teaching volunteers the art of horsemanship and trust.</p>
      </div>

      <div className="page-body">
        <div className="container">
          <span className="back-link" onClick={() => goTo('home', 'projects')}>← Back to Projects</span>

          <div className="page-img-placeholder" style={{ background: 'linear-gradient(135deg, #7B6B5A, #3D2B1F)' }}>
            <span style={{ fontSize: '6rem' }}>🐎</span>
            <div className="caption">Our horses in the Waterberg hills</div>
          </div>

          <h2>Second Chances, <em>Strong</em> Bonds</h2>
          <p>Our equine programme rescues horses from neglect, abuse, or abandonment and gives them the rehabilitation they deserve. At Nova&apos;s Legacy, these incredible animals find safety, proper veterinary care, and the patience they need to heal — both physically and emotionally.</p>
          <p>Volunteers and interns work closely with the horses, learning the fundamentals of equine care: grooming, feeding, basic groundwork, and the slow art of building trust with an animal that may have known only fear.</p>

          <div className="highlight-box">
            <p><strong>Therapeutic connection:</strong> Working with horses has profound benefits for the volunteers themselves. Many describe the experience as deeply grounding — a counterbalance to the intensity of predator care and bush life.</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a className="btn btn-primary" onClick={() => goTo('volunteer')}>Work with Our Horses</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Horses
