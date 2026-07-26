'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useIncognito } from '@/lib/hooks'

interface Trade {
  id: string
  pair: string
  direction: 'long' | 'short'
  trade_date: string
  pnl: number
  rr: number
  session: string
  emotion: string
  followed_plan: boolean
}

function fmt(n: number, sign = true): string {
  if (sign && n > 0) return `+€${n.toFixed(0)}`
  if (sign && n < 0) return `-€${Math.abs(n).toFixed(0)}`
  return `€${Math.abs(n).toFixed(0)}`
}

export default function ReportPage() {
  const router  = useRouter()
  const incognito = useIncognito()
  const [trades,   setTrades]   = useState<Trade[]>([])
  const [loading,  setLoading]  = useState(true)
  const [dark,     setDark]     = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const mask: React.CSSProperties = incognito
    ? { filter: 'blur(8px)', userSelect: 'none', transition: 'filter 0.2s', display: 'inline-block' }
    : { transition: 'filter 0.2s', display: 'inline-block' }

  useEffect(() => {
    const check = () => setDark(localStorage.getItem('fc-dark-mode') === 'true')
    check()
    window.addEventListener('fc-theme-change', check)
    return () => window.removeEventListener('fc-theme-change', check)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const fetchTrades = useCallback(async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    const { data } = await supabase
      .from('trades')
      .select('id, pair, direction, trade_date, pnl, rr, session, emotion, followed_plan')
      .eq('user_id', session.user.id)
      .order('trade_date', { ascending: true })
    setTrades(data ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => { fetchTrades() }, [fetchTrades])

  const wins       = trades.filter(t => t.pnl > 0)
  const losses     = trades.filter(t => t.pnl < 0)
  const breakevens = trades.filter(t => t.pnl === 0)

  const totalPnl    = trades.reduce((s, t) => s + t.pnl, 0)
  const grossProfit = wins.reduce((s, t) => s + t.pnl, 0)
  const grossLoss   = Math.abs(losses.reduce((s, t) => s + t.pnl, 0))

  const byDate: Record<string, Trade[]> = {}
  trades.forEach(t => { (byDate[t.trade_date] ??= []).push(t) })
  const tradingDays = Object.keys(byDate)
  const dayPnls     = tradingDays.map(d => byDate[d].reduce((s, t) => s + t.pnl, 0))
  const winDays     = dayPnls.filter(p => p > 0)
  const lossDays    = dayPnls.filter(p => p < 0)

  const byMonth: Record<string, number> = {}
  trades.forEach(t => {
    const month = t.trade_date.slice(0, 7)
    byMonth[month] = (byMonth[month] ?? 0) + t.pnl
  })
  const months = Object.entries(byMonth)

  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : grossProfit > 0 ? Infinity : 0
  const winRate      = trades.length > 0 ? (wins.length / trades.length) * 100 : 0
  const avgWin       = wins.length   > 0 ? grossProfit / wins.length   : 0
  const avgLoss      = losses.length > 0 ? grossLoss   / losses.length : 0
  const expectancy   = wins.length > 0 || losses.length > 0
    ? (winRate / 100) * avgWin - ((100 - winRate) / 100) * avgLoss : 0

  const bestMonth   = months.length > 0 ? months.reduce((a, b) => b[1] > a[1] ? b : a) : null
  const worstMonth  = months.length > 0 ? months.reduce((a, b) => b[1] < a[1] ? b : a) : null
  const largestWin  = wins.length   > 0 ? Math.max(...wins.map(t => t.pnl))   : 0
  const largestLoss = losses.length > 0 ? Math.min(...losses.map(t => t.pnl)) : 0
  const bestDay     = dayPnls.length > 0 ? Math.max(...dayPnls) : 0
  const worstDay    = dayPnls.length > 0 ? Math.min(...dayPnls) : 0

  const avgDailyPnl   = tradingDays.length > 0 ? totalPnl / tradingDays.length : 0
  const avgTradePnl   = trades.length > 0 ? totalPnl / trades.length : 0
  const avgWinningDay = winDays.length  > 0 ? winDays.reduce((a, b) => a + b, 0)  / winDays.length  : 0
  const avgLosingDay  = lossDays.length > 0 ? lossDays.reduce((a, b) => a + b, 0) / lossDays.length : 0

  const formatMonth = (ym: string) => {
    const [y, m] = ym.split('-')
    return new Date(+y, +m - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  }

  const accent      = '#2B5EA7'
  const pageBg      = dark ? '#071428' : '#f4f4f6'
  const cardBg      = dark ? '#0d1e36' : '#ffffff'
  const cardBorder  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.08)'
  const cardShadow  = dark ? '0 2px 16px rgba(0,0,0,0.4)' : '0 2px 16px rgba(0,0,0,0.06)'
  const textPrimary = dark ? '#ffffff' : '#1a1a1a'
  const textMuted   = dark ? 'rgba(255,255,255,0.4)' : 'rgba(26,26,26,0.4)'
  const divider     = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const green       = '#22c55e'
  const red         = '#dc3232'
  const pnlColor    = totalPnl >= 0 ? green : red
  const pfColor     = profitFactor >= 1.5 ? green : profitFactor >= 1 ? accent : profitFactor === 0 ? textMuted : red
  const wrColor     = winRate >= 50 ? green : red

  const renderGauge = () => {
    const r = 46, cx = 62, cy = 54, sw = 10
    const p = winRate / 100
    const bgPath  = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`
    const xE      = cx - r * Math.cos(p * Math.PI)
    const yE      = cy - r * Math.sin(p * Math.PI)
    const winPath = p <= 0 ? null : p >= 1 ? bgPath
      : `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${xE.toFixed(2)} ${yE.toFixed(2)}`
    return (
      <svg width="124" height="78" viewBox="0 0 124 78" style={{ display: 'block' }}>
        <path d={bgPath} fill="none" stroke={dark ? 'rgba(220,50,50,0.28)' : 'rgba(230,60,60,0.18)'} strokeWidth={sw} strokeLinecap="round" />
        {winPath && <path d={winPath} fill="none" stroke={green} strokeWidth={sw} strokeLinecap="round" />}
        <text x={cx - r - 2} y={cy + 16} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="12" fontWeight="700" fill={green}>{wins.length}</text>
        <text x={cx + r + 2} y={cy + 16} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="12" fontWeight="700" fill={red}>{losses.length}</text>
        <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle" fontFamily="Inter,sans-serif" fontSize="16" fontWeight="800" fill={wrColor}>
          {winRate.toFixed(0)}%
        </text>
      </svg>
    )
  }

  const Row = ({ label, value, color, last, masked = false }: { label: string; value: string; color?: string; last?: boolean; masked?: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: last ? 'none' : `0.5px solid ${divider}` }}>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textMuted }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 600, color: color ?? textPrimary, letterSpacing: '-0.01em' }}>
        {masked ? <span style={mask}>{value}</span> : value}
      </span>
    </div>
  )

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', boxShadow: cardShadow, padding: '22px 24px' }}>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 700, color: textPrimary, marginBottom: '4px' }}>{title}</div>
      <div>{children}</div>
    </div>
  )

  const badgeRow = (w: number, b: number, l: number) => (
    <div style={{ display: 'flex', gap: '5px' }}>
      {w > 0 && <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 700, color: green, background: dark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.1)', padding: '2px 7px', borderRadius: '6px' }}>W {w}</span>}
      {b > 0 && <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 700, color: textMuted, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', padding: '2px 7px', borderRadius: '6px' }}>B {b}</span>}
      {l > 0 && <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 700, color: red, background: dark ? 'rgba(220,50,50,0.12)' : 'rgba(220,50,50,0.08)', padding: '2px 7px', borderRadius: '6px' }}>L {l}</span>}
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textMuted }}>Loading…</span>
    </div>
  )

  if (trades.length === 0) return (
    <div style={{ minHeight: '100vh', background: pageBg, padding: isMobile ? '20px 16px' : '32px 32px' }}>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? '24px' : '32px', fontWeight: 700, color: textPrimary, marginBottom: '4px' }}>Report.</div>
      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textMuted, marginBottom: '40px' }}>Your performance at a glance</div>
      <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', padding: '60px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '8px' }}>No trades yet</div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textMuted }}>Log your first trade to see your report</div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: pageBg, padding: isMobile ? '20px 16px' : '32px 32px' }}>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? '24px' : '32px', fontWeight: 700, color: textPrimary, marginBottom: '4px' }}>Report.</div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textMuted }}>Your performance at a glance</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '14px', marginBottom: '16px' }}>

        {/* Total P&L */}
        <div style={{ background: totalPnl < 0 ? (dark ? 'rgba(220,50,50,0.06)' : 'rgba(220,50,50,0.03)') : cardBg, border: `0.5px solid ${totalPnl < 0 ? 'rgba(220,50,50,0.25)' : cardBorder}`, borderRadius: '18px', boxShadow: cardShadow, padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted }}>Total P&L</div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted, background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }}>{trades.length}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '34px', fontWeight: 800, color: pnlColor, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '8px' }}>
            <span style={mask}>{fmt(totalPnl)}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>
            {tradingDays.length} trading day{tradingDays.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Avg Daily P&L */}
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', boxShadow: cardShadow, padding: '20px 22px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '10px' }}>Avg Daily P&L</div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '34px', fontWeight: 800, color: avgDailyPnl >= 0 ? green : red, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '8px' }}>
            <span style={mask}>{fmt(avgDailyPnl)}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>
            {winDays.length}W · {lossDays.length}L day{lossDays.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Profit Factor */}
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', boxShadow: cardShadow, padding: '20px 22px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '10px' }}>Profit Factor</div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '34px', fontWeight: 800, color: pfColor, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '8px' }}>
            {profitFactor === Infinity ? '∞' : profitFactor > 0 ? profitFactor.toFixed(2) : '—'}
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: pfColor, fontWeight: 500 }}>
            {profitFactor >= 1.5 ? '✦ Strong edge' : profitFactor >= 1 ? 'Breakeven range' : profitFactor > 0 ? 'Below breakeven' : 'No data yet'}
          </div>
        </div>

        {/* Win Rate */}
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', boxShadow: cardShadow, padding: '20px 22px 12px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '6px' }}>Win Rate</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>{renderGauge()}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '2px' }}>
            {badgeRow(wins.length, breakevens.length, losses.length)}
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', boxShadow: cardShadow, padding: '20px 22px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '10px' }}>Total Trading Days</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '32px', fontWeight: 800, color: textPrimary, lineHeight: 1, letterSpacing: '-0.03em' }}>{tradingDays.length}</div>
            {badgeRow(winDays.length, 0, lossDays.length)}
          </div>
        </div>
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', boxShadow: cardShadow, padding: '20px 22px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '10px' }}>Total Trades</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '32px', fontWeight: 800, color: textPrimary, lineHeight: 1, letterSpacing: '-0.03em' }}>{trades.length}</div>
            {badgeRow(wins.length, breakevens.length, losses.length)}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Section title="P&L Statistics">
          <Row label="Avg Trade P&L"    value={fmt(avgTradePnl)}                          color={avgTradePnl >= 0 ? green : red} masked />
          <Row label="Avg Winning Trade" value={`+€${avgWin.toFixed(0)}`}                 color={green} masked />
          <Row label="Avg Losing Trade"  value={`-€${avgLoss.toFixed(0)}`}                color={red} masked />
          <Row label="Avg Winning Day"   value={`+€${avgWinningDay.toFixed(0)}`}          color={green} masked />
          <Row label="Avg Losing Day"    value={`-€${Math.abs(avgLosingDay).toFixed(0)}`} color={red} masked />
          <Row label="Trade Expectancy"  value={fmt(expectancy)}                           color={expectancy >= 0 ? green : red} masked last />
        </Section>

        <Section title="Performance Extremes">
          {bestMonth  && <Row label={`Best Month (${formatMonth(bestMonth[0])})`}   value={fmt(bestMonth[1])}  color={green} masked />}
          {worstMonth && <Row label={`Worst Month (${formatMonth(worstMonth[0])})`} value={fmt(worstMonth[1])} color={red} masked />}
          <Row label="Largest Win"  value={fmt(largestWin)}  color={green} masked />
          <Row label="Largest Loss" value={fmt(largestLoss)} color={red} masked />
          <Row label="Best Day"     value={fmt(bestDay)}     color={green} masked />
          <Row label="Worst Day"    value={fmt(worstDay)}    color={red} masked last />
        </Section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
        <Section title="Trading Activity">
          <Row label="Total Trades"     value={String(trades.length)} />
          <Row label="Logged Days"      value={String(tradingDays.length)} />
          <Row label="Avg Trades / Day" value={(trades.length / (tradingDays.length || 1)).toFixed(1)} />
          <Row label="Followed Plan"    value={`${trades.filter(t => t.followed_plan).length} / ${trades.length}`} color={accent} />
          <Row label="Avg R:R" last
            value={(() => {
              const rrs = trades.filter(t => t.rr > 0)
              return rrs.length > 0 ? `1:${(rrs.reduce((s, t) => s + t.rr, 0) / rrs.length).toFixed(2)}` : '—'
            })()} />
        </Section>

        <Section title="Session Breakdown">
          {(['london', 'ny', 'asia', 'overlap'] as const).map((sess, idx, arr) => {
            const labels: Record<string, string> = { london: 'London', ny: 'New York', asia: 'Asia', overlap: 'Overlap' }
            const sessTrades = trades.filter(t => t.session === sess)
            const sessPnl    = sessTrades.reduce((s, t) => s + t.pnl, 0)
            if (sessTrades.length === 0) return null
            const isLast = idx === arr.length - 1 && trades.filter(t => !t.session).length === 0
            return (
              <Row key={sess} label={`${labels[sess]} (${sessTrades.length})`}
                value={fmt(sessPnl)} color={sessPnl >= 0 ? green : red} masked last={isLast} />
            )
          })}
          {trades.filter(t => !t.session).length > 0 && (
            <Row label={`Untagged (${trades.filter(t => !t.session).length})`}
              value={fmt(trades.filter(t => !t.session).reduce((s, t) => s + t.pnl, 0))}
              color={textMuted} masked last />
          )}
        </Section>
      </div>

    </div>
  )
}