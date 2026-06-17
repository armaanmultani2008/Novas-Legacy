import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

function Wishlist({ goTo }) {
  useScrollReveal()
  const { t } = useTranslation()

  const wishlistItems = t('donate.wishlist.items', { returnObjects: true }) || []

  return (
    <>
      <div className="page-hero-img" style={{ height: '52vh' }}>
        <img src="/img/kim-savana.svg" alt="Wishlist Nova's Legacy" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('donate.wishlist.sub_label')}</span>
          <h1>
            {t('donate.wishlist.title_start')} <em>{t('donate.wishlist.title_em')}</em>
          </h1>
        </div>
      </div>

      <div className="donate-page">
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <div className="rv" style={{ color: '#555', lineHeight: '1.7', fontWeight: 300, fontSize: '0.95rem', marginBottom: '2rem' }}>
            <p style={{ marginBottom: '1rem' }}>{t('donate.wishlist.p1')}</p>
            <p style={{ marginBottom: '1.5rem' }}>{t('donate.wishlist.p2')}</p>

            <div className="highlight" style={{ margin: '2rem 0' }}>
              <p style={{ margin: 0 }}>
                ◆ <strong>{t('donate.wishlist.urgent_title')}</strong> {t('donate.wishlist.urgent_text')}
              </p>
            </div>
          </div>

          <div className="rv" style={{ textAlign: 'center', margin: '2.5rem 0' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--dark)' }}>
              {t('donate.wishlist.list_title')}
            </h3>
            <a
              href="https://www.takealot.com/wishlist/shared/1:820977a428b5448cbe57cf6015024c7c"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark"
              style={{ padding: '1rem 2.5rem', letterSpacing: '0.1em' }}
            >
              TAKEALOT WISHLIST
            </a>
          </div>

          <div className="rv" style={{ color: '#777', lineHeight: '1.65', fontWeight: 300, fontSize: '0.88rem', fontStyle: 'italic', textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
            <p>{t('donate.wishlist.disclaimer_1')}</p>
            <p style={{ fontWeight: 600, color: 'var(--dark)', marginTop: '1rem' }}>
              {t('donate.wishlist.disclaimer_2')}
            </p>
          </div>

          <div className="rv" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: 'var(--dark)', borderBottom: '2px solid #EDE5D8', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              {t('donate.wishlist.need_start')} <em>{t('donate.wishlist.need_em')}</em>
            </h3>

            <div className="programs-grid" style={{ display: 'grid', gap: '1.2rem', marginTop: '1rem' }}>
              {wishlistItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--off-white)',
                    border: '1px solid #EDE5D8',
                    padding: '1.2rem 1.5rem',
                    borderRadius: '4px',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', color: 'var(--dark)', lineHeight: '1.5', fontWeight: 300 }}>
                    ◆ {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '4rem', fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 300 }}>
            {t('donate.wishlist.footer_text')}{' '}
            <a href="mailto:kim@novaslegacy.co.za" style={{ color: 'var(--gold)', fontWeight: 600 }}>
              kim@novaslegacy.co.za
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

export default Wishlist
