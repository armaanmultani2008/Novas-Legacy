function Conservation({ goTo }) {
  return (
    <>
      <div className="page-hero page-hero-warm" style={{ background: 'linear-gradient(135deg, var(--grass-dark), var(--earth-mid))' }}>
        <p className="section-tag" style={{ color: 'var(--grass-light)' }}>~ Education &amp; Impact ~</p>
        <h2 className="section-title">Conservation &amp; <em>Education</em></h2>
        <p className="intro">Protecting predators, educating communities, and changing the narrative around human-wildlife coexistence.</p>
      </div>

      <div className="page-body">
        <div className="container">
          <span className="back-link" onClick={() => goTo('home', 'projects')}>← Back to Projects</span>

          <div className="page-img-placeholder" style={{ background: 'linear-gradient(135deg, var(--grass-dark), var(--earth-mid))' }}>
            <span style={{ fontSize: '6rem' }}>🌍</span>
            <div className="caption">Conservation runs through everything we do</div>
          </div>

          <h2>More Than a <em>Sanctuary</em></h2>
          <p>Nova&apos;s Legacy is home to far more than cheetahs. Our 865-hectare reserve houses wild dogs, caracals, servals, civets, black-backed jackals, bat-eared foxes, and lions in dedicated enclosures, while giraffes, wildebeest, impala, kudu, warthogs, and zebra roam free.</p>
          <p>But caring for animals is only half the mission. We run an educational centre that addresses the root causes of predator decline: habitat loss, human-wildlife conflict, poaching, and misinformation.</p>

          <div className="highlight-box">
            <p><strong>Community workshops:</strong> We regularly host local farmers and community members for workshops on predator-livestock coexistence, teaching non-lethal deterrent methods and building understanding.</p>
          </div>

          <h2>Species We <em>Protect</em></h2>
          <p>Our captive residents include cheetahs (spotted and king), African wild dogs, caracals, servals, civets, black-backed jackals, bat-eared foxes, and lions. Each species plays a vital role in the ecosystem, and each faces unique threats that we work to address through care, breeding, and education.</p>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a className="btn btn-secondary" onClick={() => goTo('volunteer')}>Join Our Conservation Team</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Conservation
