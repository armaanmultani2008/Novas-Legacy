import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Turnstile from "react-turnstile";
import Lightbox from '../components/Lightbox'
import { useCMSImages } from '../CMSContext'


const DEFAULTS = {
  heroDesktop: '/img/ghepardo-erba.png',
  heroMobile:  '/img/mother-baby.png',
  pillar1:     '/img/madre-cucciolo.png',
  pillar2:     '/img/community.png',
  pillar3:     '/img/ghepardo-visita-vet.png',
  cheetahRun:  '/img/ghepardo-corsa2.png',
  progRun:     '/img/ghepardo-corsa-2.png',
  progVol:     '/img/volontari-lavoro.png',
  progChalet:  '/img/chalet-esterno.png',
  progInt:     '/img/volontari-gruppo.png',
  progAdopt:   '/img/ghepardo-cucciolo.png',
  progBreed:   '/img/cucciolata.png',
  bigCta:      '/img/ghepardo-corsa.png',
}

const ANIMALS_SRCS = [
  '/img/nova-primo-piano.png',
  '/img/leone-cucciolo-pneumatico.png',
  '/img/licaone.png',
  '/img/ghepardo-erba-alta.png',
  '/img/cavallo-puledro.png',
  '/img/volpe-orecchie.png',
  '/img/baby-wild.png',
  '/img/serval.png',
]

const ANIMALS_NAMES = ['Nova', 'Shira', 'Ghost Pack', 'Tumelo', 'Spirit', 'Sandy', 'Caracal', 'Serval']

const DIAL_CODES = [
  { name: 'Afghanistan',    code: '+93',  flag: '🇦🇫' },
  { name: 'Albania',        code: '+355', flag: '🇦🇱' },
  { name: 'Algeria',        code: '+213', flag: '🇩🇿' },
  { name: 'Argentina',      code: '+54',  flag: '🇦🇷' },
  { name: 'Australia',      code: '+61',  flag: '🇦🇺' },
  { name: 'Austria',        code: '+43',  flag: '🇦🇹' },
  { name: 'Belgium',        code: '+32',  flag: '🇧🇪' },
  { name: 'Bolivia',        code: '+591', flag: '🇧🇴' },
  { name: 'Brazil',         code: '+55',  flag: '🇧🇷' },
  { name: 'Canada',         code: '+1',   flag: '🇨🇦' },
  { name: 'Chile',          code: '+56',  flag: '🇨🇱' },
  { name: 'China',          code: '+86',  flag: '🇨🇳' },
  { name: 'Colombia',       code: '+57',  flag: '🇨🇴' },
  { name: 'Croatia',        code: '+385', flag: '🇭🇷' },
  { name: 'Czech Republic', code: '+420', flag: '🇨🇿' },
  { name: 'Denmark',        code: '+45',  flag: '🇩🇰' },
  { name: 'Ecuador',        code: '+593', flag: '🇪🇨' },
  { name: 'Egypt',          code: '+20',  flag: '🇪🇬' },
  { name: 'Ethiopia',       code: '+251', flag: '🇪🇹' },
  { name: 'Finland',        code: '+358', flag: '🇫🇮' },
  { name: 'France',         code: '+33',  flag: '🇫🇷' },
  { name: 'Germany',        code: '+49',  flag: '🇩🇪' },
  { name: 'Ghana',          code: '+233', flag: '🇬🇭' },
  { name: 'Greece',         code: '+30',  flag: '🇬🇷' },
  { name: 'Hungary',        code: '+36',  flag: '🇭🇺' },
  { name: 'India',          code: '+91',  flag: '🇮🇳' },
  { name: 'Indonesia',      code: '+62',  flag: '🇮🇩' },
  { name: 'Iran',           code: '+98',  flag: '🇮🇷' },
  { name: 'Ireland',        code: '+353', flag: '🇮🇪' },
  { name: 'Israel',         code: '+972', flag: '🇮🇱' },
  { name: 'Italy',          code: '+39',  flag: '🇮🇹' },
  { name: 'Japan',          code: '+81',  flag: '🇯🇵' },
  { name: 'Kenya',          code: '+254', flag: '🇰🇪' },
  { name: 'Malaysia',       code: '+60',  flag: '🇲🇾' },
  { name: 'Mexico',         code: '+52',  flag: '🇲🇽' },
  { name: 'Morocco',        code: '+212', flag: '🇲🇦' },
  { name: 'Netherlands',    code: '+31',  flag: '🇳🇱' },
  { name: 'New Zealand',    code: '+64',  flag: '🇳🇿' },
  { name: 'Nigeria',        code: '+234', flag: '🇳🇬' },
  { name: 'Norway',         code: '+47',  flag: '🇳🇴' },
  { name: 'Pakistan',       code: '+92',  flag: '🇵🇰' },
  { name: 'Paraguay',       code: '+595', flag: '🇵🇾' },
  { name: 'Peru',           code: '+51',  flag: '🇵🇪' },
  { name: 'Philippines',    code: '+63',  flag: '🇵🇭' },
  { name: 'Poland',         code: '+48',  flag: '🇵🇱' },
  { name: 'Portugal',       code: '+351', flag: '🇵🇹' },
  { name: 'Romania',        code: '+40',  flag: '🇷🇴' },
  { name: 'Russia',         code: '+7',   flag: '🇷🇺' },
  { name: 'Saudi Arabia',   code: '+966', flag: '🇸🇦' },
  { name: 'Serbia',         code: '+381', flag: '🇷🇸' },
  { name: 'Singapore',      code: '+65',  flag: '🇸🇬' },
  { name: 'Slovakia',       code: '+421', flag: '🇸🇰' },
  { name: 'Slovenia',       code: '+386', flag: '🇸🇮' },
  { name: 'South Africa',   code: '+27',  flag: '🇿🇦' },
  { name: 'South Korea',    code: '+82',  flag: '🇰🇷' },
  { name: 'Spain',          code: '+34',  flag: '🇪🇸' },
  { name: 'Sweden',         code: '+46',  flag: '🇸🇪' },
  { name: 'Switzerland',    code: '+41',  flag: '🇨🇭' },
  { name: 'Taiwan',         code: '+886', flag: '🇹🇼' },
  { name: 'Tanzania',       code: '+255', flag: '🇹🇿' },
  { name: 'Thailand',       code: '+66',  flag: '🇹🇭' },
  { name: 'Turkey',         code: '+90',  flag: '🇹🇷' },
  { name: 'UAE',            code: '+971', flag: '🇦🇪' },
  { name: 'Uganda',         code: '+256', flag: '🇺🇬' },
  { name: 'Ukraine',        code: '+380', flag: '🇺🇦' },
  { name: 'United Kingdom', code: '+44',  flag: '🇬🇧' },
  { name: 'United States',  code: '+1',   flag: '🇺🇸' },
  { name: 'Uruguay',        code: '+598', flag: '🇺🇾' },
  { name: 'Venezuela',      code: '+58',  flag: '🇻🇪' },
  { name: 'Vietnam',        code: '+84',  flag: '🇻🇳' },
  { name: 'Zimbabwe',       code: '+263', flag: '🇿🇼' },
]

const PROG_PAGES = ['cheetah-run', 'volunteer', 'visit', 'internship', 'adopt', 'conservation']
const PROG_IMGS  = [DEFAULTS.progRun, DEFAULTS.progVol, DEFAULTS.progChalet, DEFAULTS.progInt, DEFAULTS.progAdopt, DEFAULTS.progBreed]

function useScrollRevealLocal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )
    const sel = '.reveal,.rv,.rv-left,.rv-right,.rv-scale,.rv-up'
    document.querySelectorAll(sel).forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function useCounter(target, active) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let cur = 0
    const step = Math.ceil(target / 55)
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target)
      setVal(cur)
      if (cur >= target) clearInterval(timer)
    }, 28)
    return () => clearInterval(timer)
  }, [active, target])
  return val
}

function StatItem({ num, suffix, label }) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  const count = useCounter(num, active)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
      <div className="hero-strip-item" ref={ref}>
        <div className="strip-num">{active ? count.toLocaleString('it-IT') : 0}{suffix}</div>
        <div className="strip-label">{label}</div>
      </div>
  )
}

function Home({ goTo }) {
  useScrollRevealLocal()
  const {t} = useTranslation()
  const cmsImages = useCMSImages()
  const IMG = {
    ...DEFAULTS,
    ...(cmsImages.home_hero ? { heroDesktop: cmsImages.home_hero } : {}),
    ...(cmsImages.home_cta  ? { bigCta: cmsImages.home_cta } : {}),
  }

  const animalRoles = t('home.animal_roles',   { returnObjects: true })
  const progTags    = t('home.prog_tags',       { returnObjects: true })
  const progTitles  = t('home.prog_titles',     { returnObjects: true })
  const progDescs   = t('home.prog_descs',      { returnObjects: true })

  const heroTitleWords = t('home.hero_title').split(' ')
  const cta2parts = t('home.cta_title').split('. ')

  const heroImgRef = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      if (!heroImgRef.current || window.innerWidth <= 768) return
      const y = window.scrollY * 0.35
      heroImgRef.current.style.transform = `translateY(${y}px) scale(1.02)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [lbIdx, setLbIdx] = useState(null)

  const [contactForm, setContactForm] = useState({ name: '', surname: '', email: '', dialCode: '+27', phone: '', reason: '', message: '' })
  const [contactStatus, setContactStatus] = useState(null)
  const [turnstileToken, setTurnstileToken] = useState(null)
  async function handleContactSubmit(e) {
    e.preventDefault()
    setContactStatus('sending')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://novas-legacy-api.onrender.com'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactForm,
          phone: contactForm.phone ? `${contactForm.dialCode}${contactForm.phone}` : '',
          turnstileToken: turnstileToken,
        }),
      })
      if (!res.ok) throw new Error('server')
      setContactStatus('ok')
      setContactForm({ name: '', surname: '', email: '', dialCode: '+27', phone: '', reason: '', message: '' })
    } catch {
      setContactStatus('error')
      window.turnstile?.reset()
    }
  }

  return (
      <>
        <section className="hero">
          <picture className="hero-img-picture" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
            <source media="(max-width: 768px)" srcSet={IMG.heroMobile} />
              <img
                ref={heroImgRef}
                className="hero-img"
                src={IMG.heroDesktop}
                alt="Nova — la gheparda fondatrice"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}
              />
          </picture>

          <style>{`
            @media (max-width: 1080px) and (min-width: 769px) {.hero-img{ object-position: 75% center !important; }}
            @media (max-width: 768px){.hero-img{ object-position: 72% center !important; }}
          `}</style>

          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-eyebrow">{t('home.hero_eyebrow')}</div>
            <h1>
              {heroTitleWords.slice(0, -1).join(' ')}<br />
              <em>{heroTitleWords.slice(-1)}</em>
            </h1>
            <p className="hero-sub">{t('home.hero_sub')}</p>
            <div className="hero-buttons">
              <button className="btn btn-gold" onClick={() => goTo('volunteer')}>
                {t('home.btn_volunteer')}
              </button>
              <button className="btn btn-outline" onClick={() => goTo('nova-story')}>
                {t('home.btn_discover')}
              </button>
            </div>
          </div>

          <div className="hero-strip">
            <StatItem num={7000} suffix="+"   label={t('home.stat_cheetahs')} />
            <StatItem num={865}  suffix=" ha" label={t('home.stat_reserve')} />
            <StatItem num={50}   suffix="+"   label={t('home.stat_animals')} />
            <StatItem num={200}  suffix="+"   label={t('home.stat_volunteers')} />
          </div>
        </section>
        <div className="alert-bar">
          <span className="alert-tag">{t('home.alert_tag')}</span>
          <p>
            {t('home.alert_body_1')}<strong>{t('home.alert_body_strong1')}</strong>{t('home.alert_body_2')}<strong>{t('home.alert_body_strong2')}</strong>{t('home.alert_body_3')}
          </p>
          <button className="btn btn-outline btn-sm" onClick={() => goTo('conservation')}>
            {t('home.alert_btn')}
          </button>
        </div>

        <section style={{ padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <span className="label rv">{t('home.work_label')}</span>
            <h2 className="h2 rv rv-d1" style={{ fontSize: '2.6rem', lineHeight: '1.2', margin: '0 0 1.2rem 0' }}>
              {t('home.work_title').split(' ').slice(0, -3).join(' ')} <em>{t('home.work_title').split(' ').slice(-3).join(' ')}</em>
            </h2>
            <p className="rv rv-d2" style={{ color: '#555', maxWidth: '850px', lineHeight: '1.65', margin: '0 0 3.5rem 0' }}>
              {t('home.work_desc')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="pillars-grid">
              {[
                { img: IMG.pillar1, pos: 'center 15%', num: '01', title: t('home.pillar1_title'), desc: t('home.pillar1_desc'), page: 'conservation', rv: 'rv' },
                { img: IMG.pillar2, pos: 'center 30%', num: '02', title: t('home.pillar2_title'), desc: t('home.pillar2_desc'), page: 'volunteer',    rv: 'rv rv-d1' },
                { img: IMG.pillar3, pos: 'center 50%', num: '03', title: t('home.pillar3_title'), desc: t('home.pillar3_desc'), page: 'horses',        rv: 'rv rv-d2' },
              ].map(({ img, pos, num, title, desc, page, rv }) => (
                  <div key={num} className={`program-card ${rv}`} style={{borderRadius: '8px'}}>
                    <div className="program-img" style={{ height: '320px' }}>
                      <img src={img} alt={title} style={{ objectPosition: pos }} />
                    </div>
                    <div className="program-body" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>{num}</div>
                      <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.6rem', color: 'var(--dark)', lineHeight: '1.3' }}>{title}</h3>
                      <p style={{ fontSize: '0.84rem', color: '#777', lineHeight: '1.65', marginBottom: '1.4rem', flexGrow: 1 }}>{desc}</p>
                      <span className="program-link" style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dark)' }} onClick={() => goTo(page)}>{t('common.learn_more_arrow')}</span>
                    </div>
                  </div>
              ))}
            </div>
            <style>{`
            @media (max-width: 900px) { .pillars-grid { grid-template-columns: 1fr !important; } }
            @media (max-width: 600px) { .pillars-grid { grid-template-columns: 1fr !important; } }
          `}</style>
          </div>
        </section>

        <section style={{ padding: '2rem 2rem', background: 'var(--sand-pale)' }}>
          <div className="cr-cinema">
            <img src={IMG.cheetahRun} alt="Cheetah Run" className="cr-cinema-img"/>
            <div className="cr-cinema-overlay">
              <div className="cr-cinema-left">
                <span className="label label-light rv">{t('home.run_label')}</span>
                <h2 className="cr-cinema-h2 rv rv-d1">
                  {(() => {
                    const title = t('home.run_title')
                    const idx = title.indexOf('Cheetah Run')
                    return <>{title.slice(0, idx)}<em>Cheetah Run</em>{title.slice(idx + 11)}</>
                  })()}
                </h2>
                <p className="cr-cinema-p rv rv-d2">{t('home.run_desc')}</p>
                <button className="btn btn-gold rv rv-d3" onClick={() => goTo('cheetah-run')}>
                  {t('home.run_btn')}
                </button>
              </div>
              <div className="cr-cinema-right">
                <span className="cr-big-num">112</span>
                <span className="cr-big-unit">km/h</span>
                <span className="cr-big-label">{t('home.run_speed_label')}</span>
              </div>
            </div>
          </div>
          <style>{`
          .cr-cinema {
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
            border-radius: 18px;
            overflow: hidden;
            min-height: 560px;
            box-shadow: 0 40px 120px rgba(0,0,0,0.28);
          }
          .cr-cinema-img {
            width: 100%;
            height: 100%;
            min-height: 560px;
            object-fit: cover;
            object-position: center 25%;
            display: block;
            transition: transform 1s cubic-bezier(0.22,1,0.36,1);
          }
          .cr-cinema:hover .cr-cinema-img {
            transform: scale(1.04);
          }
          .cr-cinema-overlay {
            position: absolute;
            inset: 0;
            background: 
              linear-gradient(
                to top,
                rgba(0,0,0,0.94) 0%,
                rgba(0,0,0,0.55) 42%,
                rgba(0,0,0,0.06) 100%
              );
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            padding: 3rem 3.5rem;
            gap: 3rem;
          }
          .cr-cinema-left {
            max-width: 540px;
          }
          .cr-cinema-h2 {
            font-family: var(--serif);
            font-size: clamp(1.9rem, 3.4vw, 3rem);
            color: var(--white);
            line-height: 1.12;
            margin: 0.5rem 0 1rem;
          }
          .cr-cinema-h2 em {
            font-style: italic;
            font-weight: 400;
            color: var(--gold-light);
          }
          .cr-cinema-p {
            font-size: 0.94rem;
            color: rgba(255,255,255,0.68);
            line-height: 1.8;
            font-weight: 300;
            margin-bottom: 2rem;
          }
          .cr-cinema-right {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: flex-end;
            padding-bottom: 0.25rem;
          }
          .cr-big-num {
            font-family: var(--serif);
            font-size: clamp(5rem, 8vw, 8.5rem);
            font-weight: 700;
            color: var(--gold-light);
            line-height: 1;
          }
          .cr-big-unit {
            font-size: 1.5rem;
            font-weight: 700;
            color: rgba(255,255,255,0.85);
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .cr-big-label {
            font-size: 0.65rem;
            color: rgba(255,255,255,0.38);
            letter-spacing: 0.14em;
            text-transform: uppercase;
            max-width: 130px;
            text-align: right;
            margin-top: 0.4rem;
            line-height: 1.5;
          }
          @media (max-width: 768px) {
            .cr-cinema { min-height: 500px; }
            .cr-cinema-img { min-height: 500px; object-position: 65% center !important; } 
            .cr-cinema-overlay {
              flex-direction: column-reverse;
              align-items: flex-start;
              padding: 2rem;
              gap: 1rem;
              background:
                linear-gradient(
                  to bottom,
                  rgba(0,0,0,0.94) 0%,
                  rgba(0,0,0,0.25) 22%,
                  rgba(0,0,0,0.03) 50%
                ),
                linear-gradient(
                  to top,
                  rgba(0,0,0,0.94) 0%,
                  rgba(0,0,0,0.55) 42%,
                  rgba(0,0,0,0.06) 100%
                );
            }
            .cr-cinema-right {
              flex-direction: row;
              align-items: flex-end;
              gap: 0.75rem;
            }
            .cr-big-num { font-size: 3.5rem; }
            .cr-big-unit { font-size: 1.1rem; }
            .cr-big-label { max-width: 100px; text-align: left; }
          }
          @media (max-width: 480px) {
            .cr-cinema { min-height: 420px; border-radius: 12px; }
            .cr-cinema-img { min-height: 420px; }
            .cr-cinema-overlay { padding: 1.5rem; }
          }
        `}</style>
        </section>

        <section className="programs" id="programs" style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <span className="label rv">{t('home.programs_label')}</span>
          <h2 className="h2 rv rv-d1" style={{ margin: '0 0 2.5rem 0' }}>
            {t('home.programs_title').split(' ').slice(0, -3).join(' ')} <em>{t('home.programs_title').split(' ').slice(-3).join(' ')}</em>
          </h2>
          <div className="programs-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(var(--grid-cols, 3), 1fr)',
            gap: '1.5rem',
            width: '100%'
          }}>
            {PROG_PAGES.map((page, i) => (
                <div
                    key={page}
                    className={`program-card rv rv-d${Math.min(i + 1, 5)}`}
                    onClick={() => goTo(page)}
                    style={{
                      background: 'var(--off-white)',
                      border: '1px solid #EDE5D8',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.07)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                  <div className="program-img" style={{ height: '320px', overflow: 'hidden', position: 'relative', width: '100%' }}>
                    <img
                        src={PROG_IMGS[i]}
                        alt={progTitles[i]}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center 20%'
                        }}
                    />
                  </div>

                  <div className="program-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div className="program-tag" style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                      marginBottom: '0.3rem'
                    }}>
                      {progTags[i]}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--serif)',
                      fontSize: '1.4rem',
                      marginBottom: '0.5rem',
                      color: 'var(--dark)',
                      lineHeight: '1.3'
                    }}>
                      {progTitles[i]}
                    </h3>
                    <p style={{
                      fontSize: '0.84rem',
                      color: '#777',
                      lineHeight: '1.65',
                      fontWeight: 300,
                      marginBottom: '1.4rem',
                      flexGrow: 1
                    }}>
                      {progDescs[i]}
                    </p>
                    <span className="program-link" style={{
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--dark)',
                      marginTop: 'auto'
                    }}>
                  {t('common.learn_more_arrow')}
                </span>
                  </div>
                </div>
            ))}
          </div>

          <style>{`
          .programs-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          @media (max-width: 992px) {
            .programs-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 600px) {
            .programs-grid { grid-template-columns: repeat(1, 1fr) !important; }
          }
        `}</style>
        </section>

        <section className="animals-section" id="animals" style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>
          <div className="animals-header">
            <span className="label rv">{t('home.animals_label')}</span>
            <h2 className="h2 rv rv-d1">
              {t('home.animals_title').split(' ').slice(0, -2).join(' ')} <em>{t('home.animals_title').split(' ').slice(-2).join(' ')}</em>
            </h2>
          </div>

          <div className="marquee-wrapper">
            <div className="marquee-track">
              {[...Array(2)].flatMap((_, rep) =>
                  ANIMALS_NAMES.map((name, i) => (
                      <div key={`${rep}-${name}-${i}`} className="animal-card" onClick={() => setLbIdx(i)} style={{ cursor: 'pointer', borderRadius: '8px' }} >
                        <div className="animal-photo">
                          <img src={ANIMALS_SRCS[i]} alt={name} />
                        </div>
                        <div className="animal-info">
                          <h4>{name}</h4>
                          <span>{animalRoles[i]}</span>
                        </div>
                      </div>
                  ))
              )}
            </div>
          </div>
        </section>

        <style>{`
          .animals-section {
            width: 100%;
            max-width: 100%;
            padding-left: 0 !important;
            padding-right: 0 !important;
            overflow: hidden;
          }
          .animals-header {
            padding-left: 2rem;
            padding-right: 2rem;
            max-width: 1200px;
            margin: 0 auto 2rem;
          }
          .marquee-wrapper {
            width: 100vw;
            position: relative;
            left: 50%;
            right: 50%;
            margin-left: -50vw;
            margin-right: -50vw;
            overflow: hidden;
          }
          .marquee-track {
            display: flex;
            width: max-content;
            /* Assicurati che non ci siano padding o margini iniziali */
            margin: 0;
            padding: 0;
          }
        `}</style>

        {lbIdx !== null && (
            <Lightbox srcs={ANIMALS_SRCS} captions={ANIMALS_NAMES} idx={lbIdx} setIdx={setLbIdx} />
        )}

        <section className="big-cta" style={{height:'720px'}}>
          <img src={IMG.bigCta} className={'big-cta-img'} alt="Cheetah" style={{objectFit: 'cover', objectPosition: 'center 30%'}}/>
          <div className="big-cta-content">
            <span className="label label-light rv">{t('home.cta_label')}</span>
            <h2 className="rv rv-d1">
              {cta2parts[0]}.<br /><em>{cta2parts[1]}</em>
            </h2>
            <p className="rv rv-d2">{t('home.cta_desc')}</p>
            <div className="rv rv-d3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-gold" onClick={() => goTo('adopt')}>{t('home.cta_btn1')}</button>
              <button className="btn btn-outline" onClick={() => goTo('volunteer')}>{t('home.cta_btn2')}</button>
            </div>
          </div>
        </section>
        <style>{`
          @media (max-width: 1200px) {
            .big-cta { height: 480px !important; }
            .big-cta-img { object-position: 25% center !important; }}
        `}</style>

        <section className="contact-section" id="contact">
          <div className="contact-section-inner">
            <span className="label rv">{t('home.contact_label')}</span>
            <h2 className="h2 rv rv-d1">
              {t('home.contact_title').split(' ').slice(0, -3).join(' ')} <em>{t('home.contact_title').split(' ').slice(-3).join(' ')}</em>
            </h2>

            <div className="contact-grid">
              <div className="contact-info rv-left">
                <p>{t('home.contact_desc')}</p>

                <div className="contact-item">
                  <span className="contact-icon">@</span>
                  <div>
                    <div className="contact-label">{t('home.contact_email_label')}</div>
                    <div className="contact-value">
                      <a href="mailto:kim@novaslegacy.co.za">kim@novaslegacy.co.za</a>
                    </div>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">+</span>
                  <div>
                    <div className="contact-label">{t('home.contact_phone_label')}</div>
                    <div className="contact-value">
                      <a href="tel:+27823520940">+27 82 352 0940</a>
                    </div>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">◆</span>
                  <div>
                    <div className="contact-label">{t('home.contact_address_label')}</div>
                    <div className="contact-value">
                      431 Diepdrift, Bela-Bela, 0480<br />Limpopo, South Africa
                    </div>
                  </div>
                </div>

                <div className="contact-socials">
                  <a className="social-link" href="https://facebook.com/Feracare" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg> Facebook</a>
                  <a className="social-link" href="https://instagram.com/novaslegacycheetahproject" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg> Instagram</a>
                  <a className="social-link" href="https://www.tiktok.com/@novaslegacycheetahs" target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.83 4.83 0 01-1.01-.08z"/>
                    </svg>Tik Tok</a>
                </div>
              </div>

              <form
                  className="contact-form rv-right"
                  onSubmit={handleContactSubmit}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <input
                      placeholder={t('home.form_name')} required
                      value={contactForm.name}
                      onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                  />
                  <input
                      placeholder={t('home.form_surname')}
                      value={contactForm.surname}
                      onChange={e => setContactForm(f => ({ ...f, surname: e.target.value }))}
                  />
                </div>
                <input
                    type="email" placeholder={t('home.form_email')} required
                    value={contactForm.email}
                    onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={contactForm.dialCode}
                    onChange={e => setContactForm(f => ({ ...f, dialCode: e.target.value }))}
                    style={{ width: '130px', flexShrink: 0 }}
                  >
                    {DIAL_CODES.map(({ name, code, flag }) => (
                      <option key={`${code}-${name}`} value={code}>
                        {flag} {code} {name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder={t('home.form_phone')}
                    value={contactForm.phone}
                    onChange={e => setContactForm(f => ({ ...f, phone: e.target.value.replace(/[^0-9\s\-\(\)]/g, '') }))}
                    minLength={4}
                    maxLength={15}
                    style={{ flex: 1 }}
                  />
                </div>
                <select
                    value={contactForm.reason}
                    onChange={e => setContactForm(f => ({ ...f, reason: e.target.value }))}
                >
                  <option value="" disabled>{t('home.form_reason')}</option>
                  <option value={t('home.form_reason_vol')}>{t('home.form_reason_vol')}</option>
                  <option value={t('home.form_reason_int')}>{t('home.form_reason_int')}</option>
                  <option value={t('home.form_reason_stay')}>{t('home.form_reason_stay')}</option>
                  <option value={t('home.form_reason_run')}>{t('home.form_reason_run')}</option>
                  <option value={t('home.form_reason_adopt')}>{t('home.form_reason_adopt')}</option>
                  <option value={t('home.form_reason_donate')}>{t('home.form_reason_donate')}</option>
                  <option value={t('home.form_reason_other')}>{t('home.form_reason_other')}</option>
                </select>
                <textarea
                    placeholder={t('home.form_message')} rows={5}
                    value={contactForm.message}
                    onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                />
                <div style={{marginBotttom: '1.5rem', display: 'flex', justifyContent: 'center'}}>
                  <Turnstile
                      sitekey={"0x4AAAAAADmhMcdVflcdShPP"}
                      onVerify={(token) => setTurnstileToken(token)}
                      onExpire={()=> setTurnstileToken(null)}
                  />
                </div>
                {contactStatus === 'ok' && (
                    <p style={{ color: '#3a7d44', fontFamily: 'Outfit,sans-serif', margin: '0 0 0.5rem' }}>
                      {t('home.form_success')}
                    </p>
                )}
                {contactStatus === 'error' && (
                    <p style={{ color: '#c0392b', fontFamily: 'Outfit,sans-serif', margin: '0 0 0.5rem' }}>
                      {t('home.form_error')}
                    </p>
                )}
                <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={contactStatus === 'sending' || !turnstileToken}
                >
                  {contactStatus === 'sending' ? '...' : t('common.send_message')}
                </button>
              </form>
            </div>

            <div className="rv" style={{ marginTop: '3rem' }}>
              <iframe
                  src="https://maps.google.com/maps?q=-24.845059,28.240967&z=14&output=embed"
                  width="100%"
                  height="360"
                  style={{ border: 0, display: 'block', borderRadius: '8px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nova's Legacy — Bela-Bela, South Africa"
              />
            </div>
          </div>
        </section>
      </>
  )
}

export default Home