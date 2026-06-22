import { useState } from 'react'
import { useUser } from '../UserContext'

export default function AuthModal({ open, onClose, onSuccess }) {
  const { login, register } = useUser()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const reset = () => { setName(''); setEmail(''); setPassword(''); setError(null) }

  const switchMode = (m) => { setMode(m); reset() }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (mode === 'register' && !name.trim()) return setError('Please enter your name')
    if (!email.includes('@') || !email.includes('.')) return setError('Please enter a valid email address')
    if (password.length < 8) return setError('Password must be at least 8 characters')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(name.trim(), email, password)
      }
      reset()
      onClose()
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="auth-overlay" onClick={onClose} />
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="auth-logo">Nova&apos;s <em>Legacy</em></div>
        <p className="auth-tagline">Join our community of conservation supporters</p>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => switchMode('login')}>
            Sign In
          </button>
          <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => switchMode('register')}>
            Create Account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="auth-field">
              <label>Full name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
                autoComplete="name"
              />
            </div>
          )}
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'Min. 8 characters' : '••••••••'}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {mode === 'register' && (
          <p className="auth-xp-hint">🌿 Create an account and earn XP for every adoption and purchase</p>
        )}
      </div>

      <style>{`
        .auth-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(4px);
        }
        .auth-modal {
          position: fixed; z-index: 10001;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          background: #111;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 2.5rem 2rem;
          width: min(420px, 92vw);
          box-shadow: 0 40px 100px rgba(0,0,0,0.7);
          animation: auth-in 0.28s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes auth-in {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .auth-close {
          position: absolute; top: 1rem; right: 1rem;
          background: none; border: none; color: rgba(255,255,255,0.3);
          font-size: 1rem; cursor: pointer; padding: 0.25rem 0.5rem;
          transition: color 0.2s;
        }
        .auth-close:hover { color: #fff; }
        .auth-logo {
          font-family: var(--serif); font-size: 1.5rem; font-weight: 700;
          color: #fff; text-align: center; margin-bottom: 0.25rem;
        }
        .auth-logo em { font-style: italic; font-weight: 400; color: var(--gold-light); }
        .auth-tagline {
          text-align: center; font-size: 0.78rem;
          color: rgba(255,255,255,0.35); margin-bottom: 1.75rem;
        }
        .auth-tabs {
          display: flex; gap: 0; margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .auth-tab {
          flex: 1; background: none; border: none;
          padding: 0.65rem 0; font-size: 0.82rem; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px; transition: color 0.2s, border-color 0.2s;
        }
        .auth-tab.active { color: var(--gold-light); border-bottom-color: var(--gold-light); }
        .auth-form { display: flex; flex-direction: column; gap: 1rem; }
        .auth-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .auth-field label {
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: rgba(255,255,255,0.4);
        }
        .auth-field input {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; padding: 0.7rem 1rem; color: #fff;
          font-size: 0.9rem; outline: none; transition: border-color 0.2s;
          width: 100%; box-sizing: border-box;
        }
        .auth-field input:focus { border-color: var(--gold-mid); }
        .auth-field input::placeholder { color: rgba(255,255,255,0.2); }
        .auth-error {
          background: rgba(220,50,50,0.15); border: 1px solid rgba(220,50,50,0.3);
          border-radius: 8px; padding: 0.6rem 0.9rem;
          font-size: 0.82rem; color: #ff8080;
        }
        .auth-submit {
          background: var(--gold-light); color: #111;
          border: none; border-radius: 50px;
          padding: 0.8rem; font-size: 0.82rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer; margin-top: 0.5rem;
          transition: background 0.2s, transform 0.2s, opacity 0.2s;
        }
        .auth-submit:hover:not(:disabled) { background: var(--gold-mid); transform: translateY(-1px); }
        .auth-submit:disabled { opacity: 0.5; cursor: default; }
        .auth-xp-hint {
          text-align: center; font-size: 0.78rem;
          color: rgba(255,255,255,0.3); margin-top: 1rem;
        }
      `}</style>
    </>
  )
}
