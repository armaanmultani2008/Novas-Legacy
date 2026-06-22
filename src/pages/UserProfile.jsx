import { useState, useEffect } from 'react'
import { useUser } from '../UserContext'

const LEVELS = [
  { name: "Friend of Cheetahs", emoji: '🌿', color: '#4caf50', min: 0,   max: 100  },
  { name: 'Protector',          emoji: '🛡️', color: '#26a69a', min: 100,  max: 300  },
  { name: 'Guardian',           emoji: '⚡',  color: '#7c4dff', min: 300,  max: 600  },
  { name: 'Champion',           emoji: '🌟', color: '#c8880a', min: 600,  max: 1000 },
  { name: "Nova's Hero",        emoji: '🏆', color: '#ff8f00', min: 1000, max: Infinity },
]

function getLevel(xp) { return LEVELS.findLast(l => xp >= l.min) || LEVELS[0] }
function getLevelProgress(xp) {
  const lvl = getLevel(xp)
  if (lvl.max === Infinity) return 100
  return Math.round(((xp - lvl.min) / (lvl.max - lvl.min)) * 100)
}
function getNextLevel(xp) {
  const idx = LEVELS.findIndex(l => l === getLevel(xp))
  return LEVELS[idx + 1] || null
}
function fmt(amount) { return `€${(amount / 100).toFixed(2)}` }
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function UserProfile({ goTo }) {
  const { user, logout, refreshUser } = useUser()
  const [tab, setTab] = useState('animals')

  useEffect(() => { refreshUser() }, [])

  if (!user) {
    return (
      <div className="up-empty">
        <p>You are not logged in.</p>
        <button className="up-btn-primary" onClick={() => goTo('home')}>Go home</button>
      </div>
    )
  }

  const xp = user.xp || 0
  const level = getLevel(xp)
  const progress = getLevelProgress(xp)
  const nextLevel = getNextLevel(xp)
  const adoptions = user.adoptions || []
  const orders = user.orders || []

  return (
    <div className="up">

      {/* Hero */}
      <div className="up__hero">
        <div className="up__avatar">{user.name?.[0]?.toUpperCase() || '?'}</div>
        <div className="up__hero-info">
          <h1 className="up__name">{user.name}</h1>
          <div className="up__level-badge" style={{ color: level.color }}>
            {level.emoji} {level.name}
          </div>
        </div>
        <div className="up__xp-block">
          <div className="up__xp-num">{xp} <span>XP</span></div>
          <div className="up__xp-bar-wrap">
            <div className="up__xp-bar" style={{ width: `${progress}%`, background: level.color }} />
          </div>
          {nextLevel
            ? <div className="up__xp-next">{nextLevel.max - xp} XP to {nextLevel.emoji} {nextLevel.name}</div>
            : <div className="up__xp-next">Max level reached 🏆</div>
          }
        </div>
      </div>

      {/* Tabs */}
      <div className="up__tabs">
        <button className={`up__tab ${tab === 'animals' ? 'active' : ''}`} onClick={() => setTab('animals')}>
          🐆 My Animals
          {adoptions.length > 0 && <span className="up__badge">{adoptions.length}</span>}
        </button>
        <button className={`up__tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          🛍️ My Orders
          {orders.length > 0 && <span className="up__badge">{orders.length}</span>}
        </button>
        <button className={`up__tab ${tab === 'account' ? 'active' : ''}`} onClick={() => setTab('account')}>
          ⚙️ Account
        </button>
      </div>

      {/* Content */}
      <div className="up__content">

        {tab === 'animals' && (
          <div className="up__section">
            {adoptions.length === 0 ? (
              <div className="up__empty-state">
                <div className="up__empty-icon">🐆</div>
                <p>You haven't adopted any animals yet.</p>
                <button className="up-btn-primary" onClick={() => goTo('adopt')}>Adopt an Animal</button>
              </div>
            ) : (
              <div className="up__list">
                {adoptions.map((a, i) => (
                  <div key={i} className="up__card">
                    <div className="up__card-icon">🐆</div>
                    <div className="up__card-body">
                      <div className="up__card-title">{a.animalName}</div>
                      <div className="up__card-sub">{a.animalSpecies}</div>
                      <div className="up__card-meta">
                        <span className="up__tag-gold">€{a.monthlyEur}/month</span>
                        <span className="up__card-date">since {fmtDate(a.date)}</span>
                      </div>
                    </div>
                    <div className="up__xp-tag">+50 XP</div>
                  </div>
                ))}
                <button className="up-btn-outline" onClick={() => goTo('adopt')}>Adopt another animal</button>
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="up__section">
            {orders.length === 0 ? (
              <div className="up__empty-state">
                <div className="up__empty-icon">🛍️</div>
                <p>No orders yet. Visit our shop!</p>
                <button className="up-btn-primary" onClick={() => goTo('merch')}>Go to Shop</button>
              </div>
            ) : (
              <div className="up__list">
                {orders.map((o, i) => (
                  <div key={i} className="up__card">
                    <div className="up__card-icon">📦</div>
                    <div className="up__card-body">
                      <div className="up__card-title">{o.productName}</div>
                      <div className="up__card-date">{fmtDate(o.date)}</div>
                    </div>
                    <div className="up__card-right">
                      <div className="up__tag-gold">{fmt(o.amount)}</div>
                      <div className="up__xp-tag">+{Math.max(1, Math.floor(o.amount / 100))} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'account' && (
          <div className="up__section">
            <div className="up__fields">
              <div className="up__field">
                <label>Name</label>
                <div className="up__field-val">{user.name}</div>
              </div>
              <div className="up__field">
                <label>Email</label>
                <div className="up__field-val">{user.email}</div>
              </div>
              <div className="up__field">
                <label>Member since</label>
                <div className="up__field-val">{user.createdAt ? fmtDate(user.createdAt) : '—'}</div>
              </div>
              <div className="up__field">
                <label>Level</label>
                <div className="up__field-val" style={{ color: level.color, fontWeight: 700 }}>
                  {level.emoji} {level.name} — {xp} XP
                </div>
              </div>
            </div>

            <div className="up__levels-box">
              <div className="up__levels-title">XP Levels</div>
              {LEVELS.map(l => (
                <div key={l.name} className={`up__level-row ${level.name === l.name ? 'current' : ''}`}>
                  <span className="up__level-dot" style={{ background: l.color }} />
                  <span className="up__level-name">{l.emoji} {l.name}</span>
                  <span className="up__level-req">{l.min === 0 ? '0' : l.min}+ XP</span>
                </div>
              ))}
            </div>

            <button className="up-btn-danger" onClick={logout}>Sign Out</button>
          </div>
        )}
      </div>

      <style>{`
        .up {
          min-height: 100vh;
          padding: 7rem 2rem 5rem;
          max-width: 820px;
          margin: 0 auto;
          background: var(--cream);
        }

        /* Hero */
        .up__hero {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 3rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          flex-wrap: wrap;
        }
        .up__avatar {
          width: 72px; height: 72px; border-radius: 50%;
          background: var(--gold-pale);
          border: 2px solid var(--gold);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.8rem; font-family: var(--serif);
          color: var(--gold); font-weight: 700; flex-shrink: 0;
        }
        .up__hero-info { flex: 1; min-width: 160px; padding-top: 0.25rem; }
        .up__name {
          font-family: var(--serif); font-size: 2rem; font-weight: 700;
          color: var(--dark); margin: 0 0 0.3rem; line-height: 1.1;
        }
        .up__level-badge {
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .up__xp-block { flex-shrink: 0; min-width: 200px; padding-top: 0.25rem; }
        .up__xp-num {
          font-size: 2.2rem; font-weight: 700;
          color: var(--dark); line-height: 1;
        }
        .up__xp-num span { font-size: 1rem; color: var(--gray); font-weight: 400; }
        .up__xp-bar-wrap {
          height: 6px; background: rgba(0,0,0,0.08);
          border-radius: 99px; margin: 0.6rem 0 0.4rem; overflow: hidden;
        }
        .up__xp-bar {
          height: 100%; border-radius: 99px;
          transition: width 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .up__xp-next { font-size: 0.75rem; color: var(--gray); }

        /* Tabs */
        .up__tabs {
          display: flex;
          border-bottom: 2px solid rgba(0,0,0,0.08);
          margin-bottom: 2.5rem;
          gap: 0;
        }
        .up__tab {
          flex: 1; background: none; border: none;
          padding: 0.9rem 0.5rem;
          font-size: 0.82rem; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          color: var(--gray); cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          transition: color 0.2s, border-color 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          font-family: var(--sans);
        }
        .up__tab.active { color: var(--gold); border-bottom-color: var(--gold); }
        .up__badge {
          background: var(--gold); color: #fff;
          border-radius: 99px; font-size: 0.65rem;
          padding: 0.1rem 0.45rem; font-weight: 700;
        }

        /* Section animation */
        .up__section { animation: upFade 0.25s ease; }
        @keyframes upFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Empty state */
        .up__empty-state {
          text-align: center; padding: 5rem 1rem;
          color: var(--gray);
        }
        .up__empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .up__empty-state p { margin-bottom: 1.5rem; font-size: 1rem; }

        /* Cards list */
        .up__list { display: flex; flex-direction: column; gap: 1rem; }
        .up__card {
          display: flex; align-items: center; gap: 1.25rem;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 14px; padding: 1.25rem 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .up__card-icon { font-size: 2rem; flex-shrink: 0; }
        .up__card-body { flex: 1; }
        .up__card-title {
          font-family: var(--serif); font-size: 1.1rem;
          font-weight: 700; color: var(--dark); margin-bottom: 0.15rem;
        }
        .up__card-sub { font-size: 0.8rem; color: var(--gray); margin-bottom: 0.5rem; }
        .up__card-date { font-size: 0.78rem; color: var(--gray); }
        .up__card-meta { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .up__card-right { text-align: right; flex-shrink: 0; display: flex; flex-direction: column; gap: 0.3rem; align-items: flex-end; }
        .up__tag-gold {
          font-size: 0.85rem; font-weight: 700; color: var(--gold);
        }
        .up__xp-tag {
          font-size: 0.72rem; font-weight: 700; color: #4caf50;
          background: rgba(76,175,80,0.1); border-radius: 99px;
          padding: 0.15rem 0.6rem;
        }

        /* Account fields */
        .up__fields { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem; }
        .up__field { display: flex; flex-direction: column; gap: 0.3rem; }
        .up__field label {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--gray);
        }
        .up__field-val { font-size: 0.95rem; color: var(--dark-2); }

        /* Levels box */
        .up__levels-box {
          background: #fff; border: 1px solid rgba(0,0,0,0.08);
          border-radius: 14px; padding: 1.4rem;
          display: flex; flex-direction: column; gap: 0.7rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .up__levels-title {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--gray); margin-bottom: 0.25rem;
        }
        .up__level-row {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.88rem; color: var(--gray-light);
        }
        .up__level-row.current { color: var(--dark); font-weight: 600; }
        .up__level-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .up__level-name { flex: 1; }
        .up__level-req { font-size: 0.75rem; color: var(--gray-light); }
        .up__level-row.current .up__level-req { color: var(--gray); }

        /* Buttons */
        .up-btn-primary {
          background: var(--gold); color: #fff; border: none;
          padding: 0.75rem 2rem; border-radius: 50px;
          font-size: 0.8rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; cursor: pointer;
          font-family: var(--sans);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .up-btn-primary:hover {
          background: var(--gold-mid); transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(200,136,10,0.35);
        }
        .up-btn-outline {
          background: none; border: 2px solid var(--gold);
          color: var(--gold); padding: 0.65rem 1.8rem; border-radius: 50px;
          font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; cursor: pointer; font-family: var(--sans);
          transition: background 0.2s, color 0.2s;
          align-self: flex-start; margin-top: 0.5rem;
        }
        .up-btn-outline:hover { background: var(--gold); color: #fff; }
        .up-btn-danger {
          background: none; border: 1.5px solid rgba(200,0,0,0.25);
          color: #c00; padding: 0.65rem 1.6rem; border-radius: 8px;
          font-size: 0.8rem; font-weight: 600; cursor: pointer;
          font-family: var(--sans);
          transition: border-color 0.2s, background 0.2s;
        }
        .up-btn-danger:hover { border-color: rgba(200,0,0,0.5); background: rgba(200,0,0,0.04); }

        .up-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-height: 60vh; gap: 1rem; color: var(--gray);
        }

        @media (max-width: 600px) {
          .up { padding: 5.5rem 1.25rem 3rem; }
          .up__hero { flex-direction: column; gap: 1rem; }
          .up__xp-block { width: 100%; }
          .up__tab { font-size: 0.72rem; padding: 0.75rem 0.25rem; }
          .up__card { padding: 1rem 1.1rem; }
        }
      `}</style>
    </div>
  )
}
