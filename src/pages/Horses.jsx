import { useTranslation } from 'react-i18next'

function Horses({ goTo }) {
  const { t } = useTranslation()

  return (
    <>
      <div className="page-hero-img">
        <img src="/img/cavallo-puledro.png" alt="Progetto Cavalli" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('horses.hero_label')}</span>
          <h1>{t('horses.hero_title')}</h1>
          <p>{t('horses.hero_sub')}</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <h2>{t('horses.who_title')}</h2>
          <p>{t('horses.who_p1')}</p>
          <p>{t('horses.who_p2')}</p>

          <div className="highlight">
            <p>{t('horses.highlight')}</p>
          </div>

          <h2>{t('horses.vol_title')}</h2>
          <p>{t('horses.vol_p1')}</p>
          <p>{t('horses.vol_p2')}</p>

          <h2>{t('horses.ecosystem_title')}</h2>
          <p>{t('horses.ecosystem_p1')}</p>
          <p>{t('horses.ecosystem_p2')}</p>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-dark" onClick={() => goTo('volunteer')}>
              {t('horses.btn1')}
            </button>
            <button className="btn btn-outline-dark" onClick={() => goTo('conservation')}>
              {t('horses.btn2')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Horses
