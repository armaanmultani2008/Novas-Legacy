import { useState, useEffect } from 'react'

function Navbar({ goTo }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const nav = (page, section) => {
    setMenuOpen(false)
    goTo(page, section)
  }

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
      <a className="nav-logo" onClick={() => nav('home')}>
        Nova&apos;s <span>Legacy</span>
      </a>

      <ul className={`nav-links${menuOpen ? ' show' : ''}`} id="navLinks">
        <li><a onClick={() => nav('home', 'about')}>About</a></li>

        <li>
          <a>Projects <span className="arrow">▼</span></a>
          <div className="dropdown">
            <a onClick={() => nav('cheetah')}>
              <span className="dd-icon">🐆</span> Cheetah Breeding
            </a>
            <a onClick={() => nav('conservation')}>
              <span className="dd-icon">🌍</span> Conservation &amp; Education
            </a>
            <a onClick={() => nav('horses')}>
              <span className="dd-icon">🐎</span> Horse Project
            </a>
          </div>
        </li>

        <li>
          <a>Get Involved <span className="arrow">▼</span></a>
          <div className="dropdown">
            <a onClick={() => nav('volunteer')}>
              <span className="dd-icon">🤝</span> Volunteering
            </a>
            <a onClick={() => nav('internship')}>
              <span className="dd-icon">🎓</span> University Internships
            </a>
            <a onClick={() => nav('visit')}>
              <span className="dd-icon">🏡</span> Visits &amp; Accommodation
            </a>
          </div>
        </li>

        <li><a onClick={() => nav('home', 'animals')}>Animals</a></li>

        <li>
          <a>Shop <span className="arrow">▼</span></a>
          <div className="dropdown">
            <a onClick={() => nav('merch')}>
              <span className="dd-icon">👕</span> Merchandise
            </a>
            <a onClick={() => nav('adopt')}>
              <span className="dd-icon">💛</span> Adopt an Animal
            </a>
          </div>
        </li>

        <li><a onClick={() => nav('blog')}>News</a></li>
        <li><a onClick={() => nav('home', 'contact')}>Contact</a></li>
        <li><a className="nav-cta" onClick={() => nav('volunteer')}>Join Us</a></li>
      </ul>

      <button className="menu-toggle" id="menuToggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </button>
    </nav>
  )
}

export default Navbar
