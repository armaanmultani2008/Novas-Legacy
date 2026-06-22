import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import { useCMSImages } from '../CMSContext'

const KIM_HERO_BG = '/img/kim-savana.svg'
const KIM_PHOTO_DEFAULT = '/img/kim-portrait.jpg'

function KimStory({ goTo }) {
  useScrollReveal()
  const { t } = useTranslation()
  const cmsImages = useCMSImages()

  return (
    <>
      <div className="page-hero-img" style={{ height: '52dvh' }}>
        <img src={cmsImages.kim_story_hero || KIM_HERO_BG} alt="Savana al tramonto — Nova's Legacy" style={{ objectPosition: 'center 55%' }} />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('kim_story.hero_label')}</span>
          <h1>{t('kim_story.hero_title')} <em>{t('kim_story.hero_title_em')}</em></h1>
          <p>{t('kim_story.hero_sub')}</p>
        </div>
      </div>

      <div className="page-content" style={{ padding: '4rem 1.5rem' }}>
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-dark" onClick={() => goTo('nova-story')}>
              {t('kim_story.btn1')}
            </button>
            <button className="btn btn-outline-dark" onClick={() => goTo('adopt')}>
              {t('kim_story.btn2')}
            </button>
          </div>

          <div className="kim-split rv">
            <div className="kim-photo-wrap">
              <img src={cmsImages.kim_story_portrait || KIM_PHOTO_DEFAULT} alt="Kim Hiltrop — fondatrice di Nova's Legacy" />
            </div>
            <div className="kim-text">
              <span className="label">{t('kim_story.section_label')}</span>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,3vw,2.8rem)', margin: '0.5rem 0 0.5rem', lineHeight: 1.15 }}>
                {t('kim_story.section_title')} <em style={{ color: 'var(--gold)', fontWeight: 400 }}>{t('kim_story.section_title_em')}</em>
              </h2>
              <p className="body-lg">{t('kim_story.p1')}</p>
            </div>
          </div>

          <div className="kim-quotes rv rv-d1">
            <blockquote className="kim-quote">
              <p>{t('kim_story.quote1')}</p>
            </blockquote>
            <blockquote className="kim-quote">
              <p>{t('kim_story.quote2')}</p>
            </blockquote>
            <blockquote className="kim-quote">
              <p>{t('kim_story.quote3')}</p>
            </blockquote>
          </div>
        </div>
      </div>
    </>
  )
}

export default KimStory
