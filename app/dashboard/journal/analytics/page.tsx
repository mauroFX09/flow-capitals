'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getTheme, getCard } from '@/lib/styles'
import type { Trade } from '@/lib/types'

const TABS = [
  { label: 'Overview', href: '/dashboard/journal', value: 'overview' },
  { label: 'Trade Log', href: '/dashboard/journal/trades', value: 'trades' },
  { label: 'Analytics', href: '/dashboard/journal/analytics', value: 'analytics' },
]

const EMOTIONS = [
  { label: 'Calm', emoji: '😌' },
  { label: 'Confident', emoji: '💪' },
  { label: 'Patient', emoji: '🧘' },
  { label: 'Focused', emoji: '🎯' },
  { label: 'Nervous', emoji: '😰' },
  { label: 'FOMO', emoji: '😱' },
  { label: 'Revenge', emoji: '😤' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Greedy', emoji: '🤑' },
  { label: 'Bored', emoji: '😑' },
]

const PLAN_THRESHOLD = 80

function SegmentedControl({ options, value, onChange, dark }: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  dark: boolean
}) {
  const cardBg = dark ? '#0f1825' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const textMuted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const activeIdx = options.findIndex(o => o.value === value)
  return (
    <div style={{ position: 'relative', display: 'flex', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.05)', borderRadius: '10px', padding: '3px' }}>
      <div style={{ position: 'absolute', top: '3px', left: `calc(3px + ${activeIdx} * (100% - 6px) / ${options.length})`, width: `calc((100% - 6px) / ${options.length})`, height: 'calc(100% - 6px)', background: cardBg, borderRadius: '7px', boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.12)', border: `0.5px solid ${cardBorder}`, transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 0 }} />
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{ flex: 1, padding: '7px 14px', background: 'transparent', border: 'none', color: value === opt.value ? (dark ? '#e0ecf8' : '#1a1a1a') : textMuted, fontFamily: 'var(--font-inter)', fontSize: '11px', cursor: 'pointer', position: 'relative', zIndex: 1, fontWeight: value === opt.value ? '600' : '400', transition: 'color 0.2s ease', borderRadius: '7px' }}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function PlanScoreGauge({ score, dark, size = 140 }: { score: number; dark: boolean; size?: number }) {
  const strokeWidth = size < 100 ? 8 : 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const fill = (score / 100) * circumference
  const color = score >= PLAN_THRESHOLD ? '#22c55e' : score >= 60 ? '#f59e0b' : '#dc3232'
  const label = score >= PLAN_THRESHOLD ? 'Excellent' : score >= 60 ? 'Needs work' : 'Critical'

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)'} strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={`${fill} ${circumference}`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2}
            strokeDasharray={`2 ${circumference - 2}`}
            strokeDashoffset={-(PLAN_THRESHOLD / 100) * circumference}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: size < 100 ? '22px' : '32px', fontWeight: '700', color, lineHeight: 1 }}>{score}%</span>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: size < 100 ? '8px' : '10px', color, letterSpacing: '0.08em', marginTop: '4px' }}>{label}</span>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: dark ? 'rgba(255,255,255,0.3)' : '#8a8070', letterSpacing: '0.08em' }}>
        Threshold: {PLAN_THRESHOLD}%
      </div>
    </div>
  )
}

export default function Analytics() {
  const [dark, setDark] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [analysing, setAnalysing] = useState(false)
  const [analysis, setAnalysis] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('fc-dark-mode')
    if (saved === 'true') setDark(true)
    const handler = () => setDark(localStorage.getItem('fc-dark-mode') === 'true')
    window.addEventListener('storage', handler)
    window.addEventListener('fc-theme-change', handler)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('fc-theme-change', handler)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const { data } = await supabase.from('trades').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
      if (data) setTrades(data)
      setLoading(false)
    })
  }, [])

  const total = trades.length
  const wins = trades.filter(t => t.pnl > 0)
  const losses = trades.filter(t => t.pnl < 0)
  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0)

  const pairStats: Record<string, { wins: number; total: number; pnl: number }> = {}
  trades.forEach(t => {
    if (!pairStats[t.pair]) pairStats[t.pair] = { wins: 0, total: 0, pnl: 0 }
    pairStats[t.pair].total++
    pairStats[t.pair].pnl += t.pnl
    if (t.pnl > 0) pairStats[t.pair].wins++
  })

  const emotionStats: Record<string, { wins: number; total: number; pnl: number }> = {}
  trades.forEach(t => {
    const em = t.emotion || 'Unknown'
    if (!emotionStats[em]) emotionStats[em] = { wins: 0, total: 0, pnl: 0 }
    emotionStats[em].total++
    emotionStats[em].pnl += t.pnl
    if (t.pnl > 0) emotionStats[em].wins++
  })

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayStats: Record<string, { wins: number; total: number; pnl: number }> = {}
  trades.forEach(t => {
    const day = dayNames[new Date(t.created_at).getDay()]
    if (!dayStats[day]) dayStats[day] = { wins: 0, total: 0, pnl: 0 }
    dayStats[day].total++
    dayStats[day].pnl += t.pnl
    if (t.pnl > 0) dayStats[day].wins++
  })

  const planYes = trades.filter(t => t.followed_plan === true)
  const planNo = trades.filter(t => t.followed_plan === false)
  const planTrades = trades.filter(t => t.followed_plan !== null)
  const planScore = total > 0 ? Math.round((planYes.length / total) * 100) : 0
  const planYesWinRate = planYes.length > 0 ? Math.round((planYes.filter(t => t.pnl > 0).length / planYes.length) * 100) : 0
  const planNoWinRate = planNo.length > 0 ? Math.round((planNo.filter(t => t.pnl > 0).length / planNo.length) * 100) : 0
  const planYesPnl = planYes.reduce((s, t) => s + t.pnl, 0)
  const planNoPnl = planNo.reduce((s, t) => s + t.pnl, 0)
  const luckyBreaks = planNo.filter(t => t.pnl > 0).length

  const sortedDays = Object.entries(dayStats).sort((a, b) => b[1].pnl - a[1].pnl)
  const bestDay = sortedDays[0]?.[0]
  const worstDay = sortedDays[sortedDays.length - 1]?.[0]

  async function analysePerformance() {
    if (trades.length < 10) return
    setAnalysing(true)
    setAnalysis('')

    const winRate = Math.round((wins.length / total) * 100)
    const avgRR = (trades.reduce((s, t) => s + (t.rr || 0), 0) / total).toFixed(2)
    const grossProfit = wins.reduce((s, t) => s + t.pnl, 0)
    const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0))
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : '∞'

    const pairSummary = Object.entries(pairStats).sort((a, b) => b[1].total - a[1].total).map(([pair, s]) => `${pair}: ${s.total} trades, ${Math.round((s.wins / s.total) * 100)}% win rate, ${s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(0)}€ P&L`).join('\n')
    const emotionSummary = Object.entries(emotionStats).sort((a, b) => b[1].total - a[1].total).map(([em, s]) => `${em}: ${s.total} trades, ${Math.round((s.wins / s.total) * 100)}% win rate, ${s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(0)}€ P&L`).join('\n')
    const daySummary = Object.entries(dayStats).map(([day, s]) => `${day}: ${s.total} trades, ${Math.round((s.wins / s.total) * 100)}% win rate, ${s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(0)}€ P&L`).join('\n')
    const planSummary = `Followed plan: ${planYes.length} trades (${planYesWinRate}% win rate, ${planYesPnl >= 0 ? '+' : ''}${planYesPnl.toFixed(0)}€)\nBroke plan: ${planNo.length} trades (${planNoWinRate}% win rate, ${planNoPnl >= 0 ? '+' : ''}${planNoPnl.toFixed(0)}€)\nLucky breaks (broke plan but won): ${luckyBreaks} trades — these are dangerous, not skills.`
    const sampleNote = total < 30 ? `IMPORTANT: Sample size is only ${total} trades. Be cautious with conclusions — patterns need more data to be reliable. Flag this clearly.` : total < 60 ? `Sample size is ${total} trades — patterns are emerging but still early. Note this in your assessment.` : `Sample size is ${total} trades — statistically meaningful patterns can be identified with confidence.`

    const prompt = `You are an elite trading performance analyst reviewing a trader's journal. Your job is to identify ONLY patterns that are clearly visible in the data. Do NOT give generic trading advice. Every insight must be directly traceable to the numbers provided.\n\n${sampleNote}\n\nOVERALL PERFORMANCE:\n- Total trades: ${total}\n- Net P&L: ${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(0)}€\n- Win rate: ${winRate}%\n- Average R:R: ${avgRR}\n- Profit factor: ${profitFactor}\n- Gross profit: +${grossProfit.toFixed(0)}€\n- Gross loss: -${grossLoss.toFixed(0)}€\n\nPERFORMANCE BY PAIR:\n${pairSummary}\n\nPERFORMANCE BY EMOTION STATE:\n${emotionSummary}\n\nPERFORMANCE BY DAY:\n${daySummary}\n\nPLAN ADHERENCE:\n${planSummary}\n\nProvide a concise, data-driven analysis using EXACTLY this structure. Use plain text, no markdown symbols:\n\nOVERALL ASSESSMENT\n2-3 sentences. Be honest. Reference the actual numbers.\n\nWHAT IS WORKING\nList 2-3 specific things backed by the data. If a pair has 70%+ win rate, name it. If an emotion correlates with wins, name it.\n\nWHAT IS HURTING YOUR PERFORMANCE\nList 2-3 specific patterns from the data. Name exact pairs, emotions, or days that are dragging results. Be direct.\n\nTHE PROCESS PROBLEM\nAnalyse plan adherence. If they broke the plan and got lucky, call it out explicitly. A winning trade from a broken plan is more dangerous than a losing trade from a followed plan — explain why this specific trader's data shows this.\n\nONE FOCUS FOR YOUR NEXT 20 TRADES\nOne specific, actionable instruction based purely on their data. Not generic. Tell them exactly what to do or stop doing.`

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] })
      })
      const data = await response.json()
      const text = data.content?.map((c: any) => c.text || '').join('') || 'Could not generate analysis.'
      setAnalysis(text)
    } catch {
      setAnalysis('Could not connect. Please try again.')
    }
    setAnalysing(false)
  }

  const t = getTheme(dark)
  const { bg, cardBg, cardBorder, cardShadow, textPrimary, textMuted, accent, tableBorder } = t
  const card = getCard(dark)
  const planColor = planScore >= PLAN_THRESHOLD ? '#22c55e' : planScore >= 60 ? '#f59e0b' : '#dc3232'
  const belowThreshold = planTrades.length > 0 && planScore < PLAN_THRESHOLD

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px 48px', background: bg, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: isMobile ? '16px' : '28px' }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: isMobile ? '16px' : '24px', height: '1px', background: accent }} />Trading Journal
        </div>
        {isMobile ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: textPrimary, letterSpacing: '-1px', lineHeight: 1, marginBottom: '12px' }}>Analytics.</h1>
            <SegmentedControl options={TABS.map(tb => ({ label: tb.label, value: tb.value }))} value="analytics" onChange={v => { const tab = TABS.find(tb => tb.value === v); if (tab) window.location.href = tab.href }} dark={dark} />
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '40px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1 }}>Analytics.</h1>
            <SegmentedControl options={TABS.map(tb => ({ label: tb.label, value: tb.value }))} value="analytics" onChange={v => { const tab = TABS.find(tb => tb.value === v); if (tab) window.location.href = tab.href }} dark={dark} />
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' as const, padding: '80px', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>Loading...</div>
      ) : total === 0 ? (
        <div style={{ ...card, padding: isMobile ? '40px 24px' : '64px', textAlign: 'center' as const }}>
          <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '18px', color: textMuted, marginBottom: '8px' }}>No trades to analyse yet.</div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted, marginBottom: '24px' }}>Log at least 10 trades to unlock AI analysis.</div>
          <a href="/dashboard/journal/trades" style={{ background: accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '11px 24px', textDecoration: 'none', borderRadius: '10px', fontWeight: '700' }}>Go to Trade Log →</a>
        </div>
      ) : (
        <>
          {/* Warning banner */}
          {belowThreshold && (
            <div style={{ background: planScore >= 60 ? 'rgba(245,158,11,0.08)' : 'rgba(220,50,50,0.08)', border: `0.5px solid ${planScore >= 60 ? 'rgba(245,158,11,0.3)' : 'rgba(220,50,50,0.3)'}`, borderRadius: '12px', padding: isMobile ? '14px' : '16px 20px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ fontSize: '18px', flexShrink: 0 }}>{planScore >= 60 ? '⚠️' : '🚨'}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: '700', color: planScore >= 60 ? '#f59e0b' : '#dc3232', marginBottom: '4px' }}>
                  {planScore >= 60 ? 'Plan adherence below threshold' : 'Critical: Plan adherence is dangerously low'}
                </div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted, lineHeight: '1.5' }}>
                  Your plan adherence is {planScore}% — the minimum threshold is {PLAN_THRESHOLD}%. {luckyBreaks > 0 ? `You had ${luckyBreaks} winning trade${luckyBreaks > 1 ? 's' : ''} where you broke the plan. These are not skills — they are luck that builds bad habits.` : 'Every trade outside your plan is a step backward, regardless of the outcome.'}
                </div>
              </div>
            </div>
          )}

          {/* Plan Adherence */}
          {planTrades.length > 0 && (
            <div style={{ ...card, padding: isMobile ? '20px 16px' : '28px 32px', marginBottom: '16px', borderTop: `3px solid ${planColor}` }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '20px' }}>Plan Adherence</div>

              {isMobile ? (
                // Mobile: gauge centered, then 2-col stats below
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <PlanScoreGauge score={planScore} dark={dark} size={110} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ padding: '14px', background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: '12px' }}>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>✓ Followed</div>
                      <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: '#22c55e', lineHeight: 1, marginBottom: '4px' }}>{planYesWinRate}%</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted, marginBottom: '2px' }}>win rate</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: '600', color: planYesPnl >= 0 ? '#22c55e' : '#dc3232' }}>{planYesPnl >= 0 ? '+' : ''}{planYesPnl.toFixed(0)}€</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted }}>{planYes.length} trades</div>
                    </div>
                    <div style={{ padding: '14px', background: 'rgba(220,50,50,0.06)', border: '0.5px solid rgba(220,50,50,0.2)', borderRadius: '12px' }}>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#dc3232', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>✕ Broke</div>
                      <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: '#dc3232', lineHeight: 1, marginBottom: '4px' }}>{planNoWinRate}%</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted, marginBottom: '2px' }}>win rate</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: '600', color: planNoPnl >= 0 ? '#22c55e' : '#dc3232' }}>{planNoPnl >= 0 ? '+' : ''}{planNoPnl.toFixed(0)}€</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted }}>{planNo.length} trades</div>
                      {luckyBreaks > 0 && <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#f59e0b', marginTop: '4px' }}>⚠ {luckyBreaks} lucky</div>}
                    </div>
                  </div>
                </>
              ) : (
                // Desktop: side-by-side
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '40px', alignItems: 'center' }}>
                  <PlanScoreGauge score={planScore} dark={dark} />
                  <div style={{ padding: '20px 24px', background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><span>✓</span> Followed Plan</div>
                    <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '36px', fontWeight: '700', color: '#22c55e', lineHeight: 1, marginBottom: '6px' }}>{planYesWinRate}%</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>win rate</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: '600', color: planYesPnl >= 0 ? '#22c55e' : '#dc3232' }}>{planYesPnl >= 0 ? '+' : ''}{planYesPnl.toFixed(0)}€</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted, marginTop: '2px' }}>{planYes.length} trades</div>
                  </div>
                  <div style={{ padding: '20px 24px', background: 'rgba(220,50,50,0.06)', border: '0.5px solid rgba(220,50,50,0.2)', borderRadius: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#dc3232', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><span>✕</span> Broke Plan</div>
                    <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '36px', fontWeight: '700', color: '#dc3232', lineHeight: 1, marginBottom: '6px' }}>{planNoWinRate}%</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>win rate</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: '600', color: planNoPnl >= 0 ? '#22c55e' : '#dc3232' }}>{planNoPnl >= 0 ? '+' : ''}{planNoPnl.toFixed(0)}€</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted, marginTop: '2px' }}>{planNo.length} trades</div>
                    {luckyBreaks > 0 && <div style={{ marginTop: '8px', fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#f59e0b' }}>⚠ {luckyBreaks} lucky win{luckyBreaks > 1 ? 's' : ''} — not skill</div>}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '16px', padding: isMobile ? '12px 14px' : '14px 18px', background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(26,26,26,0.03)', borderRadius: '8px', borderLeft: `3px solid ${planColor}` }}>
                <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: isMobile ? '12px' : '13px', color: textMuted, lineHeight: '1.6', margin: 0 }}>
                  {planScore >= PLAN_THRESHOLD
                    ? `You are following your plan ${planScore}% of the time — above the ${PLAN_THRESHOLD}% threshold. This is the foundation of a professional trader. Keep it here.`
                    : `A winning trade from a broken plan is not a good trade — it is a dangerous trade. It teaches your brain that breaking the plan has no consequences. This is how bad habits form. Your plan exists because it was built with a clear head. Follow it.`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Stats grid: 3-col desktop, 1-col mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>

            {/* By Pair */}
            <div style={{ ...card, padding: isMobile ? '16px' : '24px', borderTop: `3px solid ${accent}` }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '16px' }}>Performance by Pair</div>
              {Object.entries(pairStats).sort((a, b) => b[1].pnl - a[1].pnl).slice(0, isMobile ? 4 : 6).map(([pair, s]) => {
                const pairBase = pair.replace('/', '').substring(0, 2).toUpperCase()
                return (
                  <div key={pair} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: dark ? 'rgba(122,174,232,0.12)' : 'rgba(43,94,167,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '7px', fontWeight: '700', color: accent }}>{pairBase}</span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textPrimary, fontWeight: '600' }}>{pair}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: s.pnl >= 0 ? '#22c55e' : '#dc3232', fontWeight: '700' }}>{s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(0)}€</span>
                    </div>
                    <div style={{ height: '5px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '3px' }}>
                      <div style={{ height: '100%', width: `${Math.round((s.wins / s.total) * 100)}%`, background: s.pnl >= 0 ? '#22c55e' : '#dc3232', borderRadius: '3px' }} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted }}>{s.total} trades · {Math.round((s.wins / s.total) * 100)}% win rate</div>
                  </div>
                )
              })}
            </div>

            {/* By Emotion */}
            <div style={{ ...card, padding: isMobile ? '16px' : '24px', borderTop: `3px solid ${accent}` }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '16px' }}>Performance by Emotion</div>
              {Object.entries(emotionStats).sort((a, b) => b[1].pnl - a[1].pnl).map(([em, s]) => {
                const winR = Math.round((s.wins / s.total) * 100)
                const emColor = winR >= 60 ? '#22c55e' : winR >= 40 ? '#f59e0b' : '#dc3232'
                return (
                  <div key={em} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: `0.5px solid ${tableBorder}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>{EMOTIONS.find(e => e.label === em)?.emoji || '—'}</span>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textPrimary }}>{em}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ textAlign: 'right' as const }}>
                        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: emColor, fontWeight: '700' }}>{winR}%</div>
                        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted }}>{s.total} trades</div>
                      </div>
                      <div style={{ width: '32px', height: '5px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${winR}%`, background: emColor, borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* By Day */}
            <div style={{ ...card, padding: isMobile ? '16px' : '24px', borderTop: `3px solid ${accent}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted }}>Best Days to Trade</div>
                {total < 20 && <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: '4px' }}>Need 20 trades</div>}
              </div>
              {total < 20 ? (
                <div style={{ padding: '24px 0', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '13px', color: textMuted, marginBottom: '4px' }}>Not enough data yet.</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>Log {20 - total} more trade{20 - total !== 1 ? 's' : ''} to see your best days.</div>
                  <div style={{ marginTop: '14px', height: '4px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(total / 20) * 100}%`, background: accent, borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, marginTop: '4px' }}>{total} / 20 trades</div>
                </div>
              ) : (
                sortedDays.map(([day, s]) => {
                  const winR = Math.round((s.wins / s.total) * 100)
                  const isBest = day === bestDay
                  const isWorst = day === worstDay
                  return (
                    <div key={day} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textPrimary }}>{day}</span>
                          {isBest && <span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '1px 6px', borderRadius: '3px' }}>BEST</span>}
                          {isWorst && <span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: '#dc3232', background: 'rgba(220,50,50,0.1)', padding: '1px 6px', borderRadius: '3px' }}>WORST</span>}
                        </div>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: s.pnl >= 0 ? '#22c55e' : '#dc3232', fontWeight: '700' }}>{s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(0)}€</span>
                      </div>
                      <div style={{ height: '5px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '2px' }}>
                        <div style={{ height: '100%', width: `${winR}%`, background: s.pnl >= 0 ? '#22c55e' : '#dc3232', borderRadius: '3px' }} />
                      </div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted }}>{s.total} trades · {winR}% win rate</div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* AI Analysis */}
          <div style={{ ...card, padding: isMobile ? '20px 16px' : '32px', borderTop: `3px solid ${accent}` }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' as const, alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '4px' }}>AI Performance Analysis</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '17px' : '20px', fontWeight: '700', color: textPrimary }}>Your personal trading coach.</div>
              </div>
              <div style={{ width: isMobile ? '100%' : 'auto' }}>
                {total < 10 && (
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '4px 10px', borderRadius: '6px', marginBottom: '8px' }}>
                    Need {10 - total} more trades to unlock
                  </div>
                )}
                <button onClick={analysePerformance} disabled={analysing || total < 10}
                  style={{ width: isMobile ? '100%' : 'auto', background: total < 10 ? (dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.05)') : accent, color: total < 10 ? textMuted : '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '11px 24px', border: 'none', cursor: analysing || total < 10 ? 'not-allowed' : 'pointer', borderRadius: '10px', fontWeight: '700', opacity: analysing ? 0.7 : 1 }}>
                  {analysing ? 'Analysing...' : analysis ? 'Re-analyse →' : 'Analyse my trades →'}
                </button>
              </div>
            </div>

            {!analysis && !analysing && (
              <div style={{ padding: isMobile ? '28px 16px' : '40px', textAlign: 'center' as const, border: `0.5px dashed ${cardBorder}`, borderRadius: '12px' }}>
                {total < 10 ? (
                  <>
                    <div style={{ fontSize: '28px', marginBottom: '10px' }}>🔒</div>
                    <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '15px', color: textMuted, marginBottom: '6px' }}>Not enough data for reliable analysis.</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted }}>Log {10 - total} more trade{10 - total !== 1 ? 's' : ''} to unlock AI coaching.</div>
                    <div style={{ marginTop: '16px', height: '4px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', borderRadius: '2px', overflow: 'hidden', maxWidth: '200px', margin: '16px auto 0' }}>
                      <div style={{ height: '100%', width: `${(total / 10) * 100}%`, background: accent, borderRadius: '2px' }} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, marginTop: '4px' }}>{total} / 10 trades</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '15px', color: textMuted, marginBottom: '8px' }}>Ready to analyse {total} trades.</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted }}>
                      {total < 30 ? 'Early stage — patterns are emerging. Analysis will be cautious.' : total < 60 ? 'Good sample size — meaningful patterns can be identified.' : 'Strong sample size — high confidence pattern analysis.'}
                    </div>
                  </>
                )}
              </div>
            )}

            {analysing && (
              <div style={{ padding: isMobile ? '28px 16px' : '40px', textAlign: 'center' as const }}>
                <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '15px', color: textMuted, marginBottom: '8px' }}>Analysing your {total} trades...</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted }}>Reviewing patterns, emotions, plan adherence, pair performance, and day tendencies.</div>
              </div>
            )}

            {analysis && !analysing && (
              <div style={{ background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(43,94,167,0.02)', border: `0.5px solid ${cardBorder}`, borderRadius: '12px', padding: isMobile ? '18px' : '28px' }}>
                {analysis.split('\n').map((line, i) => {
                  const isHeader = line.trim().toUpperCase() === line.trim() && line.trim().length > 0 && !line.startsWith('-') && !line.startsWith('•')
                  return (
                    <p key={i} style={{
                      fontFamily: isHeader ? 'var(--font-inter)' : 'var(--font-playfair)',
                      fontSize: isHeader ? '10px' : isMobile ? '13px' : '14px',
                      fontWeight: isHeader ? '700' : '400',
                      color: isHeader ? accent : textPrimary,
                      letterSpacing: isHeader ? '0.1em' : 'normal',
                      textTransform: isHeader ? 'uppercase' as const : 'none' as const,
                      lineHeight: isHeader ? '1.4' : '1.8',
                      marginBottom: isHeader ? '8px' : '6px',
                      marginTop: isHeader && i > 0 ? '20px' : '0',
                    }}>
                      {line}
                    </p>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}