import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

const B = 'https://novaslegacy.com/wp-content/uploads/2022/08/'

const ITEM_STATIC = [
  { price: '€22', priceZar: 'R 350', sizes: ['XS','S','M','L','XL'],       emoji: '👕', photo: B + 'Nova-2.jpg' },
  { price: '€40', priceZar: 'R 650', sizes: ['S','M','L','XL','XXL'],      emoji: '🧥', photo: B + '20201128_175257-1-scaled.jpg' },
  { price: '€16', priceZar: 'R 250', sizes: ['UNICA'],                      emoji: '🧢', photo: B + 'IMG_20200927_132938_928.jpg' },
  { price: '€18', priceZar: 'R 280', sizes: null,                           emoji: '🎒', photo: B + 'IMG-20210120-WA0031-1170x600.jpg' },
  { price: '€12', priceZar: 'R 180', sizes: null,                           emoji: '☕', photo: B + 'IMG-20210918-WA0026.jpg' },
  { price: '€5',  priceZar: 'R 80',  sizes: null,                           emoji: '🏷️', photo: B + '20210512_112828-scaled.jpg' },
]

function Merch({ goTo }) {
  useScrollReveal()
  const { t } = useTranslation()
  const items = t('merch.items', { returnObjects: true })
  const info  = t('merch.info',  { returnObjects: true })

  return (
    <>
      <div className="page-hero-img" style={{ height: '52vh' }}>
        <img src={B + '20201209_171109-scaled.jpg'} alt="Shop Nova's Legacy" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('merch.hero_label')}</span>
          <h1>{t('merch.hero_title')}</h1>
          <p>{t('merch.hero_sub')}</p>
        </div>
      </div>

      <div className="shop-page">
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <div className="rv" style={{ marginBottom: '2.5rem' }}>
            <span className="label">{t('merch.section_label')}</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: 'var(--dark)', lineHeight: 1.15 }}>
              {t('merch.section_title')}
            </h2>
          </div>

          <div className="shop-grid">
            {items.map((item, i) => {
              const s = ITEM_STATIC[i]
              return (
                <article key={item.name} className={`shop-card rv rv-d${Math.min((i % 3) + 1, 3)}`}>
                  <div className="s-photo">
                    <img src={s.photo} alt={item.name} />
                    <div className="s-photo-overlay" />
                    <div className="s-emoji-wrap">
                      <div className="s-emoji">{s.emoji}</div>
                    </div>
                    {item.badge && <div className="s-badge">{item.badge}</div>}
                    <div className="s-brand">Nova&apos;s Legacy</div>
                  </div>

                  <div className="s-body">
                    <div className="s-cat">{item.category}</div>
                    <h3 className="s-name">{item.name}</h3>
                    <p className="s-desc">{item.desc}</p>

                    {s.sizes && (
                      <div className="s-sizes">
                        {s.sizes.map(sz => (
                          <span key={sz} className="s-size">{sz}</span>
                        ))}
                      </div>
                    )}

                    <div className="s-footer">
                      <div className="s-price">
                        {s.price}
                        <span>{s.priceZar} {t('merch.zar_label')}</span>
                      </div>
                      <a
                        href="mailto:kim@novaslegacy.co.za"
                        className="btn btn-dark btn-sm"
                        onClick={e => e.stopPropagation()}
                      >
                        {t('merch.order_btn')}
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="s-info-strip rv">
            {info.map(f => (
              <div key={f.title} className="s-info-item">
                <span className="s-info-icon">{f.icon}</span>
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
