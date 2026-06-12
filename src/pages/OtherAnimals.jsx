import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Lightbox from '../components/Lightbox'

// Array completo per il Lightbox (unificato per l'indice globale)
const ALL_PHOTOS = [
    '/img/lions.png',                 // 0
    '/img/ghost-pack.png',            // 1
    '/img/lince.png',                 // 2
    '/img/fox.png',                   // 3
    '/img/porcospino.png',            // 4
    '/img/dumbo.png',                 // 5
    '/img/antille.png',               // 6
    '/img/horse-zebra.png'            // 7
]

function OtherAnimals({ goTo }) {
    const { t } = useTranslation()
    const [lbIdx, setLbIdx] = useState(null)

    // Didscascalie per il Lightbox coerenti con l'ordine di ALL_PHOTOS
    const photoCaps = [
        t('other_animals.cap_lions', 'Lions Sanctuary'),
        t('other_animals.cap_ghost', 'Ghost Pack Predators'),
        t('other_animals.cap_lince', 'Caracal / Lynx'),
        t('other_animals.cap_fox', 'Bat-eared Fox'),
        t('other_animals.cap_porcupine', 'Rescued Porcupine'),
        t('other_animals.cap_dumbo', 'Sanctuary Resident'),
        t('other_animals.cap_antille', 'Antelope Species'),
        t('other_animals.cap_zebra', 'Free-roaming Zebras')
    ]

    // Funzione helper per generare i singoli box delle immagini in modo pulito
    const renderImageBlock = (globalIdx) => (
        <div
            className="rv"
            style={{
                height: '260px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '4px'
            }}
            onClick={() => setLbIdx(globalIdx)}
        >
            <img
                src={ALL_PHOTOS[globalIdx]}
                alt={photoCaps[globalIdx]}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s'
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.target.style.transform = 'none'}
            />
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                padding: '0.8rem',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                pointerEvents: 'none',
            }}>{photoCaps[globalIdx]}</div>
        </div>
    )

    return (
        <>
            <style>{`
        .sub-animal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 8px;
          margin: 2rem 0;
        }
      `}</style>

            <div className="page-hero-img" style={{
                height: '75vh',
                minHeight: '450px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <picture style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
                    <source media="(max-width: 768px)" srcSet="/img/other-animals-hero-mobile.jpg" />
                    <img
                        src="/img/other-animals-hero.jpg"
                        alt="Other Animals Sanctuary"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }}
                    />
                </picture>
                <div className="page-hero-img-overlay" />
                <div className="page-hero-text">
                    <span className="label label-light">{t('other_animals.hero_label', 'Adopt a Wild Heart')}</span>
                    <h1>{t('other_animals.hero_title', 'Beyond Cheetahs')}</h1>
                    <p>{t('other_animals.hero_sub', 'Providing a lifelong home and sanctuary to diverse wildlife species.')}</p>
                </div>
            </div>

            <div className="page-content">
                <div className="container">
                    <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button onClick={() => goTo('home', 'contact')} className="btn btn-dark">
                            {t('other_animals.btn_adopt', 'Adopt an Animal')}
                        </button>
                        <button className="btn btn-outline-dark" onClick={() => goTo('volunteer')}>
                            {t('other_animals.btn_volunteer', 'Join Us')}
                        </button>
                    </div>

                    <h2>{t('other_animals.sanctuary_title', 'A Lifelong Home for Every Soul')}</h2>
                    <p>{t('other_animals.sanctuary_p1', 'In addition to cheetahs, we provide a lifelong home to many other animal species. Lions, tigers, and small wild cats all find the care and protection they deserve here. Alongside them, we also care for numerous free-roaming herbivores, offering them a safe place to live out their lives.')}</p>

                    <div className="highlight" style={{ margin: '2rem 0' }}>
                        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--dark)', marginBottom: '0.5rem' }}>
                            {t('other_animals.feracare_title', 'In Partnership with FeraCare Wildlife Centre')}
                        </h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                            {t('other_animals.feracare_text', 'Our conservation efforts are strengthened by a proud collaboration with FeraCare Wildlife Centre in South Africa. FeraCare is renowned for its dedicated ethical contribution to cheetah conservation and wildlife protection. Together, we share vital research, optimize sustainable sanctuary management, and elevate care standards for rescued African fauna.')}
                        </p>
                    </div>

                    <h2>{t('other_animals.cats_title', 'Big & Medium Predators')}</h2>
                    <p>{t('other_animals.cats_p1', 'From the majestic roars of our rescued lions to the elusive habits of wild cat species, our sanctuary ensures species-specific nourishment and enrichment programs. Many of our predators come from situations of neglect or human-wildlife conflict.')}</p>

                    <div className="sub-animal-grid">
                        {renderImageBlock(0)} {/* lions.png */}
                        {renderImageBlock(1)} {/* ghost-pack.png */}
                        {renderImageBlock(2)} {/* lince.png */}
                    </div>

                    <h2>{t('other_animals.small_title', 'Small Wildlife & Specialized Care')}</h2>
                    <p>{t('other_animals.small_p1', 'Smaller nocturnal predators and local mammals find a secure haven here. Every single habitat is custom-designed around the precise biological needs of its guests, ensuring safety, structural dignity, and specialized veterinary monitoring for those who cannot be reintegrated into the open wilderness.')}</p>

                    <div className="sub-animal-grid">
                        {renderImageBlock(3)} {/* fox.png */}
                        {renderImageBlock(4)} {/* porcospino.png */}
                        {renderImageBlock(5)} {/* dumbo.png */}
                    </div>

                    <h2>{t('other_animals.herbivores_title', 'Free-Roaming Herbivores')}</h2>
                    <p>{t('other_animals.herbivores_p1', 'The reserve hosts vast, protected open fields where zebras, antelopes, and other free-roaming herbivores live peacefully. They play a vital role in keeping our ecosystem balanced and maintaining the natural African bushveld terrain.')}</p>

                    <div className="sub-animal-grid">
                        {renderImageBlock(6)} {/* antille.png */}
                        {renderImageBlock(7)} {/* horse-zebra.png */}
                    </div>

                    {lbIdx !== null && (
                        <Lightbox srcs={ALL_PHOTOS} captions={photoCaps} idx={lbIdx} setIdx={setLbIdx} />
                    )}

                </div>
            </div>
        </>
    )
}

export default OtherAnimals