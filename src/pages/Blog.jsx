function Blog({ goTo }) {
  return (
    <>
      <div className="page-hero page-hero-dark">
        <p className="section-tag" style={{ color: 'var(--sunset-glow)' }}>~ From the Field ~</p>
        <h2 className="section-title">News &amp; <em>Initiatives</em></h2>
        <p className="intro">Stories, updates, and the latest from Nova&apos;s Legacy. Follow our journey.</p>
      </div>

      <div className="page-body">
        <div className="container" style={{ maxWidth: '1000px' }}>
          <span className="back-link" onClick={() => goTo('home')}>← Back to Home</span>

          <article style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--cream-warm)' }}>
            <div className="page-img-placeholder" style={{ background: 'linear-gradient(135deg,#8B6B3D,#3D2B1F)', marginTop: 0 }}>
              <span style={{ fontSize: '5rem' }}>🐆</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--sunset)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>March 15, 2026</p>
            <h2>New Cheetah Cubs Born at the <em>Centre</em></h2>
            <p>We&apos;re thrilled to announce the arrival of two healthy cheetah cubs — a male and a female. Born to our female Amara and sired by king cheetah male Kgosi, these cubs carry extraordinary genetic potential for our breeding programme. Mother and cubs are doing well, and the volunteers are already besotted.</p>
          </article>

          <article style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--cream-warm)' }}>
            <div className="page-img-placeholder" style={{ background: 'linear-gradient(135deg,var(--grass-dark),var(--earth-mid))', marginTop: 0 }}>
              <span style={{ fontSize: '5rem' }}>🌿</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--sunset)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>February 8, 2026</p>
            <h2>Waterberg Farmer <em>Workshop</em> Success</h2>
            <p>Last month we hosted 30 local farmers for a two-day workshop on predator-livestock coexistence. Topics included non-lethal deterrents, livestock management best practices, and the ecological value of predators. The response was overwhelmingly positive, with several farmers committing to trial new methods on their properties.</p>
          </article>

          <article style={{ marginBottom: '3rem' }}>
            <div className="page-img-placeholder" style={{ background: 'linear-gradient(135deg,#5C4033,#3D2B1F)', marginTop: 0 }}>
              <span style={{ fontSize: '5rem' }}>🤝</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--sunset)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>January 20, 2026</p>
            <h2>Coalition <em>Reunion</em> Event Announced</h2>
            <p>Calling all past volunteers and interns! We&apos;re planning a special reunion event at the centre later this year. It&apos;s a chance to reconnect with the team, meet the new animals, and celebrate the incredible community we&apos;ve built across borders and continents. Details and dates coming soon — watch this space.</p>
          </article>
        </div>
      </div>
    </>
  )
}

export default Blog
