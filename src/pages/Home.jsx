import { useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const ANIMALS = [
  { emoji: '🐆', name: 'Nova', desc: 'Cheetah · The One Who Started It All', bg: 'linear-gradient(160deg,#8B6B3D,#3D2B1F)' },
  { emoji: '🦁', name: 'Shira', desc: 'Lion · Rescued as a Cub', bg: 'linear-gradient(160deg,#7B5B2A,#2A1A0A)' },
  { emoji: '🐕', name: 'Ghost Pack', desc: 'African Wild Dogs', bg: 'linear-gradient(160deg,#5B7B4A,#1A2A0F)' },
  { emoji: '🐎', name: 'Spirit', desc: 'Horse · Rescued & Rehabilitated', bg: 'linear-gradient(160deg,#7B6B5A,#2A1D14)' },
  { emoji: '🦒', name: 'Tumelo', desc: 'Giraffe · Free-Roaming', bg: 'linear-gradient(160deg,#6B5B3A,#1A150A)' },
  { emoji: '🦓', name: 'Stripe', desc: 'Zebra · Part of the Herd', bg: 'linear-gradient(160deg,#4B5B3A,#0F1A0A)' },
  { emoji: '🦊', name: 'Sandy', desc: 'Bat-Eared Fox', bg: 'linear-gradient(160deg,#6B4B3A,#2A1A10)' },
  { emoji: '🐈', name: 'Shadow', desc: 'Serval · Night Hunter', bg: 'linear-gradient(160deg,#5B4B3A,#1A1510)' },
]

const SCHEDULE = [
  { time: '06:00', title: 'Sunrise & Morning Prep', desc: 'Wake to the bush. Prepare food and enrichment for all animals.' },
  { time: '07:00', title: 'Feeding Time', desc: 'Feed cheetahs, wild dogs, caracals, and all residents. Learn their personalities.' },
  { time: '09:00', title: 'Enclosure Work', desc: 'Maintenance, cleaning, and habitat improvement. Physical work with purpose.' },
  { time: '12:00', title: 'Lunch & Rest', desc: 'Enjoy a meal together and soak in views of the Waterberg mountains.' },
  { time: '14:00', title: 'Afternoon Activities', desc: 'Educational sessions, enrichment, horse project, or game drives through the reserve.' },
  { time: '17:00', title: 'Evening Feed & Sunset', desc: "Final rounds, evening feeds, and the most spectacular sunsets you'll ever witness." },
]

function AnimalCard({ emoji, name, desc, bg }) {
  return (
    <div className="animal-card">
      <div className="animal-img" style={{ background: bg }}>{emoji}</div>
      <div className="animal-info">
        <h4>{name}</h4>
        <span>{desc}</span>
      </div>
    </div>
  )
}

function Home({ goTo }) {
  useScrollReveal()

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const target = parseInt(el.dataset.target)
        if (isNaN(target)) return
        let current = 0
        const increment = target / 50
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            el.textContent = target + '+'
            clearInterval(timer)
          } else {
            el.textContent = Math.floor(current)
          }
        }, 30)
        observer.unobserve(el)
      })
    }, { threshold: 0.5 })

    document.querySelectorAll('.stat-number[data-target]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const marquee = document.getElementById('marquee')
    if (!marquee) return
    const pause = () => { marquee.style.animationPlayState = 'paused' }
    const resume = () => { marquee.style.animationPlayState = 'running' }
    marquee.addEventListener('mouseenter', pause)
    marquee.addEventListener('mouseleave', resume)
    return () => {
      marquee.removeEventListener('mouseenter', pause)
      marquee.removeEventListener('mouseleave', resume)
    }
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-sky"></div>
        <div className="hero-sun"></div>
        <svg
          style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 1 }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path d="M0,280 Q60,240 80,260 Q100,220 130,250 Q160,200 200,240 Q230,210 260,250 Q290,190 330,235 Q360,220 400,255 Q430,200 470,240 Q500,220 540,250 Q570,200 610,240 Q640,190 680,230 Q710,210 740,250 Q770,180 810,230 Q840,210 880,245 Q910,200 950,240 Q980,220 1020,250 Q1050,190 1090,235 Q1120,210 1160,250 Q1190,220 1220,245 Q1250,200 1290,240 Q1320,215 1360,250 Q1390,230 1440,260 L1440,320 L0,320 Z" fill="#2A1D14" opacity="0.5" />
          <path d="M0,290 Q40,260 70,280 Q100,240 140,270 Q170,250 210,275 Q240,230 280,265 Q320,245 360,270 Q400,240 440,265 Q480,250 520,275 Q560,235 600,260 Q640,245 680,270 Q720,230 760,260 Q800,240 840,270 Q880,250 920,275 Q960,235 1000,265 Q1040,250 1080,275 Q1120,240 1160,270 Q1200,255 1240,275 Q1280,245 1320,270 Q1360,260 1400,280 Q1420,265 1440,275 L1440,320 L0,320 Z" fill="#2A1D14" opacity="0.8" />
          <path d="M0,300 Q100,285 200,295 Q350,280 500,295 Q650,285 800,300 Q950,288 1100,298 Q1250,290 1440,305 L1440,320 L0,320 Z" fill="#2A1D14" />
        </svg>
        <div className="hero-bg"></div>
        <div className="hero-content">
          <p className="hero-tag">~ Waterberg, Limpopo — South Africa ~</p>
          <h1 className="hero-title">Saving Cheetahs,<br />One <em>Spot</em> at a Time</h1>
          <p className="hero-sub">A breeding centre, a conservation mission, a community of changemakers. Fighting for those who can&apos;t fight for themselves.</p>
          <div className="hero-buttons">
            <a className="btn btn-primary" onClick={() => goTo('volunteer')}>Join the Coalition</a>
            <a className="btn btn-outline" onClick={() => goTo('cheetah')}>Our Mission</a>
          </div>
        </div>
        <div className="hero-scroll"><span>Scroll</span><div className="line"></div></div>
      </section>

      {/* Stats */}
      <div className="stats">
        <div className="stats-grid">
          <div className="reveal"><div className="stat-number" data-target="865">0</div><div className="stat-label">Hectares of Wild</div></div>
          <div className="reveal reveal-d1"><div className="stat-number" data-target="50">0</div><div className="stat-label">Animals in Care</div></div>
          <div className="reveal reveal-d2"><div className="stat-number" data-target="200">0</div><div className="stat-label">Volunteers &amp; Growing</div></div>
          <div className="reveal reveal-d3"><div className="stat-number" data-target="11">0</div><div className="stat-label">Years of Impact</div></div>
        </div>
      </div>

      {/* About */}
      <section id="about" style={{ padding: '7rem 3rem' }}>
        <div className="container">
          <div className="about-grid">
            <div className="about-text reveal">
              <p className="section-tag">~ Who We Are ~</p>
              <h2 className="section-title">Born from Love,<br />Built for <em>Legacy</em></h2>
              <p className="body">Nova&apos;s Legacy was born from an unbreakable bond between a woman and a cheetah. Founded to support Feracare Wildlife Centre in the heart of the Waterberg, we took on the mission of caring for cheetahs and every animal that joins our family across 865 hectares of wild South African bush.</p>
              <p className="body">From cheetah breeding to wildlife rehabilitation, from predator education to hands-on conservation — we exist because Nova taught us that every single life matters and every action counts.</p>
              <div className="kim-card">
                <h4>Kim Hiltrop</h4>
                <p className="role">Founder &amp; Project Manager</p>
                <p className="bio">Born in &apos;84, Kim left everything behind to follow her calling in South Africa. From birds to small cats to magnificent cheetahs — her journey led to Nova, the first cheetah cub she ever hand-reared. Eleven years together forged a bond that became a life mission. Today, Kim leads the fight for cheetah survival through captive breeding and education.</p>
              </div>
            </div>
            <div className="about-image reveal reveal-d2">
              <div className="about-image-box" style={{ background: 'linear-gradient(160deg, var(--grass-dark), var(--earth-mid))' }}>
                <div className="img-placeholder">🐆</div>
                <div className="img-caption">&ldquo;He taught me the beauty in cheetahs&rdquo;</div>
              </div>
              <div className="about-accent-border"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section-dark" id="projects">
        <div className="container">
          <p className="section-tag reveal">~ Our Mission ~</p>
          <h2 className="section-title reveal">Three Projects, One <em>Purpose</em></h2>
          <div className="projects-grid">
            <div className="project-card reveal" onClick={() => goTo('cheetah')}>
              <span className="project-icon">🐆</span>
              <h3>Cheetah Breeding</h3>
              <p>Breeding genetically diverse cheetahs in captivity, building a gene pool that will one day repopulate the African plains. Home to spotted and rare king cheetahs.</p>
              <span className="learn-link">Explore Project</span>
            </div>
            <div className="project-card reveal reveal-d1" onClick={() => goTo('conservation')}>
              <span className="project-icon">🌍</span>
              <h3>Conservation &amp; Education</h3>
              <p>An educational centre focused on cheetah and predator challenges. From wild dogs to servals — we care for them while teaching the world why they matter.</p>
              <span className="learn-link">Explore Project</span>
            </div>
            <div className="project-card reveal reveal-d2" onClick={() => goTo('horses')}>
              <span className="project-icon">🐎</span>
              <h3>Horse Project</h3>
              <p>Rescued and rehabilitated horses get a second chance. Volunteers learn horsemanship while contributing to their ongoing care and wellbeing.</p>
              <span className="learn-link">Explore Project</span>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="section-warm" id="experience">
        <div className="container">
          <p className="section-tag reveal">~ What You Can Do ~</p>
          <h2 className="section-title reveal">Your <em>Adventure</em> Starts Here</h2>
          <div className="exp-grid">
            <div className="exp-card reveal" onClick={() => goTo('volunteer')}>
              <div className="exp-icon">🤝</div>
              <h4>Volunteering</h4>
              <p>Live alongside our team. Feed animals, maintain enclosures, and become part of our daily rhythm.</p>
            </div>
            <div className="exp-card reveal reveal-d1" onClick={() => goTo('internship')}>
              <div className="exp-icon">🎓</div>
              <h4>Internships</h4>
              <p>Accredited field placements for veterinary, zoology, and conservation students.</p>
            </div>
            <div className="exp-card reveal reveal-d2" onClick={() => goTo('visit')}>
              <div className="exp-icon">🏡</div>
              <h4>Visits &amp; Stays</h4>
              <p>Stay in our accommodation. Experience sunsets, wildlife encounters, and the African bush.</p>
            </div>
            <div className="exp-card reveal reveal-d3" onClick={() => goTo('volunteer')}>
              <div className="exp-icon">📸</div>
              <h4>Photo Safaris</h4>
              <p>Intimate, ethical wildlife photography encounters you won&apos;t find anywhere else.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="section-dark" id="schedule">
        <div className="container">
          <p className="section-tag reveal">~ A Day at the Farm ~</p>
          <h2 className="section-title reveal">The Rhythm of <em>Wild</em> Life</h2>
          <div className="schedule-container">
            {SCHEDULE.map(item => (
              <div key={item.time} className="schedule-item reveal">
                <div className="schedule-time">{item.time}</div>
                <div className="schedule-desc">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animals Marquee */}
      <section className="section-grass" id="animals" style={{ overflow: 'hidden' }}>
        <div className="container">
          <p className="section-tag reveal">~ Our Residents ~</p>
          <h2 className="section-title reveal">Meet the <em>Family</em></h2>
          <p className="reveal" style={{ color: 'var(--sand)', fontWeight: 300, maxWidth: '550px', lineHeight: 1.7 }}>Every animal here has a name, a story, and a place in our hearts.</p>
        </div>
        <div className="animals-marquee" id="marquee">
          {ANIMALS.map(a => <AnimalCard key={a.name} {...a} />)}
          {ANIMALS.map(a => <AnimalCard key={a.name + '-dup'} {...a} />)}
        </div>
      </section>

      {/* Volunteer Stories */}
      <section className="section-warm" id="volunteers">
        <div className="container">
          <p className="section-tag reveal">~ The Coalition ~</p>
          <h2 className="section-title reveal">Their Words, Their <em>Stories</em></h2>
          <div className="vol-grid">
            <div className="vol-card reveal">
              <p className="vol-quote">&ldquo;This wasn&apos;t just volunteering — it was a transformation. Waking up to feed cheetahs, watching sunsets, and finding a family I never knew I needed.&rdquo;</p>
              <div className="vol-author">
                <div className="vol-avatar">SR</div>
                <div><div className="vol-name">Sarah R.</div><div className="vol-from">Pennsylvania, USA · 2 weeks</div></div>
              </div>
            </div>
            <div className="vol-card reveal reveal-d1">
              <p className="vol-quote">&ldquo;As a vet student, this was the most impactful field experience I could have asked for. Real conservation, real challenges, real connections.&rdquo;</p>
              <div className="vol-author">
                <div className="vol-avatar">LM</div>
                <div><div className="vol-name">Lucas M.</div><div className="vol-from">Berlin, Germany · 4 weeks</div></div>
              </div>
            </div>
            <div className="vol-card reveal reveal-d2">
              <p className="vol-quote">&ldquo;I came for the cheetahs and left with a new perspective on life. Kim&apos;s dedication is contagious. This place changes you.&rdquo;</p>
              <div className="vol-author">
                <div className="vol-avatar">EB</div>
                <div><div className="vol-name">Emma B.</div><div className="vol-from">Melbourne, Australia · 3 weeks</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section className="big-cta">
        <p className="section-tag reveal" style={{ color: 'var(--sunset-glow)' }}>~ Ready? ~</p>
        <h2 className="section-title reveal">Be Part of <em>Something</em><br />Bigger Than Yourself</h2>
        <p className="reveal">The animals are waiting. The sunsets are calling. Your place in the coalition is here.</p>
        <div className="reveal">
          <a className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '1.1rem 2.8rem' }} onClick={() => goTo('volunteer')}>Start Your Journey</a>
        </div>
      </section>

      {/* Contact */}
      <section className="section-dark" id="contact">
        <div className="container">
          <p className="section-tag reveal">~ Get in Touch ~</p>
          <h2 className="section-title reveal">Let&apos;s <em>Talk</em></h2>
          <div className="contact-grid">
            <div className="contact-info reveal">
              <p className="intro">Whether you want to volunteer, visit, sponsor an animal, or learn more — we&apos;d love to hear from you.</p>
              <div className="contact-detail">
                <div className="icon">📍</div>
                <div><div className="label">Location</div><div className="text">Waterberg, Bela Bela · Limpopo, South Africa</div></div>
              </div>
              <div className="contact-detail">
                <div className="icon">✉️</div>
                <div><div className="label">Email</div><div className="text">info@novaslegacy.com</div></div>
              </div>
              <div className="contact-detail">
                <div className="icon">📱</div>
                <div><div className="label">Social</div><div className="text">@feracarewildlife</div></div>
              </div>
            </div>
            <div className="contact-form reveal reveal-d1">
              <input type="text" placeholder="Your Name" />
              <input type="email" placeholder="Email Address" />
              <select defaultValue="">
                <option value="" disabled>I&apos;m interested in...</option>
                <option>Volunteering</option>
                <option>University Internship</option>
                <option>Visiting / Accommodation</option>
                <option>Adopting an Animal</option>
                <option>Merchandise</option>
                <option>Other</option>
              </select>
              <textarea placeholder="Your Message..."></textarea>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Send Message</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
