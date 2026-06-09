import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function Admin({ goTo }) {
  const [token, setToken] = useState(() => localStorage.getItem('nl_admin_token') || '')
  const [needsSetup, setNeedsSetup] = useState(false)
  const [setupPwd, setSetupPwd] = useState('')
  const [password, setPassword] = useState('')
  const [clientId, setClientId] = useState('')
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/paypal-config`)
      .then(r => r.json())
      .then(d => {
        setNeedsSetup(Boolean(d.needsSetup))
        if (token) setClientId(d.clientId || '')
      })
      .catch(() => setMsg({ type: 'error', text: 'Impossibile raggiungere il backend. Assicurati che sia avviato.' }))
  }, [token])

  const doSetup = async e => {
    e.preventDefault()
    setMsg(null)
    const r = await fetch(`${API}/api/admin/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: setupPwd }),
    })
    const d = await r.json()
    if (d.ok) {
      setMsg({ type: 'success', text: 'Password impostata. Ora puoi accedere.' })
      setNeedsSetup(false)
    } else {
      setMsg({ type: 'error', text: d.error })
    }
  }

  const doLogin = async e => {
    e.preventDefault()
    setMsg(null)
    const r = await fetch(`${API}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const d = await r.json()
    if (d.token) {
      localStorage.setItem('nl_admin_token', d.token)
      setToken(d.token)
    } else {
      setMsg({ type: 'error', text: d.error || 'Errore di accesso' })
    }
  }

  const doSave = async e => {
    e.preventDefault()
    setMsg(null)
    const r = await fetch(`${API}/api/admin/paypal-config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ clientId }),
    })
    const d = await r.json()
    if (d.ok) {
      setMsg({ type: 'success', text: 'Client ID PayPal aggiornato con successo.' })
    } else {
      setMsg({ type: 'error', text: d.error || 'Errore nel salvataggio' })
      if (r.status === 401) { localStorage.removeItem('nl_admin_token'); setToken('') }
    }
  }

  const logout = () => { localStorage.removeItem('nl_admin_token'); setToken(''); setMsg(null) }

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-logo" onClick={() => goTo('home')} style={{ cursor: 'pointer' }}>
          Nova&apos;s <em>Legacy</em>
        </div>
        <h1>Pannello Admin</h1>

        {msg && <div className={`admin-msg ${msg.type}`}>{msg.text}</div>}

        {needsSetup ? (
          <>
            <p className="admin-sub">Prima configurazione — imposta la password admin.</p>
            <form onSubmit={doSetup} className="admin-form">
              <label>Nuova password</label>
              <input
                type="password"
                value={setupPwd}
                onChange={e => setSetupPwd(e.target.value)}
                placeholder="Minimo 8 caratteri"
                required
                minLength={8}
              />
              <button type="submit" className="btn btn-dark">Imposta Password</button>
            </form>
          </>
        ) : !token ? (
          <>
            <p className="admin-sub">Accedi per gestire le impostazioni.</p>
            <form onSubmit={doLogin} className="admin-form">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password admin"
                required
              />
              <button type="submit" className="btn btn-dark">Accedi</button>
            </form>
          </>
        ) : (
          <>
            <div className="admin-header">
              <p className="admin-sub">Impostazioni PayPal</p>
              <button className="admin-logout" onClick={logout}>Esci</button>
            </div>
            <form onSubmit={doSave} className="admin-form">
              <label>PayPal Client ID</label>
              <p className="admin-hint">
                Trovalo su <strong>developer.paypal.com</strong> → My Apps &amp; Credentials → seleziona la tua app → Client ID
              </p>
              <input
                type="text"
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                placeholder="AaBbCcDdEeFfGg..."
                required
              />
              <button type="submit" className="btn btn-dark">Salva</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default Admin
