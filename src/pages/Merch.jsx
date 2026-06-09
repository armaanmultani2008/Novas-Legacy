import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const B = 'https://novaslegacy.com/wp-content/uploads/2022/08/'

const ITEMS = [
  { name: 'Classic Tee',      price: '€22', priceZar: 'R 350', sizes: ['XS','S','M','L','XL'],      photo: B + 'Nova-2.jpg' },
  { name: 'Coalition Hoodie', price: '€40', priceZar: 'R 650', sizes: ['S','M','L','XL','XXL'],      photo: B + '20201128_175257-1-scaled.jpg' },
  { name: 'Bush Cap',         price: '€16', priceZar: 'R 250', sizes: ['UNICA'],                     photo: B + 'IMG_20200927_132938_928.jpg' },
  { name: 'Field Tote Bag',   price: '€18', priceZar: 'R 280', sizes: null,                          photo: B + 'IMG-20210120-WA0031-1170x600.jpg' },
  { name: 'Safari Mug',       price: '€12', priceZar: 'R 180', sizes: null,                          photo: B + 'IMG-20210918-WA0026.jpg' },
  { name: 'Sticker Pack',     price: '€5',  priceZar: 'R 80',  sizes: null,                          photo: B + '20210512_112828-scaled.jpg' },
]

async function startCheckout(name, priceStr) {
  const price = parseFloat(priceStr.replace('€', ''))
  try {
    const r = await fetch(`${API}/api/stripe/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price }),
    })
    const data = await r.json()
    if (data.url) window.location.href = data.url
    else alert('Errore nel checkout. Riprova.')
  } catch {
    alert('Backend non raggiungibile. Assicurati che il server sia avviato.')
  }
}

function Merch({ goTo }) {
  useScrollReveal()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(null)

  const items = t('merch.items', { returnObjects: true })
  const infoStrip = t('merch.info', { returnObjects: true })

  const handleBuy = async (item) => {
    setLoading(item.name)
    await startCheckout(item.name, item.price)
    setLoading(null)
  }

  return (
    <>
      <div className="page-hero-img" style={{ height: '52vh' }}>
        <img src={B + '20201209_171109-scaled.jpg'} alt="Shop Nova's Legacy" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('merch.hero_label')}</span>
          <h1>Shop <em>Nova&apos;s Legacy</em></h1>
          <p>{t('merch.hero_sub')}</p>
        </div>
      </div>

      <div className="shop-page">
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <div className="rv" style={{ marginBottom: '2.5rem' }}>
            <span className="label">{t('merch.section_label')}</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: 'var(--dark)', lineHeight: 1.15 }}>
              {t('merch.section_title').split(' ').slice(0,-1).join(' ')} <em style={{ fontStyle: 'italic', color: 'var(--gold)', fontWeight: 400 }}>{t('merch.section_title').split(' ').slice(-1)}</em>
            </h2>
          </div>

          <div className="shop-grid">
            {ITEMS.map((item, i) => {
              const info = items[i] || {}
              return (
                <article key={item.name} className={`shop-card rv rv-d${Math.min((i % 3) + 1, 3)}`}>
                  <div className="s-photo">
                    <img src={item.photo} alt={item.name} />
                    <div className="s-photo-overlay" />
                    <div className="s-emoji-wrap">
                      <div className="s-emoji">◆</div>
                    </div>
                    {info.badge && (
                      <div className="s-badge">{info.badge}</div>
                    )}
                    <div className="s-brand">Nova&apos;s Legacy</div>
                  </div>

                  <div className="s-body">
                    <div className="s-cat">{info.category || ''}</div>
                    <h3 className="s-name">{item.name}</h3>
                    <p className="s-desc">{info.desc || ''}</p>

                    {item.sizes && (
                      <div className="s-sizes">
                        {item.sizes.map(sz => (
                          <span key={sz} className="s-size">{sz}</span>
                        ))}
                      </div>
                    )}

                    <div className="s-footer">
                      <div className="s-price">
                        {item.price}
                        <span>{item.priceZar} {t('merch.zar_label')}</span>
                      </div>
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => handleBuy(item)}
                        disabled={loading === item.name}
                        style={{ opacity: loading === item.name ? 0.6 : 1 }}
                      >
                        {loading === item.name ? '...' : t('merch.order_btn')}
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
