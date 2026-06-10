import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

const PAYPAL_CLIENT_ID = 'BAACTG0ukeM8dKAjsLDCpumLq64_3LVg7oH1hbbQ5tot-aLGXbF4FbP34W4ehWgbRxVtrOerg-NmxlclvY'
const AMOUNTS = [10, 25, 50, 100]

const IMPACT = [
  { icon: '◆', amount: '€10'  },
  { icon: '◆', amount: '€25'  },
  { icon: '◆', amount: '€50'  },
  { icon: '◆', amount: '€100' },
]

function Donate({ goTo }) {
  useScrollReveal()
  const { t } = useTranslation()
  const [amount, setAmount] = useState(25)
  const [custom, setCustom] = useState('')
  const [sdkReady, setSdkReady] = useState(false)
  const [status, setStatus] = useState(null)
  const btnRef = useRef(null)
  const amountRef = useRef(25)

  const finalAmount = custom ? (parseFloat(custom) || 0) : amount
  amountRef.current = finalAmount

  const impactDescs = t('donate.impact', { returnObjects: true }) || []

  useEffect(() => {
    setSdkReady(false)
    const existing = document.getElementById('paypal-sdk')
    if (existing) existing.remove()
    const script = document.createElement('script')
    script.id = 'paypal-sdk'
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR&intent=capture&components=buttons&locale=en_US`
    script.onload = () => setSdkReady(true)
    document.body.appendChild(script)
    return () => script.remove()
  }, [])

  useEffect(() => {
    if (!sdkReady || !btnRef.current || !window.paypal) return
    btnRef.current.innerHTML = ''
    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'donate' },
      createOrder: (_data, actions) => {
        const val = amountRef.current
        if (!val || val < 1) return Promise.reject(new Error('Importo non valido'))
        return actions.order.create({
          purchase_units: [{
            amount: { value: val.toFixed(2) },
            description: "Donazione Nova's Legacy — Conservazione Animali",
          }],
        })
      },
      onApprove: (_data, actions) => actions.order.capture().then(() => setStatus('success')),
      onError: () => setStatus('error'),
    }).render(btnRef.current)
  }, [sdkReady])

  if (status === 'success') {
    return (
        <div className="donate-page">
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div className="donate-success rv">
              <div className="donate-success-icon">◆</div>
              <h2>{t('donate.success_title')}</h2>
              <p>{t('donate.success_desc')}</p>
              <button className="btn btn-dark" onClick={() => { setStatus(null); setCustom('') }}>{t('donate.donate_again')}</button>
            </div>
          </div>
        </div>
    )
  }

  return (
      <>
        {/* ── HERO ── */}
        <div className="page-hero-img" style={{ height: '52vh' }}>
          <img src="/img/ghepardo-albero.png" alt="Donazioni Nova's Legacy" style={{ objectPosition: 'center 30%' }} />
          <div className="page-hero-img-overlay" />
          <div className="page-hero-text">
            <span className="label label-light">{t('donate.hero_label')}</span>
            <h1>{t('donate.hero_title').split(' ').slice(0,-2).join(' ')} <em>{t('donate.hero_title').split(' ').slice(-2).join(' ')}</em></h1>
            <p>{t('donate.hero_sub')}</p>
          </div>
        </div>

        <div className="donate-page">
          <div style={{ maxWidth: '820px', margin: '0 auto', padding: '0 1.5rem' }}>
            <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

            <div className="rv" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
              <span className="label">{t('donate.section_label')}</span>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: 'var(--dark)', lineHeight: 1.15 }}>
                {t('donate.section_title').split(' ').slice(0,-2).join(' ')} <em style={{ fontStyle: 'italic', color: 'var(--gold)', fontWeight: 400 }}>{t('donate.section_title').split(' ').slice(-2).join(' ')}</em>
              </h2>
            </div>

            {/* ── DONATION CARD ── */}
            <div className="donate-card rv rv-d1">
              <div className="donate-amounts">
                {AMOUNTS.map(a => (
                    <button
                        key={a}
                        className={`donate-amount-btn${amount === a && !custom ? ' active' : ''}`}
                        onClick={() => { setAmount(a); setCustom('') }}
                    >
                      €{a}
                    </button>
                ))}
              </div>

              <div className="donate-custom">
                <label>{t('donate.custom_label')}</label>
                <input
                    type="number"
                    min="1"
                    placeholder={t('donate.custom_placeholder')}
                    value={custom}
                    onChange={e => setCustom(e.target.value)}
                />
              </div>

              <div className="donate-summary">
                {t('donate.summary')} <strong>€{finalAmount > 0 ? finalAmount.toFixed(2) : '—'}</strong> {t('donate.summary_to')}
              </div>

              <div ref={btnRef} className="paypal-btn-wrap" />

              {status === 'error' && (
                  <p style={{ color: 'var(--red-alert)', textAlign: 'center', fontSize: '0.85rem', marginTop: '1rem' }}>
                    {t('donate.error_text')}{' '}
                    <a href="mailto:kim@novaslegacy.co.za" style={{ color: 'var(--gold)' }}>kim@novaslegacy.co.za</a>
                  </p>
              )}
            </div>

            {/* ── IMPACT LIST ── */}
            <div className="donate-impact rv rv-d2" style={{ marginBottom: '5rem' }}>
              {IMPACT.map((item, i) => (
                  <div key={item.amount} className="impact-item">
                    <span className="impact-icon">{item.icon}</span>
                    <strong>{item.amount}</strong>
                    <span>{impactDescs[i]?.desc || ''}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </>
  )
}

export default Donate