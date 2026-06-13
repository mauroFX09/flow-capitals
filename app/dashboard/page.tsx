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
  { day: 0, label: 'Market Analysis', type: 'live', desc: 'Full weekly outlook — Gold, Nasdaq, EUR/USD, GBP/USD' },
  { day: 1, label: 'Live Session', type: 'live', desc: 'Premium live session — deeper market analysis' },
  { day: 2, label: 'Live Reading', type: 'live', desc: 'Live price action reading — key levels and structure' },
  { day: 3, label: 'Live Session', type: 'live', desc: 'Premium live deep dive — setups and execution' },
  { day: 4, label: 'Live Session + 1-on-1', type: 'personal', desc: 'Premium live session + personal weekly call' },
  { day: 5, label: 'Psychology Call', type: 'psych', desc: 'Mindset and emotional control session' },
  { day: 6, label: 'Rest & Review', type: 'rest', desc: 'Recovery, reflection, and preparation' },
]

function CircleGauge({ value, max, color, label, dark }: { value: number; max: number; color: string; label: string; dark: boolean }) {
  const size = 72; const strokeWidth = 7; const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const fill = Math.min(value / max, 1) * circumference
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)'} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={`${fill} ${circumference}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '12px', fontWeight: '700', color: color }}>{label}</span>
      </div>
    </div>
  )
}

function WinRateCircle({ winRate, beRate, dark }: { winRate: number; beRate: number; dark: boolean }) {
  const size = 72; const strokeWidth = 7; const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const lossRate = Math.max(0, 100 - winRate - beRate)
  const winDash = (winRate / 100) * circumference
  const beDash = (beRate / 100) * circumference
  const lossDash = (lossRate / 100) * circumference
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)'} strokeWidth={strokeWidth} />
        {winRate > 0 && <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#22c55e" strokeWidth={strokeWidth} strokeDasharray={`${winDash} ${circumference - winDash}`} strokeLinecap="round" />}
        {beRate > 0 && <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#94a3b8" strokeWidth={strokeWidth} strokeDasharray={`${beDash} ${circumference - beDash}`} strokeDashoffset={-winDash} strokeLinecap="round" />}
        {lossRate > 0 && <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#dc3232" strokeWidth={strokeWidth} strokeDasharray={`${lossDash} ${circumference - lossDash}`} strokeDashoffset={-(winDash + beDash)} strokeLinecap="round" />}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: '700', color: dark ? '#e0ecf8' : '#1a1a1a' }}>{winRate}%</span>
      </div>
    </div>
  )
}

export default function DashboardHome() {
  const [dark, setDark] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [times, setTimes] = useState(CLOCKS.map(c => getTime(c.offset)))
  const [allTrades, setAllTrades] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, pnl: 0, winRate: 0, beRate: 0, profitFactor: 0, grossProfit: 0, grossLoss: 0 })

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

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single()
      if (profile?.full_name) setFirstName(profile.full_name.split(' ')[0])
      const { data: trades } = await supabase.from('trades').select('*').eq('user_id', session.user.id)
      if (trades && trades.length > 0) {
        setAllTrades(trades)
        const total = trades.length
        const pnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0)
        const wins = trades.filter(t => (t.pnl || 0) > 0).length
        const be = trades.filter(t => (t.pnl || 0) === 0).length
        const grossProfit = trades.filter(t => (t.pnl || 0) > 0).reduce((sum, t) => sum + t.pnl, 0)
        const grossLoss = Math.abs(trades.filter(t => (t.pnl || 0) < 0).reduce((sum, t) => sum + t.pnl, 0))
        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0
        setStats({ total, pnl, winRate: Math.round((wins / total) * 100), beRate: Math.round((be / total) * 100), profitFactor, grossProfit, grossLoss })
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
  const isRest = todaySession.type === 'rest'

  const bg = dark ? '#080d14' : '#F5F2EC'
  const cardBg = dark ? '#0f1825' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const cardShadow = dark ? '0 4px 20px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset' : '0 4px 20px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset'
  const textPrimary = dark ? '#e0ecf8' : '#1a1a1a'
  const textMuted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const accent = dark ? '#7aaee8' : '#2B5EA7'

  const sessionColors: Record<string, { bg: string; border: string; label: string }> = {
    live: { bg: dark ? 'rgba(43,94,167,0.15)' : 'rgba(43,94,167,0.06)', border: dark ? 'rgba(43,94,167,0.3)' : 'rgba(43,94,167,0.2)', label: dark ? '#7aaee8' : '#2B5EA7' },
    personal: { bg: dark ? 'rgba(180,120,0,0.15)' : 'rgba(180,120,0,0.05)', border: dark ? 'rgba(180,120,0,0.3)' : 'rgba(180,120,0,0.2)', label: dark ? '#fbbf24' : '#b47800' },
    psych: { bg: dark ? 'rgba(120,80,180,0.15)' : 'rgba(120,80,180,0.05)', border: dark ? 'rgba(120,80,180,0.3)' : 'rgba(120,80,180,0.2)', label: dark ? '#c4b5fd' : '#7850b4' },
    rest: { bg: dark ? 'rgba(255,255,255,0.02)' : 'rgba(26,26,26,0.02)', border: dark ? 'rgba(255,255,255,0.04)' : 'rgba(26,26,26,0.06)', label: dark ? 'rgba(255,255,255,0.2)' : '#c8c0b0' },
  }
  const sc = sessionColors[todaySession.type]
  const pfColor = stats.profitFactor >= 2 ? '#22c55e' : stats.profitFactor >= 1 ? accent : stats.profitFactor === 0 ? textMuted : '#dc3232'

  const card = {
    background: cardBg, border: `0.5px solid ${cardBorder}`,
    borderRadius: '16px', boxShadow: cardShadow, padding: '22px 24px',
  }

  // Week strip data
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    const dateKey = date.toISOString().split('T')[0]
    const dayTrades = allTrades.filter(t => t.created_at.split('T')[0] === dateKey)
    const dayPnl = dayTrades.reduce((s, t) => s + (t.pnl || 0), 0)
    const hasTrades = dayTrades.length > 0
    const isToday = date.toDateString() === today.toDateString()
    return { label, date: date.getDate(), hasTrades, dayPnl, isToday }
  })

  return (
    <div style={{ padding: '40px 48px', maxWidth: '1100px', background: bg, minHeight: '100vh' }}>

      {/* Welcome + clocks */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '36px' }}>
        <div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '24px', height: '1px', background: accent }} />Member Dashboard
          </div>
          <h1 style={{ fontSize: '44px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1, marginBottom: '6px' }}>
            Welcome back{firstName ? `, ${firstName}` : ''}.
          </h1>
          <p style={{ fontStyle: 'italic', fontSize: '14px', color: textMuted }}>{dateStr}</p>
        </div>
        <div style={{ display: 'flex', gap: '24px', background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: '14px 20px' }}>
          {CLOCKS.map((c, i) => (
            <div key={c.city} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '8px', color: textMuted, letterSpacing: '0.1em', marginBottom: '3px' }}>{c.city}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '14px', color: textPrimary }}>{times[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.4fr', gap: '12px', marginBottom: '20px' }}>
        {/* Net P&L */}
        <div style={{ ...card }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted }}>Net P&L</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: textMuted, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.04)', padding: '2px 8px', borderRadius: '10px' }}>{stats.total} trades</div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: stats.pnl >= 0 ? '#22c55e' : '#dc3232', lineHeight: 1, marginBottom: '3px' }}>{stats.pnl >= 0 ? '+' : ''}{stats.pnl.toFixed(0)}€</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted }}>All time</div>
        </div>

        {/* Profit Factor */}
        <div style={{ ...card }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '12px' }}>Profit Factor</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CircleGauge value={stats.profitFactor} max={3} color={pfColor} label={stats.profitFactor === 0 ? '—' : stats.profitFactor >= 999 ? '∞' : stats.profitFactor.toFixed(2)} dark={dark} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#22c55e' }}>+{stats.grossProfit.toFixed(0)}€</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#dc3232' }}>-{stats.grossLoss.toFixed(0)}€</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: textMuted }}>{stats.profitFactor >= 2 ? 'Excellent' : stats.profitFactor >= 1.5 ? 'Good' : stats.profitFactor >= 1 ? 'Profitable' : stats.profitFactor === 0 ? 'No data' : 'Needs work'}</div>
            </div>
          </div>
        </div>

        {/* Win Rate */}
        <div style={{ ...card }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '12px' }}>Win Rate</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <WinRateCircle winRate={stats.winRate} beRate={stats.beRate} dark={dark} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: textMuted }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />Win</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: textMuted }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#dc3232' }} />Loss</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: textMuted }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#94a3b8' }} />BE</div>
            </div>
          </div>
        </div>

        {/* Today's Session */}
        <div style={{ ...card, background: isRest ? (dark ? 'rgba(255,255,255,0.02)' : 'rgba(26,26,26,0.02)') : sc.bg, border: `0.5px solid ${isRest ? (dark ? 'rgba(255,255,255,0.04)' : 'rgba(26,26,26,0.06)') : sc.border}`, opacity: isRest ? 0.6 : 1 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: sc.label, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!isRest && (
              <div style={{ position: 'relative', width: '8px', height: '8px', flexShrink: 0 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: sc.label, animation: 'sessionPulse 2s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: sc.label }} />
              </div>
            )}
            {isRest ? '—' : 'Live today'}
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: isRest ? textMuted : textPrimary, marginBottom: '4px', lineHeight: 1.2 }}>{todaySession.label}</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted, lineHeight: '1.5' }}>{todaySession.desc}</div>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Trading Journal', desc: 'Log trades, track emotions, analyse performance', href: '/dashboard/journal', num: 'I' },
          { label: 'Courses', desc: 'Technical pillars, psychology, tape reading', href: '/dashboard/courses', num: 'II' },
          { label: 'Trading Wall', desc: 'Share payouts and community achievements', href: '/dashboard/wall', num: 'III' },
        ].map(c => (
          <a key={c.label} href={c.href} style={{ ...card, textDecoration: 'none', display: 'block', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '44px', fontWeight: '700', color: dark ? 'rgba(122,174,232,0.06)' : 'rgba(43,94,167,0.05)', lineHeight: 1, position: 'absolute', top: '8px', right: '14px' }}>{c.num}</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: accent, marginBottom: '6px' }}>Go to</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: textPrimary, marginBottom: '4px' }}>{c.label}</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted, lineHeight: '1.5' }}>{c.desc}</div>
          </a>
        ))}
      </div>

      {/* This week strip */}
      <div style={{ ...card, marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted }}>This Week</div>
          <a href="/dashboard/journal" style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: accent, textDecoration: 'none' }}>Full calendar →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {weekDays.map(({ label, date, hasTrades, dayPnl, isToday }) => {
            const isProfit = hasTrades && dayPnl > 0
            const isLoss = hasTrades && dayPnl < 0
            let bg = 'transparent'
            let border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)'
            let pnlColor = textMuted
            if (isProfit) { bg = dark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.06)'; border = 'rgba(34,197,94,0.25)'; pnlColor = '#22c55e' }
            if (isLoss) { bg = dark ? 'rgba(220,50,50,0.1)' : 'rgba(220,50,50,0.06)'; border = 'rgba(220,50,50,0.25)'; pnlColor = '#dc3232' }
            return (
              <div key={label} style={{ background: bg, border: `0.5px solid ${isToday ? accent : border}`, borderRadius: '8px', padding: '10px 8px', textAlign: 'center' as const, boxShadow: isToday ? `0 0 0 1px ${accent}` : 'none' }}>
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: isToday ? accent : textMuted, marginBottom: '3px', fontWeight: isToday ? '700' : '400' }}>{label}</div>
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{date}</div>
                {hasTrades && <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', fontWeight: '700', color: pnlColor }}>{dayPnl > 0 ? '+' : ''}{dayPnl.toFixed(0)}€</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Daily quote */}
      <div style={{ background: '#0d1e36', padding: '28px 36px', display: 'flex', alignItems: 'center', gap: '28px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
        <div style={{ width: '3px', height: '44px', background: '#2B5EA7', flexShrink: 0, borderRadius: '2px' }} />
        <div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#7aaee8', marginBottom: '6px' }}>Daily reminder</div>
          <p style={{ fontStyle: 'italic', fontSize: '17px', color: '#ffffff', lineHeight: '1.6', margin: 0 }}>&ldquo;{quote}&rdquo;</p>
        </div>
      </div>

      <style>{`
        @keyframes sessionPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}