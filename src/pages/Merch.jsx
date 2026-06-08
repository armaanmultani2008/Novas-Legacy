const ITEMS = [
  { emoji: '👕', name: 'Classic Tee', price: 'R 350 / €22', desc: '100% cotton, Nova\'s Legacy logo. Available in sand, olive, and charcoal.' },
  { emoji: '🧢', name: 'Bush Cap', price: 'R 250 / €16', desc: 'Embroidered cheetah paw logo. Adjustable. Perfect for the African sun.' },
  { emoji: '🎒', name: 'Field Tote Bag', price: 'R 280 / €18', desc: 'Durable canvas tote with the "Join the Coalition" print.' },
  { emoji: '🏷️', name: 'Sticker Pack', price: 'R 80 / €5', desc: 'Set of 6 waterproof vinyl stickers featuring our animals.' },
  { emoji: '☕', name: 'Safari Mug', price: 'R 180 / €12', desc: 'Ceramic mug with hand-drawn cheetah illustration.' },
  { emoji: '🧥', name: 'Hoodie', price: 'R 650 / €40', desc: 'Warm fleece-lined hoodie. Coalition logo on the back.' },
]

function Merch({ goTo }) {
  return (
    <>
      <div className="page-hero page-hero-dark">
        <p className="section-tag">~ Support the Mission ~</p>
        <h2 className="section-title">Shop <em>Merchandise</em></h2>
        <p className="intro">Every purchase directly funds animal care and conservation. Wear your support. Shipped worldwide.</p>
      </div>

      <div className="page-body">
        <div className="container" style={{ maxWidth: '1000px' }}>
          <span className="back-link" onClick={() => goTo('home')}>← Back to Home</span>

          <div className="shop-page-grid">
            {ITEMS.map(item => (
              <div key={item.name} className="shop-item">
                <div className="item-img">{item.emoji}</div>
                <h4>{item.name}</h4>
                <div className="price">{item.price}</div>
                <p>{item.desc}</p>
                <a className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>Add to Cart</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Merch
