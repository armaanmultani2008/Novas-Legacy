import { useState, useEffect } from 'react'
import { useUser } from '../UserContext'

const LEVELS = [
  { name: "Friend of Cheetahs", emoji: '🌿', color: '#4caf50', min: 0,   max: 100  },
  { name: 'Protector',          emoji: '🛡️', color: '#26a69a', min: 100,  max: 300  },
  { name: 'Guardian',           emoji: '⚡',  color: '#7c4dff', min: 300,  max: 600  },
  { name: 'Champion',           emoji: '🌟', color: '#c8880a', min: 600,  max: 1000 },
  { name: "Nova's Hero",        emoji: '🏆', color: '#ff8f00', min: 1000, max: Infinity },
]

function getLevel(xp) {
  return LEVELS.findLast(l => xp >= l.min) || LEVELS[0]
}

function getLevelProgress(xp) {
  const lvl = getLevel(xp)
  if (lvl.max === Infinity) return 100
  return Math.round(((xp - lvl.min) / (lvl.max - lvl.min)) * 100)
}

function getNextLevel(xp) {
  const idx = LEVELS.findIndex(l => l === getLevel(xp))
  return LEVELS[idx + 1] || null
}

function fmt(amount) {
  return `€${(amount / 100).toFixed(2)}`
}

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
        <button onClick={() => goTo('home')}>Go home</button>
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
      <div className="up__hero">
        <div className="up__avatar">{user.name?.[0]?.toUpperCase() || '?'}</div>
        <div className="up__hero-info">
          <h1 className="up__name">{user.name}</h1>
          <div className="up__level" style={{ color: level.color }}>
            <span className="up__level-emoji">{level.emoji}</span>
            {level.name}
          </div>
        </div>
        <div className="up__xp-block">
          <div className="up__xp-num">{xp} <span>XP</span></div>
          <div className="up__xp-bar-wrap">
            <div className="up__xp-bar" style={{ width: `${progress}%`, background: level.color }} />
          </div>
          {nextLevel && (
            <div className="up__xp-next">{nextLevel.max - xp} XP to {nextLevel.emoji} {nextLevel.name}</div>
          )}
          {!nextLevel && <div className="up__xp-next">Max level reached 🏆</div>}
        </div>
      </div>

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

      <div className="up__content">

        {tab === 'animals' && (
          <div className="up__section">
            {adoptions.length === 0 ? (
              <div className="up__empty">
                <div className="up__empty-icon">🐆</div>
                <p>You haven&apos;t adopted any animals yet.</p>
                <button className="up__cta" onClick={() => goTo('adopt')}>Adopt an Animal</button>
              </div>
            ) : (
              <div className="up__animals">
                {adoptions.map((a, i) => (
                  <div key={i} className="up__animal-card">
                    <div className="up__animal-icon">🐆</div>
                    <div className="up__animal-info">
                      <div className="up__animal-name">{a.animalName}</div>
                      <div className="up__animal-species">{a.animalSpecies}</div>
                      <div className="up__animal-meta">
                        <span className="up__animal-price">€{a.monthlyEur}/month</span>
                        <span className="up__animal-date">since {fmtDate(a.date)}</span>
                      </div>
                    </div>
                    <div className="up__animal-xp">+50 XP</div>
                  </div>
                ))}
                <button className="up__cta" onClick={() => goTo('adopt')}>Adopt another animal</button>
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="up__section">
            {orders.length === 0 ? (
              <div className="up__empty">
                <div className="up__empty-icon">🛍️</div>
                <p>No orders yet. Visit our shop!</p>
                <button className="up__cta" onClick={() => goTo('merch')}>Go to Shop</button>
              </div>
            ) : (
              <div className="up__orders">
                {orders.map((o, i) => (
                  <div key={i} className="up__order-row">
                    <div className="up__order-icon">📦</div>
                    <div className="up__order-info">
                      <div className="up__order-name">{o.productName}</div>
                      <div className="up__order-date">{fmtDate(o.date)}</div>
                    </div>
                    <div className="up__order-right">
                      <div className="up__order-amount">{fmt(o.amount)}</div>
                      <div className="up__order-xp">+{Math.max(1, Math.floor(o.amount / 100))} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'account' && (
          <div className="up__section up__account">
            <div className="up__account-field">
              <label>Name</label>
              <div className="up__account-val">{user.name}</div>
            </div>
            <div className="up__account-field">
              <label>Email</label>
              <div className="up__account-val">{user.email}</div>
            </div>
            <div className="up__account-field">
              <label>Member since</label>
              <div className="up__account-val">{user.createdAt ? fmtDate(user.createdAt) : '—'}</div>
            </div>
            <div className="up__account-field">
              <label>Total XP</label>
              <div className="up__account-val" style={{ color: level.color }}>
                {level.emoji} {xp} XP — {level.name}
              </div>
            </div>
            <div className="up__levels-guide">
              <div className="up__levels-title">XP Levels</div>
              {LEVELS.map(l => (
                <div key={l.name} className={`up__level-row ${level.name === l.name ? 'current' : ''}`}>
                  <span className="up__level-dot" style={{ background: l.color }}></span>
                  <span className="up__level-name">{l.emoji} {l.name}</span>
                  <span className="up__level-req">{l.min === 0 ? '0' : l.min}+ XP</span>
                </div>
              ))}
            </div>
            <button className="up__logout" onClick={logout}>Sign Out</button>
          </div>
        )}

      </div>

      <style>{`
        .up {
          min-height: 100vh;
          padding: 6rem 2rem 4rem;
          max-width: 760px;
          margin: 0 auto;
        }
        .up__hero {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        .up__avatar {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(200,136,10,0.15);
          border: 2px solid var(--gold-mid);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; font-family: var(--serif); color: var(--gold-light);
          flex-shrink: 0;
        }
        .up__hero-info { flex: 1; min-width: 140px; }
        .up__name { font-size: 1.6rem; font-family: var(--serif); color: #fff; margin: 0 0 0.25rem; }
        .up__level { font-size: 0.82rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
        .up__level-emoji { margin-right: 0.4rem; }
        .up__xp-block { flex-shrink: 0; min-width: 180px; }
        .up__xp-num { font-size: 2rem; font-weight: 700; color: #fff; line-height: 1; }
        .up__xp-num span { font-size: 0.9rem; color: rgba(255,255,255,0.4); }
        .up__xp-bar-wrap {
          height: 6px; background: rgba(255,255,255,0.08);
          border-radius: 99px; margin: 0.5rem 0 0.35rem;
          overflow: hidden;
        }
        .up__xp-bar {
          height: 100%; border-radius: 99px;
          transition: width 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .up__xp-next { font-size: 0.75rem; color: rgba(255,255,255,0.35); }

        .up__tabs {
          display: flex; gap: 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 2rem;
        }
        .up__tab {
          flex: 1; background: none; border: none;
          padding: 0.8rem 0.5rem; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.05em; color: rgba(255,255,255,0.35);
          cursor: pointer; border-bottom: 2px solid transparent;
          margin-bottom: -1px; transition: color 0.2s, border-color 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .up__tab.active { color: var(--gold-light); border-bottom-color: var(--gold-light); }
        .up__badge {
          background: var(--gold-mid); color: #111;
          border-radius: 99px; font-size: 0.65rem;
          padding: 0.1rem 0.45rem; font-weight: 700;
        }

        .up__section { animation: fadeIn 0.25s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

        .up__empty { text-align: center; padding: 4rem 1rem; color: rgba(255,255,255,0.4); }
        .up__empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .up__empty p { margin-bottom: 1.5rem; }
        .up__cta {
          background: var(--gold-light); color: #111; border: none;
          padding: 0.7rem 1.8rem; border-radius: 50px;
          font-size: 0.8rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .up__cta:hover { background: var(--gold-mid); transform: translateY(-2px); }

        .up__animals { display: flex; flex-direction: column; gap: 1rem; }
        .up__animal-card {
          display: flex; align-items: center; gap: 1rem;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 1.2rem 1.4rem;
        }
        .up__animal-icon { font-size: 2rem; flex-shrink: 0; }
        .up__animal-info { flex: 1; }
        .up__animal-name { font-size: 1.05rem; font-family: var(--serif); color: #fff; font-weight: 700; }
        .up__animal-species { font-size: 0.78rem; color: rgba(255,255,255,0.4); margin-bottom: 0.5rem; }
        .up__animal-meta { display: flex; gap: 1rem; flex-wrap: wrap; }
        .up__animal-price { font-size: 0.82rem; color: var(--gold-light); font-weight: 600; }
        .up__animal-date { font-size: 0.78rem; color: rgba(255,255,255,0.3); }
        .up__animal-xp {
          font-size: 0.75rem; font-weight: 700; color: #4caf50;
          background: rgba(76,175,80,0.12); border-radius: 99px;
          padding: 0.2rem 0.7rem; flex-shrink: 0;
        }
        .up__animals .up__cta { margin-top: 0.5rem; align-self: flex-start; }

        .up__orders { display: flex; flex-direction: column; gap: 0.75rem; }
        .up__order-row {
          display: flex; align-items: center; gap: 1rem;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 1rem 1.2rem;
        }
        .up__order-icon { font-size: 1.5rem; flex-shrink: 0; }
        .up__order-info { flex: 1; }
        .up__order-name { font-size: 0.92rem; color: #fff; font-weight: 600; }
        .up__order-date { font-size: 0.75rem; color: rgba(255,255,255,0.35); margin-top: 0.2rem; }
        .up__order-right { text-align: right; flex-shrink: 0; }
        .up__order-amount { font-size: 0.92rem; color: var(--gold-light); font-weight: 600; }
        .up__order-xp { font-size: 0.72rem; color: #4caf50; margin-top: 0.2rem; }

        .up__account { display: flex; flex-direction: column; gap: 1.25rem; max-width: 480px; }
        .up__account-field { display: flex; flex-direction: column; gap: 0.3rem; }
        .up__account-field label {
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
        }
        .up__account-val { font-size: 0.95rem; color: rgba(255,255,255,0.85); }
        .up__levels-guide {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 1.2rem;
          display: flex; flex-direction: column; gap: 0.6rem;
        }
        .up__levels-title {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
          margin-bottom: 0.2rem;
        }
        .up__level-row {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.85rem; color: rgba(255,255,255,0.4);
          transition: color 0.2s;
        }
        .up__level-row.current { color: rgba(255,255,255,0.9); }
        .up__level-dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
        }
        .up__level-name { flex: 1; }
        .up__level-req { font-size: 0.75rem; color: rgba(255,255,255,0.25); }
        .up__level-row.current .up__level-req { color: rgba(255,255,255,0.5); }
        .up__logout {
          background: none; border: 1px solid rgba(255,50,50,0.3);
          color: rgba(255,100,100,0.7); border-radius: 8px;
          padding: 0.65rem 1.4rem; font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s; align-self: flex-start;
          margin-top: 0.5rem;
        }
        .up__logout:hover { border-color: rgba(255,80,80,0.6); color: #ff8080; background: rgba(255,50,50,0.06); }

        .up-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 1rem; color: rgba(255,255,255,0.4); }

        @media (max-width: 600px) {
          .up { padding: 5rem 1.25rem 3rem; }
          .up__xp-block { width: 100%; }
          .up__tab { font-size: 0.72rem; }
        }
      `}</style>
    </div>
  )
}
