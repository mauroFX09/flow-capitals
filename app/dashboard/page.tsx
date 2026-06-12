'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const CLOCKS = [
  { city: 'LONDON', offset: 1 },
  { city: 'NEW YORK', offset: -4 },
  { city: 'TOKYO', offset: 9 },
  { city: 'DUBAI', offset: 4 },
  { city: 'SYDNEY', offset: 10 },
]

function getTime(offset: number) {
  const d = new Date()
  const utc = d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds()
  const t = (utc + offset * 3600 + 86400) % 86400
  const h = Math.floor(t / 3600).toString().padStart(2, '0')
  const m = Math.floor((t % 3600) / 60).toString().padStart(2, '0')
  const s = (t % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

const QUOTES = [
  'The goal is not to be right. The goal is to follow the process.',
  'Patience is not passive. It is concentrated strength.',
  'Every mistake studied is a future profit protected.',
  'The market rewards discipline, not intelligence.',
  'Flow state is not found. It is built, one session at a time.',
  'Your journal is your edge. Read it more than your charts.',
  'Consistency is the only strategy that compounds.',
]

const SCHEDULE = [
  { day: 0, label: 'Market Breakdown', type: 'live', desc: 'Full weekly outlook — Gold, Nasdaq, EUR/USD, GBP/USD' },
  { day: 1, label: 'Live Session', type: 'live', desc: 'Premium live session — deeper market analysis' },
  { day: 2, label: 'Live Reading', type: 'live', desc: 'Live price action reading — key levels and structure' },
  { day: 3, label: 'Live Session', type: 'live', desc: 'Premium live deep dive — setups and execution' },
  { day: 4, label: 'Live Session + 1-on-1', type: 'personal', desc: 'Premium live session + personal weekly call' },
  { day: 5, label: 'Psychology Call', type: 'psych', desc: 'Mindset and emotional control session' },
  { day: 6, label: 'Rest & Review', type: 'rest', desc: 'Recovery, reflection, and preparation' },
]

export default function DashboardHome() {
  const [dark, setDark] = useState(false)
  const [times, setTimes] = useState(CLOCKS.map(c => getTime(c.offset)))
  const [stats, setStats] = useState({ total: 0, pnl: 0, winRate: 0 })

  useEffect(() => {
    const saved = localStorage.getItem('fc-dark-mode')
    if (saved === 'true') setDark(true)
    const handler = () => setDark(localStorage.getItem('fc-dark-mode') === 'true')
    window.addEventListener('storage', handler)
window.addEventListener('fc-theme-change', handler)
    return () => window.removeEventListener('storage', handler)
window.removeEventListener('fc-theme-change', handler)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const { data: trades } = await supabase.from('trades').select('pnl').eq('user_id', session.user.id)
      if (trades && trades.length > 0) {
        const total = trades.length
        const pnl = trades.reduce((sum, tr) => sum + (tr.pnl || 0), 0)
        const wins = trades.filter(tr => (tr.pnl || 0) > 0).length
        setStats({ total, pnl, winRate: Math.round((wins / total) * 100) })
      }
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setTimes(CLOCKS.map(c => getTime(c.offset))), 1000)
    return () => clearInterval(interval)
  }, [])

  const today = new Date()
  const todaySession = SCHEDULE[today.getDay()]
  const quote = QUOTES[today.getDate() % QUOTES.length]
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  // Theme values
  const bg = dark ? '#080d14' : '#F5F2EC'
  const cardBg = dark ? '#0f1825' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const textPrimary = dark ? '#e0ecf8' : '#1a1a1a'
  const textMuted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const textSecondary = dark ? '#a0c0d8' : '#3a3530'
  const accent = dark ? '#7aaee8' : '#2B5EA7'
  const darkPanel = '#0d1e36'

  const sessionStyles: Record<string, { bg: string; border: string; label: string }> = {
    live: { bg: dark ? 'rgba(43,94,167,0.15)' : 'rgba(43,94,167,0.06)', border: dark ? 'rgba(43,94,167,0.3)' : 'rgba(43,94,167,0.2)', label: dark ? '#7aaee8' : '#2B5EA7' },
    personal: { bg: dark ? 'rgba(180,120,0,0.15)' : 'rgba(180,120,0,0.05)', border: dark ? 'rgba(180,120,0,0.3)' : 'rgba(180,120,0,0.2)', label: dark ? '#fbbf24' : '#b47800' },
    psych: { bg: dark ? 'rgba(120,80,180,0.15)' : 'rgba(120,80,180,0.05)', border: dark ? 'rgba(120,80,180,0.3)' : 'rgba(120,80,180,0.2)', label: dark ? '#c4b5fd' : '#7850b4' },
    rest: { bg: dark ? 'rgba(255,255,255,0.03)' : 'rgba(26,26,26,0.02)', border: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.08)', label: dark ? 'rgba(255,255,255,0.3)' : '#8a8070' },
  }
  const sc = sessionStyles[todaySession.type]

  return (
    <div style={{ padding: '40px 48px', maxWidth: '1100px', background: bg, minHeight: '100vh' }}>

      {/* Welcome + clocks */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '36px' }}>
        <div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '24px', height: '1px', background: accent }} />Member Dashboard
          </div>
          <h1 style={{ fontSize: '44px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1, marginBottom: '6px' }}>Welcome back.</h1>
          <p style={{ fontStyle: 'italic', fontSize: '14px', color: textMuted }}>{dateStr}</p>
        </div>
        <div style={{ display: 'flex', gap: '24px', background: cardBg, border: `0.5px solid ${cardBorder}`, padding: '14px 20px' }}>
          {CLOCKS.map((c, i) => (
            <div key={c.city} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '8px', color: textMuted, letterSpacing: '0.1em', marginBottom: '3px' }}>{c.city}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '14px', color: textPrimary }}>{times[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats + today */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.4fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, padding: '22px 24px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '8px' }}>Trades Logged</div>
          <div style={{ fontSize: '38px', fontWeight: '700', color: textPrimary, lineHeight: 1, marginBottom: '3px' }}>{stats.total}</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted }}>Total entries</div>
        </div>
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, padding: '22px 24px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '8px' }}>Total P&L</div>
          <div style={{ fontSize: '38px', fontWeight: '700', color: stats.pnl >= 0 ? accent : '#dc3232', lineHeight: 1, marginBottom: '3px' }}>{stats.pnl >= 0 ? '+' : ''}{stats.pnl.toFixed(0)}€</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted }}>All time</div>
        </div>
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, padding: '22px 24px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '8px' }}>Win Rate</div>
          <div style={{ fontSize: '38px', fontWeight: '700', color: textPrimary, lineHeight: 1, marginBottom: '3px' }}>{stats.winRate}%</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted }}>Based on logged trades</div>
        </div>
        <div style={{ background: sc.bg, border: `0.5px solid ${sc.border}`, padding: '22px 24px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: sc.label, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: sc.label }} />
            Today&apos;s Session
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: textPrimary, marginBottom: '4px', lineHeight: 1.2 }}>{todaySession.label}</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted, lineHeight: '1.5' }}>{todaySession.desc}</div>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Trading Journal', desc: 'Log trades, track emotions, analyse performance', href: '/dashboard/journal', num: 'I' },
          { label: 'Courses', desc: 'Technical pillars, psychology, tape reading', href: '/dashboard/courses', num: 'II' },
          { label: 'Trading Wall', desc: 'Share payouts and community achievements', href: '/dashboard/wall', num: 'III' },
        ].map(card => (
          <a key={card.label} href={card.href} style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, padding: '22px 24px', textDecoration: 'none', display: 'block', transition: 'border-color 0.2s', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = cardBorder}
          >
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '44px', fontWeight: '700', color: dark ? 'rgba(122,174,232,0.08)' : 'rgba(43,94,167,0.05)', lineHeight: 1, position: 'absolute', top: '8px', right: '14px' }}>{card.num}</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: accent, marginBottom: '6px' }}>Go to</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: textPrimary, marginBottom: '4px' }}>{card.label}</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted, lineHeight: '1.5' }}>{card.desc}</div>
          </a>
        ))}
      </div>

      {/* Daily quote */}
      <div style={{ background: darkPanel, padding: '28px 36px', display: 'flex', alignItems: 'center', gap: '28px' }}>
        <div style={{ width: '3px', height: '44px', background: '#2B5EA7', flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#7aaee8', marginBottom: '6px' }}>Daily reminder</div>
          <p style={{ fontStyle: 'italic', fontSize: '17px', color: '#ffffff', lineHeight: '1.6', margin: 0 }}>&ldquo;{quote}&rdquo;</p>
        </div>
      </div>

    </div>
  )
}