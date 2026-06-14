'use client'
import { useEffect, useState } from 'react'

export default function UpgradePage() {
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
  const cardShadow = dark ? '0 4px 20px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset' : '0 4px 20px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset'
  const textPrimary = dark ? '#e0ecf8' : '#1a1a1a'
  const textMuted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const accent = dark ? '#7aaee8' : '#2B5EA7'

  return (
    <div style={{ padding: '80px 48px', background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '560px', width: '100%' }}>

        {/* Lock icon */}
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: dark ? 'rgba(43,94,167,0.15)' : 'rgba(43,94,167,0.08)', border: `0.5px solid ${dark ? 'rgba(43,94,167,0.3)' : 'rgba(43,94,167,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 28px' }}>
          🔒
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1, marginBottom: '12px', textAlign: 'center' as const }}>
          Premium only.
        </h1>
        <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '16px', color: textMuted, lineHeight: '1.7', textAlign: 'center' as const, marginBottom: '40px' }}>
          This section is available to Premium members. Upgrade your membership to unlock courses, Q&A, achievements and full personal guidance.
        </p>

        {/* What you get */}
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: '28px 32px', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '16px' }}>What Premium unlocks</div>
          {[
            'Full course library — all 6 categories',
            'Live sessions 5x per week',
            'Weekly 1-on-1 personal call with Mauro',
            'Saturday psychology session',
            'Q&A — direct access to ask anything',
            'Achievements — track your milestones',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textPrimary }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a href="/contact" style={{ display: 'block', background: accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '14px', border: 'none', cursor: 'pointer', borderRadius: '10px', fontWeight: '700', textAlign: 'center' as const, textDecoration: 'none', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Apply for Premium →
          </a>
          <a href="/dashboard" style={{ display: 'block', background: 'transparent', color: textMuted, fontFamily: 'var(--font-inter)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '14px', border: `0.5px solid ${cardBorder}`, cursor: 'pointer', borderRadius: '10px', fontWeight: '600', textAlign: 'center' as const, textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.color = textMuted }}
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}