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

function PairIcon({ pair }: { pair: string }) {
  const icons: Record<string, string> = {
    'EUR': '🇪🇺', 'GBP': '🇬🇧', 'USD': '🇺🇸', 'JPY': '🇯🇵',
    'CHF': '🇨🇭', 'AUD': '🇦🇺', 'CAD': '🇨🇦', 'NZD': '🇳🇿',
    'XAU': '🥇', 'XAG': '🥈', 'NAS': '📈', 'US5': '📊',
    'US3': '📊', 'DAX': '🇩🇪', 'BTC': '₿', 'ETH': '⟠', 'USO': '🛢️',
  }
  const base = pair.replace('/', '').substring(0, 3).toUpperCase()
  return (
    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(43,94,167,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
      {icons[base] || '💱'}
    </div>
  )
}

function ThreeArcGauge({ wins, losses, be, total, dark }: { wins: number; losses: number; be: number; total: number; dark: boolean }) {
  const size = 80; const sw = 7; const r = (size - sw) / 2; const circ = 2 * Math.PI * r
  const winDash = total > 0 ? (wins / total) * circ : 0
  const beDash = total > 0 ? (be / total) * circ : 0
  const lossDash = total > 0 ? (losses / total) * circ : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)'} strokeWidth={sw} />
          {wins > 0 && <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#22c55e" strokeWidth={sw} strokeDasharray={`${winDash} ${circ - winDash}`} strokeDashoffset={0} strokeLinecap="round" />}
          {be > 0 && <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#94a3b8" strokeWidth={sw} strokeDasharray={`${beDash} ${circ - beDash}`} strokeDashoffset={-winDash} strokeLinecap="round" />}
          {losses > 0 && <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#dc3232" strokeWidth={sw} strokeDasharray={`${lossDash} ${circ - lossDash}`} strokeDashoffset={-(winDash + beDash)} strokeLinecap="round" />}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '700', color: dark ? '#e0ecf8' : '#1a1a1a' }}>{total}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: dark ? 'rgba(255,255,255,0.4)' : '#8a8070' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />{wins}W</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: dark ? 'rgba(255,255,255,0.4)' : '#8a8070' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#dc3232' }} />{losses}L</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: dark ? 'rgba(255,255,255,0.4)' : '#8a8070' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#94a3b8' }} />{be}BE</div>
      </div>
    </div>
  )
}

function WinRateGauge({ winRate, beRate, dark }: { winRate: number; beRate: number; dark: boolean }) {
  const size = 80; const sw = 7; const r = (size - sw) / 2; const circ = 2 * Math.PI * r
  const lossRate = Math.max(0, 100 - winRate - beRate)
  const winDash = (winRate / 100) * circ; const beDash = (beRate / 100) * circ; const lossDash = (lossRate / 100) * circ
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)'} strokeWidth={sw} />
          {winRate > 0 && <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#22c55e" strokeWidth={sw} strokeDasharray={`${winDash} ${circ - winDash}`} strokeLinecap="round" />}
          {beRate > 0 && <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#94a3b8" strokeWidth={sw} strokeDasharray={`${beDash} ${circ - beDash}`} strokeDashoffset={-winDash} strokeLinecap="round" />}
          {lossRate > 0 && <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#dc3232" strokeWidth={sw} strokeDasharray={`${lossDash} ${circ - lossDash}`} strokeDashoffset={-(winDash + beDash)} strokeLinecap="round" />}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '700', color: dark ? '#e0ecf8' : '#1a1a1a' }}>{winRate}%</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: dark ? 'rgba(255,255,255,0.4)' : '#8a8070' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />Win</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: dark ? 'rgba(255,255,255,0.4)' : '#8a8070' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#dc3232' }} />Loss</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: dark ? 'rgba(255,255,255,0.4)' : '#8a8070' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#94a3b8' }} />BE</div>
      </div>
    </div>
  )
}

function AvgWinLossGauge({ avgWin, avgLoss, dark, accent }: { avgWin: number; avgLoss: number; dark: boolean; accent: string }) {
  const size = 80; const sw = 7; const r = (size - sw) / 2; const circ = 2 * Math.PI * r
  const ratio = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? 3 : 0
  const fill = (Math.min(ratio, 3) / 3) * circ
  const color = ratio >= 2 ? '#22c55e' : ratio >= 1 ? accent : ratio === 0 ? (dark ? 'rgba(255,255,255,0.2)' : '#c8c0b0') : '#dc3232'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)'} strokeWidth={sw} />
          {fill > 0 && <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={`${fill} ${circ - fill}`} strokeLinecap="round" />}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: '700', color }}>{avgLoss > 0 ? ratio.toFixed(2) : avgWin > 0 ? '∞' : '—'}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#22c55e' }}>+{avgWin.toFixed(0)}€</div>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#dc3232' }}>-{avgLoss.toFixed(0)}€</div>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: dark ? 'rgba(255,255,255,0.3)' : '#8a8070' }}>{ratio >= 2 ? 'Excellent' : ratio >= 1 ? 'Profitable' : ratio === 0 ? 'No data' : 'Needs work'}</div>
      </div>
    </div>
  )
}

function PnlChart({ data, trades, dark }: { data: number[]; trades: Trade[]; dark: boolean }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  if (data.length < 2) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: dark ? 'rgba(255,255,255,0.2)' : '#c8c0b0', fontSize: '13px' }}>
      Log at least 2 trades to see your curve
    </div>
  )
  const cumulative = data.reduce((acc, val) => { acc.push((acc[acc.length - 1] || 0) + val); return acc }, [] as number[])
  const min = Math.min(...cumulative, 0); const max = Math.max(...cumulative, 0); const range = max - min || 1
  const W = 560; const H = 170; const padL = 52; const padR = 12; const padT = 10; const padB = 28
  const pts = cumulative.map((v, i) => ({ x: padL + (i / (cumulative.length - 1)) * (W - padL - padR), y: padT + ((max - v) / range) * (H - padT - padB), value: v }))
  function bezierPath(points: { x: number; y: number }[]) {
    if (points.length < 2) return ''
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) { const prev = points[i - 1]; const curr = points[i]; const cpx = (prev.x + curr.x) / 2; d += ` C ${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}` }
    return d
  }
  const pathD = bezierPath(pts)
  const isPositive = cumulative[cumulative.length - 1] >= 0
  const lineColor = isPositive ? '#22c55e' : '#dc3232'
  const zeroY = padT + ((max - 0) / range) * (H - padT - padB)
  const axisColor = dark ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,26,0.08)'
  const labelColor = dark ? 'rgba(255,255,255,0.3)' : '#8a8070'
  const yLabels = Array.from({ length: 5 }, (_, i) => ({ val: max - (range * i) / 4, y: padT + (i / 4) * (H - padT - padB) }))
  const xStep = Math.max(1, Math.floor(cumulative.length / 4))
  const xLabels = cumulative.map((_, i) => i).filter(i => i === 0 || i === cumulative.length - 1 || i % xStep === 0).slice(0, 6)
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={lineColor} stopOpacity="0.25" /><stop offset="100%" stopColor={lineColor} stopOpacity="0.02" /></linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {yLabels.map(({ val, y }, i) => (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={axisColor} strokeWidth="0.5" strokeDasharray={val === 0 ? '0' : '3,3'} />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontFamily="Arial, sans-serif" fontSize="8.5" fill={labelColor}>{Math.abs(val) >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0)}€</text>
          </g>
        ))}
        {min < 0 && max > 0 && <line x1={padL} y1={zeroY} x2={W - padR} y2={zeroY} stroke={dark ? 'rgba(255,255,255,0.2)' : 'rgba(26,26,26,0.15)'} strokeWidth="1" />}
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={axisColor} strokeWidth="0.5" />
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={axisColor} strokeWidth="0.5" />
        {xLabels.map(i => { const pt = pts[i]; const trade = trades[i]; const date = trade ? new Date(trade.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : ''; return <text key={i} x={pt.x} y={H - padB + 14} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8.5" fill={labelColor}>{date}</text> })}
        <path d={`${pathD} L ${pts[pts.length-1].x} ${Math.min(zeroY, H - padB)} L ${pts[0].x} ${Math.min(zeroY, H - padB)} Z`} fill="url(#pnlGrad)" />
        <path d={pathD} fill="none" stroke={lineColor} strokeWidth="4" opacity="0.3" filter="url(#glow)" />
        <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" />
        {pts.map((pt, i) => (
          <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} style={{ cursor: 'pointer' }}>
            <circle cx={pt.x} cy={pt.y} r="12" fill="transparent" />
            <circle cx={pt.x} cy={pt.y} r={hoveredIdx === i ? 5 : 3} fill={lineColor} stroke={dark ? '#080d14' : '#ffffff'} strokeWidth="2" style={{ transition: 'r 0.15s ease' }} />
          </g>
        ))}
        {hoveredIdx !== null && (() => {
          const pt = pts[hoveredIdx]; const trade = trades[hoveredIdx]; const pnl = data[hoveredIdx]
          const popupW = 150; const popupH = 72
          const px = pt.x + popupW > W ? pt.x - popupW - 8 : pt.x + 8
          const py = pt.y - popupH < 0 ? pt.y + 8 : pt.y - popupH - 8
          return (
            <g>
              <rect x={px} y={py} width={popupW} height={popupH} rx="8" fill={dark ? '#0f1825' : '#ffffff'} stroke={dark ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,26,0.1)'} strokeWidth="0.5" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }} />
              <text x={px+10} y={py+16} fontFamily="Arial, sans-serif" fontSize="9" fill={labelColor}>{new Date(trade?.created_at || '').toLocaleDateString('en-GB')}</text>
              <text x={px+10} y={py+32} fontFamily="Georgia, serif" fontSize="13" fontWeight="bold" fill={dark ? '#e0ecf8' : '#1a1a1a'}>{trade?.pair}</text>
              <text x={px+10} y={py+48} fontFamily="Georgia, serif" fontSize="13" fontWeight="bold" fill={pnl >= 0 ? '#22c55e' : '#dc3232'}>{pnl >= 0 ? '+' : ''}{pnl.toFixed(0)}€</text>
              <text x={px+10} y={py+62} fontFamily="Arial, sans-serif" fontSize="9" fill={labelColor}>{trade?.direction} · {trade?.emotion}</text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

function SegmentedControl({ options, value, onChange, dark }: { options: { label: string; value: string }[]; value: string; onChange: (v: string) => void; dark: boolean }) {
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

function MonthCalendar({ trades, dark, cardBg, cardBorder, cardShadow, textPrimary, textMuted, accent, tableBorder }: {
  trades: Trade[]; dark: boolean; cardBg: string; cardBorder: string; cardShadow: string; textPrimary: string; textMuted: string; accent: string; tableBorder: string
}) {
  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())

  const isCurrentMonth = calYear === today.getFullYear() && calMonth === today.getMonth()

  // Build day PnL map
  const dayMap: Record<string, number> = {}
  trades.forEach(t => {
    const d = new Date(t.created_at)
    if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
      const key = d.getDate().toString()
      dayMap[key] = (dayMap[key] || 0) + (t.pnl || 0)
    }
  })

  const firstDay = new Date(calYear, calMonth, 1)
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  // Start from Monday (0=Mon, 6=Sun)
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const weeks: (number | null)[][] = []
  let currentWeek: (number | null)[] = Array(startOffset).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(d)
    if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = [] }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null)
    weeks.push(currentWeek)
  }

  const monthName = new Date(calYear, calMonth).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) } else setCalMonth(m => m - 1)
  }
  function nextMonth() {
    if (isCurrentMonth) return
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) } else setCalMonth(m => m + 1)
  }

  return (
    <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: '24px', marginTop: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted }}>Trading Calendar</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={prevMonth} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', width: '26px', height: '26px', cursor: 'pointer', color: textMuted, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '600', color: textPrimary, minWidth: '120px', textAlign: 'center' as const }}>{monthName}</span>
          <button onClick={nextMonth} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', width: '26px', height: '26px', cursor: isCurrentMonth ? 'not-allowed' : 'pointer', color: isCurrentMonth ? (dark ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,26,0.15)') : textMuted, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isCurrentMonth ? 0.3 : 1 }}>→</button>
        </div>
      </div>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
        {dayLabels.map(d => (
          <div key={d} style={{ textAlign: 'center' as const, fontFamily: 'Arial, sans-serif', fontSize: '9px', color: textMuted, letterSpacing: '0.08em', padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {week.map((day, di) => {
              if (!day) return <div key={di} />
              const pnl = dayMap[day.toString()]
              const isToday = isCurrentMonth && day === today.getDate()
              const hasTrades = pnl !== undefined
              const isProfit = hasTrades && pnl > 0
              const isLoss = hasTrades && pnl < 0
              const isBe = hasTrades && pnl === 0

              let bg = 'transparent'
              let borderColor = dark ? 'rgba(255,255,255,0.04)' : 'rgba(26,26,26,0.06)'
              let pnlColor = textMuted

              if (isProfit) { bg = dark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.08)'; borderColor = 'rgba(34,197,94,0.25)'; pnlColor = '#22c55e' }
              if (isLoss) { bg = dark ? 'rgba(220,50,50,0.12)' : 'rgba(220,50,50,0.08)'; borderColor = 'rgba(220,50,50,0.25)'; pnlColor = '#dc3232' }
              if (isBe) { bg = dark ? 'rgba(148,163,184,0.08)' : 'rgba(148,163,184,0.06)'; borderColor = 'rgba(148,163,184,0.2)'; pnlColor = '#94a3b8' }

              return (
                <div key={di} style={{ background: bg, border: `0.5px solid ${isToday ? accent : borderColor}`, borderRadius: '8px', padding: '6px 8px', minHeight: '48px', position: 'relative' as const, boxShadow: isToday ? `0 0 0 1px ${accent}` : 'none' }}>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: isToday ? accent : textMuted, fontWeight: isToday ? '700' : '400', marginBottom: '2px' }}>{day}</div>
                  {hasTrades && (
                    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', fontWeight: '700', color: pnlColor, lineHeight: 1 }}>
                      {pnl > 0 ? '+' : ''}{pnl.toFixed(0)}€
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', paddingTop: '12px', borderTop: `0.5px solid ${tableBorder}` }}>
        {[
          { color: '#22c55e', label: 'Profitable day' },
          { color: '#dc3232', label: 'Loss day' },
          { color: '#94a3b8', label: 'Breakeven' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: textMuted }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color, opacity: 0.7 }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}

const TABS = [
  { label: 'Overview', href: '/dashboard/journal', value: 'overview' },
  { label: 'Trade Log', href: '/dashboard/journal/trades', value: 'trades' },
  { label: 'Analytics', href: '/dashboard/journal/analytics', value: 'analytics' },
]

export default function JournalDashboard() {
  const [dark, setDark] = useState(false)
  const [trades, setTrades] = useState<Trade[]>([])
  const [chartMode, setChartMode] = useState('daily')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('fc-dark-mode')
    if (saved === 'true') setDark(true)
    const handler = () => setDark(localStorage.getItem('fc-dark-mode') === 'true')
    window.addEventListener('storage', handler)
    window.addEventListener('fc-theme-change', handler)
    return () => { window.removeEventListener('storage', handler); window.removeEventListener('fc-theme-change', handler) }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const { data } = await supabase.from('trades').select('*').eq('user_id', session.user.id).order('created_at', { ascending: true })
      if (data) setTrades(data)
      setLoading(false)
    })
  }, [])

  const total = trades.length
  const totalPnl = trades.reduce((s, t) => s + (t.pnl || 0), 0)
  const wins = trades.filter(t => t.pnl > 0)
  const losses = trades.filter(t => t.pnl < 0)
  const be = trades.filter(t => t.pnl === 0)
  const winRate = total > 0 ? Math.round((wins.length / total) * 100) : 0
  const beRate = total > 0 ? Math.round((be.length / total) * 100) : 0
  const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((s, t) => s + t.pnl, 0) / losses.length) : 0

  function getChartData() {
    if (trades.length === 0) return []
    if (chartMode === 'daily') return trades.map(t => t.pnl || 0)
    if (chartMode === 'weekly') {
      const weeks: Record<string, number> = {}
      trades.forEach(t => { const d = new Date(t.created_at); const week = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`; weeks[week] = (weeks[week] || 0) + (t.pnl || 0) })
      return Object.values(weeks)
    }
    const months: Record<string, number> = {}
    trades.forEach(t => { const d = new Date(t.created_at); const month = `${d.getFullYear()}-${d.getMonth()}`; months[month] = (months[month] || 0) + (t.pnl || 0) })
    return Object.values(months)
  }

  const chartData = getChartData()
  const recentTrades = [...trades].reverse().slice(0, 8)

  const bg = dark ? '#080d14' : '#F5F2EC'
  const cardBg = dark ? '#0f1825' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const cardShadow = dark ? '0 4px 20px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset' : '0 4px 20px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset'
  const textPrimary = dark ? '#e0ecf8' : '#1a1a1a'
  const textMuted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const accent = dark ? '#7aaee8' : '#2B5EA7'
  const tableBorder = dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.06)'
  const card = { background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow }
  const pnlCardBg = totalPnl > 0 ? dark ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.06)' : totalPnl < 0 ? dark ? 'rgba(220,50,50,0.08)' : 'rgba(220,50,50,0.06)' : cardBg
  const pnlCardBorder = totalPnl > 0 ? 'rgba(34,197,94,0.25)' : totalPnl < 0 ? 'rgba(220,50,50,0.25)' : cardBorder

  return (
    <div style={{ padding: '40px 48px', background: bg, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: accent }} />Trading Journal
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1 }}>Overview.</h1>
          <SegmentedControl options={TABS.map(t => ({ label: t.label, value: t.value }))} value="overview" onChange={v => { const tab = TABS.find(t => t.value === v); if (tab) window.location.href = tab.href }} dark={dark} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: pnlCardBg, border: `0.5px solid ${pnlCardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: '20px 24px', transition: 'all 0.4s ease' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '8px' }}>Total Net P&L</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: totalPnl >= 0 ? '#22c55e' : '#dc3232', lineHeight: 1, marginBottom: '4px' }}>{totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(0)}€</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted }}>{total} trades</div>
        </div>
        <div style={{ ...card, padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '12px' }}>Total Trades</div>
          <ThreeArcGauge wins={wins.length} losses={losses.length} be={be.length} total={total} dark={dark} />
        </div>
        <div style={{ ...card, padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '12px' }}>Win Rate</div>
          <WinRateGauge winRate={winRate} beRate={beRate} dark={dark} />
        </div>
        <div style={{ ...card, padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '12px' }}>Avg Win / Loss</div>
          <AvgWinLossGauge avgWin={avgWin} avgLoss={avgLoss} dark={dark} accent={accent} />
        </div>
      </div>

      {/* Chart + recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div style={{ ...card, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '4px' }}>Cumulative P&L</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '700', color: totalPnl >= 0 ? '#22c55e' : '#dc3232' }}>{totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(0)}€</div>
            </div>
            <SegmentedControl options={[{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }]} value={chartMode} onChange={setChartMode} dark={dark} />
          </div>
          <div style={{ height: '200px' }}>
            <PnlChart data={chartData} trades={trades} dark={dark} />
          </div>
        </div>

        <div style={{ ...card, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted }}>Recent Trades</div>
            <a href="/dashboard/journal/trades" style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: accent, textDecoration: 'none' }}>View all →</a>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' as const }}>
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: textMuted }}>Loading...</div>
            ) : recentTrades.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: textMuted, fontSize: '14px' }}>No trades yet</div>
            ) : recentTrades.map(trade => (
              <div key={trade.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderTop: `0.5px solid ${tableBorder}`, transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.03)' : 'rgba(43,94,167,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PairIcon pair={trade.pair} />
                  <div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: '600', color: textPrimary }}>{trade.pair}</div>
                    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: textMuted }}>{trade.direction} · {trade.emotion}</div>
                  </div>
                  <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', fontWeight: '700', color: trade.pnl > 0 ? '#22c55e' : trade.pnl < 0 ? '#dc3232' : '#94a3b8', background: trade.pnl > 0 ? 'rgba(34,197,94,0.1)' : trade.pnl < 0 ? 'rgba(220,50,50,0.1)' : 'rgba(148,163,184,0.1)', padding: '2px 7px', borderRadius: '4px' }}>
                    {trade.pnl > 0 ? 'WIN' : trade.pnl < 0 ? 'LOSS' : 'BE'}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: '700', color: trade.pnl > 0 ? '#22c55e' : trade.pnl < 0 ? '#dc3232' : textMuted }}>{trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(0)}€</div>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: textMuted }}>{new Date(trade.created_at).toLocaleDateString('en-GB')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Calendar */}
      <MonthCalendar
        trades={trades}
        dark={dark}
        cardBg={cardBg}
        cardBorder={cardBorder}
        cardShadow={cardShadow}
        textPrimary={textPrimary}
        textMuted={textMuted}
        accent={accent}
        tableBorder={tableBorder}
      />
    </div>
  )
}