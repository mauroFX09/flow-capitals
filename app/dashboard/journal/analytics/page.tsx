'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Trade = {
  id: string
  pair: string
  direction: string
  pnl: number
  rr: number
  emotion: string
  followed_plan: boolean | null
  created_at: string
}

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
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{ flex: 1, padding: '7px 14px', background: 'transparent', border: 'none', color: value === opt.value ? (dark ? '#e0ecf8' : '#1a1a1a') : textMuted, fontFamily: 'Arial, sans-serif', fontSize: '11px', cursor: 'pointer', position: 'relative', zIndex: 1, fontWeight: value === opt.value ? '600' : '400', transition: 'color 0.2s ease', borderRadius: '7px' }}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [dark, setDark] = useState(false)
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
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('fc-theme-change', handler)
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

  // Pair stats
  const pairStats: Record<string, { wins: number; total: number; pnl: number }> = {}
  trades.forEach(t => {
    if (!pairStats[t.pair]) pairStats[t.pair] = { wins: 0, total: 0, pnl: 0 }
    pairStats[t.pair].total++
    pairStats[t.pair].pnl += t.pnl
    if (t.pnl > 0) pairStats[t.pair].wins++
  })

  // Emotion stats
  const emotionStats: Record<string, { wins: number; total: number; pnl: number }> = {}
  trades.forEach(t => {
    if (!emotionStats[t.emotion]) emotionStats[t.emotion] = { wins: 0, total: 0, pnl: 0 }
    emotionStats[t.emotion].total++
    emotionStats[t.emotion].pnl += t.pnl
    if (t.pnl > 0) emotionStats[t.emotion].wins++
  })

  // Day stats
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayStats: Record<string, { wins: number; total: number; pnl: number }> = {}
  trades.forEach(t => {
    const day = dayNames[new Date(t.created_at).getDay()]
    if (!dayStats[day]) dayStats[day] = { wins: 0, total: 0, pnl: 0 }
    dayStats[day].total++
    dayStats[day].pnl += t.pnl
    if (t.pnl > 0) dayStats[day].wins++
  })

  // Followed plan stats
  const planYes = trades.filter(t => t.followed_plan === true)
  const planNo = trades.filter(t => t.followed_plan === false)
  const planYesWinRate = planYes.length > 0 ? Math.round((planYes.filter(t => t.pnl > 0).length / planYes.length) * 100) : 0
  const planNoWinRate = planNo.length > 0 ? Math.round((planNo.filter(t => t.pnl > 0).length / planNo.length) * 100) : 0
  const planYesPnl = planYes.reduce((s, t) => s + t.pnl, 0)
  const planNoPnl = planNo.reduce((s, t) => s + t.pnl, 0)

  async function analysePerformance() {
    if (trades.length === 0) return
    setAnalysing(true)
    setAnalysis('')

    const totalPnl = trades.reduce((s, t) => s + t.pnl, 0)
    const winRate = Math.round((wins.length / total) * 100)
    const avgRR = (trades.reduce((s, t) => s + (t.rr || 0), 0) / total).toFixed(2)
    const grossProfit = wins.reduce((s, t) => s + t.pnl, 0)
    const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0))
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : '∞'

    const pairSummary = Object.entries(pairStats).map(([pair, s]) =>
      `${pair}: ${s.total} trades, ${Math.round((s.wins / s.total) * 100)}% win rate, ${s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(0)}€`
    ).join('\n')

    const emotionSummary = Object.entries(emotionStats).map(([em, s]) =>
      `${em}: ${s.total} trades, ${Math.round((s.wins / s.total) * 100)}% win rate, ${s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(0)}€`
    ).join('\n')

    const daySummary = Object.entries(dayStats).map(([day, s]) =>
      `${day}: ${s.total} trades, ${Math.round((s.wins / s.total) * 100)}% win rate, ${s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(0)}€`
    ).join('\n')

    const planSummary = planYes.length > 0 || planNo.length > 0
      ? `Followed plan YES: ${planYes.length} trades, ${planYesWinRate}% win rate, ${planYesPnl >= 0 ? '+' : ''}${planYesPnl.toFixed(0)}€\nFollowed plan NO: ${planNo.length} trades, ${planNoWinRate}% win rate, ${planNoPnl >= 0 ? '+' : ''}${planNoPnl.toFixed(0)}€`
      : 'No plan adherence data recorded yet.'

    const prompt = `You are a professional trading coach analysing a trader's journal. Be direct, specific, and actionable. Use a professional but encouraging tone. The trader is building their career seriously.

OVERALL STATS:
- Total trades: ${total}
- Net P&L: ${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(0)}€
- Win rate: ${winRate}%
- Average R:R: ${avgRR}
- Profit factor: ${profitFactor}

PERFORMANCE BY PAIR:
${pairSummary}

PERFORMANCE BY EMOTION:
${emotionSummary}

PERFORMANCE BY DAY:
${daySummary}

PLAN ADHERENCE:
${planSummary}

Provide a structured analysis with these sections:
1. OVERALL ASSESSMENT (2-3 sentences)
2. TOP 3 STRENGTHS
3. TOP 3 AREAS TO IMPROVE (with specific actionable advice)
4. KEY PATTERN (most important insight from the data)
5. PLAN ADHERENCE INSIGHT (how following/not following the plan affects results)
6. FOCUS FOR NEXT 30 TRADES (one specific goal)

Keep it concise, honest, and practical.`

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      const data = await response.json()
      const text = data.content?.map((c: any) => c.text || '').join('') || 'Could not generate analysis.'
      setAnalysis(text)
    } catch {
      setAnalysis('Could not connect. Please try again.')
    }
    setAnalysing(false)
  }

  const bg = dark ? '#080d14' : '#F5F2EC'
  const cardBg = dark ? '#0f1825' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const cardShadow = dark ? '0 4px 20px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset' : '0 4px 20px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset'
  const textPrimary = dark ? '#e0ecf8' : '#1a1a1a'
  const textMuted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const accent = dark ? '#7aaee8' : '#2B5EA7'
  const tableBorder = dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.06)'
  const card = { background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow }

  return (
    <div style={{ padding: '40px 48px', background: bg, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: accent }} />Trading Journal
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1 }}>Analytics.</h1>
          <SegmentedControl
            options={TABS.map(t => ({ label: t.label, value: t.value }))}
            value="analytics"
            onChange={v => { const tab = TABS.find(t => t.value === v); if (tab) window.location.href = tab.href }}
            dark={dark}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: textMuted }}>Loading...</div>
      ) : total === 0 ? (
        <div style={{ ...card, padding: '64px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '20px', color: textMuted, marginBottom: '8px' }}>No trades to analyse yet.</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: textMuted, marginBottom: '24px' }}>Log at least a few trades to unlock AI analysis.</div>
          <a href="/dashboard/journal/trades" style={{ background: accent, color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '11px 24px', textDecoration: 'none', borderRadius: '10px', fontWeight: '700' }}>Go to Trade Log →</a>
        </div>
      ) : (
        <>
          {/* Plan adherence — hero insight */}
          {(planYes.length > 0 || planNo.length > 0) && (
            <div style={{ ...card, padding: '24px', marginBottom: '20px', background: dark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.04)', border: `0.5px solid rgba(34,197,94,0.2)` }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#22c55e', marginBottom: '16px' }}>Plan Adherence — Key Insight</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted, marginBottom: '6px' }}>When you followed your plan</div>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: '#22c55e', lineHeight: 1, marginBottom: '4px' }}>{planYesWinRate}%</div>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted }}>{planYes.length} trades · {planYesPnl >= 0 ? '+' : ''}{planYesPnl.toFixed(0)}€</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted, marginBottom: '6px' }}>When you didn&apos;t follow your plan</div>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: '#dc3232', lineHeight: 1, marginBottom: '4px' }}>{planNoWinRate}%</div>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted }}>{planNo.length} trades · {planNoPnl >= 0 ? '+' : ''}{planNoPnl.toFixed(0)}€</div>
                </div>
              </div>
            </div>
          )}

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>

            {/* By Pair */}
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '16px' }}>By Pair</div>
              {Object.entries(pairStats).sort((a, b) => b[1].pnl - a[1].pnl).slice(0, 6).map(([pair, s]) => (
                <div key={pair} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: textPrimary, fontWeight: '600' }}>{pair}</span>
                    <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: s.pnl >= 0 ? '#22c55e' : '#dc3232', fontWeight: '600' }}>{s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(0)}€</span>
                  </div>
                  <div style={{ height: '4px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((s.wins / s.total) * 100)}%`, background: s.pnl >= 0 ? '#22c55e' : '#dc3232', borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: textMuted, marginTop: '2px' }}>{s.total} trades · {Math.round((s.wins / s.total) * 100)}% win</div>
                </div>
              ))}
            </div>

            {/* By Emotion */}
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '16px' }}>By Emotion</div>
              {Object.entries(emotionStats).sort((a, b) => b[1].pnl - a[1].pnl).map(([em, s]) => (
                <div key={em} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `0.5px solid ${tableBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{EMOTIONS.find(e => e.label === em)?.emoji}</span>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: textPrimary }}>{em}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: s.pnl >= 0 ? '#22c55e' : '#dc3232', fontWeight: '600' }}>{Math.round((s.wins / s.total) * 100)}%</div>
                    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: textMuted }}>{s.total} trades</div>
                  </div>
                </div>
              ))}
            </div>

            {/* By Day */}
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '16px' }}>By Day of Week</div>
              {Object.entries(dayStats).sort((a, b) => b[1].pnl - a[1].pnl).map(([day, s]) => (
                <div key={day} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: textPrimary }}>{day}</span>
                    <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: s.pnl >= 0 ? '#22c55e' : '#dc3232', fontWeight: '600' }}>{s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(0)}€</span>
                  </div>
                  <div style={{ height: '4px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((s.wins / s.total) * 100)}%`, background: s.pnl >= 0 ? '#22c55e' : '#dc3232', borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: textMuted, marginTop: '2px' }}>{s.total} trades · {Math.round((s.wins / s.total) * 100)}% win</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis */}
          <div style={{ ...card, padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '4px' }}>AI Performance Analysis</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '700', color: textPrimary }}>Your personal trading coach</div>
              </div>
              <button onClick={analysePerformance} disabled={analysing} style={{ background: accent, color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '11px 24px', border: 'none', cursor: analysing ? 'not-allowed' : 'pointer', borderRadius: '10px', fontWeight: '700', opacity: analysing ? 0.7 : 1 }}>
                {analysing ? 'Analysing...' : analysis ? 'Re-analyse →' : 'Analyse my trades →'}
              </button>
            </div>

            {!analysis && !analysing && (
              <div style={{ padding: '40px', textAlign: 'center', border: `0.5px dashed ${cardBorder}`, borderRadius: '12px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '16px', color: textMuted, marginBottom: '8px' }}>Ready to analyse {total} trades.</div>
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: textMuted }}>Get your personalised AI performance report — patterns, insights, and specific advice.</div>
              </div>
            )}

            {analysing && (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '16px', color: textMuted, marginBottom: '8px' }}>Analysing your {total} trades...</div>
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: textMuted }}>Reviewing patterns, emotions, plan adherence, and performance data.</div>
              </div>
            )}

            {analysis && !analysing && (
              <div style={{ background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(43,94,167,0.02)', border: `0.5px solid ${cardBorder}`, borderRadius: '12px', padding: '28px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: textPrimary, lineHeight: '1.85', whiteSpace: 'pre-wrap' as const }}>
                  {analysis}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}