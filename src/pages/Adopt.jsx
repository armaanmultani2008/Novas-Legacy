const ANIMALS = [
  { emoji: '🐆', name: 'Nova', species: 'Cheetah', desc: 'The one who started it all. Your adoption supports his legacy and the entire breeding programme.', price: 'From €15/month', bg: 'linear-gradient(160deg,#8B6B3D,#3D2B1F)' },
  { emoji: '🦁', name: 'Shira', species: 'Lion', desc: 'Rescued as a cub, Shira has grown into a magnificent lioness. Your support keeps her safe.', price: 'From €20/month', bg: 'linear-gradient(160deg,#7B5B2A,#2A1A0A)' },
  { emoji: '🐕', name: 'Ghost Pack', species: 'African Wild Dogs', desc: 'Our painted wolves are endangered and extraordinary. Help keep the pack together.', price: 'From €25/month', bg: 'linear-gradient(160deg,#5B7B4A,#1A2A0F)' },
  { emoji: '🐎', name: 'Spirit', species: 'Horse', desc: 'Rescued from neglect, Spirit is living proof that second chances work.', price: 'From €10/month', bg: 'linear-gradient(160deg,#7B6B5A,#2A1D14)' },
  { emoji: '🦊', name: 'Sandy', species: 'Bat-Eared Fox', desc: 'Tiny, curious, and full of personality. Sandy needs your help to thrive.', price: 'From €8/month', bg: 'linear-gradient(160deg,#6B4B3A,#2A1A10)' },
  { emoji: '🐈', name: 'Shadow', species: 'Serval', desc: 'A nocturnal hunter with golden fur and incredible hearing. Quiet but unforgettable.', price: 'From €12/month', bg: 'linear-gradient(160deg,#5B4B3A,#1A1510)' },
]

function Adopt({ goTo }) {
  return (
    <>
      <div className="page-hero page-hero-dark" style={{ background: 'linear-gradient(135deg, var(--earth-mid), var(--earth-deep))' }}>
        <p className="section-tag" style={{ color: 'var(--sunset-glow)' }}>~ Make It Personal ~</p>
        <h2 className="section-title">Adopt an <em>Animal</em></h2>
        <p className="intro">Choose a resident to sponsor. Receive their story, photo updates, and know that your support covers their food, medical care, and enrichment.</p>
      </div>

      <div className="page-body">
        <div className="container" style={{ maxWidth: '1000px' }}>
          <span className="back-link" onClick={() => goTo('home')}>← Back to Home</span>

          <div className="adoption-grid">
            {ANIMALS.map(a => (
              <div key={a.name} className="adoption-card">
                <div className="adoption-img" style={{ background: a.bg }}>{a.emoji}</div>
                <div className="adoption-body">
                  <h4>{a.name}</h4>
                  <div className="species">{a.species}</div>
                  <p>{a.desc}</p>
                  <div className="price">{a.price}</div>
                  <a className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>Adopt {a.name}</a>
                </div>
              </div>
            ))}
          </div>

          <div className="highlight-box" style={{ marginTop: '3rem' }}>
            <p><strong>What you receive:</strong> A personalised adoption certificate, your animal&apos;s story, quarterly photo and video updates via email, and the knowledge that you&apos;re making a real, tangible difference in their life.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Adopt
