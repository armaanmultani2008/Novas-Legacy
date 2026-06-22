import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import { useUser } from '../UserContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const FALLBACK_ITEMS = [
]

async function startCheckout(name, price, variantId, quantity, errCheckout, errBackend, userId) {
  try {
    const r = await fetch(`${API}/api/stripe/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, variantId, quantity, ...(userId ? { userId } : {}) }),
    })
    const data = await r.json()
    if (data.url) window.location.href = data.url
    else alert(errCheckout)
  } catch {
    alert(errBackend)
  }
}

const CATEGORY_RULES = [
  { key: 'tshirts',  label: 'T-Shirts',    match: /t-?shirt|\btee\b/i },
  { key: 'hoodies',  label: 'Hoodies',     match: /hoodie|sweatshirt|crewneck/i },
  { key: 'headwear', label: 'Headwear',    match: /\bcap\b|hat|beanie|bucket|twill/i },
  { key: 'mugs',     label: 'Mugs',        match: /\bmug\b|cup/i },
  { key: 'bottles',  label: 'Bottles',     match: /bottle|flask/i },
  { key: 'other',    label: 'Accessories', match: /bag|tote|sticker|poster|phone|pillow|print/i },
]

function getCategory(name) {
  for (const rule of CATEGORY_RULES) {
    if (rule.match.test(name)) return rule.key
  }
  return 'other'
}

function getEffectiveCategory(item, overrides) {
  return overrides[item.id]?.category || getCategory(item.name)
}

function Merch({ goTo }) {
  useScrollReveal()
  const { t } = useTranslation()
  const { user } = useUser()
  const [loading, setLoading] = useState(null)
  const [cmsItems, setCmsItems] = useState(null)
  const [overrides, setOverrides] = useState({})
  const [printfulItems, setPrintfulItems] = useState(null)
  const [selectedVariants, setSelectedVariants] = useState({})
  const [selectedSizes, setSelectedSizes] = useState({})
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    fetch(`${API}/api/cms`)
      .then(r => r.json())
      .then(d => {
        if (d.products?.length) setCmsItems(d.products)
        if (d.productOverrides) setOverrides(d.productOverrides)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch(`${API}/api/printful/products`)
      .then(r => r.json())
      .then(products => {
        if (!Array.isArray(products) || !products.length) return
        setPrintfulItems(products)
        const defaults = {}
        products.forEach(p => {
          if (p.variants?.length) defaults[p.id] = p.variants[0].id
        })
        setSelectedVariants(defaults)
      })
      .catch(() => {})
  }, [])

  const normalizedPrintful = printfulItems
    ?.filter((p, idx, arr) => arr.findIndex(x => x.id === p.id) === idx)
    .map(p => {
      const selectedId = selectedVariants[p.id] || p.variants?.[0]?.id
      const activeVariant = p.variants?.find(v => v.id === selectedId) || p.variants?.[0]
      return {
        id: p.id,
        name: p.name,
        photo: p.thumbnail,
        price: activeVariant?.price ?? 0,
        priceZar: null,
        sizes: [...new Set(p.variants?.map(v => v.size).filter(Boolean) ?? [])],
        variants: p.variants,
        isPrintful: true,
      }
    })

  const allItems = (normalizedPrintful || cmsItems || FALLBACK_ITEMS)
    .filter(item => overrides[item.id]?.available !== false)

  const availableCategories = CATEGORY_RULES.filter(r =>
    allItems.some(item => getEffectiveCategory(item, overrides) === r.key)
  )

  const shopItems = activeFilter === 'all'
    ? allItems
    : allItems.filter(item => getEffectiveCategory(item, overrides) === activeFilter)

  const infoStrip = t('merch.info', { returnObjects: true })

  const handleSizeSelect = (productId, size, isPrintful) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }))
    if (!isPrintful) return
    const item = printfulItems?.find(p => p.id === productId)
    if (!item) return
    const variant = item.variants.find(v => v.size === size)
    if (variant) setSelectedVariants(prev => ({ ...prev, [productId]: variant.id }))
  }

  const handleBuy = async (item) => {
    setLoading(item.id || item.name)
    const variantId = item.isPrintful ? (selectedVariants[item.id] || item.variants?.[0]?.id) : undefined
    await startCheckout(item.name, item.price, variantId, 1, t('common.error_checkout'), t('common.error_backend'), user?._id)
    setLoading(null)
  }

  const fmtPrice = p => `€${typeof p === 'number' ? p : p}`
  const fmtZar   = p => `R ${typeof p === 'number' ? p : p}`

  const getSelectedSize = (item) => {
    if (selectedSizes[item.id]) return selectedSizes[item.id]
    if (item.isPrintful && item.variants?.length) return item.variants[0].size
    if (item.sizes?.length) return item.sizes[0]
    return null
  }

  return (
    <>
      <style>{`
        .shop-card .s-photo {
          height: 280px;
        }
        @media (min-width: 768px) {
          .shop-card .s-photo {
            height: 340px;
          }
        }
        .s-size.selected {
          background: var(--dark);
          color: #fff;
          border-color: var(--dark);
        }
        .s-size { cursor: pointer; }
        .shop-filter-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .shop-filter-label {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--gray);
        }
        .shop-filter-select {
          appearance: none;
          -webkit-appearance: none;
          background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23333' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 0.9rem center;
          border: 1.5px solid #ddd;
          border-radius: 6px;
          padding: 0.5rem 2.4rem 0.5rem 0.9rem;
          font-size: 0.88rem;
          font-family: inherit;
          color: var(--dark);
          cursor: pointer;
          transition: border-color 0.2s;
          min-width: 160px;
        }
        .shop-filter-select:focus {
          outline: none;
          border-color: var(--gold);
        }
        .shop-count {
          margin-left: auto;
          font-size: 0.8rem;
          color: var(--gray);
        }
      `}</style>

      <div className="page-hero-img" style={{
        height: '65dvh',
        minHeight: '450px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <picture style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
          <source media="(max-width: 768px)" srcSet="/img/merch-hero.jpg" />
          <img
            src="/img/hero.png"
            alt="Shop Nova's Legacy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}
          />
        </picture>
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('merch.hero_label')}</span>
          <h1>Shop <em>Nova&apos;s Legacy</em></h1>
          <p>{t('merch.hero_sub')}</p>
        </div>
      </div>

      <div className="shop-page">
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <div className="rv" style={{ marginBottom: '2.5rem' }}>
            <span className="label">{t('merch.section_label')}</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: 'var(--dark)', lineHeight: 1.15 }}>
              {t('merch.section_title').split(' ').slice(0,-1).join(' ')} <em style={{ fontStyle: 'italic', color: 'var(--gold)', fontWeight: 400 }}>{t('merch.section_title').split(' ').slice(-1)}</em>
            </h2>
          </div>

          {availableCategories.length > 0 && (
            <div className="shop-filter-bar rv">
              <span className="shop-filter-label">Filter</span>
              <select
                className="shop-filter-select"
                value={activeFilter}
                onChange={e => setActiveFilter(e.target.value)}
              >
                <option value="all">All products</option>
                {availableCategories.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
              <span className="shop-count">{shopItems.length} product{shopItems.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="shop-grid">
            {shopItems.map((item, i) => {
              const selectedSize = getSelectedSize(item)
              return (
                <article key={item.id || item.name} className={`shop-card rv rv-d${Math.min((i % 3) + 1, 3)}`} style={{borderRadius: '8px'}}>
                  <div className="s-photo">
                    <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div className="s-photo-overlay" />
                    <div className="s-brand">Nova&apos;s Legacy</div>
                  </div>

                  <div className="s-body">
                    <h3 className="s-name">{item.name}</h3>

                    {item.sizes?.length > 0 && (
                      <div className="s-sizes">
                        {item.sizes.map(sz => (
                          <span
                            key={sz}
                            className={`s-size${selectedSize === sz ? ' selected' : ''}`}
                            onClick={() => handleSizeSelect(item.id, sz, item.isPrintful)}
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="s-footer">
                      <div className="s-price">
                        {fmtPrice(item.price)}
                        {item.priceZar && <span>{fmtZar(item.priceZar)} {t('merch.zar_label')}</span>}
                      </div>
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => handleBuy(item)}
                        disabled={loading === (item.id || item.name)}
                        style={{ opacity: loading === (item.id || item.name) ? 0.6 : 1 }}
                      >
                        {loading === (item.id || item.name) ? '...' : t('merch.order_btn')}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="s-info-strip rv">
            {infoStrip.map(f => (
              <div key={f.title} className="s-info-item">
                <span className="s-info-icon">◆</span>
                <strong>{f.title}</strong>
                <span>{f.desc}</span>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 300 }}>
            {t('merch.custom_orders')}{' '}
            <a href="mailto:kim@novaslegacy.co.za" style={{ color: 'var(--gold)', fontWeight: 600 }}>
              kim@novaslegacy.co.za
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

export default Merch
