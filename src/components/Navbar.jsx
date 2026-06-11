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

  const handleNav = page => {
    goTo(page)
    setMenuOpen(false)
    setActiveDropdown(null)
  }

  return (
    <>
      {/* ── TOP BAR ── */}
      <nav className={`nn ${solid || menuOpen ? 'nn--solid' : ''}`}>
        <div className="nn__wrap">

          <div className="nn__logo" onClick={() => handleNav('home')}>
            Nova&apos;s <em>Legacy</em>
          </div>

          {/* Desktop links */}
          <ul className="nn__links">
            {NAV.map(item => (
              <li key={item.label} className={item.children ? 'nn__item nn__item--drop' : 'nn__item'}>
                <span className="nn__link" onClick={() => !item.children && handleNav(item.page)}>
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

          {/* Hamburger */}
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

      {/* ── MOBILE DRAWER ── */}
      {/* Backdrop */}
      <div
        className={`drawer-bd ${menuOpen ? 'drawer-bd--on' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Panel */}
      <div className={`drawer ${menuOpen ? 'drawer--open' : ''}`} aria-hidden={!menuOpen}>

        {/* Drawer header */}
        <div className="drawer__head">
          <div className="drawer__logo" onClick={() => handleNav('home')}>
            Nova&apos;s <em>Legacy</em>
          </div>
          <button className="drawer__close" onClick={() => setMenuOpen(false)} aria-label="Chiudi menu">
            <span /><span />
          </button>
        </div>

        {/* Nav items */}
        <nav className="drawer__nav">
          {NAV.map(item => (
            <div key={item.label} className="drawer__group">
              <div
                className="drawer__item"
                onClick={() => item.children
                  ? setActiveDropdown(activeDropdown === item.label ? null : item.label)
                  : handleNav(item.page)
                }
              >
                <span className="drawer__label">{item.label}</span>
                {item.children && (
                  <span className={`drawer__chevron ${activeDropdown === item.label ? 'drawer__chevron--open' : ''}`}>
                    ›
                  </span>
                )}
              </div>

              {item.children && (
                <div className={`drawer__sub ${activeDropdown === item.label ? 'drawer__sub--open' : ''}`}>
                  {item.children.map(c => (
                    <div key={c.label} className="drawer__sub-item" onClick={() => handleNav(c.page)}>
                      <span className="drawer__sub-sym">{c.sym}</span>
                      {c.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA */}
        <div className="drawer__cta-wrap">
          <button className="drawer__cta" onClick={() => handleNav('volunteer')}>
            {t('nav.become_volunteer')}
          </button>
        </div>

        {/* Footer */}
        <div className="drawer__foot">
          <a href="mailto:kim@novaslegacy.co.za">kim@novaslegacy.co.za</a>
          <div className="drawer__socials">
            <a href="https://instagram.com/novaslegacycheetahproject" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://facebook.com/Feracare" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.tiktok.com/@novaslegacycheetahs" target="_blank" rel="noreferrer">TikTok</a>
          </div>
        </div>

      </div>

      <style>{`
        /* ─────────────────────────────────────────
           NAVBAR
        ───────────────────────────────────────── */
        .nn {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: background 0.35s ease, box-shadow 0.35s ease;
        }
        .nn--solid {
          background: rgba(8, 8, 8, 0.97);
          backdrop-filter: blur(14px);
          box-shadow: 0 1px 0 rgba(255,255,255,0.05);
        }
        .nn__wrap {
          max-width: 1340px;
          margin: 0 auto;
          padding: 0 2.5rem;
          height: 72px;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nn__logo {
          font-family: var(--serif);
          font-size: 1.35rem;
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
          margin-left: 0.1rem;
        }

        /* Desktop links */
        .nn__links {
          display: flex;
          list-style: none;
          margin: 0; padding: 0;
          gap: 0;
          flex: 1;
          justify-content: center;
          flex-wrap: nowrap;
        }
        .nn__item { position: relative; }
        .nn__link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.7rem;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: color 0.22s;
          user-select: none;
          white-space: nowrap;
        }
        .nn__link:hover { color: #fff; }
        .nn__underline {
          position: absolute;
          bottom: 2px; left: 0.7rem; right: 0.7rem;
          height: 1px;
          background: var(--gold-light);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nn__link:hover .nn__underline { transform: scaleX(1); }
        .nn__arr {
          font-size: 0.6rem;
          transition: transform 0.28s ease;
          display: inline-block;
        }
        .nn__item--drop:hover .nn__arr { transform: rotate(180deg); }

        /* Dropdown */
        .nn__drop {
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          min-width: 200px;
          background: rgba(12, 12, 12, 0.98);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.45rem 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1), visibility 0.25s;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          z-index: 10;
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
          gap: 0.7rem;
          padding: 0.6rem 1.2rem;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: color 0.18s, padding-left 0.18s, background 0.18s;
          border-left: 2px solid transparent;
        }
        .nn__drop-item:hover {
          color: var(--gold-light);
          background: rgba(255,255,255,0.03);
          border-left-color: var(--gold);
          padding-left: 1.45rem;
        }
        .nn__drop-sym { color: var(--gold-mid); font-size: 0.6rem; flex-shrink: 0; }

        /* Desktop CTA */
        .nn__actions { display: flex; align-items: center; flex-shrink: 0; }
        .nn__cta {
          background: var(--gold-light);
          color: #111;
          border: none;
          padding: 0.55rem 1.25rem;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
          white-space: nowrap;
        }
        .nn__cta:hover {
          background: var(--gold-mid);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(200,136,10,0.4);
        }

        /* ── HAMBURGER ── */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 26px; height: 17px;
          background: none; border: none;
          cursor: pointer; padding: 0;
          z-index: 1100; position: relative;
          flex-shrink: 0; margin-left: auto;
        }
        .hamburger__b {
          width: 100%; height: 1.5px;
          background: #fff;
          transform-origin: center;
          transition: transform 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.28s ease, width 0.28s ease;
          display: block;
        }
        .hamburger__b--short { width: 62%; }
        .hamburger--open .hamburger__b:nth-child(1) { transform: translateY(7.75px) rotate(45deg); }
        .hamburger--open .hamburger__b:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger--open .hamburger__b:nth-child(3) { transform: translateY(-7.75px) rotate(-45deg); width: 100%; }

        /* ─────────────────────────────────────────
           DRAWER (mobile menu)
        ───────────────────────────────────────── */

        /* Backdrop */
        .drawer-bd {
          position: fixed; inset: 0;
          z-index: 1050;
          background: rgba(0,0,0,0);
          pointer-events: none;
          transition: background 0.35s ease;
        }
        .drawer-bd--on {
          background: rgba(0,0,0,0.55);
          pointer-events: all;
        }

        /* Panel */
        .drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(340px, 88vw);
          z-index: 1100;
          background: #0A0A0A;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .drawer--open { transform: translateX(0); }

        /* Drawer header */
        .drawer__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.4rem;
          height: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .drawer__logo {
          font-family: var(--serif);
          font-size: 1.15rem;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
        }
        .drawer__logo em {
          font-style: italic;
          font-weight: 400;
          color: var(--gold-light);
          margin-left: 0.1rem;
        }
        .drawer__close {
          position: relative;
          width: 30px; height: 30px;
          background: none; border: none;
          cursor: pointer; padding: 0;
          flex-shrink: 0;
        }
        .drawer__close span {
          position: absolute;
          top: 50%; left: 50%;
          width: 18px; height: 1.5px;
          background: rgba(255,255,255,0.55);
          display: block;
          transition: background 0.2s;
        }
        .drawer__close span:first-child {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        .drawer__close span:last-child {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
        .drawer__close:hover span { background: #fff; }

        /* Nav items */
        .drawer__nav {
          flex: 1;
          padding: 0.5rem 0;
        }
        .drawer__group {
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .drawer__item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.88rem 1.4rem;
          cursor: pointer;
          transition: background 0.15s;
        }
        .drawer__item:hover { background: rgba(255,255,255,0.03); }
        .drawer__label {
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.82);
          transition: color 0.18s;
        }
        .drawer__item:hover .drawer__label { color: #fff; }
        .drawer__chevron {
          font-size: 1.2rem;
          font-weight: 300;
          color: rgba(255,255,255,0.25);
          line-height: 1;
          transition: transform 0.28s ease, color 0.18s;
          display: inline-block;
        }
        .drawer__chevron--open {
          transform: rotate(90deg);
          color: var(--gold-light);
        }

        /* Sub-items */
        .drawer__sub {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.32s cubic-bezier(0.22,1,0.36,1);
          background: rgba(255,255,255,0.02);
        }
        .drawer__sub--open { max-height: 300px; }
        .drawer__sub-item {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.65rem 1.4rem 0.65rem 2rem;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: color 0.18s, background 0.15s;
          border-left: 2px solid transparent;
        }
        .drawer__sub-item:hover {
          color: var(--gold-light);
          background: rgba(255,255,255,0.02);
          border-left-color: var(--gold);
        }
        .drawer__sub-sym { color: var(--gold-mid); font-size: 0.58rem; flex-shrink: 0; }

        /* CTA */
        .drawer__cta-wrap {
          padding: 1.2rem 1.4rem 0.5rem;
          flex-shrink: 0;
        }
        .drawer__cta {
          width: 100%;
          background: var(--gold-light);
          color: #111;
          border: none;
          padding: 0.8rem 1.4rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
        }
        .drawer__cta:hover { background: var(--gold-mid); }

        /* Footer */
        .drawer__foot {
          padding: 1rem 1.4rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .drawer__foot > a {
          display: block;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.28);
          margin-bottom: 0.8rem;
          transition: color 0.18s;
        }
        .drawer__foot > a:hover { color: rgba(255,255,255,0.6); }
        .drawer__socials {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
        }
        .drawer__socials a {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
          transition: color 0.18s;
        }
        .drawer__socials a:hover { color: rgba(255,255,255,0.6); }

        /* ── RESPONSIVE BREAKPOINTS ── */

        /* At 1100px: slightly compress links */
        @media (max-width: 1100px) {
          .nn__wrap { padding: 0 1.5rem; gap: 1rem; }
          .nn__link { padding: 0.5rem 0.55rem; font-size: 0.68rem; }
          .nn__cta { padding: 0.5rem 1rem; font-size: 0.68rem; }
        }

        /* At 920px: hide desktop nav, show hamburger */
        @media (max-width: 920px) {
          .nn__links, .nn__actions { display: none; }
          .hamburger { display: flex; }
          .nn__wrap { padding: 0 1.25rem; }
        }

        @media (max-width: 480px) {
          .nn__wrap { padding: 0 1rem; height: 62px; }
          .nn__logo { font-size: 1.15rem; }
          .drawer { width: 100vw; }
        }
      `}</style>
    </>
  )
}

export default Navbar
