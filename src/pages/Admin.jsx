import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const TABS = ['Blog', 'Shop', 'Animali']

// ── helpers ──────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2) }

// ── Login screen ─────────────────────────────────────────────────────────────
function AdminStyles() {
  return (
    <style>{`
      .adm-wrap { min-height: 100vh; background: #F4F1EC; font-family: var(--sans); }
      .adm-login-card { max-width: 400px; margin: 10vh auto 0; background: #fff; border: 1px solid #E8E0D4; padding: 2.5rem; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
      .adm-brand { font-family: var(--serif); font-size: 1.4rem; font-weight: 700; color: var(--dark); margin-bottom: 1.2rem; }
      .adm-brand em { font-style: italic; font-weight: 400; color: var(--gold); margin-left: 4px; }
      .adm-login-card h2 { font-size: 1.3rem; margin-bottom: 0.3rem; }
      .adm-hint { font-size: 0.8rem; color: #999; margin-bottom: 1.5rem; }
      .adm-shell { display: flex; min-height: 100vh; }
      .adm-sidebar { width: 220px; flex-shrink: 0; background: #111; display: flex; flex-direction: column; padding: 1.8rem 1.2rem; position: sticky; top: 0; height: 100vh; }
      .adm-sidebar .adm-brand { color: #fff; margin-bottom: 2.5rem; }
      .adm-sidebar .adm-brand em { color: var(--gold-light); }
      .adm-nav { flex: 1; display: flex; flex-direction: column; gap: 0.3rem; }
      .adm-nav-item { display: flex; align-items: center; gap: 0.75rem; background: none; border: none; color: rgba(255,255,255,0.5); font-size: 0.85rem; font-weight: 500; padding: 0.7rem 0.9rem; cursor: pointer; text-align: left; border-radius: 6px; transition: background 0.2s, color 0.2s; }
      .adm-nav-item:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.85); }
      .adm-nav-item--active { background: rgba(200,136,10,0.18); color: var(--gold-light); }
      .adm-nav-icon { font-size: 1rem; }
      .adm-logout { background: none; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.4); font-size: 0.78rem; padding: 0.55rem 1rem; cursor: pointer; border-radius: 4px; transition: all 0.2s; }
      .adm-logout:hover { border-color: rgba(255,255,255,0.4); color: rgba(255,255,255,0.7); }
      .adm-main { flex: 1; padding: 2rem 2.5rem; overflow-y: auto; max-width: 900px; }
      .adm-main-header { margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #E8E0D4; }
      .adm-main-header h2 { font-size: 1.5rem; font-weight: 700; }
      .adm-main-sub { font-size: 0.82rem; color: #999; }
      .adm-tab-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
      .adm-tab-header h3 { font-size: 1rem; font-weight: 600; }
      .adm-count { background: var(--gold-pale); color: var(--gold); font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 20px; margin-left: 0.4rem; }
      .adm-list { display: flex; flex-direction: column; gap: 0.6rem; }
      .adm-row { display: flex; align-items: center; gap: 1rem; background: #fff; border: 1px solid #EDE5D8; padding: 0.9rem 1rem; border-radius: 6px; transition: box-shadow 0.2s; }
      .adm-row:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
      .adm-row-img { width: 64px; height: 52px; flex-shrink: 0; background: #F0EBE3; border-radius: 4px; overflow: hidden; }
      .adm-row-img img { width: 100%; height: 100%; object-fit: cover; }
      .adm-row-body { flex: 1; min-width: 0; }
      .adm-row-tag { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.2rem; }
      .adm-row-title { font-weight: 600; font-size: 0.9rem; color: #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .adm-row-sub { font-size: 0.78rem; color: #888; margin-top: 0.15rem; }
      .adm-row-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }
      .adm-empty { color: #aaa; font-size: 0.85rem; padding: 1.5rem 0; text-align: center; }
      .adm-btn { background: #fff; border: 1px solid #D0C9BE; color: #333; font-size: 0.78rem; font-weight: 600; padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px; transition: all 0.2s; }
      .adm-btn:hover { border-color: #888; color: #111; }
      .adm-btn--primary { background: #111; border-color: #111; color: #fff; }
      .adm-btn--primary:hover { background: var(--gold); border-color: var(--gold); }
      .adm-btn--sm { font-size: 0.72rem; padding: 0.35rem 0.75rem; }
      .adm-btn--danger { color: #C0392B; border-color: #f0c0ba; }
      .adm-btn--danger:hover { background: #fdf0ee; }
      .adm-btn:disabled { opacity: 0.55; cursor: not-allowed; }
      .adm-alert { padding: 0.65rem 1rem; border-radius: 4px; font-size: 0.82rem; margin-bottom: 0.8rem; }
      .adm-alert--ok { background: #EAF5EC; color: #276a2f; border: 1px solid #b8e4bc; }
      .adm-alert--err { background: #fdf0ee; color: #C0392B; border: 1px solid #f5c0ba; }
      .adm-form { display: flex; flex-direction: column; gap: 0.9rem; }
      .adm-form label { font-size: 0.78rem; font-weight: 600; color: #555; display: block; margin-bottom: 0.25rem; }
      .adm-form input, .adm-form textarea { width: 100%; border: 1px solid #D5CBBD; padding: 0.6rem 0.85rem; font-size: 0.88rem; font-family: var(--sans); border-radius: 4px; background: #FDFBF8; color: #111; transition: border-color 0.2s; box-sizing: border-box; }
      .adm-form input:focus, .adm-form textarea:focus { outline: none; border-color: var(--gold); }
      .adm-form textarea { resize: vertical; }
      .adm-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 2000; display: flex; align-items: flex-start; justify-content: center; padding: 3rem 1rem; overflow-y: auto; }
      .adm-modal { background: #fff; width: 100%; max-width: 680px; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.25); overflow: hidden; }
      .adm-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 1.5rem; border-bottom: 1px solid #EDE5D8; }
      .adm-modal-head h3 { font-size: 1rem; font-weight: 700; }
      .adm-modal-close { background: none; border: none; font-size: 1.1rem; cursor: pointer; color: #888; line-height: 1; }
      .adm-form--modal { padding: 1.5rem; }
      .adm-modal-foot { display: flex; justify-content: flex-end; gap: 0.6rem; padding-top: 1rem; border-top: 1px solid #EDE5D8; margin-top: 0.5rem; }
      .adm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .adm-preview-img { height: 120px; object-fit: cover; border-radius: 4px; border: 1px solid #EDE5D8; }
      @media (max-width: 768px) {
        .adm-shell { flex-direction: column; }
        .adm-sidebar { width: 100%; height: auto; position: relative; flex-direction: row; flex-wrap: wrap; padding: 1rem; gap: 0.5rem; }
        .adm-sidebar .adm-brand { width: 100%; margin-bottom: 0.5rem; }
        .adm-nav { flex-direction: row; flex: unset; }
        .adm-logout { margin-left: auto; }
        .adm-main { padding: 1.2rem; }
        .adm-grid-2 { grid-template-columns: 1fr; }
      }
    `}</style>
  )
}

function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const r = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      const d = await r.json()
      if (d.token) { onLogin(d.token) }
      else setErr(d.error || 'Password errata')
    } catch { setErr('Impossibile raggiungere il server') }
    setLoading(false)
  }

  return (
    <>
      <AdminStyles />
      <div className="adm-wrap">
        <div className="adm-login-card">
          <div className="adm-brand">Nova&apos;s <em>Legacy</em></div>
          <h2>Pannello Gestione</h2>
          <p className="adm-hint">Solo per uso interno — Kim&apos;s CMS</p>
          {err && <div className="adm-alert adm-alert--err">{err}</div>}
          <form onSubmit={submit} className="adm-form">
            <label>Password admin</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)}
              placeholder="••••••••" required />
            <button className="adm-btn adm-btn--primary" disabled={loading}>
              {loading ? 'Accesso…' : 'Accedi'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

// ── Blog tab ─────────────────────────────────────────────────────────────────
function BlogTab({ token }) {
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/cms`).then(r => r.json()).then(d => setPosts(d.blog || []))
  }, [])

  const save = async list => {
    setSaving(true)
    setMsg(null)
    try {
      const r = await fetch(`${API}/api/cms/blog`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(list),
      })
      const d = await r.json()
      if (d.ok) { setPosts(list); setMsg({ ok: true, text: 'Salvato!' }) }
      else setMsg({ ok: false, text: d.error || 'Errore' })
    } catch { setMsg({ ok: false, text: 'Errore di rete' }) }
    setSaving(false)
  }

  const del = id => {
    if (!confirm('Eliminare questo articolo?')) return
    save(posts.filter(p => p.id !== id))
  }

  const upsert = post => {
    const list = post.id && posts.find(p => p.id === post.id)
      ? posts.map(p => p.id === post.id ? post : p)
      : [...posts, { ...post, id: uid() }]
    save(list)
    setEditing(null)
  }

  return (
    <div className="adm-tab">
      <div className="adm-tab-header">
        <h3>Articoli Blog <span className="adm-count">{posts.length}</span></h3>
        <button className="adm-btn adm-btn--primary" onClick={() => setEditing({})}>+ Nuovo articolo</button>
      </div>
      {msg && <div className={`adm-alert ${msg.ok ? 'adm-alert--ok' : 'adm-alert--err'}`}>{msg.text}</div>}

      <div className="adm-list">
        {posts.map(p => (
          <div key={p.id} className="adm-row">
            <div className="adm-row-img">
              {p.img && <img src={p.img} alt="" />}
            </div>
            <div className="adm-row-body">
              <div className="adm-row-tag">{p.tag} · {p.date}</div>
              <div className="adm-row-title">{p.title}</div>
              <div className="adm-row-sub">{p.excerpt?.slice(0, 80)}…</div>
            </div>
            <div className="adm-row-actions">
              <button className="adm-btn adm-btn--sm" onClick={() => setEditing(p)}>Modifica</button>
              <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => del(p.id)}>Elimina</button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="adm-empty">Nessun articolo. Aggiungine uno!</p>}
      </div>

      {editing && (
        <BlogModal post={editing} onSave={upsert} onClose={() => setEditing(null)} saving={saving} />
      )}
    </div>
  )
}

function BlogModal({ post, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    id: post.id || '',
    title: post.title || '',
    tag: post.tag || '',
    date: post.date || '',
    excerpt: post.excerpt || '',
    img: post.img || '',
    body: Array.isArray(post.body) ? post.body.join('\n\n') : (post.body || ''),
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    onSave({
      ...form,
      body: form.body.split('\n\n').map(s => s.trim()).filter(Boolean),
    })
  }

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div className="adm-modal-head">
          <h3>{form.id ? 'Modifica articolo' : 'Nuovo articolo'}</h3>
          <button className="adm-modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} className="adm-form adm-form--modal">
          <div className="adm-grid-2">
            <div>
              <label>Titolo *</label>
              <input value={form.title} onChange={set('title')} required />
            </div>
            <div>
              <label>Tag (es. Conservation)</label>
              <input value={form.tag} onChange={set('tag')} placeholder="Conservation" />
            </div>
            <div>
              <label>Data</label>
              <input value={form.date} onChange={set('date')} placeholder="June 11, 2026" />
            </div>
            <div>
              <label>URL Immagine di copertina</label>
              <input value={form.img} onChange={set('img')} placeholder="https://… oppure /img/foto.jpg" />
            </div>
          </div>
          {form.img && <img src={form.img} className="adm-preview-img" alt="preview" />}
          <label>Estratto (breve descrizione)</label>
          <textarea rows={2} value={form.excerpt} onChange={set('excerpt')} />
          <label>Testo articolo (separa i paragrafi con una riga vuota)</label>
          <textarea rows={10} value={form.body} onChange={set('body')} />
          <div className="adm-modal-foot">
            <button type="button" className="adm-btn" onClick={onClose}>Annulla</button>
            <button type="submit" className="adm-btn adm-btn--primary" disabled={saving}>
              {saving ? 'Salvataggio…' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Shop tab ──────────────────────────────────────────────────────────────────
function ShopTab({ token }) {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/cms`).then(r => r.json()).then(d => setProducts(d.products || []))
  }, [])

  const save = async list => {
    setSaving(true)
    setMsg(null)
    try {
      const r = await fetch(`${API}/api/cms/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(list),
      })
      const d = await r.json()
      if (d.ok) { setProducts(list); setMsg({ ok: true, text: 'Salvato!' }) }
      else setMsg({ ok: false, text: d.error || 'Errore' })
    } catch { setMsg({ ok: false, text: 'Errore di rete' }) }
    setSaving(false)
  }

  const del = id => {
    if (!confirm('Eliminare questo prodotto?')) return
    save(products.filter(p => p.id !== id))
  }

  const upsert = prod => {
    const list = prod.id && products.find(p => p.id === prod.id)
      ? products.map(p => p.id === prod.id ? prod : p)
      : [...products, { ...prod, id: uid() }]
    save(list)
    setEditing(null)
  }

  return (
    <div className="adm-tab">
      <div className="adm-tab-header">
        <h3>Prodotti Shop <span className="adm-count">{products.length}</span></h3>
        <button className="adm-btn adm-btn--primary" onClick={() => setEditing({})}>+ Nuovo prodotto</button>
      </div>
      {msg && <div className={`adm-alert ${msg.ok ? 'adm-alert--ok' : 'adm-alert--err'}`}>{msg.text}</div>}

      <div className="adm-list">
        {products.map(p => (
          <div key={p.id} className="adm-row">
            <div className="adm-row-img">
              {p.photo && <img src={p.photo} alt="" />}
            </div>
            <div className="adm-row-body">
              <div className="adm-row-title">{p.name}</div>
              <div className="adm-row-sub">
                €{p.price} · R {p.priceZar}
                {p.sizes?.length > 0 && ` · Taglie: ${p.sizes.join(', ')}`}
              </div>
            </div>
            <div className="adm-row-actions">
              <button className="adm-btn adm-btn--sm" onClick={() => setEditing(p)}>Modifica</button>
              <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => del(p.id)}>Elimina</button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="adm-empty">Nessun prodotto.</p>}
      </div>

      {editing && (
        <ShopModal prod={editing} onSave={upsert} onClose={() => setEditing(null)} saving={saving} />
      )}
    </div>
  )
}

function ShopModal({ prod, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    id: prod.id || '',
    name: prod.name || '',
    price: prod.price ?? '',
    priceZar: prod.priceZar ?? '',
    sizes: Array.isArray(prod.sizes) ? prod.sizes.join(', ') : (prod.sizes || ''),
    photo: prod.photo || '',
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    onSave({
      ...form,
      price: parseFloat(form.price) || 0,
      priceZar: parseFloat(form.priceZar) || 0,
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
    })
  }

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div className="adm-modal-head">
          <h3>{form.id ? 'Modifica prodotto' : 'Nuovo prodotto'}</h3>
          <button className="adm-modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} className="adm-form adm-form--modal">
          <div className="adm-grid-2">
            <div>
              <label>Nome prodotto *</label>
              <input value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label>Prezzo in € *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required />
            </div>
            <div>
              <label>Prezzo in Rand (ZAR)</label>
              <input type="number" min="0" step="1" value={form.priceZar} onChange={set('priceZar')} />
            </div>
            <div>
              <label>Taglie (separate da virgola)</label>
              <input value={form.sizes} onChange={set('sizes')} placeholder="XS, S, M, L, XL — lascia vuoto se non applicabile" />
            </div>
          </div>
          <label>URL Foto prodotto</label>
          <input value={form.photo} onChange={set('photo')} placeholder="https://… oppure /img/foto.jpg" />
          {form.photo && <img src={form.photo} className="adm-preview-img" alt="preview" />}
          <div className="adm-modal-foot">
            <button type="button" className="adm-btn" onClick={onClose}>Annulla</button>
            <button type="submit" className="adm-btn adm-btn--primary" disabled={saving}>
              {saving ? 'Salvataggio…' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Animali tab ───────────────────────────────────────────────────────────────
function AnimaliTab({ token }) {
  const [animals, setAnimals] = useState([])
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/cms`).then(r => r.json()).then(d => setAnimals(d.animals || []))
  }, [])

  const save = async list => {
    setSaving(true)
    setMsg(null)
    try {
      const r = await fetch(`${API}/api/cms/animals`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(list),
      })
      const d = await r.json()
      if (d.ok) { setAnimals(list); setMsg({ ok: true, text: 'Salvato!' }) }
      else setMsg({ ok: false, text: d.error || 'Errore' })
    } catch { setMsg({ ok: false, text: 'Errore di rete' }) }
    setSaving(false)
  }

  const del = id => {
    if (!confirm('Eliminare questo animale?')) return
    save(animals.filter(a => a.id !== id))
  }

  const upsert = animal => {
    const list = animal.id && animals.find(a => a.id === animal.id)
      ? animals.map(a => a.id === animal.id ? animal : a)
      : [...animals, { ...animal, id: uid() }]
    save(list)
    setEditing(null)
  }

  return (
    <div className="adm-tab">
      <div className="adm-tab-header">
        <h3>Animali Adozione <span className="adm-count">{animals.length}</span></h3>
        <button className="adm-btn adm-btn--primary" onClick={() => setEditing({})}>+ Nuovo animale</button>
      </div>
      {msg && <div className={`adm-alert ${msg.ok ? 'adm-alert--ok' : 'adm-alert--err'}`}>{msg.text}</div>}

      <div className="adm-list">
        {animals.map(a => (
          <div key={a.id} className="adm-row">
            <div className="adm-row-img">
              {a.img && <img src={a.img} alt="" />}
            </div>
            <div className="adm-row-body">
              <div className="adm-row-title">{a.name}</div>
              <div className="adm-row-sub">{a.species} · €{a.price}/mese</div>
            </div>
            <div className="adm-row-actions">
              <button className="adm-btn adm-btn--sm" onClick={() => setEditing(a)}>Modifica</button>
              <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => del(a.id)}>Elimina</button>
            </div>
          </div>
        ))}
        {animals.length === 0 && <p className="adm-empty">Nessun animale.</p>}
      </div>

      {editing && (
        <AnimalModal animal={editing} onSave={upsert} onClose={() => setEditing(null)} saving={saving} />
      )}
    </div>
  )
}

function AnimalModal({ animal, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    id: animal.id || '',
    name: animal.name || '',
    species: animal.species || '',
    price: animal.price ?? '',
    img: animal.img || '',
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    onSave({ ...form, price: parseFloat(form.price) || 0 })
  }

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div className="adm-modal-head">
          <h3>{form.id ? 'Modifica animale' : 'Nuovo animale'}</h3>
          <button className="adm-modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} className="adm-form adm-form--modal">
          <div className="adm-grid-2">
            <div>
              <label>Nome *</label>
              <input value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label>Specie</label>
              <input value={form.species} onChange={set('species')} placeholder="Cheetah" />
            </div>
            <div>
              <label>Quota mensile in € *</label>
              <input type="number" min="1" step="1" value={form.price} onChange={set('price')} required />
            </div>
          </div>
          <label>URL Foto</label>
          <input value={form.img} onChange={set('img')} placeholder="https://… oppure /img/foto.jpg" />
          {form.img && <img src={form.img} className="adm-preview-img" alt="preview" />}
          <div className="adm-modal-foot">
            <button type="button" className="adm-btn" onClick={onClose}>Annulla</button>
            <button type="submit" className="adm-btn adm-btn--primary" disabled={saving}>
              {saving ? 'Salvataggio…' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Admin ────────────────────────────────────────────────────────────────
export default function Admin({ goTo }) {
  const [token, setToken] = useState(() => localStorage.getItem('nl_admin_token') || '')
  const [tab, setTab] = useState(0)

  const handleLogin = t => { localStorage.setItem('nl_admin_token', t); setToken(t) }
  const logout = () => { localStorage.removeItem('nl_admin_token'); setToken('') }

  if (!token) return <LoginScreen onLogin={handleLogin} goTo={goTo} />

  return (
    <>
    <AdminStyles />
    <div className="adm-wrap">
      <div className="adm-shell">
        {/* Sidebar */}
        <aside className="adm-sidebar">
          <div className="adm-brand" onClick={() => goTo('home')} style={{ cursor: 'pointer' }}>
            Nova&apos;s <em>Legacy</em>
          </div>
          <nav className="adm-nav">
            {TABS.map((t, i) => (
              <button key={t} className={`adm-nav-item ${tab === i ? 'adm-nav-item--active' : ''}`}
                onClick={() => setTab(i)}>
                <span className="adm-nav-icon">{['📝', '🛍️', '🐆'][i]}</span>
                {t}
              </button>
            ))}
          </nav>
          <button className="adm-logout" onClick={logout}>Esci</button>
        </aside>

        {/* Main */}
        <main className="adm-main">
          <div className="adm-main-header">
            <h2>{TABS[tab]}</h2>
            <span className="adm-main-sub">Gestisci i contenuti del sito</span>
          </div>
          {tab === 0 && <BlogTab token={token} />}
          {tab === 1 && <ShopTab token={token} />}
          {tab === 2 && <AnimaliTab token={token} />}
        </main>
      </div>
    </div>
    </>
  )
}
