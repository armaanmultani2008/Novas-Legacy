const POSTS = [
  {
    tag: 'Notizie',
    date: '15 Maggio 2025',
    title: 'Nuovi cuccioli di ghepardo nati a Nova\'s Legacy',
    excerpt: 'Grande gioia nella riserva: la nostra femmina Amira ha dato alla luce tre cuccioli sani. Il team veterinario li monitora 24 ore su 24. Aggiornamenti in arrivo.',
    img: 'https://novaslegacy.com/wp-content/uploads/2022/05/Gallery-28.jpg',
  },
  {
    tag: 'Volontariato',
    date: '3 Aprile 2025',
    title: 'Testimonianza: sei settimane nel bush con i ghepardi',
    excerpt: 'Marco, 24 anni, studente di biologia da Torino, ci racconta la sua esperienza di volontariato. "Ho imparato cose che non troverò mai in un libro di testo."',
    img: 'https://novaslegacy.com/wp-content/uploads/2022/05/Volunteer-04.jpg',
  },
  {
    tag: 'Conservazione',
    date: '18 Marzo 2025',
    title: 'Perché il ghepardo è più a rischio del leone',
    excerpt: 'Un approfondimento sui fattori che rendono il ghepardo particolarmente vulnerabile: dalla bassa diversità genetica al conflitto con gli allevatori.',
    img: 'https://novaslegacy.com/wp-content/uploads/2022/05/Gallery-41.jpg',
  },
  {
    tag: 'Progetto Cavalli',
    date: '7 Febbraio 2025',
    title: 'Spirit trova casa: la storia di un cavallo salvato',
    excerpt: 'Spirit è arrivato da noi in condizioni precarie. Sei mesi dopo, trotta libero nella riserva. La storia della sua riabilitazione.',
    img: 'https://novaslegacy.com/wp-content/uploads/2022/05/vol-4-1024x768.jpg',
  },
  {
    tag: 'Educazione',
    date: '22 Gennaio 2025',
    title: '200 bambini in visita dalla scuola di Bela-Bela',
    excerpt: 'Il nostro programma educativo ha accolto 200 studenti locali. Per molti di loro, era la prima volta che vedevano un ghepardo da vicino.',
    img: 'https://novaslegacy.com/wp-content/uploads/2022/05/Gallery-49.jpg',
  },
  {
    tag: 'Cheetah Run',
    date: '10 Gennaio 2025',
    title: 'Il Cheetah Run: come funziona e come prepararsi',
    excerpt: 'Tutto quello che devi sapere prima di correre accanto al ghepardo più veloce del mondo. Consigli, FAQ e prenotazione.',
    img: 'https://novaslegacy.com/wp-content/uploads/2022/08/IMG-20210120-WA0031-1170x600.jpg',
  },
]

function Blog({ goTo }) {
  return (
    <>
      <div className="page-hero-img">
        <img
          src="https://novaslegacy.com/wp-content/uploads/2022/05/Gallery-28.jpg"
          alt="Blog Nova's Legacy"
        />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">~ Dal Campo ~</span>
          <h1>News &amp; <em>Storie</em></h1>
          <p>Aggiornamenti, notizie e storie dal cuore del Waterberg.</p>
        </div>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 3rem' }}>
          <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginTop: '0.5rem',
          }}>
            {POSTS.map(p => (
              <div
                key={p.title}
                style={{
                  background: 'var(--off-white)',
                  border: '1px solid #EDE5D8',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>{p.tag}</span>
                    <span style={{ fontSize: '0.72rem', color: '#AAA' }}>{p.date}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', lineHeight: '1.3', marginBottom: '0.6rem', color: 'var(--dark)' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.83rem', color: '#777', lineHeight: '1.65', fontWeight: 300, marginBottom: '1rem' }}>{p.excerpt}</p>
                  <span style={{ fontSize: '0.73rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dark)' }}>
                    Leggi tutto →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Blog
