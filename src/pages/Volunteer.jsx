function Volunteer({ goTo }) {
  return (
    <>
      <div className="page-hero page-hero-warm" style={{ background: 'linear-gradient(135deg, var(--sunset), var(--earth-deep))' }}>
        <p className="section-tag" style={{ color: 'var(--sand-light)' }}>~ Join the Coalition ~</p>
        <h2 className="section-title">Volunteer <em>With Us</em></h2>
        <p className="intro">Live the conservation life. Work alongside our team, care for incredible animals, and experience Africa in a way no tourist ever could.</p>
      </div>

      <div className="page-body">
        <div className="container">
          <span className="back-link" onClick={() => goTo('home', 'experience')}>← Back to Experiences</span>

          <h2>What <em>Volunteering</em> Looks Like</h2>
          <p>This isn&apos;t a holiday with animals on the side. Volunteering at Nova&apos;s Legacy means becoming part of the team. You&apos;ll wake early, work hard, get your hands dirty, and fall asleep to the sounds of the African bush. Every day, you&apos;ll make a direct impact on the lives of the animals in our care.</p>
          <p>Volunteers help with animal feeding and nutrition preparation, enclosure maintenance and enrichment building, the horse project, game drives and reserve monitoring, educational activities and community outreach, and general farm maintenance. Minimum stay is typically 2 weeks, though we welcome longer commitments.</p>

          <div className="highlight-box">
            <p><strong>Accommodation &amp; meals:</strong> Comfortable shared accommodation is provided in our volunteer quarters, along with three meals a day. You&apos;ll live in the bush, surrounded by wildlife, with everything you need to be comfortable.</p>
          </div>

          <h2>How to <em>Apply</em></h2>
          <p>Getting started is simple. Fill out our contact form or email us directly at info@novaslegacy.com. Tell us about yourself, your interests, and your preferred dates. We&apos;ll get back to you with availability, pricing, and a full information pack to help you prepare for the experience of a lifetime.</p>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a className="btn btn-primary" onClick={() => goTo('home', 'contact')}>Apply Now</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Volunteer
