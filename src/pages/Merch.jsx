import { useScrollReveal } from '../hooks/useScrollReveal.js'

const B = 'https://novaslegacy.com/wp-content/uploads/2022/08/'

const ITEMS = [
  {
    emoji: '👕',
    name: 'Classic Tee',
    category: 'Abbigliamento',
    price: '€22',
    priceZar: 'R 350',
    desc: '100% cotone premium, logo Nova\'s Legacy. Colori: sabbia, oliva, carbone.',
    sizes: ['XS','S','M','L','XL'],
    badge: 'Bestseller',
    photo: B + 'Nova-2.jpg',
  },
  {
    emoji: '🧥',
    name: 'Coalition Hoodie',
    category: 'Abbigliamento',
    price: '€40',
    priceZar: 'R 650',
    desc: 'Felpa foderata in pile con logo "Join the Coalition" sul retro. Carbone, foresta.',
    sizes: ['S','M','L','XL','XXL'],
    badge: 'Nuovo',
    photo: B + '20201128_175257-1-scaled.jpg',
  },
  {
    emoji: '🧢',
    name: 'Bush Cap',
    category: 'Accessori',
    price: '€16',
    priceZar: 'R 250',
    desc: 'Logo ghepardo ricamato. Taglia unica regolabile. Perfetto per il sole africano.',
    sizes: ['UNICA'],
    badge: null,
    photo: B + 'IMG_20200927_132938_928.jpg',
  },
  {
    emoji: '🎒',
    name: 'Field Tote Bag',
    category: 'Accessori',
    price: '€18',
    priceZar: 'R 280',
    desc: 'Canvas resistente, stampa "Join the Coalition". Manici lunghi, tasca interna.',
    sizes: null,
    badge: null,
    photo: B + 'IMG-20210120-WA0031-1170x600.jpg',
  },
  {
    emoji: '☕',
    name: 'Safari Mug',
    category: 'Casa',
    price: '€12',
    priceZar: 'R 180',
    desc: 'Ceramica con illustrazione del ghepardo. Lavabile in lavastoviglie. 350ml.',
    sizes: null,
    badge: null,
    photo: B + 'IMG-20210918-WA0026.jpg',
  },
  {
    emoji: '🏷️',
    name: 'Sticker Pack',
    category: 'Collezione',
    price: '€5',
    priceZar: 'R 80',
    desc: '6 adesivi vinile impermeabile con i nostri animali. Per laptop, borracce, caschi.',
    sizes: null,
    badge: 'Idea Regalo',
    photo: B + '20210512_112828-scaled.jpg',
  },
]

function Merch({ goTo }) {
  useScrollReveal()
  return (
      <>
        <div className="page-hero-img" style={{ height: '52vh' }}>
          <img src={B + '20201209_171109-scaled.jpg'} alt="Shop Nova's Legacy" />
          <div className="page-hero-img-overlay" />
          <div className="page-hero-text">
            <span className="label label-light">~ Support the Mission ~</span>
            <h1>Shop <em>Nova&apos;s Legacy</em></h1>
            <p>Ogni acquisto finanzia le cure degli animali e il programma di conservazione.</p>
          </div>
        </div>

        <div className="shop-page">
          <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 2rem' }}>
            <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

            <div className="rv" style={{ marginBottom: '2.5rem' }}>
              <span className="label">~ Il Nostro Merch ~</span>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: 'var(--dark)', lineHeight: 1.15 }}>
                Indossa il tuo <em style={{ fontStyle: 'italic', color: 'var(--gold)', fontWeight: 400 }}>sostegno</em>
              </h2>
            </div>

            <div className="shop-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {ITEMS.map((item, i) => (
                  <article
                      key={item.name}
                      className={`shop-card rv rv-d${Math.min((i % 3) + 1, 3)}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        background: 'var(--off-white)',
                        border: '1px solid #EDE5D8',
                        overflow: 'hidden'
                      }}
                  >
                    <div className="s-photo" style={{ width: '100%', aspectRatio: '4 / 3', height: 'auto', position: 'relative', overflow: 'hidden' }}>
                      <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                      <div className="s-photo-overlay" />
                      <div className="s-emoji-wrap">
                        <div className="s-emoji">{item.emoji}</div>
                      </div>
                      {item.badge && (
                          <div className="s-badge">{item.badge}</div>
                      )}
                      <div className="s-brand">Nova&apos;s Legacy</div>
                    </div>

                    <div className="s-body" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '1.5rem' }}>
                      <div className="s-cat">{item.category}</div>
                      <h3 className="s-name">{item.name}</h3>
                      <p className="s-desc" style={{ fontSize: '0.88rem', color: '#555', lineHeight: '1.6', flexGrow: 1 }}>{item.desc}</p>

                      {item.sizes && (
                          <div className="s-sizes" style={{ marginBottom: '1.2rem' }}>
                            {item.sizes.map(sz => (
                                <span key={sz} className="s-size">{sz}</span>
                            ))}
                          </div>
                      )}

                      <div className="s-footer" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="s-price">
                          {item.price}
                          <span>{item.priceZar} in ZAR</span>
                        </div>
                        <a
                            href="mailto:kim@novaslegacy.co.za"
                            className="btn btn-dark btn-sm"
                            onClick={e => e.stopPropagation()}
                        >
                          Ordina →
                        </a>
                      </div>
                    </div>
                  </article>
              ))}
            </div>

            <div className="s-info-strip rv">
              {[
                { icon: '📦', t: 'Spedizione Mondiale', d: 'Oltre 40 paesi, 5–14 giorni lavorativi.' },
                { icon: '💳', t: 'Pagamento Sicuro',    d: 'PayPal, bonifico, carta. Ricevuta inclusa.' },
                { icon: '🌿', t: 'Impatto Diretto',     d: '100% dei proventi → cure animali e conservazione.' },
              ].map(f => (
                  <div key={f.t} className="s-info-item">
                    <span className="s-info-icon">{f.icon}</span>
                    <strong>{f.t}</strong>
                    <span>{f.d}</span>
                  </div>
              ))}
            </div>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 300 }}>
              Ordini personalizzati o all&apos;ingrosso →{' '}
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