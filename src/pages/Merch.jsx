import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const FALLBACK_ITEMS = [
  { id: '1', name: 'Classic Tee',      price: 22, priceZar: 350, sizes: ['XS','S','M','L','XL'],    photo: '/img/merch-tee.jpg' },
  { id: '2', name: 'Coalition Hoodie', price: 40, priceZar: 650, sizes: ['S','M','L','XL','XXL'],   photo: '/img/merch-hoodie.jpg' },
  { id: '3', name: 'Bush Cap',         price: 16, priceZar: 250, sizes: ['UNICA'],                  photo: '/img/merch-cap.jpg' },
  { id: '4', name: 'Field Tote Bag',   price: 18, priceZar: 280, sizes: [],                         photo: '/img/merch-tote.jpg' },
  { id: '5', name: 'Safari Mug',       price: 12, priceZar: 180, sizes: [],                         photo: '/img/merch-mug.jpg' },
  { id: '6', name: 'Sticker Pack',     price: 5,  priceZar: 80,  sizes: [],                         photo: '/img/merch-sticker.jpg' },
]

async function startCheckout(name, price, variantId, quantity, errCheckout, errBackend) {
  try {
    const r = await fetch(`${API}/api/stripe/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, variantId, quantity }),
    })
    const data = await r.json()
    if (data.url) window.location.href = data.url
    else alert(errCheckout)
  } catch {
    alert(errBackend)
  }
}

function Merch({ goTo }) {
  useScrollReveal()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(null)
  const [cmsItems, setCmsItems] = useState(null)
  const [printfulItems, setPrintfulItems] = useState(null)
  const [selectedVariants, setSelectedVariants] = useState({})
  const [selectedSizes, setSelectedSizes] = useState({})

  useEffect(() => {
    fetch(`${API}/api/cms`)
      .then(r => r.json())
      .then(d => { if (d.products?.length) setCmsItems(d.products) })
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

  const normalizedPrintful = printfulItems?.map(p => {
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

  const shopItems = normalizedPrintful || cmsItems || FALLBACK_ITEMS
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
    await startCheckout(item.name, item.price, variantId, 1, t('common.error_checkout'), t('common.error_backend'))
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
      `}</style>

      <div className="page-hero-img" style={{
        height: '65vh',
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

          <div className="shop-grid">
            {shopItems.map((item, i) => {
              const selectedSize = getSelectedSize(item)
              return (
                <article key={item.id || item.name} className={`shop-card rv rv-d${Math.min((i % 3) + 1, 3)}`} style={{borderRadius: '8px'}}>
                  <div className="s-photo">
                    <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div className="s-photo-overlay" />
                    <div className="s-emoji-wrap"><div className="s-emoji">◆</div></div>
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
