import { useState, useEffect, useRef } from 'react'
import i18n from '../i18n'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const TABS = ['Blog', 'Shop', 'Animals', 'Our Animals', 'Content', 'Settings']

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }

const LS = {
  get: key => { try { return JSON.parse(localStorage.getItem('nl_cms_' + key)) } catch { return null } },
  set: (key, val) => localStorage.setItem('nl_cms_' + key, JSON.stringify(val)),
}

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
    if (r.status === 401) return { ok: false, expired: true }
    return { ok: r.ok }
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

async function uploadImage(dataUrl, token) {
  const r = await fetch(`${API}/api/admin/upload-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ image: dataUrl }),
  })
  if (!r.ok) throw new Error('Upload failed')
  const { url } = await r.json()
  return url
}

async function saveContent(data, token) {
  try {
    const r = await fetch(`${API}/api/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    if (r.status === 401) return { ok: false, expired: true }
    return { ok: r.ok }
  } catch { return { ok: false } }
}

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

  /* array fields (repeatable list/object editor) */
  .adm-arr { display: flex; flex-direction: column; gap: 0.5rem; }
  .adm-arr-row { display: flex; gap: 0.6rem; align-items: flex-start; background: #FDFBF8; border: 1px solid #EDE5D8; border-radius: 4px; padding: 0.6rem; }
  .adm-arr-row-main { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; min-width: 0; }
  .adm-arr-row-btns { display: flex; gap: 0.3rem; flex-shrink: 0; }
  .adm-arr-row-btns .btn-sm:disabled { opacity: 0.35; cursor: not-allowed; }

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

function ImageUpload({ value, onChange, token, label = 'Photo' }) {
  const inputRef = useRef()
  const [uploading, setUploading] = useState(false)
  const isBase64 = value?.startsWith('data:')

  const pick = async e => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const b64 = await compressImage(file)
      if (b64) onChange(await uploadImage(b64, token))
    } catch {
      alert('Image upload failed. Please try again.')
    }
    setUploading(false)
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
            {uploading ? 'Uploading…' : '+ Upload'}
            <input ref={inputRef} type="file" accept="image/*" onChange={pick} disabled={uploading} style={{ display: 'none' }} />
          </label>
        </div>
        {isBase64 && <div className="img-up-name">Photo uploaded — click the text field to remove it and use a URL</div>}
      </div>
    </div>
  )
}

function LoginScreen({ onLogin, goTo, sessionExpired }) {
  const [needsSetup, setNeedsSetup] = useState(null)
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

          {mode === 'login' && <>
            <h2>Admin Sign In</h2>
            <p className="adm-login-sub">Internal use only.</p>
            {sessionExpired && <div className="adm-err">Your session expired. Please sign in again.</div>}
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

function useCMS(section, token, onExpired, listKey) {
  const [items, setItems] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    loadCMS().then(d => {
      const raw = listKey ? d?.[section]?.[listKey] : d?.[section]
      if (raw?.length) { setItems(raw); LS.set(section, raw) }
      else { const cached = LS.get(section); if (cached) setItems(cached); else setItems([]) }
    })
  }, [section, listKey])

  const persist = async list => {
    setSaving(true); setMsg(null)
    LS.set(section, list)
    const { ok, expired } = await saveCMS(section, list, token)
    if (expired) { onExpired(); return }
    setItems(list)
    setMsg(ok ? 'ok' : 'local')
    setSaving(false)
  }

  return { items, saving, msg, persist }
}

function BlogTab({ token, onExpired }) {
  const { items: posts, saving, msg, persist } = useCMS('blog', token, onExpired, 'posts')
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
      {editing && <BlogForm post={editing} onSave={upsert} onClose={() => setEditing(null)} saving={saving} token={token} />}
    </div>
  )
}

function BlogForm({ post, onSave, onClose, saving, token }) {
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
      <ImageUpload label="Cover photo" value={f.img} onChange={v => setF(p => ({ ...p, img: v }))} token={token} />
      <div className="adm-field">
        <label>Article body</label>
        <textarea rows={9} value={f.body} onChange={set('body')} />
        <div className="adm-field-hint">Separate paragraphs with a blank line.</div>
      </div>
    </Modal>
  )
}

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

function AnimaliTab({ token, onExpired }) {
  const { items: animals, saving, msg, persist } = useCMS('animals', token, onExpired)
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
      {editing && <AnimalForm animal={editing} onSave={upsert} onClose={() => setEditing(null)} saving={saving} token={token} />}
    </div>
  )
}

function AnimalForm({ animal, onSave, onClose, saving, token }) {
  const [f, setF] = useState({
    id: animal.id || '', name: animal.name || '',
    species: animal.species || '', price: animal.price ?? '',
    img: animal.img || '', bio: animal.bio || '', extraImages: animal.extraImages || (animal.extraImg ? [animal.extraImg] : []),
  })
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  const save = () => {
    if (!f.name.trim()) return alert('Please enter a name.')
    if (!f.price) return alert('Please enter the monthly fee.')
    onSave({ ...f, price: parseFloat(f.price) || 0 })
  }
  const addImageSlot = () => {
    setF(p => ({
      ...p,
      extraImages: [...p.extraImages, '']
    }))
  }
  const handleExtraImageChange = (index, value) => {
    setF(p => {
      const updatedImages = [...p.extraImages]
      updatedImages[index] = value
      return {...p, extraImages: updatedImages}
    })
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
      <ImageUpload label="Animal photo" value={f.img} onChange={v => setF(p => ({ ...p, img: v }))} token={token} />
      <div className="adm-field">
        <label>Story / bio (shown when visitors click the photo)</label>
        <textarea rows={4} value={f.bio} onChange={set('bio')} placeholder="A short story about this animal…" />
      </div>
      {f.extraImages.map((imgUrl, index) => (
          <ImageUpload
              key={index}
              label={`Extra Photo #${index + 1} (optional, shown in story popup)`}
              value={imgUrl}
              onChange={v => handleExtraImageChange(index, v)}
              token={token}
          />
      ))}
      <div className="adm-field" style={{ marginTop: '0.5rem' }}>
        <button type="button" className="btn btn-outline-dark btn-sm" onClick={addImageSlot}>
          + Add another photo
        </button>
      </div>
    </Modal>
  )
}

const OUR_ANIMALS_SPECIES = [
  { value: 'cheetahs',             label: 'Cheetahs' },
  { value: 'lions',                label: 'Lions' },
  { value: 'tigers',               label: 'Tigers' },
  { value: 'servals',              label: 'Servals' },
  { value: 'caracals',             label: 'Caracals' },
  { value: 'civets',               label: 'Civets' },
  { value: 'porcupines',           label: 'Porcupines' },
  { value: 'bat_eared_foxes',      label: 'Bat-Eared Foxes' },
  { value: 'horses',               label: 'Horses' },
  { value: 'cows',                 label: 'Cows' },
  { value: 'pets',                 label: 'Pets' },
  { value: 'birds',                label: 'Birds' },
  { value: 'jackals',              label: 'Jackals' },
  { value: 'free_roaming_animals', label: 'Free-Roaming Animals' },
]

function OurAnimalsTab({ token, onExpired }) {
  const { items: animals, saving, msg, persist } = useCMS('ourAnimals', token, onExpired)
  const [editing, setEditing] = useState(null)

  const del = id => { if (!confirm('Delete this animal?')) return; persist(animals.filter(a => a.id !== id)) }
  const upsert = animal => {
    const list = animals.find(a => a.id === animal.id)
      ? animals.map(a => a.id === animal.id ? animal : a)
      : [...animals, { ...animal, id: uid() }]
    persist(list); setEditing(null)
  }
  const speciesLabel = v => OUR_ANIMALS_SPECIES.find(s => s.value === v)?.label || v

  return (
    <div>
      {msg === 'local' && <div className="adm-offline">Saved locally. Deploy the backend to make changes visible to everyone.</div>}
      {msg === 'ok'    && <div className="adm-ok">Saved to server.</div>}
      <div className="adm-section-head">
        <h2>Our Animals {animals && <span style={{ fontWeight: 400, color: '#999', fontSize: '0.82rem' }}>({animals.length})</span>}</h2>
        <button className="btn-add" onClick={() => setEditing({})}>+ New Animal</button>
      </div>
      <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: '1rem' }}>
        These are the individual animals shown scrolling under each species on the public "Our Animals" page. If none are added for a species yet, a set of bundled defaults is shown instead — add one here to replace them.
      </p>
      {animals === null && <p style={{ color: '#999', fontSize: '0.85rem' }}>Loading<Dots /></p>}
      {animals?.length === 0 && <p className="adm-empty">No animals yet — the public page is showing its bundled defaults.</p>}
      <div className="adm-list">
        {animals?.map(a => (
          <div key={a.id} className="adm-item">
            <div className="adm-item-thumb">{a.img && <img src={a.img} alt="" />}</div>
            <div className="adm-item-info">
              <div className="adm-item-label">{speciesLabel(a.species)}</div>
              <div className="adm-item-name">{a.name}</div>
              <div className="adm-item-meta">{a.role}</div>
            </div>
            <div className="adm-item-btns">
              <button className="btn-sm" onClick={() => setEditing(a)}>Edit</button>
              <button className="btn-sm btn-del" onClick={() => del(a.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {editing && <OurAnimalForm animal={editing} onSave={upsert} onClose={() => setEditing(null)} saving={saving} token={token} />}
    </div>
  )
}

function OurAnimalForm({ animal, onSave, onClose, saving, token }) {
  const [f, setF] = useState({
    id: animal.id || '', name: animal.name || '',
    species: animal.species || OUR_ANIMALS_SPECIES[0].value,
    role: animal.role || '', img: animal.img || '', bio: animal.bio || '', extraImages: animal.extraImages || (animal.extraImg ? [animal.extraImg]: []) || '',
  })
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  const save = () => {
    if (!f.name.trim()) return alert('Please enter a name.')
    onSave(f)
  }
  const addImageSlot = () => {
    setF(p => ({
      ...p,
      extraImages: [...p.extraImages, '']
    }))
  }
  const handleExtraImageChange = (index, value) => {
    setF(p => {
      const updatedImages = [...p.extraImages]
      updatedImages[index] = value
      return {...p, extraImages: updatedImages}
    })
  }
  return (
    <Modal title={f.id ? 'Edit animal' : 'New animal'} onClose={onClose} onSave={save} saving={saving}>
      <div className="adm-grid2">
        <div className="adm-field"><label>Name *</label><input value={f.name} onChange={set('name')} /></div>
        <div className="adm-field">
          <label>Species *</label>
          <select value={f.species} onChange={set('species')}>
            {OUR_ANIMALS_SPECIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div className="adm-field"><label>Role / caption (shown under the name)</label><input value={f.role} onChange={set('role')} placeholder="Cheetah · The Founder" /></div>
      <ImageUpload label="Animal photo" value={f.img} onChange={v => setF(p => ({ ...p, img: v }))} token={token} />
      <div className="adm-field">
        <label>Story / bio (shown when visitors click the photo)</label>
        <textarea rows={4} value={f.bio} onChange={set('bio')} placeholder="A short story about this animal…" />
      </div>
      {f.extraImages.map((imgUrl, index) => (
          <ImageUpload
          key={index}
          label={`Extra Photo #${index + 1} (optional, shown in story popup)`}
          value={imgUrl}
          onChange={v => handleExtraImageChange(index, v)}
          token={token}
          />
      ))}
      <div className={"adm-field"} style={{marginTop: '0.5rem'}}>
        <button
          type="button"
          className={"btn btn-outline-dark btn-sm"}
          onClick={addImageSlot}
          >
          + Add another photo
        </button>
      </div>
    </Modal>
  )
}


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
      { k: 'hero_eyebrow',  l: 'Hero — small label above title' },
      { k: 'hero_title',    l: 'Hero — main title' },
      { k: 'hero_sub',      l: 'Hero — subtitle' },
      { k: 'btn_volunteer', l: 'Hero — "Become a volunteer" button' },
      { k: 'btn_discover',  l: 'Hero — "Discover Nova\'s story" button' },
      { k: 'stat_cheetahs',   l: 'Hero stats — cheetahs remaining label' },
      { k: 'stat_reserve',    l: 'Hero stats — reserve size label' },
      { k: 'stat_animals',    l: 'Hero stats — animals hosted label' },
      { k: 'stat_volunteers', l: 'Hero stats — volunteers/year label' },
      { k: 'alert_tag',           l: 'Alert bar — tag' },
      { k: 'alert_body_1',        l: 'Alert bar — text part 1' },
      { k: 'alert_body_strong1',  l: 'Alert bar — bold part 1' },
      { k: 'alert_body_2',        l: 'Alert bar — text part 2' },
      { k: 'alert_body_strong2',  l: 'Alert bar — bold part 2' },
      { k: 'alert_body_3',        l: 'Alert bar — text part 3' },
      { k: 'alert_btn',           l: 'Alert bar — button' },
      { k: 'work_label',    l: 'Three pillars — small label' },
      { k: 'work_title',    l: 'Three pillars — title' },
      { k: 'work_desc',     l: 'Three pillars — text' },
      { k: 'pillar1_title', l: 'Pillar 1 — title' },
      { k: 'pillar1_desc',  l: 'Pillar 1 — text' },
      { k: 'pillar2_title', l: 'Pillar 2 — title' },
      { k: 'pillar2_desc',  l: 'Pillar 2 — text' },
      { k: 'pillar3_title', l: 'Pillar 3 — title' },
      { k: 'pillar3_desc',  l: 'Pillar 3 — text' },
      { k: 'run_label',       l: 'Cheetah Run banner — small label' },
      { k: 'run_title',       l: 'Cheetah Run banner — title' },
      { k: 'run_desc',        l: 'Cheetah Run banner — text' },
      { k: 'run_speed_label', l: 'Cheetah Run banner — "km/h" caption' },
      { k: 'run_btn',         l: 'Cheetah Run banner — button' },
      { k: 'programs_label', l: 'Programs grid — small label' },
      { k: 'programs_title', l: 'Programs grid — title' },
      { k: 'prog_tags',   l: 'Programs grid — tags (one per card)', arrayShape: 'string' },
      { k: 'prog_titles', l: 'Programs grid — titles (one per card)', arrayShape: 'string' },
      { k: 'prog_descs',  l: 'Programs grid — descriptions (one per card)', arrayShape: 'string' },
      { k: 'animals_label', l: 'Species section — small label' },
      { k: 'animals_title', l: 'Species section — title' },
      { k: 'animals_desc',  l: 'Species section — text'},
      { k: 'cta_label', l: 'Bottom CTA — small label' },
      { k: 'cta_title', l: 'CTA — title' },
      { k: 'cta_desc',  l: 'CTA — text' },
      { k: 'cta_btn1',  l: 'CTA — first button (Adopt)' },
      { k: 'cta_btn2',  l: 'CTA — second button (Volunteer)' },
      { k: 'contact_label', l: 'Contact section — small label' },
      { k: 'contact_title', l: 'Contact section — title' },
      { k: 'contact_desc',  l: 'Contact section — intro text' },
      { k: 'contact_email_label',   l: 'Contact section — email field label' },
      { k: 'contact_phone_label',   l: 'Contact section — phone field label' },
      { k: 'contact_address_label', l: 'Contact section — address field label' },
      { k: 'form_name',    l: 'Contact form — name placeholder' },
      { k: 'form_surname', l: 'Contact form — surname placeholder' },
      { k: 'form_email',   l: 'Contact form — email placeholder' },
      { k: 'form_phone',   l: 'Contact form — phone placeholder' },
      { k: 'form_reason',        l: 'Contact form — reason placeholder' },
      { k: 'form_reason_vol',    l: 'Contact form — reason option: Volunteering' },
      { k: 'form_reason_int',    l: 'Contact form — reason option: Internship' },
      { k: 'form_reason_stay',   l: 'Contact form — reason option: Stay' },
      { k: 'form_reason_run',    l: 'Contact form — reason option: Cheetah Run' },
      { k: 'form_reason_adopt',  l: 'Contact form — reason option: Adopt' },
      { k: 'form_reason_donate', l: 'Contact form — reason option: Donate' },
      { k: 'form_reason_other',  l: 'Contact form — reason option: Other' },
      { k: 'form_message', l: 'Contact form — message placeholder' },
      { k: 'form_success',  l: 'Contact form — success message' },
      { k: 'form_error',    l: 'Contact form — error message' },
    ]},
  { key: 'our_animals', label: 'Our Animals',
    images: [
      { k: 'our_animals_hero',                 l: 'Hero image',                           def: '/img/leoni-bliss-thunder.jpg' },
      { k: 'our_animals_cheetahs',             l: 'Species cover — Cheetahs',             def: '/img/ghepardo-erba-alta.png' },
      { k: 'our_animals_horses',               l: 'Species cover — Horses',               def: '/img/horses-species.png' },
      { k: 'our_animals_lions',                l: 'Species cover — Lions',                def: '/img/lions.png' },
      { k: 'our_animals_tigers',               l: 'Species cover — Tigers',               def: '/img/tigre-quake-ritratto.jpg' },
      { k: 'our_animals_servals',              l: 'Species cover — Servals',              def: '/img/serval.png' },
      { k: 'our_animals_caracals',             l: 'Species cover — Caracals',             def: '/img/lince.png' },
      { k: 'our_animals_civets',               l: 'Species cover — Civets',               def: '/img/african-civet.png' },
      { k: 'our_animals_porcupines',           l: 'Species cover — Porcupines',           def: '/img/porcospino.png' },
      { k: 'our_animals_bat_eared_foxes',      l: 'Species cover — Bat-Eared Foxes',      def: '/img/fox.png' },
      { k: 'our_animals_cows',                 l: 'Species cover — Cows',                 def: '/img/cows.png' },
      { k: 'our_animals_pets',                 l: 'Species cover — Pets',                 def: '/img/pets.png' },
      { k: 'our_animals_birds',                l: 'Species cover — Birds',                def: '/img/birds.png' },
      { k: 'our_animals_jackals',              l: 'Species cover — Jackals',              def: '/img/smokey-jackal.png' },
      { k: 'our_animals_free_roaming_animals', l: 'Species cover — Free-Roaming Animals', def: '/img/free-roaming.png' },
    ],
    fields: [
      { k: 'hero_label',  l: 'Small label (above title)' },
      { k: 'hero_title',  l: 'Hero title' },
      { k: 'hero_sub',    l: 'Hero subtitle' },
      { k: 'intro_p1',    l: 'Intro paragraph' },
      { k: 'other_label', l: '"Other Animals" group — small label' },
      { k: 'other_title', l: '"Other Animals" group — title' },
      { k: 'other_desc',  l: '"Other Animals" group — text' },
      { k: 'discover_story', l: 'Photo overlay link — "Discover their story"' },
      { k: 'empty_species',  l: 'Message shown when a species has no animals yet' },
      { k: 'btn1', l: 'Button 1 — (→ Kim\'s Story)' },
      { k: 'btn2', l: 'Button 2 — (→ Adopt)' },
      { k: 'cheetahs_title',             l: 'Cheetahs — title' },
      { k: 'cheetahs_desc',              l: 'Cheetahs — short description (Home page card)' },
      { k: 'cheetahs_detail',            l: 'Cheetahs — full description (Our Animals page)' },
      { k: 'horses_title',               l: 'Horses — title' },
      { k: 'horses_desc',                l: 'Horses — short description (Home page card)' },
      { k: 'horses_detail',              l: 'Horses — full description (Our Animals page)' },
      { k: 'lions_title',                l: 'Lions — title' },
      { k: 'lions_desc',                 l: 'Lions — short description (Home page card)' },
      { k: 'lions_detail',               l: 'Lions — full description (Our Animals page)' },
      { k: 'tigers_title',               l: 'Tigers — title' },
      { k: 'tigers_desc',                l: 'Tigers — short description (Home page card)' },
      { k: 'tigers_detail',              l: 'Tigers — full description (Our Animals page)' },
      { k: 'servals_title',              l: 'Servals — title' },
      { k: 'servals_desc',               l: 'Servals — short description (Home page card)' },
      { k: 'servals_detail',             l: 'Servals — full description (Our Animals page)' },
      { k: 'caracals_title',             l: 'Caracals — title' },
      { k: 'caracals_desc',              l: 'Caracals — short description (Home page card)' },
      { k: 'caracals_detail',            l: 'Caracals — full description (Our Animals page)' },
      { k: 'civets_title',               l: 'Civets — title' },
      { k: 'civets_desc',                l: 'Civets — short description (Home page card)' },
      { k: 'civets_detail',              l: 'Civets — full description (Our Animals page)' },
      { k: 'porcupines_title',           l: 'Porcupines — title' },
      { k: 'porcupines_desc',            l: 'Porcupines — short description (Home page card)' },
      { k: 'porcupines_detail',          l: 'Porcupines — full description (Our Animals page)' },
      { k: 'jackals_title',              l: 'Jackals — title' },
      { k: 'jackals_desc',               l: 'Jackals — short description (Home page card)' },
      { k: 'jackals_detail',             l: 'Jackals — full description (Our Animals page)' },
      { k: 'bat_eared_foxes_title',      l: 'Bat-Eared Foxes — title' },
      { k: 'bat_eared_foxes_desc',       l: 'Bat-Eared Foxes — short description (Home page card)' },
      { k: 'bat_eared_foxes_detail',     l: 'Bat-Eared Foxes — full description (Our Animals page)' },
      { k: 'cows_title',                 l: 'Cows — title' },
      { k: 'cows_desc',                  l: 'Cows — short description (Home page card)' },
      { k: 'cows_detail',                l: 'Cows — full description (Our Animals page)' },
      { k: 'pets_title',                 l: 'Pets — title' },
      { k: 'pets_desc',                  l: 'Pets — short description (Home page card)' },
      { k: 'pets_detail',                l: 'Pets — full description (Our Animals page)' },
      { k: 'birds_title',                l: 'Birds — title' },
      { k: 'birds_desc',                 l: 'Birds — short description (Home page card)' },
      { k: 'birds_detail',               l: 'Birds — full description (Our Animals page)' },
      { k: 'free_roaming_animals_title', l: 'Free-Roaming Animals — title' },
      { k: 'free_roaming_animals_desc',  l: 'Free-Roaming Animals — short description (Home page card)' },
      { k: 'free_roaming_animals_detail', l: 'Free-Roaming Animals — full description (Our Animals page)' },
    ]},
  { key: 'nova_story', label: "Nova's Story",
    images: [
      { k: 'nova_story_hero', l: 'Hero image — desktop', def: '/img/nova-sdraiata.png' },
      { k: 'nova_story_hero_mobile', l: 'Hero image — mobile', def: '/img/ghepardo-erba.png' },
      { k: 'nova_story_photo_1', l: 'Gallery — Nova close-up', def: '/img/nova-primo-piano.png', capL: 'Caption' },
      { k: 'nova_story_photo_2', l: 'Gallery — Cub', def: '/img/cub.png', capL: 'Caption' },
      { k: 'nova_story_photo_3', l: 'Gallery — Mother & cub', def: '/img/nova-madre-cucciolo.png', capL: 'Caption' },
      { k: 'nova_story_photo_4', l: 'Gallery — Two cheetahs', def: '/img/due-ghepardi.png', capL: 'Caption' },
    ],
    fields: [
      { k: 'hero_label',     l: 'Small label (above title)' },
      { k: 'hero_title',     l: 'Hero title' },
      { k: 'hero_sub',       l: 'Hero subtitle' },
      { k: 'btn1',           l: 'Button 1' },
      { k: 'btn2',           l: 'Button 2' },
      { k: 'origins_title',  l: 'Origins — section title' },
      { k: 'origins_p1',     l: 'Origins — paragraph 1' },
      { k: 'origins_p2',     l: 'Origins — paragraph 2' },
      { k: 'highlight',      l: 'Highlighted quote' },
      { k: 'genetics_title', l: 'Genetics — section title' },
      { k: 'genetics_p1',    l: 'Genetics — paragraph 1' },
      { k: 'genetics_p2',    l: 'Genetics — paragraph 2' },
      { k: 'genetics_p3',    l: 'Genetics — paragraph 3' },
      { k: 'legacy_title',   l: 'Legacy — section title' },
      { k: 'legacy_p1',      l: 'Legacy — paragraph 1' },
      { k: 'legacy_p2',      l: 'Legacy — paragraph 2' },
      { k: 'photo_caps',     l: 'Gallery — default captions (used if a photo has no custom caption)', arrayShape: 'string' },
    ]},
  { key: 'kim_story', label: "Kim's Story",
    images: [
      { k: 'kim_story_hero', l: 'Hero image', def: '/img/kim-savana.svg' },
      { k: 'kim_story_portrait', l: 'Kim portrait photo', def: '/img/kim-portrait.jpg' },
      { k: 'kim_story_cheetah', l: 'Kim with a cheetah photo', def: '/img/kim-cheetah.png' },
    ],
    fields: [
      { k: 'hero_label',        l: 'Small label' },
      { k: 'hero_title',        l: 'Title — first part' },
      { k: 'hero_title_em',     l: 'Title — italic part' },
      { k: 'hero_sub',          l: 'Subtitle' },
      { k: 'btn1',              l: 'Button 1' },
      { k: 'btn2',              l: 'Button 2' },
      { k: 'section_label',     l: 'Section label' },
      { k: 'section_title',     l: 'Section title — first part' },
      { k: 'section_title_em',  l: 'Section title — italic part' },
      { k: 'p1',                l: 'Main text' },
      { k: 'quote1',            l: 'Quote 1' },
      { k: 'quote2',            l: 'Quote 2' },
      { k: 'quote3',            l: 'Quote 3' },
    ]},
  { key: 'conservation', label: 'Conservation',
    images: [
      { k: 'conservation_hero', l: 'Hero image — desktop', def: '/img/hero-cheetah-project.png' },
      { k: 'conservation_hero_mobile', l: 'Hero image — mobile', def: '/img/due-ghepardi.png' },
      { k: 'conservation_photo_1', l: 'Section photo — Cubs', def: '/img/cubs.png' },
      { k: 'conservation_photo_2', l: 'Section photo — Veterinary', def: '/img/veterinary.jpg' },
      { k: 'conservation_photo_3', l: 'Section photo — Team', def: '/img/volontari-gruppo.png' },
      { k: 'conservation_photo_4', l: 'Section photo — Man & cheetah', def: '/img/man-cheetah.png' },
    ],
    fields: [
      { k: 'hero_label',    l: 'Small label' },
      { k: 'hero_title',    l: 'Title' },
      { k: 'hero_sub',      l: 'Subtitle' },
      { k: 'mission_title', l: 'Mission — title' },
      { k: 'mission_p',     l: 'Mission — text' },
      { k: 'highlight',     l: 'Highlighted quote' },
      { k: 'edu_title',     l: 'Education — title' },
      { k: 'edu_p1',        l: 'Education — paragraph 1' },
      { k: 'edu_p2',        l: 'Education — paragraph 2' },
      { k: 'science_title', l: 'Scientific research — title' },
      { k: 'science_p',     l: 'Scientific research — text' },
      { k: 'coexist_title', l: 'Coexistence — title' },
      { k: 'coexist_p',     l: 'Coexistence — text' },
      { k: 'btn1', l: 'Button 1 — Join the Project (→ Volunteer)' },
      { k: 'btn2', l: 'Button 2 — (→ Our Animals / Cheetahs)' },
    ]},
  { key: 'volunteer', label: 'Volunteering',
    images: [
      { k: 'volunteer_hero', l: 'Hero image', def: '/img/vol-volontari-1.jpg' },
      { k: 'volunteer_photo_1', l: 'Gallery — Animal care', def: '/img/animal-care.png', capL: 'Caption' },
      { k: 'volunteer_photo_2', l: 'Gallery — Daily work', def: '/img/daily-work.png', capL: 'Caption' },
      { k: 'volunteer_photo_3', l: 'Gallery — With cheetahs', def: '/img/with-the-cheetahs.png', capL: 'Caption' },
      { k: 'volunteer_photo_4', l: 'Gallery — In the bush', def: '/img/in-the-bush.png', capL: 'Caption' },
      { k: 'volunteer_photo_5', l: 'Gallery — Feeding', def: '/img/feeding.png', capL: 'Caption' },
      { k: 'volunteer_photo_6', l: 'Gallery — Team in action', def: '/img/team-in-action.png', capL: 'Caption' },
    ],
    fields: [
      { k: 'hero_label',     l: 'Small label' },
      { k: 'hero_title',     l: 'Title' },
      { k: 'hero_sub',       l: 'Subtitle' },
      { k: 'btn_write',      l: 'Button 1 — Write to us' },
      { k: 'btn2',           l: 'Button 2 — Apply now' },
      { k: 'what_title',     l: 'What it means — title' },
      { k: 'what_p1',        l: 'What it means — paragraph 1' },
      { k: 'what_p2',        l: 'What it means — paragraph 2' },
      { k: 'highlight',      l: 'Highlighted box' },
      { k: 'daily_title',    l: 'Daily tasks — title' },
      { k: 'tasks',          l: 'Daily tasks — list', arrayShape: 'string' },
      { k: 'schedule_title', l: 'Schedule — title' },
      { k: 'schedule',       l: 'Schedule — entries', arrayShape: ['time', 'title', 'desc'] },
      { k: 'photo_caps',     l: 'Gallery — default captions (used if a photo has no custom caption)', arrayShape: 'string' },
      { k: 'apply_title',    l: 'How to apply — title' },
      { k: 'apply_text',     l: 'How to apply — text' },
    ]},
  { key: 'visit', label: 'Stay & Visits',
    images: [
      { k: 'visit_hero', l: 'Hero image', def: '/img/chalet-esterno.png' },
      { k: 'visit_chalet_nova', l: 'Chalet Nova photo', def: '/img/chalet-cucina.png' },
      { k: 'visit_chalet_bush', l: 'Chalet Bush photo', def: '/img/chalet-esterno-2.png' },
      { k: 'visit_chalet_waterberg', l: 'Chalet Waterberg photo', def: '/img/chalet-camera.png' },
      { k: 'visit_photo_1', l: 'Section photo — External space', def: '/img/external.jpg' },
      { k: 'visit_photo_2', l: 'Section photo — Peaceful place', def: '/img/thutlwa.jpg' },
    ],
    fields: [
      { k: 'hero_label',    l: 'Small label' },
      { k: 'hero_title',    l: 'Title' },
      { k: 'hero_sub',      l: 'Subtitle' },
      { k: 'btn_book',      l: 'Button 1 — Book your stay' },
      { k: 'chalets_title', l: 'Chalets — title' },
      { k: 'chalets_p',     l: 'Chalets — text' },
      { k: 'chalets',       l: 'Chalets — entries', arrayShape: ['name', 'size', 'desc'] },
      { k: 'highlight',     l: 'Highlighted box (best season etc.)' },
      { k: 'how_title',     l: 'How to get there — title' },
      { k: 'how_p1',        l: 'How to get there — paragraph 1' },
      { k: 'how_p2',        l: 'How to get there — paragraph 2' },
      { k: 'add_run_title', l: 'Add Cheetah Run — title' },
      { k: 'add_run_p',     l: 'Add Cheetah Run — text' },
      { k: 'btn2',          l: 'Button 2 — Add the Cheetah Run' },
    ]},
  { key: 'horses', label: 'Horse Project',
    images: [
      { k: 'horses_hero', l: 'Hero image', def: '/img/cavallo-puledro.png' },
      { k: 'horses_photo_1', l: 'Section photo — Fence maintenance', def: '/img/volontario-recinzione.png' },
      { k: 'horses_photo_2', l: 'Section photo — Team at work', def: '/img/volontari-lavoro.png' },
      { k: 'horses_fullwidth', l: 'Full-width banner', def: '/img/horse-project.png' },
    ],
    fields: [
      { k: 'hero_label',      l: 'Small label' },
      { k: 'hero_title',      l: 'Title' },
      { k: 'hero_sub',        l: 'Subtitle' },
      { k: 'who_title',       l: 'Our horses — title' },
      { k: 'who_p1',          l: 'Our horses — paragraph 1' },
      { k: 'who_p2',          l: 'Our horses — paragraph 2' },
      { k: 'highlight',       l: 'Highlighted box' },
      { k: 'vol_title',       l: 'What volunteers do — title' },
      { k: 'vol_p1',          l: 'What volunteers do — paragraph 1' },
      { k: 'vol_p2',          l: 'What volunteers do — paragraph 2' },
      { k: 'ecosystem_title', l: 'Ecosystem — title' },
      { k: 'ecosystem_p1',    l: 'Ecosystem — paragraph 1' },
      { k: 'ecosystem_p2',    l: 'Ecosystem — paragraph 2' },
      { k: 'btn1', l: 'Button 1 — Volunteer (→ Volunteer)' },
      { k: 'btn2', l: 'Button 2 — (→ Our Animals / Horses)' },
    ]},
  { key: 'cheetah_run', label: 'Cheetah Run',
    images: [
      { k: 'cheetah_run_hero', l: 'Hero / slideshow first image', def: '/img/ghepardo-corsa.png' },
      { k: 'cheetah_run_photo_1', l: 'Section photo — Speed', def: '/img/ghepardo-corsa-erba-gialla.png' },
      { k: 'cheetah_run_photo_2', l: 'Section photo — Volunteers with cheetah', def: '/img/volontarie-ghepardo.png' },
    ],
    fields: [
      { k: 'hero_label',        l: 'Small label' },
      { k: 'hero_title',        l: 'Title' },
      { k: 'hero_sub',          l: 'Subtitle' },
      { k: 'btn1',              l: 'Button 1' },
      { k: 'btn2',              l: 'Button 2' },
      { k: 'title',             l: 'Section title' },
      { k: 'p1',                l: 'Main text' },
      { k: 'stat_labels',       l: 'Stat captions (used as photo captions)', arrayShape: 'string' },
      { k: 'highlight',         l: 'Highlighted box' },
      { k: 'how_title',         l: 'How it works — title' },
      { k: 'how_p1',            l: 'How it works — paragraph 1' },
      { k: 'how_p2',            l: 'How it works — paragraph 2' },
      { k: 'practical_title',   l: 'Practical info — title' },
      { k: 'practical_p',       l: 'Practical info — text' },
      { k: 'booking_highlight', l: 'Booking info text' },
    ]},
  { key: 'donate', label: 'Donations',
    images: [
      { k: 'donate_hero', l: 'Hero image', def: '/img/support.png' },
    ],
    fields: [
      { k: 'hero_label',         l: 'Small label' },
      { k: 'hero_title',         l: 'Title' },
      { k: 'hero_sub',           l: 'Subtitle' },
      { k: 'section_label',      l: 'Section label' },
      { k: 'section_title',      l: 'Section title' },
      { k: 'custom_label',       l: 'Custom amount — label' },
      { k: 'custom_placeholder', l: 'Custom amount — placeholder' },
      { k: 'summary',            l: 'Summary text (before amount)' },
      { k: 'summary_to',         l: 'Summary text (after amount)' },
      { k: 'success_title',      l: 'Success — title' },
      { k: 'success_desc',       l: 'Success — text' },
      { k: 'donate_again',       l: 'Donate again button' },
      { k: 'error_text',         l: 'Error message (payment failed)' },
      { k: 'impact',             l: 'Impact list (what a donation funds)', arrayShape: ['desc'] },
    ]},
  { key: 'cheetah', label: 'Cheetah Project',
    images: [
      { k: 'cheetah_hero', l: 'Hero image', def: '/img/nova-madre-cucciolo.png' },
    ],
    fields: [
      { k: 'hero_label',     l: 'Small label' },
      { k: 'hero_title',     l: 'Hero title' },
      { k: 'hero_sub',       l: 'Hero subtitle' },
      { k: 'btn1',           l: 'Button 1' },
      { k: 'btn2',           l: 'Button 2' },
      { k: 'nova_title',     l: "Nova's story — title" },
      { k: 'nova_p1',        l: "Nova's story — paragraph 1" },
      { k: 'nova_p2',        l: "Nova's story — paragraph 2" },
      { k: 'highlight',      l: 'Highlighted box' },
      { k: 'run_title',      l: 'Cheetah Run — title' },
      { k: 'run_p1',         l: 'Cheetah Run — paragraph 1' },
      { k: 'run_p2',         l: 'Cheetah Run — paragraph 2' },
      { k: 'breeding_title', l: 'Breeding — title' },
      { k: 'breeding_p1',    l: 'Breeding — paragraph 1' },
      { k: 'breeding_p2',    l: 'Breeding — paragraph 2' },
    ]},
  { key: 'internship', label: 'Internship',
    images: [
      { k: 'internship_hero', l: 'Hero image', def: '/img/internship-hero.png' },
      { k: 'internship_photo_1', l: 'Gallery photo 1', def: '/img/internship.png' },
      { k: 'internship_photo_2', l: 'Gallery photo 2', def: '/img/internship2.png' },
      { k: 'internship_photo_3', l: 'Section photo — Medicine', def: '/img/medicine-internship.png' },
      { k: 'internship_photo_4', l: 'Section photo — Hard work', def: '/img/hard-work-internship.png' },
    ],
    fields: [
      { k: 'hero_label',     l: 'Small label' },
      { k: 'hero_title',     l: 'Hero title' },
      { k: 'hero_sub',       l: 'Hero subtitle' },
      { k: 'btn1',           l: 'Button 1' },
      { k: 'btn2',           l: 'Button 2' },
      { k: 'learn_title',    l: 'Learn in the field — title' },
      { k: 'learn_p1',       l: 'Learn in the field — paragraph 1' },
      { k: 'learn_p2',       l: 'Learn in the field — paragraph 2' },
      { k: 'highlight',      l: 'Highlighted box' },
      { k: 'fields_title',   l: 'Specialisation areas — title' },
      { k: 'field_labels',   l: 'Specialisation areas — list', arrayShape: 'string' },
      { k: 'includes_title', l: 'What is included — title' },
      { k: 'includes_p',     l: 'What is included — text' },
      { k: 'duration_title', l: 'Duration — title' },
      { k: 'duration_p',     l: 'Duration — text' },
    ]},
  { key: 'blog', label: 'Blog',
    images: [
      { k: 'blog_hero', l: 'Hero image', def: '/img/ghepardo-corsa-2.png' },
    ],
    fields: [
      { k: 'hero_label',    l: 'Small label' },
      { k: 'hero_title',    l: 'Hero title' },
      { k: 'hero_sub',      l: 'Hero subtitle' },
      { k: 'read_all',      l: 'Card link — "Read more"' },
      { k: 'back_to_blog',  l: 'Post page — back link' },
      { k: 'prev_post',     l: 'Post page — previous link' },
      { k: 'next_post',     l: 'Post page — next link' },
    ]},
  { key: 'adopt', label: 'Adopt an Animal',
    images: [
      { k: 'adopt_hero', l: 'Hero image', def: '/img/ghepardo-corsa-erba-gialla.png' },
    ],
    fields: [
      { k: 'hero_label',         l: 'Small label' },
      { k: 'hero_title',         l: 'Hero title' },
      { k: 'hero_sub',           l: 'Hero subtitle' },
      { k: 'desc',               l: 'Description text' },
      { k: 'what_you_get_title', l: 'What you receive — label' },
      { k: 'what_you_get_text',  l: 'What you receive — items' },
      { k: 'discover_story',     l: 'Photo overlay link — "Discover their story"' },
      { k: 'per_month',                l: '"/month" suffix' },
      { k: 'adopt_btn',                l: '"Adopt" button text' },
      { k: 'loading',                  l: 'Loading state text' },
      { k: 'portal_title',             l: 'Manage subscription — title (first part)' },
      { k: 'portal_title_em',          l: 'Manage subscription — title (italic part)' },
      { k: 'portal_desc',              l: 'Manage subscription — text' },
      { k: 'portal_email_placeholder', l: 'Manage subscription — email placeholder' },
      { k: 'portal_btn',               l: 'Manage subscription — button' },
      { k: 'portal_loading',           l: 'Manage subscription — loading text' },
      { k: 'portal_error_not_found',   l: 'Manage subscription — "not found" error' },
    ]},
  { key: 'wishlist', label: 'Wishlist',
    images: [
      { k: 'wishlist_hero', l: 'Hero image', def: '/img/kim-savana.svg' },
    ],
    fields: [
      { k: 'sub_label',    l: 'Small label (above title)' },
      { k: 'title_start',  l: 'Title — first part' },
      { k: 'title_em',     l: 'Title — italic part' },
      { k: 'p1',           l: 'Intro — paragraph 1' },
      { k: 'p2',           l: 'Intro — paragraph 2' },
      { k: 'urgent_title', l: 'Urgent items — label' },
      { k: 'urgent_text',  l: 'Urgent items — text' },
      { k: 'list_title',   l: 'Wishlist link — label' },
      { k: 'items',        l: 'Wishlist items', arrayShape: 'string' },
      { k: 'disclaimer_1', l: 'Disclaimer — paragraph 1' },
      { k: 'disclaimer_2', l: 'Disclaimer — paragraph 2' },
      { k: 'need_start',   l: 'What we need — title start' },
      { k: 'need_em',      l: 'What we need — title italic' },
      { k: 'footer_text',  l: 'Footer text' },
    ]},
  { key: 'faq', label: 'FAQ',
    images: [
      { k: 'faq_hero', l: 'Hero image', def: '/img/nova-sdraiata.png' },
    ],
    fields: [
      { k: 'hero_label',       l: 'Small label' },
      { k: 'hero_title_start', l: 'Hero title — first part' },
      { k: 'hero_title_em',    l: 'Hero title — italic part' },
      { k: 'hero_sub',         l: 'Hero subtitle' },
      { k: 'footer_bold',      l: 'Footer — bold text' },
      { k: 'footer_text',      l: 'Footer — body text' },
    ]},
  { key: 'merch', label: 'Shop / Merch',
    images: [
      { k: 'merch_hero', l: 'Hero image — desktop', def: '/img/hero.png' },
      { k: 'merch_hero_mobile', l: 'Hero image — mobile', def: '/img/merch-hero.jpg' },
    ],
    fields: [
      { k: 'hero_label',    l: 'Small label' },
      { k: 'hero_title',    l: 'Hero title' },
      { k: 'hero_sub',      l: 'Hero subtitle' },
      { k: 'section_label', l: 'Section label' },
      { k: 'section_title', l: 'Section title' },
      { k: 'order_btn',     l: 'Order button text' },
      { k: 'custom_orders', l: 'Custom orders text' },
      { k: 'info',          l: 'Info strip (shipping/payment/impact)', arrayShape: ['icon', 'title', 'desc'] },
    ]},
  { key: 'other_animals', label: 'Other Animals',
    images: [
      { k: 'other_animals_hero', l: 'Hero image — desktop', def: '/img/adotta-wild-hearts.png' },
      { k: 'other_animals_hero_mobile', l: 'Hero image — mobile', def: '/img/leoni-cuccioli.png' },
      { k: 'other_animals_photo_1', l: 'Gallery — Lions', def: '/img/lions.png', capL: 'Caption' },
      { k: 'other_animals_photo_2', l: 'Gallery — Ghost Pack', def: '/img/ghost-pack.png', capL: 'Caption' },
      { k: 'other_animals_photo_3', l: 'Gallery — Lynx/Caracal', def: '/img/lince.png', capL: 'Caption' },
      { k: 'other_animals_photo_4', l: 'Gallery — Fox', def: '/img/fox.png', capL: 'Caption' },
      { k: 'other_animals_photo_5', l: 'Gallery — Porcupine', def: '/img/porcospino.png', capL: 'Caption' },
      { k: 'other_animals_photo_6', l: 'Gallery — Dumbo', def: '/img/dumbo.png', capL: 'Caption' },
      { k: 'other_animals_photo_7', l: 'Gallery — Antelope', def: '/img/antille.png', capL: 'Caption' },
      { k: 'other_animals_photo_8', l: 'Gallery — Zebra', def: '/img/horse-zebra.png', capL: 'Caption' },
    ],
    fields: [
      { k: 'hero_label',       l: 'Small label' },
      { k: 'hero_title',       l: 'Hero title' },
      { k: 'hero_sub',         l: 'Hero subtitle' },
      { k: 'sanctuary_title',  l: 'Sanctuary — title' },
      { k: 'sanctuary_p1',     l: 'Sanctuary — text' },
      { k: 'feracare_title',   l: 'FeraCare — title' },
      { k: 'feracare_text',    l: 'FeraCare — text' },
      { k: 'cats_title',       l: 'Big cats — title' },
      { k: 'cats_p1',          l: 'Big cats — text' },
      { k: 'small_title',      l: 'Small wildlife — title' },
      { k: 'small_p1',         l: 'Small wildlife — text' },
      { k: 'herbivores_title', l: 'Herbivores — title' },
      { k: 'herbivores_p1',    l: 'Herbivores — text' },
      { k: 'btn_adopt',     l: 'Button 1 — Adopt an Animal (→ Home contact)' },
      { k: 'btn_volunteer', l: 'Button 2 — (→ Our Animals / Other Animals)' },
    ]},
  { key: 'footer', label: 'Footer',
    images: [],
    fields: [
      { k: 'brand_desc',    l: 'Brand description' },
      { k: 'col_project',   l: 'Column 1 — heading ("The Project")' },
      { k: 'conservation',  l: 'Column 1 — link: Conservation' },
      { k: 'horses',        l: 'Column 1 — link: Horse Project' },
      { k: 'blog',          l: 'Column 1 — link: Blog' },
      { k: 'col_involved',  l: 'Column 2 — heading ("Get Involved")' },
      { k: 'volunteer',     l: 'Column 2 — link: Volunteering' },
      { k: 'internship',    l: 'Column 2 — link: Internship' },
      { k: 'stay',          l: 'Column 2 — link: Stay' },
      { k: 'adopt',         l: 'Column 2 — link: Adopt' },
      { k: 'col_social',    l: 'Column 3 — heading ("Follow Us")' },
      { k: 'copyright',  l: 'Copyright line' },
      { k: 'reg',        l: 'Legal info (reg. number)' },
    ]},
  { key: 'nav', label: 'Navigation',
    images: [],
    fields: [
      { k: 'home',             l: 'Home' },
      { k: 'about_us',         l: 'About Us (menu label)' },
      { k: 'nova_story',       l: "  ↳ Nova's Story" },
      { k: 'kim_story',        l: "  ↳ Kim's Story" },
      { k: 'our_animals',      l: '  ↳ Our Animals' },
      { k: 'our_mission',      l: 'Our Mission (menu label)' },
      { k: 'cheetah_project',  l: '  ↳ Cheetah Project' },
      { k: 'horses',           l: '  ↳ Horse Project' },
      { k: 'other_animals',    l: '  ↳ Other Animals' },
      { k: 'get_involved',     l: 'Get Involved (menu label)' },
      { k: 'volunteer',        l: '  ↳ Volunteering' },
      { k: 'internship',       l: '  ↳ Internship' },
      { k: 'stay',             l: '  ↳ Stay' },
      { k: 'cheetah_run',      l: '  ↳ Cheetah Run' },
      { k: 'FAQ',              l: '  ↳ FAQ' },
      { k: 'blog',             l: 'Blog' },
      { k: 'shop',             l: 'Shop' },
      { k: 'support_us',       l: 'Support Us (menu label)' },
      { k: 'donations',        l: '  ↳ Donations' },
      { k: 'wishlist',         l: '  ↳ Wishlist' },
      { k: 'adopt_animal',     l: '  ↳ Adopt an Animal' },
      { k: 'become_volunteer', l: 'CTA button (top right)' },
    ]},
  { key: 'common', label: 'Shared text (used across many pages)',
    images: [],
    fields: [
      { k: 'back_home',        l: '"← Back to Home" link' },
      { k: 'discover',         l: '"Discover" (species card button)' },
      { k: 'learn_more_arrow', l: '"Learn more →" link' },
      { k: 'send_message',     l: 'Contact form submit button' },
      { k: 'error_backend',    l: 'Generic "server unreachable" error' },
      { k: 'error_checkout',   l: 'Generic checkout error' },
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

// Editor for cms.json values that are arrays — either a plain list of strings
// (shape=null) or a list of objects with a fixed set of text fields (shape=['time','title','desc']).
function ArrayField({ label, value, shape, onChange }) {
  const items = Array.isArray(value) ? value : []

  const setString = (i, v) => { const next = [...items]; next[i] = v; onChange(next) }
  const setObjField = (i, key, v) => { const next = [...items]; next[i] = { ...next[i], [key]: v }; onChange(next) }
  const addItem = () => onChange([...items, shape ? Object.fromEntries(shape.map(k => [k, ''])) : ''])
  const removeItem = i => onChange(items.filter((_, idx) => idx !== i))
  const moveItem = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="adm-field">
      <label>{label}</label>
      <div className="adm-arr">
        {items.map((item, i) => (
          <div key={i} className="adm-arr-row">
            <div className="adm-arr-row-main">
              {shape
                ? shape.map(fieldKey => (
                    fieldKey === 'desc'
                      ? <textarea key={fieldKey} rows={2} placeholder={fieldKey} value={item?.[fieldKey] || ''} onChange={e => setObjField(i, fieldKey, e.target.value)} />
                      : <input key={fieldKey} placeholder={fieldKey} value={item?.[fieldKey] || ''} onChange={e => setObjField(i, fieldKey, e.target.value)} />
                  ))
                : <input value={item || ''} onChange={e => setString(i, e.target.value)} />
              }
            </div>
            <div className="adm-arr-row-btns">
              <button type="button" className="btn-sm" disabled={i === 0} onClick={() => moveItem(i, -1)} title="Move up">↑</button>
              <button type="button" className="btn-sm" disabled={i === items.length - 1} onClick={() => moveItem(i, 1)} title="Move down">↓</button>
              <button type="button" className="btn-sm btn-del" onClick={() => removeItem(i)} title="Remove">Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn-sm" onClick={addItem}>+ Add item</button>
      </div>
    </div>
  )
}

function ContentTab({ token, onExpired }) {
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
    const { ok, expired } = await saveContent(payload, token)
    localStorage.setItem('nl_content', JSON.stringify(payload))
    i18n.addResourceBundle('en', 'translation', payload, true, true)
    if (expired) { onExpired(); return }
    setMsg(ok ? 'ok' : 'local')
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
                {sec.images.map(({ k, l, def, capL }) => {
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
                        <ImageUpload label="" value={cmsImgs[k] || ''} onChange={v => updateImage(k, v)} token={token} />
                        {capL && (
                          <div className="adm-field" style={{ marginTop: '0.4rem', marginBottom: 0 }}>
                            <label style={{ color: '#888', fontSize: '0.68rem' }}>{capL}</label>
                            <input
                              value={cmsImgs['cap_' + k] || ''}
                              onChange={e => updateImage('cap_' + k, e.target.value)}
                              placeholder="Caption text…"
                            />
                          </div>
                        )}
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
              {sec.fields.map(({ k, l, arrayShape }) => (
                arrayShape
                  ? <ArrayField key={k} label={l} value={secData[k] || []} shape={arrayShape === 'string' ? null : arrayShape} onChange={v => updateField(k, v)} />
                  : <TextField key={k} label={l} value={secData[k] || ''} onChange={v => updateField(k, v)} />
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
  const [sessionExpired, setSessionExpired] = useState(false)

  const login = t => { localStorage.setItem('nl_admin_token', t); setToken(t); setSessionExpired(false) }
  const logout = () => { localStorage.removeItem('nl_admin_token'); setToken(''); goTo('home') }
  const onExpired = () => { localStorage.removeItem('nl_admin_token'); setToken(''); setSessionExpired(true) }

  if (!token) return <LoginScreen onLogin={login} goTo={goTo} sessionExpired={sessionExpired} />

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
          {tab === 0 && <BlogTab     token={token} onExpired={onExpired} />}
          {tab === 1 && <ShopTab token={token} />}
          {tab === 2 && <AnimaliTab  token={token} onExpired={onExpired} />}
          {tab === 3 && <OurAnimalsTab token={token} onExpired={onExpired} />}
          {tab === 4 && <ContentTab  token={token} onExpired={onExpired} />}
          {tab === 5 && <SettingsTab token={token} />}
        </div>
      </div>
    </>
  )
}
