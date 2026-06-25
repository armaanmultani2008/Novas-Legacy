import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useUser } from '../UserContext'

const ROLES = [
  { name: 'Friend of Nova',      emoji: '🌿', color: '#4caf50', gradient: 'linear-gradient(135deg, #388e3c, #66bb6a)', min: 0    },
  { name: 'Conservation Ally',   emoji: '🛡️', color: '#26a69a', gradient: 'linear-gradient(135deg, #00897b, #4db6ac)', min: 100  },
  { name: 'Wildlife Guardian',   emoji: '⚡',  color: '#7c4dff', gradient: 'linear-gradient(135deg, #651fff, #9c6eff)', min: 300  },
  { name: 'Cheetah Champion',    emoji: '🌟', color: '#c8880a', gradient: 'linear-gradient(135deg, #c8880a, #f5a623)', min: 600  },
  { name: "Nova's Legend",       emoji: '👑', color: '#e65100', gradient: 'linear-gradient(135deg, #bf360c, #ff7043)', min: 1000 },
]
function getRole(xp) { return ROLES.findLast(l => xp >= l.min) || ROLES[0] }

function Navbar({ goTo, openAuth, forceSolid = false }) {
  const { t } = useTranslation()
  const { user, logout } = useUser()

  const NAV = [
    { label: t('nav.home'), page: 'home' },
    {
      label: t('nav.about_us'),
      page: 'nova-story',
      children: [
        { label: t('nav.nova_story'),  page: 'nova-story',  sym: '◆' },
        { label: t('nav.kim_story'),   page: 'kim-story',   sym: '◆' },
        { label: t('nav.our_animals', 'Our Animals'), page: 'our-animals', sym: '◆' },
      ],
    },
    {
      label: t('nav.our_mission'),
      page: 'conservation',
      children: [
        { label: t('nav.cheetah_project'), page: 'conservation', sym: '◆' },
        { label: t('nav.horses'),          page: 'horses',       sym: '◆' },
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
        { label: t('nav.FAQ'), page: 'faq', sym: '→'},
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

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1461px)')
    const onChange = (e) => {
      if (e.matches) {
        setMenuOpen(false)
        setActiveDropdown(null)
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const handleNav = (page) => {
    goTo(page)
    setMenuOpen(false)
    setActiveDropdown(null)
  }

  return (
      <>
        <nav className={`nn ${solid || menuOpen || forceSolid ? 'nn--solid' : ''}`}>
          <div className="nn__wrap">

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

            <div className="nn__user-wrap">
              {user ? (
                <button className="nn__user-btn" onClick={() => handleNav('user-profile')}>
                  <span className="nn__user-avatar">{user.name?.[0]?.toUpperCase()}</span>
                  <span className="nn__role-badge" style={{ background: getRole(user.xp || 0).gradient }}>
                    {getRole(user.xp || 0).emoji} {getRole(user.xp || 0).name}
                  </span>
                </button>
              ) : (
                <button className="nn__user-icon" onClick={openAuth} aria-label="Sign in">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </button>
              )}
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

        <div
            className={`ovmenu-backdrop ${menuOpen ? 'ovmenu-backdrop--open' : ''}`}
            onClick={() => { setMenuOpen(false); setActiveDropdown(null) }}
            aria-hidden="true"
        />

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
            {user ? (
              <div className="ovmenu__user">
                <button className="ovmenu__user-profile" onClick={() => handleNav('user-profile')}>
                  <span className="ovmenu__user-av">{user.name?.[0]?.toUpperCase()}</span>
                  <div className="ovmenu__user-info">
                    <span className="ovmenu__user-name">{user.name}</span>
                    <span className="ovmenu__role-pill" style={{ background: getRole(user.xp || 0).gradient }}>
                      {getRole(user.xp || 0).emoji} {getRole(user.xp || 0).name}
                    </span>
                  </div>
                </button>
                <button className="ovmenu__logout" onClick={() => { logout(); handleNav('home') }}>Sign out</button>
              </div>
            ) : (
              <button className="ovmenu__signin" onClick={() => { setMenuOpen(false); openAuth() }}>
                Sign in / Create account
              </button>
            )}
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
          width: 100%;
          max-width: 1260px;
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
          margin: 0; 
          padding: 0;
          gap: 0.5rem;
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

        .nn__actions { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        .nn__user-wrap { display: flex; align-items: center; flex-shrink: 0; margin-left: auto; }
        .nn__user-icon {
          background: none; border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7); border-radius: 50%;
          width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .nn__user-icon:hover { border-color: var(--gold-light); color: var(--gold-light); }
        .nn__user-btn {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px; padding: 0.3rem 0.45rem 0.3rem 0.35rem;
          cursor: pointer; transition: border-color 0.2s, background 0.2s;
          flex-shrink: 0;
        }
        .nn__user-btn:hover { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.08); }
        .nn__user-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(200,136,10,0.2); border: 1px solid var(--gold-mid);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; color: var(--gold-light);
          flex-shrink: 0;
        }
        .nn__role-badge {
          font-size: 0.68rem; font-weight: 700; white-space: nowrap;
          padding: 0.2rem 0.6rem; border-radius: 99px;
          color: #fff; letter-spacing: 0.03em;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        }
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
          justify-content: flex-start;
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

        .ovmenu-backdrop {
          position: fixed;
          inset: 0;
          z-index: 998;
          background: rgba(0,0,0,0.55);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .ovmenu-backdrop--open {
          opacity: 1;
          pointer-events: all;
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
          font-size: clamp(1.3rem, 2.5vw, 2rem);
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          cursor: pointer;
          padding: 0.4rem 0;
          line-height: 1.15;
          transform: translateY(100%);
          transition:
            transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--i, 0) * 0.055s),
            color 0.12s ease 0s;
          user-select: none;
        }
        .ovmenu--open .ovmenu__link {
          transform: translateY(0);
          transition:
            transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--i, 0) * 0.055s + 0.25s),
            color 0.12s ease 0s;
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

        .ovmenu__user {
          display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
          padding-bottom: 1rem; margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          width: 100%;
        }
        .ovmenu__user-profile {
          display: flex; align-items: center; gap: 0.75rem;
          background: none; border: none; cursor: pointer; flex: 1;
        }
        .ovmenu__user-av {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(200,136,10,0.15); border: 1.5px solid var(--gold-mid);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; font-weight: 700; color: var(--gold-light); flex-shrink: 0;
        }
        .ovmenu__user-info { display: flex; flex-direction: column; gap: 0.3rem; align-items: flex-start; }
        .ovmenu__user-name { font-size: 0.85rem; color: rgba(255,255,255,0.85); font-weight: 600; }
        .ovmenu__role-pill {
          font-size: 0.65rem; font-weight: 700; padding: 0.18rem 0.6rem;
          border-radius: 99px; color: #fff; letter-spacing: 0.04em;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .ovmenu__logout {
          background: none; border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.35); border-radius: 6px;
          padding: 0.35rem 0.85rem; font-size: 0.75rem; cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .ovmenu__logout:hover { color: rgba(255,100,100,0.8); border-color: rgba(255,100,100,0.3); }
        .ovmenu__signin {
          background: rgba(200,136,10,0.1); border: 1px solid rgba(200,136,10,0.25);
          color: var(--gold-light); border-radius: 50px;
          padding: 0.6rem 1.4rem; font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          margin-bottom: 1.5rem;
        }
        .ovmenu__signin:hover { background: rgba(200,136,10,0.18); border-color: rgba(200,136,10,0.5); }
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

        @media (max-width: 1460px) {
          .nn__links, .nn__actions { display: none; }
          .nn__role-badge { display: flex; }
          .hamburger { display: flex; }
        }

        @media (hover: hover) and (pointer: fine) {
          .ovmenu {
            top: 50px;
            bottom: auto;
            max-height: calc(100vh - 72px);
            padding: 1.25rem 6vw 1.75rem;
            background: rgba(6,6,6,0.99);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border-bottom: 1px solid rgba(255,255,255,0.07);
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          }
          .ovmenu__link,
          .ovmenu--open .ovmenu__link {
            font-size: clamp(1.75rem, 2vw, 1.75rem);
            padding: 0.5rem 0;
            transform: none;
            transition: color 0.12s ease;
          }
          .ovmenu__toggle { font-size: 1.6rem; }
          .ovmenu__sub { padding: 0 0 0.6rem 1.75rem; font-size: .088rem; gap: 0.15rem 1.5rem; }
          .ovmenu__sub-item { font-size: 1rem; }
          .ovmenu__foot { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.06); }
          .ovmenu__signin { margin-bottom: 0.75rem; }
        }

        @media (hover: none) and (pointer: coarse) and (max-width: 900px) {
          .ovmenu__link { font-size: clamp(1.4rem, 4vw, 2.4rem); }
          .ovmenu__sub { padding: 0 0 0.8rem 2.5rem; }
          .ovmenu__foot { margin-top: 2.5rem; gap: 2rem; }
        }

        @media (max-width: 768px) {
          .nn__wrap { padding: 0 1.25rem; gap: 1rem; }
        }
        @media (hover: none) and (pointer: coarse) and (max-width: 768px) {
          .ovmenu { padding: 80px 5vw 3rem 5vw; }
          .ovmenu__link { font-size: clamp(1.5rem, 5.5vw, 2.6rem); padding: 0.45rem 0; }
          .ovmenu__sub { padding: 0 0 0.6rem 2rem; gap: 0.2rem 1.5rem; }
          .ovmenu__foot { margin-top: 2rem; }
        }

        @media (max-width: 480px) {
          .nn__wrap { padding: 0 1rem; gap: 0.75rem; }
        }
        @media (hover: none) and (pointer: coarse) and (max-width: 480px) {
          .ovmenu { padding: 72px 4vw 2.5rem 4vw; }
          .ovmenu__link { font-size: clamp(1.4rem, 7vw, 2rem); padding: 0.4rem 0; }
          .ovmenu__sub { padding: 0 0 0.5rem 1.25rem; }
          .ovmenu__sub-item { font-size: 0.88rem; }
          .ovmenu__foot { gap: 1.25rem; flex-direction: column; align-items: flex-start; }
          .ovmenu__socials { margin-left: 0; gap: 1.25rem; }
          .ovmenu__contacts a { font-size: 0.78rem; }
        }

        @media (max-width: 360px) {
          .nn__wrap { padding: 0 0.75rem; }
        }
        @media (hover: none) and (pointer: coarse) and (max-width: 360px) {
          .ovmenu { padding: 68px 3.5vw 2rem 3.5vw; }
          .ovmenu__link { font-size: clamp(1.3rem, 8vw, 1.8rem); }
        }
      `}</style>
      </>
  )
}

export default Navbar