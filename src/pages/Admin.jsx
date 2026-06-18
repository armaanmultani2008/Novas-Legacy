import { useState, useEffect, useRef } from 'react'
import i18n from '../i18n'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const TABS = ['Blog', 'Shop', 'Animals', 'Content', 'Settings']

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }

// ── localStorage cache ────────────────────────────────────────────────────────
const LS = {
  get: key => { try { return JSON.parse(localStorage.getItem('nl_cms_' + key)) } catch { return null } },
  set: (key, val) => localStorage.setItem('nl_cms_' + key, JSON.stringify(val)),
}

// ── API helpers ───────────────────────────────────────────────────────────────
async function loadCMS() {
  try {
    const r = await fetch(`${API}/api/cms`)
    if (!r.ok) return null
    return await r.json()
  } catch { return null }
}

async function saveCMS(section, data, token) {
  try {
    const r = await fetch(`${API}/api/cms/${section}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    return r.ok ? { ok: true } : { ok: false }
  } catch { return { ok: false } }
}

async function loadContent() {
  try {
    const r = await fetch(`${API}/api/content`)
    if (!r.ok) return null
    const d = await r.json()
    return d && Object.keys(d).length > 0 ? d : null
  } catch { return null }
}

async function saveContent(data, token) {
  try {
    const r = await fetch(`${API}/api/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    return r.ok ? { ok: true } : { ok: false }
  } catch { return { ok: false } }
}

// ── Image compress (client-side, no backend needed) ───────────────────────────
function compressImage(file, maxPx = 1000, quality = 0.82) {
  return new Promise(resolve => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      let w = img.width, h = img.height
      if (w > maxPx) { h = Math.round(h * maxPx / w); w = maxPx }
      if (h > maxPx) { w = Math.round(w * maxPx / h); h = maxPx }
      const c = document.createElement('canvas')
      c.width = w; c.height = h
      c.getContext('2d').drawImage(img, 0, 0, w, h)
      resolve(c.toDataURL('image/jpeg', quality))
      URL.revokeObjectURL(url)
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = `
  *, *::before, *::after { box-sizing: border-box; }
  .adm { min-height: 100vh; background: #F6F3EE; font-family: var(--sans, system-ui, sans-serif); color: #111; }

  /* ── TOP BAR ── */
  .adm-bar {
    position: sticky; top: 0; z-index: 100;
    background: #111;
    display: flex; flex-direction: column;
  }
  .adm-bar-top {
    height: 52px; display: flex; align-items: center;
    padding: 0 1.25rem; gap: 0.75rem;
  }
  .adm-logo {
    font-family: var(--serif, Georgia, serif); font-size: 1.05rem; font-weight: 700;
    color: #fff; white-space: nowrap; cursor: pointer; flex-shrink: 0;
  }
  .adm-logo em { font-style: italic; font-weight: 400; color: var(--gold-light, #E8B84B); margin-left: 3px; }
  .adm-bar-acts { display: flex; gap: 0.4rem; margin-left: auto; flex-shrink: 0; }
  .adm-btn-site {
    background: none; border: 1px solid rgba(255,255,255,0.25);
    color: rgba(255,255,255,0.7); font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.05em; text-transform: uppercase;
    padding: 0.3rem 0.75rem; cursor: pointer; border-radius: 3px;
    transition: all 0.18s; white-space: nowrap;
  }
  .adm-btn-site:hover { border-color: rgba(255,255,255,0.6); color: #fff; }
  .adm-btn-exit {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.45); font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.05em; text-transform: uppercase;
    padding: 0.3rem 0.75rem; cursor: pointer; border-radius: 3px;
    transition: all 0.18s; white-space: nowrap;
  }
  .adm-btn-exit:hover { color: #ff9999; border-color: rgba(255,100,100,0.4); }

  /* Tab row */
  .adm-tabs {
    display: flex; overflow-x: auto; -webkit-overflow-scrolling: touch;
    scrollbar-width: none; border-top: 1px solid rgba(255,255,255,0.07);
    padding: 0 1.25rem;
  }
  .adm-tabs::-webkit-scrollbar { display: none; }
  .adm-tab {
    background: none; border: none; border-bottom: 2px solid transparent;
    color: rgba(255,255,255,0.38); font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 0 1rem; height: 38px; white-space: nowrap;
    cursor: pointer; transition: color 0.18s, border-color 0.18s; flex-shrink: 0;
  }
  .adm-tab:hover { color: rgba(255,255,255,0.75); }
  .adm-tab--on { color: var(--gold-light, #E8B84B); border-bottom-color: var(--gold-light, #E8B84B); }

  /* ── BODY ── */
  .adm-body { max-width: 860px; margin: 0 auto; padding: 1.75rem 1.25rem 3rem; }

  /* banners */
  .adm-offline { background: #FFF8E7; border: 1px solid #F0D080; color: #7A5C00; padding: 0.55rem 0.9rem; font-size: 0.77rem; border-radius: 4px; margin-bottom: 0.9rem; }
  .adm-ok  { background: #EBF5EC; border: 1px solid #B8DFB8; color: #1E6B2E; padding: 0.55rem 0.9rem; font-size: 0.8rem; border-radius: 4px; margin-bottom: 0.8rem; }
  .adm-err { background: #FDF0EE; border: 1px solid #F0C0BA; color: #B03020; padding: 0.55rem 0.9rem; font-size: 0.8rem; border-radius: 4px; margin-bottom: 0.8rem; }

  /* section header */
  .adm-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.1rem; flex-wrap: wrap; gap: 0.5rem; }
  .adm-section-head h2 { font-size: 1rem; font-weight: 700; margin: 0; }

  /* list */
  .adm-list { display: flex; flex-direction: column; gap: 0.45rem; }
  .adm-item {
    display: flex; align-items: center; gap: 0.8rem;
    background: #fff; border: 1px solid #E2D8CC;
    padding: 0.7rem 0.9rem; border-radius: 5px;
    transition: box-shadow 0.15s;
  }
  .adm-item:hover { box-shadow: 0 2px 10px rgba(0,0,0,0.07); }
  .adm-item-thumb {
    width: 56px; height: 44px; flex-shrink: 0;
    background: #EDE5D8; border-radius: 3px; overflow: hidden;
  }
  .adm-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .adm-item-info { flex: 1; min-width: 0; }
  .adm-item-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold, #C8880A); margin-bottom: 0.1rem; }
  .adm-item-name  { font-weight: 600; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .adm-item-meta  { font-size: 0.73rem; color: #888; margin-top: 0.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .adm-item-btns  { display: flex; gap: 0.3rem; flex-shrink: 0; }
  .adm-empty { text-align: center; color: #AAA; font-size: 0.84rem; padding: 2.5rem 0; }

  /* buttons */
  .btn-add {
    background: #111; color: #fff; border: none;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em;
    padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px;
    transition: background 0.18s; white-space: nowrap;
  }
  .btn-add:hover { background: var(--gold, #C8880A); }
  .btn-sm {
    background: #fff; border: 1px solid #D0C9BE; color: #333;
    font-size: 0.7rem; font-weight: 600;
    padding: 0.28rem 0.65rem; cursor: pointer; border-radius: 3px;
    transition: all 0.15s; white-space: nowrap;
  }
  .btn-sm:hover { border-color: #888; color: #111; }
  .btn-del { color: #B03020; border-color: #EAC0BA; }
  .btn-del:hover { background: #FDF0EE; }
  .btn-primary {
    background: #111; color: #fff; border: 1px solid #111;
    font-size: 0.8rem; font-weight: 700;
    padding: 0.6rem 1.4rem; cursor: pointer; border-radius: 4px;
    transition: background 0.18s;
  }
  .btn-primary:hover { background: var(--gold, #C8880A); border-color: var(--gold, #C8880A); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-cancel {
    background: #fff; color: #555; border: 1px solid #D0C9BE;
    font-size: 0.8rem; font-weight: 600;
    padding: 0.6rem 1.2rem; cursor: pointer; border-radius: 4px;
    transition: all 0.15s;
  }
  .btn-cancel:hover { border-color: #999; color: #111; }

  /* modal overlay */
  .adm-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.52); z-index: 200;
    display: flex; align-items: flex-start; justify-content: center;
    padding: 2rem 0.75rem 2rem; overflow-y: auto;
  }
  .adm-modal {
    background: #fff; width: 100%; max-width: 640px;
    border-radius: 6px; box-shadow: 0 24px 64px rgba(0,0,0,0.2);
    margin: auto;
  }
  .adm-modal-top {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.3rem; border-bottom: 1px solid #EDE5D8;
  }
  .adm-modal-top h3 { font-size: 0.92rem; font-weight: 700; margin: 0; }
  .adm-modal-x { background: none; border: none; font-size: 1.15rem; line-height: 1; cursor: pointer; color: #999; padding: 0; }
  .adm-modal-x:hover { color: #333; }
  .adm-modal-body { padding: 1.3rem; }
  .adm-modal-foot { display: flex; justify-content: flex-end; gap: 0.55rem; padding-top: 1.1rem; border-top: 1px solid #EDE5D8; margin-top: 0.5rem; }

  /* forms */
  .adm-field { margin-bottom: 0.85rem; }
  .adm-field label { display: block; font-size: 0.73rem; font-weight: 700; color: #555; letter-spacing: 0.04em; margin-bottom: 0.28rem; }
  .adm-field input, .adm-field textarea, .adm-field select {
    width: 100%; border: 1px solid #D0C8BC;
    padding: 0.52rem 0.75rem; font-size: 0.86rem;
    font-family: inherit; border-radius: 4px;
    background: #FDFBF8; color: #111; outline: none;
    transition: border-color 0.18s;
  }
  .adm-field input:focus, .adm-field textarea:focus { border-color: var(--gold, #C8880A); }
  .adm-field textarea { resize: vertical; }
  .adm-field-hint { font-size: 0.7rem; color: #999; margin-top: 0.22rem; }
  .adm-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

  /* image upload */
  .img-up-wrap { display: flex; flex-direction: column; gap: 0.5rem; }
  .img-up-preview { width: 100%; height: 140px; object-fit: cover; border-radius: 4px; border: 1px solid #EDE5D8; display: block; }
  .img-up-placeholder { width: 100%; height: 90px; background: #F0EBE2; border: 1px dashed #C8B898; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #BBB; font-size: 0.78rem; }
  .img-up-row { display: flex; gap: 0.5rem; align-items: stretch; }
  .img-up-row input { flex: 1; min-width: 0; }
  .btn-upload {
    flex-shrink: 0; background: #fff; border: 1px solid #D0C9BE; color: #333;
    font-size: 0.72rem; font-weight: 700; padding: 0 0.9rem;
    cursor: pointer; border-radius: 4px; transition: all 0.15s;
    display: flex; align-items: center; gap: 0.3rem; white-space: nowrap;
  }
  .btn-upload:hover { border-color: #888; background: #F5F0E8; }
  .img-up-name { font-size: 0.7rem; color: #888; margin-top: 0.15rem; }

  /* settings */
  .adm-settings { max-width: 400px; }
  .adm-settings h3 { font-size: 0.88rem; font-weight: 700; margin: 0 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #EDE5D8; }

  /* login */
  .adm-login { min-height: 100vh; background: #F6F3EE; display: flex; align-items: center; justify-content: center; font-family: var(--sans, system-ui, sans-serif); padding: 2rem 1rem; }
  .adm-login-box { background: #fff; border: 1px solid #E2D8CC; padding: 2.2rem 2rem; width: 100%; max-width: 360px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
  .adm-login-logo { font-family: var(--serif, Georgia, serif); font-size: 1.25rem; font-weight: 700; color: #111; margin-bottom: 1.3rem; }
  .adm-login-logo em { font-style: italic; font-weight: 400; color: var(--gold, #C8880A); }
  .adm-login-box h2 { font-size: 1rem; margin: 0 0 0.25rem; }
  .adm-login-sub { font-size: 0.77rem; color: #999; margin-bottom: 1.3rem; }

  /* animated dots */
  @keyframes dot-up {
    0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
    30%            { opacity: 1;    transform: translateY(-4px); }
  }
  .dots span {
    display: inline-block;
    animation: dot-up 1.1s infinite;
    font-size: 1.1em; line-height: 1;
  }
  .dots span:nth-child(2) { animation-delay: 0.18s; }
  .dots span:nth-child(3) { animation-delay: 0.36s; }

  /* mobile */
  @media (max-width: 540px) {
    .adm-bar-top { padding: 0 1rem; gap: 0.5rem; }
    .adm-logo { font-size: 0.9rem; }
    .adm-btn-site, .adm-btn-exit { font-size: 0.65rem; padding: 0.28rem 0.6rem; }
    .adm-tabs { padding: 0 0.75rem; }
    .adm-tab { font-size: 0.68rem; padding: 0 0.75rem; }
    .adm-body { padding: 1.2rem 0.9rem 3rem; }
    .adm-grid2 { grid-template-columns: 1fr; }
    .adm-item-btns { flex-direction: column; }
    .adm-overlay { padding: 0; align-items: flex-end; }
    .adm-modal { border-radius: 12px 12px 0 0; max-height: 92vh; overflow-y: auto; }
    .adm-login-box { padding: 1.8rem 1.4rem; }
  }
`

function Styles() { return <style>{S}</style> }

function Dots() {
  return <span className="dots"><span>.</span><span>.</span><span>.</span></span>
}

// ── Image upload component ────────────────────────────────────────────────────
function ImageUpload({ value, onChange, label = 'Photo' }) {
  const inputRef = useRef()
  const isBase64 = value?.startsWith('data:')

  const pick = async e => {
    const file = e.target.files[0]
    if (!file) return
    const b64 = await compressImage(file)
    if (b64) onChange(b64)
    e.target.value = ''
  }

  return (
    <div className="adm-field">
      {label && <label>{label}</label>}
      <div className="img-up-wrap">
        {value && !isBase64 && <img src={value} className="img-up-preview" alt="" />}
        <div className="img-up-row">
          {!isBase64
            ? <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder="https://... or upload from device →" />
            : <input value="" readOnly placeholder="[uploaded from device — click to remove]" style={{ color: '#888', fontStyle: 'italic' }} onClick={() => onChange('')} title="Click to remove and use a URL instead" />
          }
          <label className="btn-upload" title="Upload from device">
            + Upload
            <input ref={inputRef} type="file" accept="image/*" onChange={pick} style={{ display: 'none' }} />
          </label>
        </div>
        {isBase64 && <div className="img-up-name">Photo uploaded — click the text field to remove it and use a URL</div>}
      </div>
    </div>
  )
}

// ── Login / Setup ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, goTo }) {
  const [needsSetup, setNeedsSetup] = useState(null)
  // mode: 'login' | 'setup' | 'recover'
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ pw: '', recoveryKey: '', newpw: '', newpwConfirm: '' })
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    fetch(`${API}/api/paypal-config`)
      .then(r => r.json())
      .then(d => { if (d.needsSetup) setMode('setup'); setNeedsSetup(Boolean(d.needsSetup)) })
      .catch(() => setNeedsSetup(false))
  }, [])

  const doSetup = async e => {
    e.preventDefault(); setErr(null); setLoading(true)
    try {
      const r = await fetch(`${API}/api/admin/setup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: f.pw, recoveryKey: f.recoveryKey }),
      })
      const d = await r.json()
      if (d.ok) { setNeedsSetup(false); setMode('login'); setF(p => ({ ...p, pw: '', recoveryKey: '' })) }
      else setErr(d.error || 'Errore')
    } catch { setErr('Server non raggiungibile') }
    setLoading(false)
  }

  const doLogin = async e => {
    e.preventDefault(); setErr(null); setLoading(true)
    try {
      const r = await fetch(`${API}/api/admin/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: f.pw }),
      })
      const d = await r.json()
      if (d.token) onLogin(d.token)
      else setErr(d.error || 'Password errata')
    } catch { setErr('Server non raggiungibile') }
    setLoading(false)
  }

  const doRecover = async e => {
    e.preventDefault(); setErr(null)
    if (f.newpw !== f.newpwConfirm) return setErr('Le password non coincidono.')
    if (f.newpw.length < 8) return setErr('Almeno 8 caratteri.')
    setLoading(true)
    try {
      const r = await fetch(`${API}/api/admin/recover`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryKey: f.recoveryKey, newPassword: f.newpw }),
      })
      const d = await r.json()
      if (d.token) onLogin(d.token)
      else setErr(d.error || 'Errore')
    } catch { setErr('Server non raggiungibile') }
    setLoading(false)
  }

  if (needsSetup === null) return (
    <>
      <Styles />
      <div className="adm-login"><div className="adm-login-box">
        <div className="adm-login-logo">Nova&apos;s <em>Legacy</em></div>
        <p style={{ color: '#999', fontSize: '0.85rem' }}>Connecting<Dots /></p>
      </div></div>
    </>
  )

  return (
    <>
      <Styles />
      <div className="adm-login">
        <div className="adm-login-box">
          <div className="adm-login-logo">Nova&apos;s <em>Legacy</em></div>

          {/* ── SETUP ── */}
          {mode === 'setup' && <>
            <h2>Initial Setup</h2>
            <p className="adm-login-sub">Choose a password and a recovery keyword.</p>
            {err && <div className="adm-err">{err}</div>}
            <form onSubmit={doSetup}>
              <div className="adm-field">
                <label>Password (min. 8 characters)</label>
                <input type="password" value={f.pw} onChange={set('pw')} placeholder="••••••••" required minLength={8} autoFocus />
              </div>
              <div className="adm-field">
                <label>Recovery keyword</label>
                <input type="text" value={f.recoveryKey} onChange={set('recoveryKey')}
                  placeholder="e.g. novalegacy" required minLength={3} autoComplete="off" />
                <div className="adm-field-hint">Used to reset your password if forgotten. Keep it safe.</div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.3rem' }} disabled={loading}>
                {loading ? <Dots /> : 'Set & Sign In'}
              </button>
            </form>
          </>}

          {/* ── LOGIN ── */}
          {mode === 'login' && <>
            <h2>Admin Sign In</h2>
            <p className="adm-login-sub">Internal use only.</p>
            {err && <div className="adm-err">{err}</div>}
            <form onSubmit={doLogin}>
              <div className="adm-field">
                <label>Password</label>
                <input type="password" value={f.pw} onChange={set('pw')} placeholder="••••••••" required autoFocus />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.3rem' }} disabled={loading}>
                {loading ? <Dots /> : 'Sign In'}
              </button>
            </form>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button onClick={() => { setMode('recover'); setErr(null) }}
                style={{ background: 'none', border: 'none', color: '#999', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>
                Forgot password?
              </button>
            </div>
          </>}

          {/* ── RECOVER ── */}
          {mode === 'recover' && <>
            <h2>Password Recovery</h2>
            <p className="adm-login-sub">Enter your recovery keyword to set a new password.</p>
            {err && <div className="adm-err">{err}</div>}
            <form onSubmit={doRecover}>
              <div className="adm-field">
                <label>Recovery keyword</label>
                <input type="text" value={f.recoveryKey} onChange={set('recoveryKey')} placeholder="recovery keyword" required autoComplete="off" autoFocus />
              </div>
              <div className="adm-field">
                <label>New password (min. 8 characters)</label>
                <input type="password" value={f.newpw} onChange={set('newpw')} placeholder="••••••••" required minLength={8} />
              </div>
              <div className="adm-field">
                <label>Confirm new password</label>
                <input type="password" value={f.newpwConfirm} onChange={set('newpwConfirm')} placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.3rem' }} disabled={loading}>
                {loading ? <Dots /> : 'Reset password'}
              </button>
            </form>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button onClick={() => { setMode('login'); setErr(null) }}
                style={{ background: 'none', border: 'none', color: '#999', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>
                Back to sign in
              </button>
            </div>
          </>}

          <div style={{ marginTop: '1.4rem', paddingTop: '1.1rem', borderTop: '1px solid #EDE5D8', textAlign: 'center' }}>
            <button onClick={() => goTo('home')}
              style={{ background: 'none', border: 'none', color: '#AAA', fontSize: '0.75rem', cursor: 'pointer' }}>
              ← Back to site
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

// ── Modal base ────────────────────────────────────────────────────────────────
function Modal({ title, onClose, onSave, saving, children }) {
  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div className="adm-modal-top">
          <h3>{title}</h3>
          <button className="adm-modal-x" onClick={onClose}>x</button>
        </div>
        <div className="adm-modal-body">
          {children}
          <div className="adm-modal-foot">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={onSave} disabled={saving}>
              {saving ? <><Dots /> Salvo</> : 'Salva'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Shared hook per caricare e salvare una sezione CMS ────────────────────────
function useCMS(section, token) {
  const [items, setItems] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    loadCMS().then(d => {
      if (d?.[section]?.length) { setItems(d[section]); LS.set(section, d[section]) }
      else { const cached = LS.get(section); if (cached) setItems(cached); else setItems([]) }
    })
  }, [section])

  const persist = async list => {
    setSaving(true); setMsg(null)
    const { ok } = await saveCMS(section, list, token)
    if (ok) { setItems(list); LS.set(section, list); setMsg('ok') }
    else    { LS.set(section, list); setItems(list); setMsg('local') }
    setSaving(false)
  }

  return { items, saving, msg, persist }
}

// ── Blog tab ──────────────────────────────────────────────────────────────────
function BlogTab({ token }) {
  const { items: posts, saving, msg, persist } = useCMS('blog', token)
  const [editing, setEditing] = useState(null)

  const del = id => { if (!confirm('Delete this post?')) return; persist(posts.filter(p => p.id !== id)) }
  const upsert = post => {
    const list = posts.find(p => p.id === post.id)
      ? posts.map(p => p.id === post.id ? post : p)
      : [...posts, { ...post, id: uid() }]
    persist(list); setEditing(null)
  }

  return (
    <div>
      {msg === 'local' && <div className="adm-offline">Saved locally. Deploy the backend to make changes visible to everyone.</div>}
      {msg === 'ok'    && <div className="adm-ok">Saved to server.</div>}
      <div className="adm-section-head">
        <h2>Blog Posts {posts && <span style={{ fontWeight: 400, color: '#999', fontSize: '0.82rem' }}>({posts.length})</span>}</h2>
        <button className="btn-add" onClick={() => setEditing({})}>+ New Post</button>
      </div>
      {posts === null && <p style={{ color: '#999', fontSize: '0.85rem' }}>Loading<Dots /></p>}
      {posts?.length === 0 && <p className="adm-empty">No posts yet. Add one.</p>}
      <div className="adm-list">
        {posts?.map(p => (
          <div key={p.id} className="adm-item">
            <div className="adm-item-thumb">{p.img && <img src={p.img} alt="" />}</div>
            <div className="adm-item-info">
              <div className="adm-item-label">{p.tag || 'Blog'}{p.date ? ' · ' + p.date : ''}</div>
              <div className="adm-item-name">{p.title}</div>
              <div className="adm-item-meta">{p.excerpt?.slice(0, 80)}{p.excerpt?.length > 80 ? '...' : ''}</div>
            </div>
            <div className="adm-item-btns">
              <button className="btn-sm" onClick={() => setEditing(p)}>Edit</button>
              <button className="btn-sm btn-del" onClick={() => del(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {editing && <BlogForm post={editing} onSave={upsert} onClose={() => setEditing(null)} saving={saving} />}
    </div>
  )
}

function BlogForm({ post, onSave, onClose, saving }) {
  const [f, setF] = useState({
    id: post.id || '', title: post.title || '', tag: post.tag || '',
    date: post.date || '', excerpt: post.excerpt || '', img: post.img || '',
    body: Array.isArray(post.body) ? post.body.join('\n\n') : (post.body || ''),
  })
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  const save = () => {
    if (!f.title.trim()) return alert('Please enter a title.')
    onSave({ ...f, body: f.body.split('\n\n').map(s => s.trim()).filter(Boolean) })
  }
  return (
    <Modal title={f.id ? 'Edit post' : 'New post'} onClose={onClose} onSave={save} saving={saving}>
      <div className="adm-grid2">
        <div className="adm-field"><label>Title *</label><input value={f.title} onChange={set('title')} /></div>
        <div className="adm-field"><label>Tag (e.g. Conservation)</label><input value={f.tag} onChange={set('tag')} /></div>
        <div className="adm-field"><label>Date (e.g. June 11, 2026)</label><input value={f.date} onChange={set('date')} /></div>
      </div>
      <div className="adm-field"><label>Short excerpt</label><textarea rows={2} value={f.excerpt} onChange={set('excerpt')} /></div>
      <ImageUpload label="Cover photo" value={f.img} onChange={v => setF(p => ({ ...p, img: v }))} />
      <div className="adm-field">
        <label>Article body</label>
        <textarea rows={9} value={f.body} onChange={set('body')} />
        <div className="adm-field-hint">Separate paragraphs with a blank line.</div>
      </div>
    </Modal>
  )
}

// ── Shop tab ──────────────────────────────────────────────────────────────────
const SHOP_CATEGORIES = [
  { key: 'tshirts',  label: 'T-Shirts' },
  { key: 'hoodies',  label: 'Hoodies' },
  { key: 'headwear', label: 'Headwear' },
  { key: 'mugs',     label: 'Mugs' },
  { key: 'bottles',  label: 'Bottles' },
  { key: 'other',    label: 'Accessories' },
]

const CATEGORY_RULES_ADMIN = [
  { key: 'tshirts',  match: /t-?shirt|\btee\b/i },
  { key: 'hoodies',  match: /hoodie|sweatshirt|crewneck/i },
  { key: 'headwear', match: /\bcap\b|hat|beanie|bucket|twill/i },
  { key: 'mugs',     match: /\bmug\b|cup/i },
  { key: 'bottles',  match: /bottle|flask/i },
  { key: 'other',    match: /bag|tote|sticker|poster|phone|pillow|print/i },
]

function autoCat(name) {
  for (const r of CATEGORY_RULES_ADMIN) if (r.match.test(name)) return r.key
  return 'other'
}

function ShopTab({ token }) {
  const [products, setProducts] = useState(null)
  const [overrides, setOverrides] = useState({})
  const [localOv, setLocalOv] = useState({})
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setProducts(null); setError(null)
    Promise.all([
      fetch(`${API}/api/printful/products`).then(r => r.json()),
      fetch(`${API}/api/cms`).then(r => r.json()),
    ]).then(([pf, cms]) => {
      if (pf.error) throw new Error(pf.error)
      setProducts(Array.isArray(pf) ? pf : [])
      const ov = cms.productOverrides || {}
      setOverrides(ov)
      setLocalOv(ov)
    }).catch(err => setError(err.message))
  }, [refreshKey])

  const setOv = (id, field, value) =>
    setLocalOv(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))

  const save = async () => {
    setSaving(true); setMsg(null)
    try {
      const r = await fetch(`${API}/api/cms/productOverrides`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(localOv),
      })
      if (r.ok) { setOverrides(localOv); setMsg('ok') }
      else setMsg('error')
    } catch { setMsg('error') }
    setSaving(false)
  }

  const isDirty = JSON.stringify(localOv) !== JSON.stringify(overrides)

  return (
    <div>
      <div className="adm-section-head">
        <h2>
          Shop Products
          {products && <span style={{ fontWeight: 400, color: '#999', fontSize: '0.82rem' }}> ({products.length})</span>}
        </h2>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {msg === 'ok'    && <span style={{ color: '#27ae60', fontSize: '0.82rem' }}>Saved</span>}
          {msg === 'error' && <span style={{ color: '#c0392b', fontSize: '0.82rem' }}>Error saving</span>}
          <button className="btn-sm" onClick={() => setRefreshKey(k => k + 1)}>Refresh</button>
          {isDirty && <button className="btn-add" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>}
          <a href="https://www.printful.com/dashboard/products" target="_blank" rel="noopener noreferrer"
            className="btn-sm" style={{ textDecoration: 'none' }}>Manage on Printful ↗</a>
        </div>
      </div>

      <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: '1.2rem' }}>
        Products sync live from Printful. Change category or hide products below — new products are auto-categorised by name.
      </p>

      {products === null && !error && <p style={{ color: '#999', fontSize: '0.85rem' }}>Loading<Dots /></p>}
      {error && <p style={{ color: '#c0392b', fontSize: '0.85rem' }}>Error: {error}</p>}
      {products?.length === 0 && <p className="adm-empty">No products found in Printful store.</p>}

      <div className="adm-list">
        {products?.map(p => {
          const ov = localOv[p.id] || {}
          const available = ov.available !== false
          const catAuto = autoCat(p.name)
          const catLabel = SHOP_CATEGORIES.find(c => c.key === catAuto)?.label || 'Accessories'
          const minPrice = p.variants?.length ? Math.min(...p.variants.map(v => v.price)) : null
          const maxPrice = p.variants?.length ? Math.max(...p.variants.map(v => v.price)) : null
          const priceLabel = minPrice === maxPrice ? `€${minPrice?.toFixed(2)}` : `€${minPrice?.toFixed(2)} – €${maxPrice?.toFixed(2)}`

          return (
            <div key={p.id} className="adm-item" style={{ opacity: available ? 1 : 0.45, alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div className="adm-item-thumb">
                {p.thumbnail && <img src={p.thumbnail} alt={p.name} />}
              </div>
              <div className="adm-item-info" style={{ flex: 1, minWidth: 0 }}>
                <div className="adm-item-name">{p.name}</div>
                <div className="adm-item-meta">{priceLabel}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                <select
                  value={ov.category || ''}
                  onChange={e => setOv(p.id, 'category', e.target.value || undefined)}
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', borderRadius: 5, border: '1.5px solid #ddd', fontFamily: 'inherit' }}
                >
                  <option value="">Auto: {catLabel}</option>
                  {SHOP_CATEGORIES.map(c => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
                <button
                  className={`btn-sm${available ? '' : ' btn-del'}`}
                  onClick={() => setOv(p.id, 'available', !available)}
                  style={{ minWidth: 80 }}
                >
                  {available ? '● Visible' : '○ Hidden'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Animali tab ───────────────────────────────────────────────────────────────
function AnimaliTab({ token }) {
  const { items: animals, saving, msg, persist } = useCMS('animals', token)
  const [editing, setEditing] = useState(null)

  const del = id => { if (!confirm('Delete this animal?')) return; persist(animals.filter(a => a.id !== id)) }
  const upsert = animal => {
    const list = animals.find(a => a.id === animal.id)
      ? animals.map(a => a.id === animal.id ? animal : a)
      : [...animals, { ...animal, id: uid() }]
    persist(list); setEditing(null)
  }

  return (
    <div>
      {msg === 'local' && <div className="adm-offline">Saved locally. Deploy the backend to make changes visible to everyone.</div>}
      {msg === 'ok'    && <div className="adm-ok">Saved to server.</div>}
      <div className="adm-section-head">
        <h2>Adoption Animals {animals && <span style={{ fontWeight: 400, color: '#999', fontSize: '0.82rem' }}>({animals.length})</span>}</h2>
        <button className="btn-add" onClick={() => setEditing({})}>+ New Animal</button>
      </div>
      {animals === null && <p style={{ color: '#999', fontSize: '0.85rem' }}>Loading<Dots /></p>}
      {animals?.length === 0 && <p className="adm-empty">No animals yet.</p>}
      <div className="adm-list">
        {animals?.map(a => (
          <div key={a.id} className="adm-item">
            <div className="adm-item-thumb">{a.img && <img src={a.img} alt="" />}</div>
            <div className="adm-item-info">
              <div className="adm-item-label">{a.species}</div>
              <div className="adm-item-name">{a.name}</div>
              <div className="adm-item-meta">€{a.price}/month</div>
            </div>
            <div className="adm-item-btns">
              <button className="btn-sm" onClick={() => setEditing(a)}>Modifica</button>
              <button className="btn-sm btn-del" onClick={() => del(a.id)}>Elimina</button>
            </div>
          </div>
        ))}
      </div>
      {editing && <AnimalForm animal={editing} onSave={upsert} onClose={() => setEditing(null)} saving={saving} />}
    </div>
  )
}

function AnimalForm({ animal, onSave, onClose, saving }) {
  const [f, setF] = useState({
    id: animal.id || '', name: animal.name || '',
    species: animal.species || '', price: animal.price ?? '',
    img: animal.img || '',
  })
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  const save = () => {
    if (!f.name.trim()) return alert('Please enter a name.')
    if (!f.price) return alert('Please enter the monthly fee.')
    onSave({ ...f, price: parseFloat(f.price) || 0 })
  }
  return (
    <Modal title={f.id ? 'Edit animal' : 'New animal'} onClose={onClose} onSave={save} saving={saving}>
      <div className="adm-grid2">
        <div className="adm-field"><label>Name *</label><input value={f.name} onChange={set('name')} /></div>
        <div className="adm-field"><label>Species</label><input value={f.species} onChange={set('species')} placeholder="Cheetah" /></div>
        <div className="adm-field">
          <label>Monthly fee (€) *</label>
          <input type="number" min="1" step="1" value={f.price} onChange={set('price')} placeholder="15" />
        </div>
      </div>
      <ImageUpload label="Animal photo" value={f.img} onChange={v => setF(p => ({ ...p, img: v }))} />
    </Modal>
  )
}

// ── Content tab — site-wide text & image editor ────────────────────────────

const CURATED = [
  { key: 'home', label: 'Homepage',
    images: [
      { k: 'home_hero_desktop', l: 'Hero banner Desktop', def: '/img/ghepardo-erba.png' },
      { k: 'home_hero_mobile', l: 'Hero banner Mobile', def: '/img/mother-baby.png' },
      { k: 'home_cta',  l: 'Bottom CTA background', def: '/img/ghepardo-corsa.png' },
      { k: 'home_pillar1', l: 'Pillar 1', def: '/img/madre-cucciolo.png' },
      { k: 'home_pillar2', l: 'Pillar 2', def: '/img/community.png' },
      { k: 'home_pillar3', l: 'Pillar 3', def: '/img/ghepardo-visita-vet.png' },
      { k: 'home_cheetah_run', l: 'Cheetah run Background', def: '/img/ghepardo-corsa2.png' },
      { k: 'home_prog_run', l: 'Project Cheetah Run', def: '/img/ghepardo-corsa-2.png' },
      { k: 'home_prog_volunteer', l: 'Project Volunteer', def: '/img/volontari-lavoro.png' },
      { k: 'home_prog_stay', l: 'Project Stay', def: '/img/chalet-esterno.png' },
      { k: 'home_prog_internship', l: 'Project Internship', def: '/img/volontari-gruppo.png' },
      { k: 'home_adopt', l: 'Project adopt', def: '/img/ghepardo-cucciolo.png' },
      { k: 'home_prog_breed', l: 'Project breed', def: '/img/cucciolata.png' },
    ],
    fields: [
      { k: 'hero_title',    l: 'Hero — main title' },
      { k: 'hero_sub',      l: 'Hero — subtitle' },
      { k: 'work_title',    l: 'Three pillars — title' },
      { k: 'work_desc',     l: 'Three pillars — text' },
      { k: 'pillar1_title', l: 'Pillar 1 — title' },
      { k: 'pillar1_desc',  l: 'Pillar 1 — text' },
      { k: 'pillar2_title', l: 'Pillar 2 — title' },
      { k: 'pillar2_desc',  l: 'Pillar 2 — text' },
      { k: 'pillar3_title', l: 'Pillar 3 — title' },
      { k: 'pillar3_desc',  l: 'Pillar 3 — text' },
      { k: 'cta_title',     l: 'CTA — title' },
      { k: 'cta_desc',      l: 'CTA — text' },
      { k: 'contact_desc',  l: 'Contact section — intro text' },
    ]},
  { key: 'nova_story', label: "Nova's Story",
    images: [
      { k: 'nova_story_hero', l: 'Hero image', def: '/img/nova-madre-cucciolo.png' },
    ],
    fields: [
      { k: 'hero_label',    l: 'Small label (above title)' },
      { k: 'hero_title',    l: 'Hero title' },
      { k: 'hero_sub',      l: 'Hero subtitle' },
      { k: 'origins_title', l: 'Origins — section title' },
      { k: 'origins_p1',    l: 'Origins — paragraph 1' },
      { k: 'origins_p2',    l: 'Origins — paragraph 2' },
      { k: 'highlight',     l: 'Highlighted quote' },
      { k: 'legacy_title',  l: "Legacy — section title" },
      { k: 'legacy_p1',     l: 'Legacy — paragraph 1' },
      { k: 'legacy_p2',     l: 'Legacy — paragraph 2' },
    ]},
  { key: 'kim_story', label: "Kim's Story",
    images: [
      { k: 'kim_story_hero', l: 'Hero image', def: '/img/kim-savana.svg' },
    ],
    fields: [
      { k: 'hero_label',    l: 'Small label' },
      { k: 'hero_title',    l: 'Title' },
      { k: 'hero_sub',      l: 'Subtitle' },
      { k: 'p1',            l: 'Main text' },
      { k: 'quote1',        l: 'Quote 1' },
      { k: 'quote2',        l: 'Quote 2' },
      { k: 'quote3',        l: 'Quote 3' },
    ]},
  { key: 'conservation', label: 'Conservation',
    images: [
      { k: 'conservation_hero', l: 'Hero image', def: '/img/due-ghepardi.png' },
    ],
    fields: [
      { k: 'hero_label',    l: 'Small label' },
      { k: 'hero_title',    l: 'Title' },
      { k: 'hero_sub',      l: 'Subtitle' },
      { k: 'mission_p',     l: 'Mission — text' },
      { k: 'highlight',     l: 'Highlighted quote' },
      { k: 'edu_title',     l: 'Education — title' },
      { k: 'edu_p1',        l: 'Education — paragraph 1' },
      { k: 'edu_p2',        l: 'Education — paragraph 2' },
      { k: 'science_title', l: 'Scientific research — title' },
      { k: 'science_p',     l: 'Scientific research — text' },
    ]},
  { key: 'volunteer', label: 'Volunteering',
    images: [
      { k: 'volunteer_hero', l: 'Hero image', def: '/img/vol-volontari-1.jpg' },
    ],
    fields: [
      { k: 'hero_label',    l: 'Small label' },
      { k: 'hero_title',    l: 'Title' },
      { k: 'hero_sub',      l: 'Subtitle' },
      { k: 'what_p1',       l: 'What it means — paragraph 1' },
      { k: 'what_p2',       l: 'What it means — paragraph 2' },
      { k: 'highlight',     l: 'Highlighted box' },
      { k: 'apply_title',   l: 'How to apply — title' },
      { k: 'apply_text',    l: 'How to apply — text' },
    ]},
  { key: 'visit', label: 'Stay & Visits',
    images: [
      { k: 'visit_hero', l: 'Hero image', def: '/img/chalet-esterno.png' },
    ],
    fields: [
      { k: 'hero_label',    l: 'Small label' },
      { k: 'hero_title',    l: 'Title' },
      { k: 'hero_sub',      l: 'Subtitle' },
      { k: 'chalets_title', l: 'Chalets — title' },
      { k: 'chalets_p',     l: 'Chalets — text' },
      { k: 'highlight',     l: 'Highlighted box (best season etc.)' },
      { k: 'how_p1',        l: 'How to get there — paragraph 1' },
      { k: 'how_p2',        l: 'How to get there — paragraph 2' },
    ]},
  { key: 'horses', label: 'Horse Project',
    images: [
      { k: 'horses_hero', l: 'Hero image', def: '/img/cavallo-puledro.png' },
    ],
    fields: [
      { k: 'hero_label',    l: 'Small label' },
      { k: 'hero_title',    l: 'Title' },
      { k: 'hero_sub',      l: 'Subtitle' },
      { k: 'who_p1',        l: 'Our horses — paragraph 1' },
      { k: 'who_p2',        l: 'Our horses — paragraph 2' },
      { k: 'highlight',     l: 'Highlighted box' },
      { k: 'vol_p1',        l: 'What volunteers do — paragraph 1' },
    ]},
  { key: 'cheetah_run', label: 'Cheetah Run',
    images: [
      { k: 'cheetah_run_hero', l: 'Hero / slideshow first image', def: '/img/ghepardo-corsa.png' },
    ],
    fields: [
      { k: 'hero_label',        l: 'Small label' },
      { k: 'hero_title',        l: 'Title' },
      { k: 'hero_sub',          l: 'Subtitle' },
      { k: 'p1',                l: 'Main text' },
      { k: 'highlight',         l: 'Highlighted box' },
      { k: 'how_p1',            l: 'How it works — paragraph 1' },
      { k: 'how_p2',            l: 'How it works — paragraph 2' },
      { k: 'booking_highlight', l: 'Booking info text' },
    ]},
  { key: 'donate', label: 'Donations',
    images: [],
    fields: [
      { k: 'hero_label',    l: 'Small label' },
      { k: 'hero_title',    l: 'Title' },
      { k: 'hero_sub',      l: 'Subtitle' },
      { k: 'section_title', l: 'Section title' },
    ]},
  { key: 'footer', label: 'Footer',
    images: [],
    fields: [
      { k: 'brand_desc', l: 'Brand description' },
      { k: 'copyright',  l: 'Copyright line' },
      { k: 'reg',        l: 'Legal info (reg. number)' },
    ]},
  { key: 'nav', label: 'Navigation',
    images: [],
    fields: [
      { k: 'home',           l: 'Home' },
      { k: 'about_us',       l: 'About Us (menu label)' },
      { k: 'nova_story',     l: '  ↳ Nova\'s Story' },
      { k: 'kim_story',      l: '  ↳ Kim\'s Story' },
      { k: 'our_mission',    l: 'Our Mission (menu label)' },
      { k: 'cheetah_project', l: '  ↳ Cheetah Project' },
      { k: 'horses',         l: '  ↳ Horse Project' },
      { k: 'get_involved',   l: 'Get Involved (menu label)' },
      { k: 'volunteer',      l: '  ↳ Volunteering' },
      { k: 'internship',     l: '  ↳ Internship' },
      { k: 'stay',           l: '  ↳ Stay' },
      { k: 'cheetah_run',    l: '  ↳ Cheetah Run' },
      { k: 'blog',           l: 'Blog' },
      { k: 'shop',           l: 'Shop' },
      { k: 'support_us',     l: 'Support Us (menu label)' },
      { k: 'donations',      l: '  ↳ Donations' },
      { k: 'wishlist',       l: '  ↳ Wishlist' },
      { k: 'adopt_animal',   l: '  ↳ Adopt an Animal' },
      { k: 'become_volunteer', l: 'CTA button (top right)' },
    ]},
]

function TextField({ label, value, onChange }) {
  const long = typeof value === 'string' && value.length > 100
  return (
    <div className="adm-field">
      <label>{label}</label>
      {long
        ? <textarea rows={Math.min(Math.ceil(value.length / 80) + 1, 7)} value={value} onChange={e => onChange(e.target.value)} />
        : <input value={value || ''} onChange={e => onChange(e.target.value)} />
      }
    </div>
  )
}

function ContentTab({ token }) {
  const [content, setContent] = useState(null)
  const [secIdx,  setSecIdx]  = useState(0)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState(null)

  useEffect(() => {
    const cached = (() => { try { return JSON.parse(localStorage.getItem('nl_content')) } catch { return null } })()
    if (cached && Object.keys(cached).length) setContent(cached)
    loadContent().then(d => {
      if (d && Object.keys(d).length) {
        setContent(d)
        localStorage.setItem('nl_content', JSON.stringify(d))
      } else if (!cached) {
        const builtin = i18n.getDataByLanguage('en')?.translation || {}
        setContent(Object.keys(builtin).length ? builtin : {})
      }
    })
  }, [])

  const sec = CURATED[secIdx]

  const updateField = (fieldKey, value) =>
    setContent(prev => ({ ...prev, [sec.key]: { ...(prev?.[sec.key] || {}), [fieldKey]: value } }))

  const updateImage = (imgKey, value) =>
    setContent(prev => ({ ...prev, _images: { ...(prev?._images || {}), [imgKey]: value } }))

  const save = async () => {
    setSaving(true); setMsg(null)
    const payload = content || {}
    const { ok } = await saveContent(payload, token)
    if (ok) {
      i18n.addResourceBundle('en', 'translation', payload, true, true)
      localStorage.setItem('nl_content', JSON.stringify(payload))
      setMsg('ok')
    } else {
      localStorage.setItem('nl_content', JSON.stringify(payload))
      i18n.addResourceBundle('en', 'translation', payload, true, true)
      setMsg('local')
    }
    setSaving(false)
  }

  const secData = content?.[sec.key] || {}
  const cmsImgs = content?._images  || {}

  return (
    <div>
      {msg === 'ok'    && <div className="adm-ok">Saved to server. The site will update automatically.</div>}
      {msg === 'local' && <div className="adm-offline">Saved locally. Visible immediately in this browser. Deploy the backend to make it permanent for everyone.</div>}

      {/* Page tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CURATED.map((s, i) => (
          <button key={s.key} onClick={() => { setSecIdx(i); setMsg(null) }}
            style={{
              background: secIdx === i ? '#111' : '#fff',
              color: secIdx === i ? '#fff' : '#555',
              border: `1px solid ${secIdx === i ? '#111' : '#D0C9BE'}`,
              borderRadius: 4, padding: '0.35rem 0.75rem',
              fontSize: '0.75rem', fontWeight: secIdx === i ? 700 : 400,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
            {s.label}
          </button>
        ))}
      </div>

      {content === null && <p style={{ color: '#999', fontSize: '0.85rem' }}>Loading<Dots /></p>}

      {content !== null && (
        <div style={{ background: '#fff', border: '1px solid #E2D8CC', borderRadius: 6, padding: '1.3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.4rem' }}>
            <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{sec.label}</h2>
            <button className="btn-primary" onClick={save} disabled={saving}>
              {saving ? <><Dots /> Saving</> : 'Save changes'}
            </button>
          </div>

          {/* Images grid */}
          {sec.images.length > 0 && (
            <div style={{ marginBottom: '1.4rem', paddingBottom: '1.4rem', borderBottom: '1px solid #EDE5D8' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#AAA', marginBottom: '0.8rem' }}>
                Images
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {sec.images.map(({ k, l, def }) => {
                  const current = cmsImgs[k] || def
                  return (
                    <div key={k} style={{ background: '#F8F5F0', border: '1px solid #EDE5D8', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ position: 'relative', height: 120 }}>
                        <img src={current} alt={l}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        {cmsImgs[k] && (
                          <button onClick={() => updateImage(k, '')}
                            title="Remove custom image (restore default)"
                            style={{
                              position: 'absolute', top: 6, right: 6,
                              background: 'rgba(0,0,0,0.55)', border: 'none',
                              color: '#fff', borderRadius: '50%', width: 22, height: 22,
                              fontSize: '0.75rem', cursor: 'pointer', lineHeight: 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>×</button>
                        )}
                      </div>
                      <div style={{ padding: '0.6rem 0.7rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#555', marginBottom: '0.45rem' }}>{l}</div>
                        <ImageUpload label="" value={cmsImgs[k] || ''} onChange={v => updateImage(k, v)} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Text fields */}
          {sec.fields.length > 0 && (
            <>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#AAA', marginBottom: '0.8rem' }}>
                Text
              </div>
              {sec.fields.map(({ k, l }) => (
                <TextField key={k} label={l} value={secData[k] || ''} onChange={v => updateField(k, v)} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Settings tab ──────────────────────────────────────────────────────────────
function SettingsTab({ token }) {
  const [f, setF] = useState({ current: '', newpw: '', confirm: '', newKey: '' })
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  const [logIdInput, setLogIdInput] = useState('')
  const [securityMsg, setSecurityMsg] = useState(null)
  const [securityLoading, setSecurityLoading] = useState(false)

  const change = async e => {
    e.preventDefault(); setMsg(null)
    if (f.newpw !== f.confirm) return setMsg({ err: 'Passwords do not match.' })
    if (f.newpw.length < 8) return setMsg({ err: 'Password must be at least 8 characters.' })
    setLoading(true)
    try {
      const body = { current: f.current, newPassword: f.newpw }
      if (f.newKey.trim().length >= 3) body.newRecoveryKey = f.newKey.trim()
      const r = await fetch(`${API}/api/admin/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const d = await r.json()
      if (d.ok) {
        const note = f.newKey.trim().length >= 3 ? ' and recovery keyword updated.' : ' updated.'
        setMsg({ ok: 'Password' + note + ' Changes are permanent.' })
        setF({ current: '', newpw: '', confirm: '', newKey: '' })
      } else setMsg({ err: d.error || 'Error.' })
    } catch { setMsg({ err: 'Server unreachable.' }) }
    setLoading(false)
  }

  const handleBanUser = async (e) => {
    e.preventDefault()
    if (!logIdInput.trim()) return

    setSecurityLoading(true)
    setSecurityMsg(null)

    try {
      const res = await fetch(`${API}/api/admin/blacklist-by-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ logId: logIdInput.trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        setSecurityMsg({ ok: data.message || 'The IP adress of the user has been inserted in blacklist.' })
        setLogIdInput('')
      } else {
        setSecurityMsg({ err: data.error || 'An Error occured during the Block operation.' })
      }
    } catch {
      setSecurityMsg({ err: 'Server unreachable.' })
    } finally {
      setSecurityLoading(false)
    }
  }

  return (
      <div className="adm-settings">
        <div className="adm-section-head" style={{ marginBottom: '1.3rem' }}><h2>Settings</h2></div>

        <h3>Change password</h3>
        {msg?.ok  && <div className="adm-ok">{msg.ok}</div>}
        {msg?.err && <div className="adm-err">{msg.err}</div>}
        <form onSubmit={change} style={{ marginBottom: '2.5rem' }}>
          <div className="adm-field"><label>Current password</label>
            <input type="password" value={f.current} onChange={set('current')} required placeholder="••••••••" /></div>
          <div className="adm-field"><label>New password (min. 8 characters)</label>
            <input type="password" value={f.newpw} onChange={set('newpw')} required minLength={8} placeholder="••••••••" /></div>
          <div className="adm-field"><label>Confirm new password</label>
            <input type="password" value={f.confirm} onChange={set('confirm')} required placeholder="••••••••" /></div>
          <div className="adm-field">
            <label>New recovery keyword (optional)</label>
            <input type="text" value={f.newKey} onChange={set('newKey')} placeholder="leave empty to keep current" autoComplete="off" />
            <div className="adm-field-hint">Used to recover access if you forget your password.</div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Dots /> : 'Save changes'}
          </button>
        </form>

        <h3 style={{ color: '#b03020' }}>Anti-Spam Security</h3>
        <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: '1.4', marginBottom: '1rem' }}>
          Paste here the numeric/alphanumeric code present in the red box at the end of the spam/hate email received. The server will search for the IP address connected to the user who sent it, banning him instanstly.
        </p>

        {securityMsg?.ok  && <div className="adm-ok">{securityMsg.ok}</div>}
        {securityMsg?.err && <div className="adm-err">{securityMsg.err}</div>}

        <form onSubmit={handleBanUser} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <div className="adm-field" style={{ flex: 1, marginBottom: 0 }}>
            <input
                type="text"
                placeholder="Esempio: 666ff45c92ba3c11..."
                value={logIdInput}
                onChange={(e) => setLogIdInput(e.target.value)}
                disabled={securityLoading}
                style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}
                required
            />
          </div>
          <button
              type="submit"
              className="btn-primary"
              style={{ background: '#b03020', borderColor: '#b03020', padding: '0.52rem 1.2rem', fontSize: '0.83rem' }}
              disabled={securityLoading || !logIdInput.trim()}
          >
            {securityLoading ? <Dots /> : 'Block IP'}
          </button>
        </form>
      </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Admin({ goTo }) {
  const [token, setToken] = useState(() => localStorage.getItem('nl_admin_token') || '')
  const [tab, setTab] = useState(0)

  const login = t => { localStorage.setItem('nl_admin_token', t); setToken(t) }
  const logout = () => { localStorage.removeItem('nl_admin_token'); setToken(''); goTo('home') }

  if (!token) return <LoginScreen onLogin={login} goTo={goTo} />

  return (
    <>
      <Styles />
      <div className="adm">
        <div className="adm-bar">
          <div className="adm-bar-top">
            <div className="adm-logo">Nova&apos;s <em>Legacy</em></div>
            <div className="adm-bar-acts">
              <button className="adm-btn-site" onClick={() => goTo('home')}>← Site</button>
              <button className="adm-btn-exit" onClick={logout}>Sign out</button>
            </div>
          </div>
          <div className="adm-tabs">
            {TABS.map((t, i) => (
              <button key={t} className={`adm-tab${tab === i ? ' adm-tab--on' : ''}`} onClick={() => setTab(i)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="adm-body">
          {tab === 0 && <BlogTab     token={token} />}
          {tab === 1 && <ShopTab token={token} />}
          {tab === 2 && <AnimaliTab  token={token} />}
          {tab === 3 && <ContentTab  token={token} />}
          {tab === 4 && <SettingsTab token={token} />}
        </div>
      </div>
    </>
  )
}
