import { useTranslation } from 'react-i18next'

function Conservation({ goTo }) {
  const { t } = useTranslation()

  return (
    <>
      <div className="page-hero-img">
        <img src="/img/due-ghepardi.png" alt="Conservazione" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('conservation.hero_label')}</span>
          <h1>{t('conservation.hero_title')}</h1>
          <p>{t('conservation.hero_sub')}</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <h2>{t('conservation.mission_title')}</h2>
          <p>{t('conservation.mission_p')}</p>

          <div className="highlight">
            <p>{t('conservation.highlight')}</p>
          </div>

          <h2>{t('conservation.edu_title')}</h2>
          <p>{t('conservation.edu_p1')}</p>
          <p>{t('conservation.edu_p2')}</p>

          <h2>{t('conservation.science_title')}</h2>
          <p>{t('conservation.science_p')}</p>

          <h2>{t('conservation.coexist_title')}</h2>
          <p>{t('conservation.coexist_p')}</p>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-dark" onClick={() => goTo('volunteer')}>
              {t('conservation.btn1')}
            </button>
            <button className="btn btn-outline-dark" onClick={() => goTo('internship')}>
              {t('conservation.btn2')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Conservation
