import { useState, useEffect } from 'react'

const NAV = [
  { label: 'Home', page: 'home' },
  {
    label: 'I Ghepardi',
    page: 'cheetah',
    children: [
      { label: 'La Storia di Nova',  page: 'cheetah',      sym: '◆' },
      { label: 'Cheetah Run',        page: 'cheetah',      sym: '→' },
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
]

function Navbar({ goTo }) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const nav = (page) => { goTo(page); setOpen(false) }

  return (
    <nav className={solid || open ? 'solid' : 'transparent'}>
      <div className="nav-logo" onClick={() => nav('home')}>
        Nova&apos;s <em>Legacy</em>
      </div>

      <ul className={`nav-links${open ? ' open' : ''}`}>
        {NAV.map(item =>
          item.children ? (
            <li key={item.label}>
              <a onClick={() => nav(item.page)}>
                {item.label} <span className="arr">▾</span>
              </a>
              <div className="dropdown">
                {item.children.map(c => (
                  <a key={c.label} onClick={() => nav(c.page)}>
                    <span style={{ color: 'var(--gold-mid)', fontSize: '0.7rem', flexShrink: 0 }}>{c.sym}</span>
                    {c.label}
                  </a>
                ))}
              </div>
            </li>
          ) : (
            <li key={item.label}>
              <a onClick={() => nav(item.page)}>{item.label}</a>
            </li>
          )
        )}
        <li>
          <a className="nav-cta" onClick={() => nav('volunteer')}>Diventa Volontario</a>
        </li>
        {open && (
          <li>
            <a
              onClick={() => setOpen(false)}
              style={{ marginTop: '2rem', color: 'rgba(255,255,255,0.35)', fontSize: '1.8rem', cursor: 'pointer' }}
            >✕</a>
          </li>
        )}
      </ul>

      <button className="menu-toggle" onClick={() => setOpen(o => !o)} aria-label="Menu">
        <span style={{ transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
        <span style={{ opacity: open ? 0 : 1 }} />
        <span style={{ transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
      </button>
    </nav>
  )
}

export default Navbar
