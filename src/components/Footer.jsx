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

          <div className="footer-col">
            <h5>{t('footer.col_social')}</h5>
            <a href="https://facebook.com/Feracare" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://instagram.com/novaslegacycheetahproject" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
            <a onClick={() => goTo('merch')}>{t('footer.shop')}</a>
            <a onClick={() => goTo('donate')}>{t('footer.donations')}</a>
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