import { useTranslation } from 'react-i18next'

function Footer({ goTo }) {
  const { t } = useTranslation()

  return (
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <div className="nav-logo" onClick={() => goTo('home')} style={{ cursor: 'pointer' }}>
              Nova&apos;s <em>Legacy</em>
            </div>
            <p>{t('footer.brand_desc')}</p>
            <div className="contact-small">
              <a href="mailto:kim@novaslegacy.co.za">kim@novaslegacy.co.za</a>
              <a href="tel:+27823520940">+27 82 352 0940</a>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
              431 Diepdrift, Bela-Bela, 0480, South Africa
            </span>
            </div>
          </div>

          <div className="footer-col">
            <h5>{t('footer.col_project')}</h5>
            <a onClick={() => goTo('nova-story')}>{t('nav.nova_story')}</a>
            <a onClick={() => goTo('cheetah-run')}>{t('nav.cheetah_run')}</a>
            <a onClick={() => goTo('conservation')}>{t('footer.conservation')}</a>
            <a onClick={() => goTo('horses')}>{t('footer.horses')}</a>
            <a onClick={() => goTo('blog')}>{t('footer.blog')}</a>
          </div>

          <div className="footer-col">
            <h5>{t('footer.col_involved')}</h5>
            <a onClick={() => goTo('volunteer')}>{t('footer.volunteer')}</a>
            <a onClick={() => goTo('internship')}>{t('footer.internship')}</a>
            <a onClick={() => goTo('visit')}>{t('footer.stay')}</a>
            <a onClick={() => goTo('adopt')}>{t('footer.adopt')}</a>
            <a onClick={() => goTo('faq')}>{t('nav.FAQ')}</a>
          </div>

          <div className="footer-social-col">
            <h5>{t('footer.col_social')}</h5>
            <div className="footer-social-icons">
              <a href="https://www.instagram.com/novaslegacycheetahproject/" target="_blank" rel="noreferrer" className="footer-social-icon-item">
                <div className="social-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="social-icon-label">Instagram</span>
              </a>
              <a href="https://www.facebook.com/Feracare" target="_blank" rel="noreferrer" className="footer-social-icon-item">
                <div className="social-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="social-icon-label">Facebook</span>
              </a>
              <a href="https://www.tiktok.com/@novaslegacycheetahs" target="_blank" rel="noreferrer" className="footer-social-icon-item">
                <div className="social-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.83 4.83 0 01-1.01-.08z"/>
                  </svg>
                </div>
                <span className="social-icon-label">TikTok</span>
              </a>
            </div>

            <div className="footer-shop-links" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a onClick={() => goTo('merch')} style={{ cursor: 'pointer' }}>{t('footer.shop')}</a>
              <a onClick={() => goTo('donate')} style={{ cursor: 'pointer' }}>{t('footer.donations')}</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t('footer.copyright')}</span>
          <span>{t('footer.reg')}</span>
          <span
              onClick={() => goTo('admin')}
              style={{ cursor: 'pointer', opacity: 0.12, fontSize: '0.6rem', userSelect: 'none' }}
              title="Admin"
          >●</span>
        </div>
      </footer>
  )
}

export default Footer