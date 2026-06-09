import { useState, useEffect } from 'react'

const NAV = [
  { label: 'Home', page: 'home' },
  {
    label: 'I Ghepardi',
    page: 'nova-story',
    children: [
      { label: 'La Storia di Nova',  page: 'nova-story',   sym: '◆' },
      { label: 'Cheetah Run',        page: 'cheetah-run',  sym: '→' },
      { label: 'Adotta un Animale',  page: 'adopt',        sym: '♡' },
    ],
  },
  {
    label: 'Conservazione',
    page: 'conservation',
    children: [
      { label: 'La Nostra Missione', page: 'conservation', sym: '◆' },
      { label: 'Progetto Cavalli',   page: 'horses',       sym: '◆' },
    ],
  },
  {
    label: 'Partecipa',
    page: 'volunteer',
    children: [
      { label: 'Volontariato',       page: 'volunteer',    sym: '→' },
      { label: 'Internship',         page: 'internship',   sym: '→' },
      { label: 'Soggiorno',          page: 'visit',        sym: '→' },
    ],
  },
  { label: 'Blog', page: 'blog' },
  { label: 'Shop', page: 'merch' },
  { label: 'Donazioni', page: 'donate' },
]

function Navbar({ goTo }) {
  const [solid, setSolid] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (page) => {
    goTo(page)
    setMobileOpen(false)
    setActiveDropdown(null)
  }

  const toggleDropdown = (label) => {
    setActiveDropdown(activeDropdown === label ? null : label)
  }

  return (
      <>
        <nav className={`custom-navbar ${solid || mobileOpen ? 'is-solid' : 'is-transparent'}`}>
          <div className="nav-container">

            <div className="nav-logo" onClick={() => handleNav('home')}>
              Nova&apos;s <em>Legacy</em>
            </div>

            <button
                className={`menu-toggle ${mobileOpen ? 'is-active' : ''}`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
            >
              <span />
              <span />
              <span />
            </button>

            <div className={`nav-menu-wrapper ${mobileOpen ? 'is-open' : ''}`}>
              <ul className="nav-links">
                {NAV.map(item => {
                  const isDropdownOpen = activeDropdown === item.label
                  return (
                      <li key={item.label} className={item.children ? 'has-dropdown' : ''}>
                        <div
                            className="nav-link-main"
                            onClick={() => item.children ? toggleDropdown(item.label) : handleNav(item.page)}
                        >
                          {item.label}
                          {item.children && (
                              <span className={`arr ${isDropdownOpen ? 'arr-up' : ''}`}>▾</span>
                          )}
                        </div>

                        {item.children && (
                            <div className={`dropdown-menu ${isDropdownOpen ? 'mobile-show' : ''}`}>
                              {item.children.map(c => (
                                  <div key={c.label} className="dropdown-item" onClick={() => handleNav(c.page)}>
                                    <span className="bullet">{c.sym}</span>
                                    <span className="text">{c.label}</span>
                                  </div>
                              ))}
                            </div>
                        )}
                      </li>
                  )
                })}
              </ul>

              <div className="nav-actions">
                <button className="nav-cta" onClick={() => handleNav('volunteer')}>
                  Diventa Volontario
                </button>
              </div>
            </div>

          </div>
        </nav>

        <style>{`
        .custom-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: background-color 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease;
          box-sizing: border-box;
        }

        .custom-navbar.is-transparent {
          background-color: transparent;
        }

        .custom-navbar.is-solid {
          background-color: #111111;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
          border-bottom: 1px solid rgba(237, 229, 216, 0.05);
        }

        .nav-container {
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 2rem;
          min-height: 75px;
          box-sizing: border-box;
        }

        .nav-logo {
          color: #ffffff;
          font-size: 1.45rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          cursor: pointer;
          user-select: none;
          z-index: 1001;
        }
        
        .nav-logo em {
          font-style: italic;
          color: var(--gold, #d4af37);
          font-weight: 400;
          margin-left: 0.15rem;
        }

        .nav-menu-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-grow: 1;
          margin-left: 3rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.8rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-links li {
          position: relative;
        }

        .nav-link-main {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.88rem;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 0.6rem 0;
          cursor: pointer;
          transition: color 0.25s ease;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          user-select: none;
        }

        .nav-link-main:hover {
          color: #ffffff;
        }

        .arr {
          font-size: 0.7rem;
          transition: transform 0.3s ease;
          display: inline-block;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 12px;
          background-color: #161616;
          border: 1px solid rgba(237, 229, 216, 0.12);
          border-radius: 4px;
          padding: 0.7rem 0;
          min-width: 220px;
          display: none;
          flex-direction: column;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
        }

        /* Crea un'area attiva continua per evitare che il dropdown si chiuda scorrendo con il mouse */
        .dropdown-menu::before {
          content: '';
          position: absolute;
          top: -14px;
          left: 0;
          width: 100%;
          height: 14px;
          background: transparent;
        }

        .has-dropdown:hover .dropdown-menu {
          display: flex;
        }

        .dropdown-item {
          color: rgba(255, 255, 255, 0.7);
          padding: 0.6rem 1.4rem;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .dropdown-item:hover {
          background-color: rgba(212, 175, 55, 0.08);
          color: #ffffff;
        }

        .bullet {
          color: var(--gold-mid, #c5a059);
          font-size: 0.7rem;
          display: flex;
          align-items: center;
        }

        .nav-actions {
          display: flex;
          align-items: center;
        }

        .nav-cta {
          background-color: var(--gold, #d4af37);
          color: #111111;
          border: none;
          padding: 0.65rem 1.5rem;
          border-radius: 50px;
          font-size: 0.85rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
          white-space: nowrap;
        }

        .nav-cta:hover {
          background-color: #e5be48;
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(214, 175, 55, 0.3);
        }

        .menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 26px;
          height: 18px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1002;
          margin-left: 2rem; 
        }

        .menu-toggle span {
          width: 100%;
          height: 2px;
          background-color: #ffffff;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
          transform-origin: center;
        }

        @media (max-width: 1024px) {
          .nav-container {
            padding: 1.2rem 2rem;
            justify-content: space-between;
          }

          .menu-toggle {
            display: flex;
          }

          .menu-toggle.is-active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
          }

          .menu-toggle.is-active span:nth-child(2) {
            opacity: 0;
          }

          .menu-toggle.is-active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
          }

          .nav-menu-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background-color: #111111;
            margin-left: 0;
            flex-direction: column;
            justify-content: flex-start;
            padding: 110px 2rem 3rem 2rem;
            overflow-y: auto;
            box-sizing: border-box;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .nav-menu-wrapper.is-open {
            transform: translateX(0);
          }

          .nav-links {
            flex-direction: column;
            width: 100%;
            gap: 0.5rem;
            display: flex;
          }

          .nav-links li {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            height: auto;
          }

          .nav-link-main {
            font-size: 1.15rem;
            justify-content: center;
            width: 100%;
            padding: 0.8rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          }

          .arr {
            font-size: 0.85rem;
          }

          .arr-up {
            transform: rotate(180deg);
          }

          .dropdown-menu {
            position: relative;
            top: 0;
            left: 0;
            transform: none;
            display: none;
            background-color: rgba(255, 255, 255, 0.02);
            border: none;
            box-shadow: none;
            padding: 0.5rem 0;
            margin: 0.2rem 0;
            width: 100%;
            border-radius: 6px;
            height: auto;
          }

          /* Rimuove lo pseudo-elemento su mobile in quanto non necessario */
          .dropdown-menu::before {
            display: none;
          }

          .dropdown-menu.mobile-show {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .dropdown-item {
            width: 100%;
            justify-content: center;
            font-size: 0.98rem;
            padding: 0.7rem 1rem;
            color: rgba(255, 255, 255, 0.6);
            box-sizing: border-box;
          }

          .nav-actions {
            width: 100%;
            justify-content: center;
            margin-top: auto;
            padding-top: 2.5rem;
          }

          .nav-cta {
            width: 100%;
            max-width: 320px;
            padding: 0.9rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
      </>
  )
}

export default Navbar