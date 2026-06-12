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

    return (
        <>
            <style>{`
        .sub-animal-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin: 2.5rem 0 4rem 0;
        }

        .sub-animal-grid--duo {
          grid-template-columns: repeat(2, 1fr);
        }

        .animal-card {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          cursor: pointer;
          border-radius: 8px;
          background: #111;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease;
        }

        .animal-card.rv {
          opacity: 1 !important;
          transform: none !important;
          visibility: visible !important;
        }

        .animal-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .animal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .animal-card:hover img {
          transform: scale(1.05);
        }

        .animal-card-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%);
          padding: 1.5rem 1.2rem;
          pointer-events: none;
          z-index: 2;
        }

        .animal-card-title {
          color: #ffffff;
          font-family: var(--sans, sans-serif);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0;
          opacity: 0.9;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .animal-card:hover .animal-card-title {
          opacity: 1;
        }

        /* ── RESPONSIVE DESIGN ── */
        @media (max-width: 992px) {
          .sub-animal-grid, .sub-animal-grid--duo {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.2rem;
          }
        }

        @media (max-width: 576px) {
          .sub-animal-grid, .sub-animal-grid--duo {
            grid-template-columns: 1fr; 
            gap: 1rem;
          }
          .animal-card {
            aspect-ratio: 16 / 10; 
          }
        }
      `}</style>
            <div className="page-hero-img" style={{
                height: '70vh',
                minHeight: '450px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <picture style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
                    <source media="(max-width: 768px)" srcSet="/img/leoni-cuccioli.png" />
                    <img
                        src="/img/adotta-wild-hearts.png"
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
                        <div className="animal-card rv" onClick={() => setLbIdx(0)}>
                            <img src={ALL_PHOTOS[0]} alt={photoCaps[0]} />
                            <div className="animal-card-overlay">
                                <span className="animal-card-title">{photoCaps[0]}</span>
                            </div>
                        </div>
                        <div className="animal-card rv" onClick={() => setLbIdx(1)}>
                            <img src={ALL_PHOTOS[1]} alt={photoCaps[1]} />
                            <div className="animal-card-overlay">
                                <span className="animal-card-title">{photoCaps[1]}</span>
                            </div>
                        </div>
                        <div className="animal-card rv" onClick={() => setLbIdx(2)}>
                            <img src={ALL_PHOTOS[2]} alt={photoCaps[2]} />
                            <div className="animal-card-overlay">
                                <span className="animal-card-title">{photoCaps[2]}</span>
                            </div>
                        </div>
                    </div>

                    <h2>{t('other_animals.small_title', 'Small Wildlife & Specialized Care')}</h2>
                    <p>{t('other_animals.small_p1', 'Smaller nocturnal predators and local mammals find a secure haven here. Every single habitat is custom-designed around the precise biological needs of its guests, ensuring safety, structural dignity, and specialized veterinary monitoring for those who cannot be reintegrated into the open wilderness.')}</p>

                    <div className="sub-animal-grid">
                        <div className="animal-card rv" onClick={() => setLbIdx(3)}>
                            <img src={ALL_PHOTOS[3]} alt={photoCaps[3]} />
                            <div className="animal-card-overlay">
                                <span className="animal-card-title">{photoCaps[3]}</span>
                            </div>
                        </div>
                        <div className="animal-card rv" onClick={() => setLbIdx(4)}>
                            <img src={ALL_PHOTOS[4]} alt={photoCaps[4]} style={{}}/>
                            <div className="animal-card-overlay">
                                <span className="animal-card-title">{photoCaps[4]}</span>
                            </div>
                        </div>
                        <div className="animal-card rv" onClick={() => setLbIdx(5)}>
                            <img src={ALL_PHOTOS[5]} alt={photoCaps[5]} />
                            <div className="animal-card-overlay">
                                <span className="animal-card-title">{photoCaps[5]}</span>
                            </div>
                        </div>
                    </div>

                    <h2>{t('other_animals.herbivores_title', 'Free-Roaming Herbivores')}</h2>
                    <p>{t('other_animals.herbivores_p1', 'The reserve hosts vast, protected open fields where zebras, antelopes, and other free-roaming herbivores live peacefully. They play a vital role in keeping our ecosystem balanced and maintaining the natural African bushveld terrain.')}</p>

                    <div className="sub-animal-grid sub-animal-grid--duo">
                        <div className="animal-card rv" onClick={() => setLbIdx(6)}>
                            <img src={ALL_PHOTOS[6]} alt={photoCaps[6]} />
                            <div className="animal-card-overlay">
                                <span className="animal-card-title">{photoCaps[6]}</span>
                            </div>
                        </div>
                        <div className="animal-card rv" onClick={() => setLbIdx(7)}>
                            <img src={ALL_PHOTOS[7]} alt={photoCaps[7]} />
                            <div className="animal-card-overlay">
                                <span className="animal-card-title">{photoCaps[7]}</span>
                            </div>
                        </div>
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