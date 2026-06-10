import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

function FAQ({ goTo }) {
    useScrollReveal()
    const { t } = useTranslation()
    const [activeCategory, setActiveCategory] = useState('volunteer')
    const [openIndex, setOpenIndex] = useState(null)

    const categories = ['volunteer', 'internship', 'accommodation', 'shop', 'donations']

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    // Recupera la lista di domande e risposte per la categoria attiva dal file di traduzione
    const currentFaqs = t(`faq.categories.${activeCategory}.questions`, { returnObjects: true }) || []

    return (
        <>
            {/* ── HERO SECTION ── */}
            <div className="page-hero-img" style={{ height: '45vh' }}>
                <img src="https://novaslegacy.com/wp-content/uploads/2022/08/IMG-20210120-WA0031-1170x600.jpg" alt="FAQ Nova's Legacy" />
                <div className="page-hero-img-overlay" />
                <div className="page-hero-text">
                    <span className="label label-light">{t('faq.hero_label')}</span>
                    <h1>{t('faq.hero_title_start')} <em>{t('faq.hero_title_em')}</em></h1>
                    <p>{t('faq.hero_sub')}</p>
                </div>
            </div>

            <div className="page-content" style={{ paddingBottom: '5rem' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

                    {/* ── CATEGORY TABS ── */}
                    <div
                        className="rv"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            justifyContent: 'center',
                            margin: '2.5rem 0 3rem'
                        }}
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveCategory(cat)
                                    setOpenIndex(null)
                                }}
                                className={`btn ${activeCategory === cat ? 'btn-dark' : 'btn-light'}`}
                                style={{
                                    fontSize: '0.82rem',
                                    padding: '0.6rem 1.2rem',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    border: '1px solid #EDE5D8'
                                }}
                            >
                                {t(`faq.categories.${cat}.title`)}
                            </button>
                        ))}
                    </div>

                    {/* ── ACCORDION ITEMS ── */}
                    <div className="rv" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {currentFaqs.map((faq, idx) => {
                            const isOpen = openIndex === idx
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        background: 'var(--off-white)',
                                        border: '1px solid #EDE5D8',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {/* Intestazione Domanda */}
                                    <div
                                        onClick={() => toggleAccordion(idx)}
                                        style={{
                                            padding: '1.25rem 1.5rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                            background: isOpen ? '#F7F3EE' : 'transparent'
                                        }}
                                    >
                                        <h3 style={{
                                            fontFamily: 'var(--sans)',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            color: 'var(--dark)',
                                            margin: 0,
                                            paddingRight: '1rem',
                                            lineHeight: '1.4'
                                        }}>
                                            {faq.q}
                                        </h3>
                                        <span style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 300,
                                            color: 'var(--gold)',
                                            transform: isOpen ? 'rotate(45deg)' : 'none',
                                            transition: 'transform 0.2s ease'
                                        }}>
                      ◆
                    </span>
                                    </div>

                                    {/* Corpo Risposta */}
                                    <div
                                        style={{
                                            maxHeight: isOpen ? '500px' : '0',
                                            overflow: 'hidden',
                                            transition: 'max-height 0.3s cubic-bezier(0, 1, 0, 1)'
                                        }}
                                    >
                                        <div style={{
                                            padding: '0 1.5rem 1.5rem',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.7',
                                            color: '#555',
                                            fontWeight: 300,
                                            borderTop: '1px solid #F1EAE0',
                                            paddingTop: '1rem'
                                        }}>
                                            {faq.a}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* ── CONTATTI DI SUPPORTO IN FONDO ── */}
                    <div
                        className="highlight rv"
                        style={{
                            marginTop: '5rem',
                            textAlign: 'center',
                            padding: '2rem'
                        }}
                    >
                        <p style={{ margin: 0, fontSize: '0.92rem' }}>
                            <strong>{t('faq.footer_bold')}</strong> {t('faq.footer_text')}{' '}
                            <a href="mailto:kim@novaslegacy.co.za" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                                kim@novaslegacy.co.za
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FAQ