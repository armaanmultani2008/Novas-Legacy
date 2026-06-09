import { useTranslation } from 'react-i18next'

function Cheetah({ goTo }) {
  const { t } = useTranslation()

  return (
    <>
      <div className="page-hero-img">
        <img src="/img/nova-madre-cucciolo.png" alt="Ghepardo Nova's Legacy" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('cheetah.hero_label')}</span>
          <h1>{t('cheetah.hero_title')}</h1>
          <p>{t('cheetah.hero_sub')}</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <h2>{t('cheetah.nova_title')}</h2>
          <p>{t('cheetah.nova_p1')}</p>
          <p>{t('cheetah.nova_p2')}</p>

          <div className="highlight">
            <p>{t('cheetah.highlight')}</p>
          </div>

          <h2>{t('cheetah.run_title')}</h2>
          <p>{t('cheetah.run_p1')}</p>
          <p>{t('cheetah.run_p2')}</p>

          <h2>{t('cheetah.breeding_title')}</h2>
          <p>{t('cheetah.breeding_p1')}</p>
          <p>{t('cheetah.breeding_p2')}</p>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-dark" onClick={() => goTo('volunteer')}>
              {t('cheetah.btn1')}
            </button>
            <button className="btn btn-outline-dark" onClick={() => goTo('adopt')}>
              {t('cheetah.btn2')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cheetah
