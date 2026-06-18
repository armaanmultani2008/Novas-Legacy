import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Lightbox from '../components/Lightbox'

const ALL_PHOTOS = [
    '/img/lions.png',
    '/img/ghost-pack.png',
    '/img/lince.png',
    '/img/fox.png',
    '/img/porcospino.png',
    '/img/dumbo.png',
    '/img/antille.png',
    '/img/horse-zebra.png'
]

function OtherAnimals({ goTo }) {
    const { t } = useTranslation()
    const [lbIdx, setLbIdx] = useState(null)

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

    const cardStyle = {
        height: '320px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '6px'
    }

    const imgStyle = {
        width: '100%',
        height: '100%',
        minWidth: '300px',
        objectFit: 'cover',
        display: 'block',
        transition: 'transform 0.5s'
    }

    const overlayStyle = {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
        padding: '0.8rem',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '0.68rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        pointerEvents: 'none'
    }

    return (
        <>
            <style>{`
                .responsive-grid-3 {
                  display: grid;
                  grid-template-columns: 1fr; 
                  gap: 6px; 
                  margin: 2.5rem 0;
                }
                .responsive-grid-2 {
                  display: grid;
                  grid-template-columns: 1fr; 
                  gap: 6px;
                  margin: 2.5rem 0;
                }
                
                @media (min-width: 768px) {
                  .responsive-grid-3 { grid-template-columns: repeat(3, 1fr); }
                  .responsive-grid-2 { grid-template-columns: repeat(2, 1fr); }
                }

                @media (max-width: 768px) { 
                  .page-hero-img-photo { object-position: 75% center !important; }
                }
                @media (max-width: 1080px) and (min-width: 769px) { 
                  .page-hero-img-photo { object-position: 85% center !important; } 
                }
            `}</style>

            <div className="page-hero-img" style={{ height: '75dvh', minHeight: '450px', position: 'relative', overflow: 'hidden' }}>
                <picture style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
                    <source media="(max-width: 768px)" srcSet="/img/leoni-cuccioli.png" />
                    <img
                        src="/img/adotta-wild-hearts.png"
                        alt="Other Animals Sanctuary"
                        className='page-hero-img-photo'
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', display: 'block' }}
                    />
                </picture>
                <div className="page-hero-img-overlay" />
                <div className="page-hero-text">
                    <span className="label label-light">{t('other_animals.hero_label', 'Adopt a Wild Heart')}</span>
                    <h1>{t('other_animals.hero_title', 'Beyond Cheetahs')}</h1>
                    <p>{t('other_animals.hero_sub', 'Providing a lifelong home and sanctuary to diverse wildlife species.')}</p>
                </div>
            </div>

            <div className="page-content" style={{padding: '4rem 1.5rem'}}>
                <div className="container" style={{maxWidth: '1100px', margin: '0 auto'}}>
                    <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                        <button onClick={() => goTo('home', 'contact')} className="btn btn-dark">
                            {t('other_animals.btn_adopt', 'Adopt an Animal')}
                        </button>
                        <button className="btn btn-outline-dark" onClick={() => goTo('volunteer')}>
                            {t('other_animals.btn_volunteer', 'Join Us')}
                        </button>
                    </div>

                    <h2>{t('other_animals.sanctuary_title', 'A Lifelong Home for Every Soul')}</h2>
                    <p>{t('other_animals.sanctuary_p1', 'In addition to cheetahs, we provide a lifelong home to many other animal species. Lions, tigers, and small wild cats all find the care and protection they deserve here. Alongside them, we also care for numerous free-roaming herbivores, offering them a safe place to live out their lives.')}</p>

                    <div className="highlight">
                        <h3 style={{ color: 'var(--dark)', marginBottom: '0.5rem', fontFamily: 'var(--serif)'}}>
                            {t('other_animals.feracare_title', 'In Partnership with FeraCare Wildlife Centre')}
                        </h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                            {t('other_animals.feracare_text', 'Our conservation efforts are strengthened by a proud collaboration with FeraCare Wildlife Centre in South Africa. FeraCare is renowned for its dedicated ethical contribution to cheetah conservation and wildlife protection. Together, we share vital research, optimize sustainable sanctuary management, and elevate care standards for rescued African fauna.')}
                        </p>
                    </div>

                    <h2>{t('other_animals.cats_title', 'Big & Medium Predators')}</h2>
                    <p>{t('other_animals.cats_p1', 'From the majestic roars of our rescued lions to the elusive habits of wild cat species, our sanctuary ensures species-specific nourishment and enrichment programs. Many of our predators come from situations of neglect or human-wildlife conflict.')}</p>

                    <div className="responsive-grid-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i} style={cardStyle} onClick={() => setLbIdx(i)}>
                                <img
                                    src={ALL_PHOTOS[i]}
                                    alt={photoCaps[i]}
                                    style={imgStyle}
                                    onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                                    onMouseLeave={e => e.target.style.transform = 'none'}
                                />
                                <div style={overlayStyle}>{photoCaps[i]}</div>
                            </div>
                        ))}
                    </div>

                    <h2>{t('other_animals.small_title', 'Small Wildlife & Specialized Care')}</h2>
                    <p>{t('other_animals.small_p1', 'Smaller nocturnal predators and local mammals find a secure haven here. Every single habitat is custom-designed around the precise biological needs of its guests, ensuring safety, structural dignity, and specialized veterinary monitoring for those who cannot be reintegrated into the open wilderness.')}</p>

                    <div className="responsive-grid-3">
                        {[3, 4, 5].map((i) => (
                            <div key={i} style={cardStyle} onClick={() => setLbIdx(i)}>
                                <img
                                    src={ALL_PHOTOS[i]}
                                    alt={photoCaps[i]}
                                    style={imgStyle}
                                    onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                                    onMouseLeave={e => e.target.style.transform = 'none'}
                                />
                                <div style={overlayStyle}>{photoCaps[i]}</div>
                            </div>
                        ))}
                    </div>

                    <h2>{t('other_animals.herbivores_title', 'Free-Roaming Herbivores')}</h2>
                    <p>{t('other_animals.herbivores_p1', 'The reserve hosts vast, protected open fields where zebras, antelopes, and other free-roaming herbivores live peacefully. They play a vital role in keeping our ecosystem balanced and maintaining the natural African bushveld terrain.')}</p>

                    <div className="responsive-grid-2">
                        {[6, 7].map((i) => (
                            <div key={i} style={cardStyle} onClick={() => setLbIdx(i)}>
                                <img
                                    src={ALL_PHOTOS[i]}
                                    alt={photoCaps[i]}
                                    style={{
                                        ...imgStyle,
                                        objectPosition: i === 7 ? '100% center' : imgStyle.objectPosition || 'center'
                                    }}
                                    onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                                    onMouseLeave={e => e.target.style.transform = 'none'}
                                />
                                <div style={overlayStyle}>{photoCaps[i]}</div>
                            </div>
                        ))}
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