import { useState, useEffect } from 'react'
import { useUser } from '../UserContext'

const LEVELS = [
  { name: "Friend of Cheetahs", emoji: '🌿', color: '#4caf50', bg: 'rgba(76,175,80,0.1)',   min: 0,   max: 100  },
  { name: 'Protector',          emoji: '🛡️', color: '#26a69a', bg: 'rgba(38,166,154,0.1)',  min: 100,  max: 300  },
  { name: 'Guardian',           emoji: '⚡',  color: '#7c4dff', bg: 'rgba(124,77,255,0.1)',  min: 300,  max: 600  },
  { name: 'Champion',           emoji: '🌟', color: '#c8880a', bg: 'rgba(200,136,10,0.1)',  min: 600,  max: 1000 },
  { name: "Nova's Hero",        emoji: '🏆', color: '#e65100', bg: 'rgba(230,81,0,0.1)',    min: 1000, max: Infinity },
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

const IconPaw = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="8" r="2"/><circle cx="17" cy="8" r="2"/>
    <circle cx="4" cy="14" r="1.5"/><circle cx="20" cy="14" r="1.5"/>
    <path d="M12 21c-3 0-6-2-6-5 0-1.5 1-3 3-4l3-1 3 1c2 1 3 2.5 3 4 0 3-3 5-6 5z"/>
  </svg>
)
const IconBag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
)
const IconBox = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function UserProfile({ goTo }) {
  const { user, token, logout, refreshUser } = useUser()
  const [tab, setTab] = useState('animals')
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwStatus, setPwStatus] = useState(null) // { type: 'ok'|'err', msg }
  const [pwLoading, setPwLoading] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwStatus(null)
    if (pwForm.next.length < 8) return setPwStatus({ type: 'err', msg: 'New password must be at least 8 characters' })
    if (pwForm.next !== pwForm.confirm) return setPwStatus({ type: 'err', msg: 'Passwords do not match' })
    setPwLoading(true)
    try {
      const res = await fetch(`${API}/api/user/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      })
      const data = await res.json()
      if (!res.ok) return setPwStatus({ type: 'err', msg: data.error || 'Error' })
      setPwStatus({ type: 'ok', msg: 'Password updated successfully!' })
      setPwForm({ current: '', next: '', confirm: '' })
    } catch {
      setPwStatus({ type: 'err', msg: 'Could not reach the server' })
    } finally {
      setPwLoading(false)
    }
  }

  useEffect(() => { refreshUser() }, [])

  if (!user) {
    return (
      <div className="up-gate">
        <p>You are not logged in.</p>
        <button className="up-btn-gold" onClick={() => goTo('home')}>Go home</button>
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

      {/* ── Header ── */}
      <div className="up__header">
        <div className="up__av">{user.name?.[0]?.toUpperCase() || '?'}</div>
        <div className="up__header-center">
          <h1 className="up__name">{user.name}</h1>
          <span className="up__level-pill" style={{ color: level.color, background: level.bg }}>
            {level.emoji} {level.name}
          </span>
        </div>
        <div className="up__xp-panel">
          <div className="up__xp-top">
            <span className="up__xp-label">Total XP</span>
            <span className="up__xp-value" style={{ color: level.color }}>{xp}</span>
          </div>
          <div className="up__xp-track">
            <div className="up__xp-fill" style={{ width: `${progress}%`, background: level.color }} />
          </div>
          <div className="up__xp-sub">
            {nextLevel
              ? <>{nextLevel.max - xp} XP to <strong>{nextLevel.name}</strong></>
              : 'Maximum level reached'}
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="up__stats">
        <div className="up__stat">
          <div className="up__stat-n">{adoptions.length}</div>
          <div className="up__stat-l">Adoptions</div>
        </div>
        <div className="up__stat-div" />
        <div className="up__stat">
          <div className="up__stat-n">{orders.length}</div>
          <div className="up__stat-l">Orders</div>
        </div>
        <div className="up__stat-div" />
        <div className="up__stat">
          <div className="up__stat-n" style={{ color: level.color }}>{LEVELS.findIndex(l => l === level) + 1}<span>/{LEVELS.length}</span></div>
          <div className="up__stat-l">Level</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="up__tabs">
        <button className={`up__tab ${tab === 'animals' ? 'active' : ''}`} onClick={() => setTab('animals')}>
          <IconPaw /> My Animals
          {adoptions.length > 0 && <span className="up__count">{adoptions.length}</span>}
        </button>
        <button className={`up__tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          <IconBag /> My Orders
          {orders.length > 0 && <span className="up__count">{orders.length}</span>}
        </button>
        <button className={`up__tab ${tab === 'account' ? 'active' : ''}`} onClick={() => setTab('account')}>
          <IconUser /> Account
        </button>
      </div>

      {/* ── Content ── */}
      <div className="up__body">

        {tab === 'animals' && (
          <div className="up__section">
            {adoptions.length === 0 ? (
              <div className="up__empty">
                <div className="up__empty-icon"><IconPaw /></div>
                <h3>No adoptions yet</h3>
                <p>Adopt an animal and it will appear here with your monthly contribution.</p>
                <button className="up-btn-gold" onClick={() => goTo('adopt')}>Adopt an Animal</button>
              </div>
            ) : (
              <div className="up__list">
                {adoptions.map((a, i) => (
                  <div key={i} className="up__card">
                    <div className="up__card-icon-wrap" style={{ background: 'rgba(76,175,80,0.08)', color: '#4caf50' }}>
                      <IconPaw />
                    </div>
                    <div className="up__card-body">
                      <div className="up__card-title">{a.animalName}</div>
                      <div className="up__card-sub">{a.animalSpecies}</div>
                      <div className="up__card-row">
                        <span className="up__chip up__chip--gold">€{a.monthlyEur}/month</span>
                        <span className="up__chip up__chip--green">
                          <IconStar /> +50 XP
                        </span>
                        <span className="up__card-date">Since {fmtDate(a.date)}</span>
                      </div>
                    </div>
                    <div className="up__card-arrow"><IconChevron /></div>
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
              <div className="up__empty">
                <div className="up__empty-icon"><IconBag /></div>
                <h3>No orders yet</h3>
                <p>Your merch purchases will appear here after checkout.</p>
                <button className="up-btn-gold" onClick={() => goTo('merch')}>Visit the Shop</button>
              </div>
            ) : (
              <div className="up__list">
                {orders.map((o, i) => (
                  <div key={i} className="up__card">
                    <div className="up__card-icon-wrap" style={{ background: 'rgba(200,136,10,0.08)', color: 'var(--gold)' }}>
                      <IconBox />
                    </div>
                    <div className="up__card-body">
                      <div className="up__card-title">{o.productName}</div>
                      <div className="up__card-row">
                        <span className="up__chip up__chip--gold">{fmt(o.amount)}</span>
                        <span className="up__chip up__chip--green">
                          <IconStar /> +{Math.max(1, Math.floor(o.amount / 100))} XP
                        </span>
                        <span className="up__card-date">{fmtDate(o.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'account' && (
          <div className="up__section">
            <div className="up__info-grid">
              <div className="up__info-card">
                <label>Full name</label>
                <span>{user.name}</span>
              </div>
              <div className="up__info-card">
                <label>Email address</label>
                <span>{user.email}</span>
              </div>
              <div className="up__info-card">
                <label>Member since</label>
                <span>{user.createdAt ? fmtDate(user.createdAt) : '—'}</span>
              </div>
              <div className="up__info-card">
                <label>Current level</label>
                <span style={{ color: level.color, fontWeight: 700 }}>{level.name}</span>
              </div>
            </div>

            <div className="up__levels-card">
              <div className="up__levels-head">Your Journey</div>
              <div className="up__lv-grid">
                {LEVELS.map((l) => {
                  const isCurrent = level.name === l.name
                  const isUnlocked = xp >= l.min
                  const isLocked = !isUnlocked
                  return (
                    <div
                      key={l.name}
                      className={`up__lv-tile ${isCurrent ? 'current' : ''} ${isUnlocked && !isCurrent ? 'unlocked' : ''} ${isLocked ? 'locked' : ''}`}
                      style={isCurrent ? { borderColor: l.color, background: l.bg } : {}}
                    >
                      <div className="up__lv-emoji" style={{ filter: isLocked ? 'grayscale(1) opacity(0.4)' : 'none' }}>
                        {l.emoji}
                      </div>
                      <div className="up__lv-tile-name" style={isCurrent ? { color: l.color } : isLocked ? { color: 'var(--gray-light)' } : {}}>
                        {l.name}
                      </div>
                      <div className="up__lv-tile-req">
                        {l.min === 0 ? '0 XP' : `${l.min} XP`}
                      </div>
                      {isCurrent && <div className="up__lv-current-dot" style={{ background: l.color }} />}
                      {isLocked && <div className="up__lv-lock">🔒</div>}
                    </div>
                  )
                })}
              </div>
            </div>

            <form className="up__pw-form" onSubmit={handleChangePassword} noValidate>
              <div className="up__pw-head">Change Password</div>
              <div className="up__pw-fields">
                <div className="up__pw-field">
                  <label>Current password</label>
                  <input type="password" placeholder="••••••••" value={pwForm.current}
                    onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} required />
                </div>
                <div className="up__pw-field">
                  <label>New password</label>
                  <input type="password" placeholder="Min. 8 characters" value={pwForm.next}
                    onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} required />
                </div>
                <div className="up__pw-field">
                  <label>Confirm new password</label>
                  <input type="password" placeholder="Repeat new password" value={pwForm.confirm}
                    onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} required />
                </div>
              </div>
              {pwStatus && (
                <div className={`up__pw-msg ${pwStatus.type}`}>{pwStatus.msg}</div>
              )}
              <button className="up-btn-gold" type="submit" disabled={pwLoading}>
                {pwLoading ? 'Saving…' : 'Update Password'}
              </button>
            </form>

            <button className="up-btn-danger" onClick={() => { logout(); goTo('home') }}>Sign out</button>
          </div>
        )}
      </div>

      <style>{`
        .up {
          min-height: 100vh;
          background: var(--cream);
          padding: 7rem 2rem 5rem;
          max-width: 860px;
          margin: 0 auto;
        }

        /* Header */
        .up__header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 20px;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          flex-wrap: wrap;
        }
        .up__av {
          width: 68px; height: 68px; border-radius: 50%;
          background: var(--gold-pale);
          border: 2px solid var(--gold);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--serif); font-size: 1.9rem; font-weight: 700;
          color: var(--gold); flex-shrink: 0;
        }
        .up__header-center { flex: 1; min-width: 140px; }
        .up__name {
          font-family: var(--serif); font-size: 1.75rem; font-weight: 700;
          color: var(--dark); margin: 0 0 0.5rem; line-height: 1;
        }
        .up__level-pill {
          display: inline-block;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 0.3rem 0.85rem;
          border-radius: 99px;
        }
        .up__xp-panel {
          min-width: 200px; flex-shrink: 0;
          border-left: 1px solid rgba(0,0,0,0.07);
          padding-left: 1.5rem;
        }
        .up__xp-top {
          display: flex; justify-content: space-between;
          align-items: baseline; margin-bottom: 0.5rem;
        }
        .up__xp-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gray); font-weight: 600; }
        .up__xp-value { font-size: 1.6rem; font-weight: 700; line-height: 1; }
        .up__xp-track {
          height: 5px; background: rgba(0,0,0,0.07);
          border-radius: 99px; overflow: hidden; margin-bottom: 0.4rem;
        }
        .up__xp-fill {
          height: 100%; border-radius: 99px;
          transition: width 1s cubic-bezier(0.22,1,0.36,1);
        }
        .up__xp-sub { font-size: 0.74rem; color: var(--gray); }
        .up__xp-sub strong { color: var(--dark-2); }

        /* Stats */
        .up__stats {
          display: flex; align-items: center;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          margin-bottom: 1.25rem;
          padding: 1.25rem 2rem;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
        }
        .up__stat { flex: 1; text-align: center; }
        .up__stat-n {
          font-family: var(--serif); font-size: 2rem; font-weight: 700;
          color: var(--dark); line-height: 1; margin-bottom: 0.25rem;
        }
        .up__stat-n span { font-size: 1rem; color: var(--gray); }
        .up__stat-l { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gray); font-weight: 600; }
        .up__stat-div { width: 1px; height: 40px; background: rgba(0,0,0,0.08); margin: 0 1rem; }

        /* Tabs */
        .up__tabs {
          display: flex; gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .up__tab {
          flex: 1; background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          padding: 0.75rem 0.5rem;
          font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em;
          color: var(--gray); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.45rem;
          transition: all 0.2s; font-family: var(--sans);
        }
        .up__tab:hover { border-color: var(--gold-mid); color: var(--dark); }
        .up__tab.active {
          background: var(--dark); border-color: var(--dark);
          color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .up__count {
          background: var(--gold); color: #fff;
          border-radius: 99px; font-size: 0.62rem;
          padding: 0.1rem 0.4rem; font-weight: 700; line-height: 1.4;
        }
        .up__tab.active .up__count { background: rgba(255,255,255,0.2); color: #fff; }

        /* Body */
        .up__body { }
        .up__section { animation: upIn 0.22s ease; }
        @keyframes upIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Empty */
        .up__empty {
          background: #fff; border: 1px solid rgba(0,0,0,0.07);
          border-radius: 20px; padding: 4rem 2rem;
          text-align: center; box-shadow: 0 2px 16px rgba(0,0,0,0.04);
        }
        .up__empty-icon {
          width: 60px; height: 60px; border-radius: 16px;
          background: var(--gold-pale); color: var(--gold);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .up__empty-icon svg { width: 28px; height: 28px; }
        .up__empty h3 { font-family: var(--serif); font-size: 1.4rem; color: var(--dark); margin: 0 0 0.5rem; }
        .up__empty p { font-size: 0.9rem; color: var(--gray); margin: 0 0 1.5rem; max-width: 320px; margin-left: auto; margin-right: auto; }

        /* Cards */
        .up__list { display: flex; flex-direction: column; gap: 0.75rem; }
        .up__card {
          display: flex; align-items: center; gap: 1rem;
          background: #fff; border: 1px solid rgba(0,0,0,0.07);
          border-radius: 14px; padding: 1.1rem 1.25rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .up__card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .up__card-icon-wrap {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .up__card-body { flex: 1; }
        .up__card-title { font-size: 0.95rem; font-weight: 700; color: var(--dark); margin-bottom: 0.2rem; }
        .up__card-sub { font-size: 0.78rem; color: var(--gray); margin-bottom: 0.5rem; }
        .up__card-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .up__card-date { font-size: 0.75rem; color: var(--gray-light); margin-left: 0.25rem; }
        .up__card-arrow { color: var(--gray-light); flex-shrink: 0; }
        .up__chip {
          display: inline-flex; align-items: center; gap: 0.25rem;
          font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.6rem;
          border-radius: 99px; letter-spacing: 0.02em;
        }
        .up__chip--gold { background: rgba(200,136,10,0.1); color: var(--gold); }
        .up__chip--green { background: rgba(76,175,80,0.1); color: #388e3c; }

        /* Account */
        .up__info-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0.75rem; margin-bottom: 1.25rem;
        }
        .up__info-card {
          background: #fff; border: 1px solid rgba(0,0,0,0.07);
          border-radius: 14px; padding: 1.1rem 1.25rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          display: flex; flex-direction: column; gap: 0.35rem;
        }
        .up__info-card label {
          font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--gray); font-weight: 600;
        }
        .up__info-card span { font-size: 0.9rem; color: var(--dark-2); font-weight: 500; }

        /* Levels card */
        .up__levels-card {
          background: #fff; border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px; padding: 1.5rem 1.75rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .up__levels-head {
          font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--gray); font-weight: 700; margin-bottom: 1.25rem;
        }
        .up__lv-grid {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem;
        }
        .up__lv-tile {
          position: relative; border: 2px solid rgba(0,0,0,0.07);
          border-radius: 14px; padding: 1rem 0.5rem 0.85rem;
          text-align: center; transition: all 0.2s; background: #fafafa;
        }
        .up__lv-tile.unlocked { border-color: rgba(0,0,0,0.1); background: #fff; }
        .up__lv-tile.current {
          box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-2px);
        }
        .up__lv-tile.locked { opacity: 0.45; }
        .up__lv-emoji { font-size: 1.9rem; margin-bottom: 0.5rem; display: block; line-height: 1; }
        .up__lv-tile-name {
          font-size: 0.66rem; font-weight: 700; color: var(--dark-2);
          line-height: 1.3; margin-bottom: 0.3rem;
        }
        .up__lv-tile-req {
          font-size: 0.6rem; color: var(--gray); font-weight: 600; letter-spacing: 0.04em;
        }
        .up__lv-current-dot {
          position: absolute; bottom: -1px; left: 50%; transform: translateX(-50%);
          width: 28px; height: 3px; border-radius: 99px;
        }
        .up__lv-lock {
          position: absolute; top: 0.35rem; right: 0.35rem; font-size: 0.65rem; opacity: 0.7;
        }

        /* Change password form */
        .up__pw-form {
          background: #fff; border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px; padding: 1.5rem 1.75rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          display: flex; flex-direction: column; gap: 1.1rem;
        }
        .up__pw-head {
          font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--gray); font-weight: 700;
        }
        .up__pw-fields { display: flex; flex-direction: column; gap: 0.75rem; }
        .up__pw-field { display: flex; flex-direction: column; gap: 0.35rem; }
        .up__pw-field label {
          font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--gray); font-weight: 600;
        }
        .up__pw-field input {
          background: var(--cream); border: 1.5px solid rgba(0,0,0,0.1);
          border-radius: 10px; padding: 0.65rem 1rem;
          font-size: 0.9rem; color: var(--dark); outline: none;
          font-family: var(--sans); transition: border-color 0.2s;
          width: 100%; box-sizing: border-box;
        }
        .up__pw-field input:focus { border-color: var(--gold-mid); background: #fff; }
        .up__pw-msg {
          font-size: 0.82rem; padding: 0.6rem 0.9rem; border-radius: 8px;
        }
        .up__pw-msg.ok { background: rgba(76,175,80,0.1); color: #2e7d32; border: 1px solid rgba(76,175,80,0.2); }
        .up__pw-msg.err { background: rgba(200,0,0,0.07); color: #b00; border: 1px solid rgba(200,0,0,0.15); }

        /* Buttons */
        .up-btn-gold {
          background: var(--gold); color: #fff; border: none;
          padding: 0.8rem 2.2rem; border-radius: 50px;
          font-size: 0.78rem; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; cursor: pointer; font-family: var(--sans);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .up-btn-gold:hover {
          background: var(--gold-mid); transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(200,136,10,0.3);
        }
        .up-btn-outline {
          background: none; border: 1.5px solid var(--gold);
          color: var(--gold); padding: 0.7rem 1.8rem; border-radius: 50px;
          font-size: 0.78rem; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; cursor: pointer; font-family: var(--sans);
          transition: all 0.2s; margin-top: 0.5rem;
        }
        .up-btn-outline:hover { background: var(--gold); color: #fff; }
        .up-btn-danger {
          background: none; border: 1.5px solid rgba(180,0,0,0.2);
          color: #b00; padding: 0.65rem 1.6rem; border-radius: 8px;
          font-size: 0.78rem; font-weight: 600; cursor: pointer; font-family: var(--sans);
          transition: all 0.2s;
        }
        .up-btn-danger:hover { border-color: rgba(180,0,0,0.45); background: rgba(180,0,0,0.04); }

        .up-gate {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-height: 60vh; gap: 1rem; color: var(--gray);
        }

        @media (max-width: 640px) {
          .up { padding: 5.5rem 1rem 3rem; }
          .up__header { padding: 1.25rem; gap: 1rem; }
          .up__xp-panel { border-left: none; padding-left: 0; border-top: 1px solid rgba(0,0,0,0.07); padding-top: 1rem; width: 100%; }
          .up__stats { padding: 1rem; }
          .up__info-grid { grid-template-columns: 1fr; }
          .up__tab { font-size: 0.72rem; gap: 0.3rem; }
          .up__tab svg { width: 16px; height: 16px; }
          .up__lv-grid { grid-template-columns: repeat(3, 1fr); }
          .up__lv-emoji { font-size: 1.5rem; }
          .up__levels-card { padding: 1.25rem 1rem; }
        }
      `}</style>
    </div>
  )
}
