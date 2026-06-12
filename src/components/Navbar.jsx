import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function Navbar({ goTo }) {
  const { t } = useTranslation()

  const NAV = [
    { label: t('nav.home'), page: 'home' },
    {
      label: t('nav.about_us'),
      page: 'nova-story',
      children: [
        { label: t('nav.nova_story'), page: 'nova-story', sym: '◆' },
        { label: t('nav.kim_story'),  page: 'kim-story',  sym: '◆' },
      ],
    },
    {
      label: t('nav.our_mission'),
      page: 'conservation',
      children: [
        { label: t('nav.cheetah_project'), page: 'conservation', sym: '◆' },
        { label: t('nav.horses'),          page: 'horses',       sym: '◆' },
        /* ── NUOVA PAGINA AGGIUNTA QUI ── */
        { label: t('nav.other_animals', 'Other Animals'), page: 'other-animals', sym: '◆' },
      ],
    },
    {
      label: t('nav.get_involved'),
      page: 'volunteer',
      children: [
        { label: t('nav.volunteer'),   page: 'volunteer',   sym: '→' },
        { label: t('nav.internship'),  page: 'internship',  sym: '→' },
        { label: t('nav.stay'),        page: 'visit',       sym: '→' },
        { label: t('nav.cheetah_run'), page: 'cheetah-run', sym: '→' },
      ],
    },
    { label: t('nav.blog'), page: 'blog' },
    { label: t('nav.shop'), page: 'merch' },
    {
      label: t('nav.support_us'),
      page: 'donate',
      children: [
        { label: t('nav.donations'),    page: 'donate',    sym: '◆' },
        { label: t('nav.wishlist'),     page: 'wishlist',  sym: '◆' },
        { label: t('nav.adopt_animal'), page: 'adopt',     sym: '♡' },
      ],
    },
  ]

  const [solid,          setSolid]          = useState(false)
  const [menuOpen,       setMenuOpen]       = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNav = (page) => {
    goTo(page)
    setMenuOpen(false)
    setActiveDropdown(null)
  }

  return (
      <>
        {/* ── TOP BAR ── */}
        <nav className={`nn ${solid || menuOpen ? 'nn--solid' : ''}`}>
          <div className="nn__wrap">

            {/* Logo */}
            <div className="nn__logo" onClick={() => handleNav('home')}>
              Nova&apos;s <em>Legacy</em>
            </div>

            <ul className="nn__links">
              {NAV.map(item => (
                  <li key={item.label} className={item.children ? 'nn__item nn__item--drop' : 'nn__item'}>
                <span
                    className="nn__link"
                    onClick={() => !item.children && handleNav(item.page)}
                >
                  {item.label}
                  {item.children && <span className="nn__arr">▾</span>}
                  <span className="nn__underline" />
                </span>
                    {item.children && (
                        <div className="nn__drop">
                          {item.children.map(c => (
                              <div key={c.label} className="nn__drop-item" onClick={() => handleNav(c.page)}>
                                <span className="nn__drop-sym">{c.sym}</span>
                                {c.label}
                              </div>
                          ))}
                        </div>
                    )}
                  </li>
              ))}
            </ul>

            <div className="nn__actions">
              <button className="nn__cta" onClick={() => handleNav('volunteer')}>
                {t('nav.become_volunteer')}
              </button>
            </div>

            <button
                className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Toggle menu"
            >
              <span className="hamburger__b" />
              <span className="hamburger__b" />
              <span className="hamburger__b hamburger__b--short" />
            </button>

          </div>
        </nav>

        <div className={`ovmenu ${menuOpen ? 'ovmenu--open' : ''}`} aria-hidden={!menuOpen}>

          <ul className="ovmenu__list">
            {NAV.map((item, idx) => (
                <li key={item.label} className="ovmenu__row" style={{ '--i': idx }}>
                  <div className="ovmenu__row-inner">
                <span
                    className="ovmenu__link"
                    onClick={() => item.children
                        ? setActiveDropdown(activeDropdown === item.label ? null : item.label)
                        : handleNav(item.page)
                    }
                >
                  <span className="ovmenu__n">{String(idx + 1).padStart(2, '0')}</span>
                  {item.label}
                  {item.children && (
                      <span className="ovmenu__toggle">{activeDropdown === item.label ? '−' : '+'}</span>
                  )}
                </span>
                  </div>

                  {item.children && activeDropdown === item.label && (
                      <ul className="ovmenu__sub">
                        {item.children.map(c => (
                            <li key={c.label} className="ovmenu__sub-item" onClick={() => handleNav(c.page)}>
                              <span className="ovmenu__sub-sym">{c.sym}</span>
                              {c.label}
                            </li>
                        ))}
                      </ul>
                  )}
                </li>
            ))}
          </ul>

          <div className="ovmenu__foot">
            <div className="ovmenu__contacts">
              <a href="mailto:kim@novaslegacy.co.za">kim@novaslegacy.co.za</a>
              <a href="tel:+27823520940">+27 82 352 0940</a>
            </div>
            <div className="ovmenu__socials">
              <a href="https://instagram.com/novaslegacycheetahproject" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://facebook.com/Feracare" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://www.tiktok.com/@novaslegacycheetahs" target="_blank" rel="noreferrer">TikTok</a>
            </div>
          </div>

        </div>

        <style>{`
        .nn {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: background 0.4s ease, box-shadow 0.4s ease;
        }
        .nn--solid {
          background: rgba(10, 10, 10, 0.97);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 rgba(255,255,255,0.05);
        }
        .nn__wrap {
          max-width: 1340px;
          margin: 0 auto;
          padding: 0 2.5rem;
          height: 72px;
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nn__logo {
          font-family: var(--serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          letter-spacing: -0.01em;
          flex-shrink: 0;
          z-index: 1001;
          position: relative;
        }
        .nn__logo em {
          font-style: italic;
          font-weight: 400;
          color: var(--gold-light);
          margin-left: 0.12rem;
        }

        .nn__links {
          display: flex;
          list-style: none;
          margin: 0; padding: 0;
          gap: 0.2rem;
          flex: 1;
          justify-content: center;
        }
        .nn__item { position: relative; }
        .nn__link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.5rem 0.9rem;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          transition: color 0.25s ease;
          user-select: none;
          white-space: nowrap;
        }
        .nn__link:hover { color: #fff; }

        .nn__underline {
          position: absolute;
          bottom: 2px; left: 0.9rem; right: 0.9rem;
          height: 1px;
          background: var(--gold-light);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nn__link:hover .nn__underline { transform: scaleX(1); }

        .nn__arr {
          font-size: 0.65rem;
          transition: transform 0.3s ease;
          display: inline-block;
        }
        .nn__item--drop:hover .nn__arr { transform: rotate(180deg); }

        .nn__drop {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%) translateY(8px);
          min-width: 210px;
          background: rgba(14, 14, 14, 0.98);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.5rem 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.28s;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }
        .nn__drop::before {
          content: '';
          position: absolute;
          top: -8px; left: 0; right: 0; height: 8px;
        }
        .nn__item--drop:hover .nn__drop {
          opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0);
        }
        .nn__drop-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 1.3rem;
          font-size: 0.83rem;
          color: rgba(255,255,255,0.65);
          cursor: pointer;
          transition: color 0.2s, padding-left 0.2s, background 0.2s;
          border-left: 2px solid transparent;
        }
        .nn__drop-item:hover {
          color: var(--gold-light);
          background: rgba(255,255,255,0.03);
          border-left-color: var(--gold);
          padding-left: 1.55rem;
        }
        .nn__drop-sym { color: var(--gold-mid); font-size: 0.65rem; flex-shrink: 0; }

        .nn__actions { display: flex; align-items: center; flex-shrink: 0; }
        .nn__cta {
          background: var(--gold-light);
          color: #111;
          border: none;
          padding: 0.6rem 1.4rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
          white-space: nowrap;
        }
        .nn__cta:hover {
          background: var(--gold-mid);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(200,136,10,0.4);
        }

        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 28px; height: 18px;
          background: none; border: none;
          cursor: pointer; padding: 0;
          z-index: 1001; position: relative;
          flex-shrink: 0;
        }
        .hamburger__b {
          width: 100%; height: 1.5px;
          background: #fff;
          transform-origin: center;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease, width 0.3s ease;
          display: block;
        }
        .hamburger__b--short { width: 65%; }
        .hamburger--open .hamburger__b:nth-child(1) { transform: translateY(8.25px) rotate(45deg); }
        .hamburger--open .hamburger__b:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger--open .hamburger__b:nth-child(3) { transform: translateY(-8.25px) rotate(-45deg); width: 100%; }

        .ovmenu {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: #080808;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 100px 8vw 4rem 8vw;
          pointer-events: none;
          clip-path: inset(0 0 100% 0);
          transition: clip-path 0.7s cubic-bezier(0.76, 0, 0.24, 1);
          overflow-y: auto;
        }
        .ovmenu--open {
          pointer-events: all;
          clip-path: inset(0 0 0% 0);
        }

        .ovmenu__row {
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ovmenu__row:first-child { border-top: 1px solid rgba(255,255,255,0.06); }
        .ovmenu__row-inner { overflow: hidden; }

        .ovmenu__link {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-family: var(--serif);
          font-size: clamp(2rem, 4.5vw, 3.8rem);
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          cursor: pointer;
          padding: 0.55rem 0;
          line-height: 1.1;
          transform: translateY(100%);
          transition:
            transform 0.65s cubic-bezier(0.22, 1, 0.36, 1),
            color 0.25s ease;
          transition-delay: calc(var(--i, 0) * 0.055s);
          user-select: none;
        }
        .ovmenu--open .ovmenu__link {
          transform: translateY(0);
          transition-delay: calc(var(--i, 0) * 0.055s + 0.25s);
        }
        .ovmenu__link:hover { color: var(--gold-light); }

        .ovmenu__n {
          font-family: var(--sans);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.2);
          flex-shrink: 0;
          margin-top: 0.2rem;
        }
        .ovmenu__toggle {
          margin-left: auto;
          font-family: var(--sans);
          font-size: 1.6rem;
          font-weight: 300;
          color: rgba(255,255,255,0.3);
        }

        .ovmenu__sub {
          list-style: none; margin: 0; padding: 0 0 0.8rem 3.5rem;
          display: flex; flex-wrap: wrap; gap: 0.3rem 2rem;
        }
        .ovmenu__sub-item {
          display: flex; align-items: center; gap: 0.6rem;
          font-size: 1rem;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          padding: 0.3rem 0;
          transition: color 0.2s;
        }
        .ovmenu__sub-item:hover { color: rgba(255,255,255,0.85); }
        .ovmenu__sub-sym { color: var(--gold-mid); font-size: 0.6rem; }

        .ovmenu__foot {
          margin-top: 3rem;
          display: flex;
          align-items: center;
          gap: 3rem;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          transition-delay: 0s;
        }
        .ovmenu--open .ovmenu__foot {
          opacity: 1; transform: translateY(0);
          transition-delay: 0.65s;
        }
        .ovmenu__contacts { display: flex; flex-direction: column; gap: 0.25rem; }
        .ovmenu__contacts a {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
          transition: color 0.2s;
        }
        .ovmenu__contacts a:hover { color: rgba(255,255,255,0.7); }
        .ovmenu__socials { display: flex; gap: 1.5rem; margin-left: auto; }
        .ovmenu__socials a {
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          transition: color 0.2s;
        }
        .ovmenu__socials a:hover { color: rgba(255,255,255,0.65); }

        @media (max-width: 1050px) {
          .nn__links, .nn__actions { display: none; }
          .hamburger { display: flex; }
        }

        @media (max-width: 768px) {
          .nn__wrap { padding: 0 1.5rem; }
          .ovmenu { padding: 90px 6vw 3rem 6vw; }
        }
        @media (max-width: 480px) {
          .ovmenu__foot { gap: 1.5rem; }
          .ovmenu__socials { margin-left: 0; }
        }
      `}</style>
      </>
  )
}

export default Navbar