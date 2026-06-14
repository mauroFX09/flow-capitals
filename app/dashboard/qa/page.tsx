'use client'
import { useEffect, useState } from 'react'

export default function QAPage() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('fc-dark-mode')
    if (saved === 'true') setDark(true)
    const handler = () => setDark(localStorage.getItem('fc-dark-mode') === 'true')
    window.addEventListener('storage', handler)
    window.addEventListener('fc-theme-change', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('fc-theme-change', handler)
    }
  }, [])

  const bg = dark ? '#080d14' : '#F5F2EC'
  const cardBg = dark ? '#0f1825' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const cardShadow = dark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)'
  const textPrimary = dark ? '#e0ecf8' : '#1a1a1a'
  const textMuted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const accent = dark ? '#7aaee8' : '#2B5EA7'

  return (
    <div style={{ padding: '40px 48px', background: bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' as const }}>

        {/* Icon */}
        <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: dark ? 'rgba(43,94,167,0.15)' : 'rgba(43,94,167,0.08)', border: `0.5px solid ${dark ? 'rgba(43,94,167,0.3)' : 'rgba(43,94,167,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: '32px' }}>
          ◎
        </div>

        {/* Label */}
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ width: '20px', height: '1px', background: accent }} />
          Coming Soon
          <div style={{ width: '20px', height: '1px', background: accent }} />
        </div>

        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '44px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1, marginBottom: '16px' }}>
          Q&amp;A is on its way.
        </h1>

        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: textMuted, lineHeight: '1.8', marginBottom: '40px' }}>
          The Q&amp;A section is currently being built. Soon you will be able to ask questions directly to your mentors and get answers posted publicly for the whole community to learn from.
        </p>

        {/* What to expect */}
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: '28px 32px', marginBottom: '28px', textAlign: 'left' as const }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '16px' }}>What to expect</div>
          {[
            'Ask any question about strategy, psychology, or your journal',
            'Mentors answer directly — honest and to the point',
            'All Q&As posted publicly so the whole community learns',
            'Search past questions before asking',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, flexShrink: 0, marginTop: '6px' }} />
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textPrimary, lineHeight: '1.6' }}>{item}</span>
            </div>
          ))}
        </div>

        <a href="/dashboard" style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = accent}
          onMouseLeave={e => e.currentTarget.style.color = textMuted}
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  )
}