'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useDarkMode } from '@/lib/hooks'
import { getTheme, getCard } from '@/lib/styles'
import type { Trade } from '@/lib/types'

function PairIcon({ pair }: { pair: string }) {
  const base = pair.replace('/', '').substring(0, 2).toUpperCase()
  return (
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(43,94,167,0.08)', border: '0.5px solid rgba(43,94,167,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', fontWeight: '700', color: '#2B5EA7', letterSpacing: '0.02em' }}>{base}</span>
    </div>
  )
}

function ThreeArcGauge({ wins, losses, be, total, dark, size = 80 }: { wins: number; losses: number; be: number; total: number; dark: boolean; size?: number }) {
  const sw = 7; const r = (size - sw) / 2; const circ = 2 * Math.PI * r
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
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: size < 70 ? '13px' : '16px', fontWeight: '700', color: dark ? '#e0ecf8' : '#1a1a1a' }}>{total}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter)', fontSize: '10px', color: dark ? 'rgba(255,255,255,0.4)' : '#8a8070' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />{wins}W</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter)', fontSize: '10px', color: dark ? 'rgba(255,255,255,0.4)' : '#8a8070' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#dc3232' }} />{losses}L</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter)', fontSize: '10px', color: dark ? 'rgba(255,255,255,0.4)' : '#8a8070' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#94a3b8' }} />{be}BE</div>
      </div>
    </div>
  )
}

function WinRateGauge({ winRate, beRate, dark, size = 80 }: { winRate: number; beRate: number; dark: boolean; size?: number }) {
  const sw = 7; const r = (size - sw) / 2; const circ = 2 * Math.PI * r
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
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: size < 70 ? '12px' : '14px', fontWeight: '700', color: dark ? '#e0ecf8' : '#1a1a1a' }}>{winRate}%</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter)', fontSize: '10px', color: dark ? 'rgba(255,255,255,0.4)' : '#8a8070' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />Win</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter)', fontSize: '10px', color: dark ? 'rgba(255,255,255,0.4)' : '#8a8070' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#dc3232' }} />Loss</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter)', fontSize: '10px', color: dark ? 'rgba(255,255,255,0.4)' : '#8a8070' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#94a3b8' }} />BE</div>
      </div>
    </div>
  )
}

function AvgWinLossGauge({ avgWin, avgLoss, dark, accent, size = 80 }: { avgWin: number; avgLoss: number; dark: boolean; accent: string; size?: number }) {
  const sw = 7; const r = (size - sw) / 2; const circ = 2 * Math.PI * r
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
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: size < 70 ? '11px' : '13px', fontWeight: '700', color }}>{avgLoss > 0 ? ratio.toFixed(2) : avgWin > 0 ? '∞' : '—'}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#22c55e' }}>+{avgWin.toFixed(0)}€</div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#dc3232' }}>-{avgLoss.toFixed(0)}€</div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: dark ? 'rgba(255,255,255,0.3)' : '#8a8070' }}>{ratio >= 2 ? 'Excellent' : ratio >= 1 ? 'Profitable' : ratio === 0 ? 'No data' : 'Needs work'}</div>
      </div>
    </div>
  )
}

function PnlChart({ data, trades, dark }: { data: number[]; trades: Trade[]; dark: boolean }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  if (data.length < 2) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: dark ? 'rgba(255,255,255,0.2)' : '#c8c0b0', fontSize: '13px' }}>
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
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{ flex: 1, padding: '7px 14px', background: 'transparent', border: 'none', color: value === opt.value ? (dark ? '#e0ecf8' : '#1a1a1a') : textMuted, fontFamily: 'var(--font-inter)', fontSize: '11px', cursor: 'pointer', position: 'relative', zIndex: 1, fontWeight: value === opt.value ? '600' : '400', transition: 'color 0.2s ease', borderRadius: '7px' }}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function MonthCalendar({ trades, dark, cardBg, cardBorder, cardShadow, textPrimary, textMuted, accent, tableBorder, isMobile }: {
  trades: Trade[]; dark: boolean; cardBg: string; cardBorder: string; cardShadow: string; textPrimary: string; textMuted: string; accent: string; tableBorder: string; isMobile: boolean
}) {
  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const isCurrentMonth = calYear === today.getFullYear() && calMonth === today.getMonth()

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
  const dayLabels = isMobile ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) } else setCalMonth(m => m - 1)
  }
  function nextMonth() {
    if (isCurrentMonth) return
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) } else setCalMonth(m => m + 1)
  }

  return (
    <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: isMobile ? '16px' : '24px', marginTop: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted }}>Trading Calendar</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={prevMonth} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', width: '26px', height: '26px', cursor: 'pointer', color: textMuted, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: textPrimary, minWidth: isMobile ? '100px' : '120px', textAlign: 'center' as const }}>{monthName}</span>
          <button onClick={nextMonth} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', width: '26px', height: '26px', cursor: isCurrentMonth ? 'not-allowed' : 'pointer', color: isCurrentMonth ? (dark ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,26,0.15)') : textMuted, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isCurrentMonth ? 0.3 : 1 }}>→</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: isMobile ? '3px' : '4px', marginBottom: isMobile ? '3px' : '4px' }}>
        {dayLabels.map((d, i) => (
          <div key={i} style={{ textAlign: 'center' as const, fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.08em', padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: isMobile ? '3px' : '4px' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: isMobile ? '3px' : '4px' }}>
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
                <div key={di} style={{ background: bg, border: `0.5px solid ${isToday ? accent : borderColor}`, borderRadius: isMobile ? '6px' : '8px', padding: isMobile ? '5px 3px' : '6px 8px', minHeight: isMobile ? '38px' : '48px', position: 'relative' as const, boxShadow: isToday ? `0 0 0 1px ${accent}` : 'none' }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: isMobile ? '9px' : '10px', color: isToday ? accent : textMuted, fontWeight: isToday ? '700' : '400', marginBottom: '2px', textAlign: isMobile ? 'center' as const : 'left' as const }}>{day}</div>
                  {hasTrades && !isMobile && <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', fontWeight: '700', color: pnlColor, lineHeight: 1 }}>{pnl > 0 ? '+' : ''}{pnl.toFixed(0)}€</div>}
                  {hasTrades && isMobile && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: pnlColor, margin: '0 auto' }} />}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', paddingTop: '12px', borderTop: `0.5px solid ${tableBorder}`, flexWrap: 'wrap' as const }}>
        {[{ color: '#22c55e', label: 'Profitable day' }, { color: '#dc3232', label: 'Loss day' }, { color: '#94a3b8', label: 'Breakeven' }].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color, opacity: 0.7 }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── MONTHLY RECAP CARD ──
function MonthlyRecapCard({ cardRef, monthLabel, pnl, winRate, tradeCount, wallPosts, firstName, pairs, planAdherence }: {
  cardRef: React.RefObject<HTMLDivElement | null>
  monthLabel: string
  pnl: number
  winRate: number
  tradeCount: number
  wallPosts: number
  firstName?: string
  pairs: string[]
  planAdherence: number
}) {
  const quotes = [
    "The market rewards discipline, not intelligence.",
    "Consistency is the edge.",
    "Every trade is a lesson. Every month is a chapter.",
    "Process over outcome. Always.",
    "Small gains compound. Stay the course.",
    "The blueprint works. Trust the process.",
  ]
  const quote = quotes[new Date().getMonth() % quotes.length]
  const isPositive = pnl >= 0

  return (
    <div ref={cardRef} style={{ width: '390px', height: '760px', background: 'linear-gradient(145deg, #0d1e36 0%, #0a1628 50%, #061020 100%)', borderRadius: '24px', padding: '36px 36px', display: 'flex', flexDirection: 'column' as const, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      {/* Grid pattern */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />
      {/* Glow */}
      <div style={{ position: 'absolute', top: '140px', left: '50%', transform: 'translateX(-50%)', width: '320px', height: '320px', background: isPositive ? 'radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(220,50,50,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', border: '1.5px solid #7aaee8', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '6px', height: '6px', background: '#7aaee8', borderRadius: '1.5px' }} />
          </div>
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', fontWeight: '700', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.85)' }}>FLOW <span style={{ color: '#7aaee8' }}>CAPITALS</span></span>
        </div>
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>{monthLabel}</span>
      </div>

      {/* Recap label */}
      <div style={{ position: 'relative', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#7aaee8', letterSpacing: '0.2em', textTransform: 'uppercase' as const }}>
          {firstName ? `${firstName}'s` : 'My'} Monthly Recap
        </span>
      </div>

      {/* P&L Hero */}
      <div style={{ position: 'relative', marginBottom: '4px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '64px', fontWeight: '700', color: isPositive ? '#22c55e' : '#dc3232', lineHeight: 1, letterSpacing: '-2px', textShadow: isPositive ? '0 0 48px rgba(34,197,94,0.45)' : '0 0 48px rgba(220,50,50,0.45)' }}>
          {isPositive ? '+' : ''}{pnl.toFixed(0)}€
        </div>
      </div>
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '28px', position: 'relative' }}>Net profit this month</div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '24px', position: 'relative' }}>
        {[
          { label: 'Win Rate', value: `${winRate}%`, color: winRate >= 60 ? '#22c55e' : winRate >= 40 ? '#7aaee8' : '#dc3232' },
          { label: 'Trades', value: String(tradeCount), color: '#e0ecf8' },
          { label: 'Wall Posts', value: String(wallPosts), color: '#22c55e' },
          { label: 'Plan', value: `${planAdherence}%`, color: planAdherence >= 70 ? '#22c55e' : planAdherence >= 40 ? '#7aaee8' : '#dc3232' },
        ].map((stat, i) => (
          <div key={i} style={{ flex: 1, borderLeft: i > 0 ? '0.5px solid rgba(255,255,255,0.08)' : 'none', paddingLeft: i > 0 ? '14px' : '0' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '700', color: stat.color, lineHeight: 1, marginBottom: '5px' }}>{stat.value}</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', marginBottom: '20px', position: 'relative' }} />

      {/* Pairs traded */}
      {pairs.length > 0 && (
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Pairs Traded</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {pairs.map(pair => (
              <div key={pair} style={{ background: 'rgba(122,174,232,0.1)', border: '0.5px solid rgba(122,174,232,0.25)', borderRadius: '6px', padding: '4px 10px', fontFamily: 'Arial, sans-serif', fontSize: '10px', fontWeight: '700', color: '#7aaee8', letterSpacing: '0.05em' }}>
                {pair}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan adherence bar */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>Plan Adherence</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '12px', fontWeight: '700', color: planAdherence >= 70 ? '#22c55e' : planAdherence >= 40 ? '#7aaee8' : '#dc3232' }}>{planAdherence}%</div>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${planAdherence}%`, background: planAdherence >= 70 ? 'linear-gradient(90deg, #16a34a, #22c55e)' : planAdherence >= 40 ? 'linear-gradient(90deg, #2b5ea7, #7aaee8)' : 'linear-gradient(90deg, #991b1b, #dc3232)', borderRadius: '2px' }} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', marginBottom: '20px', position: 'relative' }} />

      {/* Quote + footer */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' as const, justifyContent: 'flex-end' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.75', marginBottom: '24px' }}>
          "{quote}"
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em' }}>FLOWCAPITALS.BE</div>
          <div style={{ background: isPositive ? 'rgba(34,197,94,0.12)' : 'rgba(220,50,50,0.12)', border: `0.5px solid ${isPositive ? 'rgba(34,197,94,0.3)' : 'rgba(220,50,50,0.3)'}`, borderRadius: '20px', padding: '5px 14px', fontFamily: 'Arial, sans-serif', fontSize: '10px', fontWeight: '700', color: isPositive ? '#22c55e' : '#dc3232', letterSpacing: '0.04em' }}>
            {isPositive ? '▲ Profitable Month' : '▼ Keep Going'}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── RECAP MODAL ──
function RecapModal({ onClose, trades, dark, firstName, userId }: {
  onClose: () => void
  trades: Trade[]
  dark: boolean
  firstName?: string
  userId: string | null
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [wallPosts, setWallPosts] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const [year, month] = selectedMonth.split('-').map(Number)

  const monthTrades = trades.filter(t => {
    const d = new Date(t.created_at)
    return d.getFullYear() === year && d.getMonth() === month - 1
  })
  const pnl = monthTrades.reduce((s, t) => s + (t.pnl || 0), 0)
  const wins = monthTrades.filter(t => t.pnl > 0).length
  const winRate = monthTrades.length > 0 ? Math.round((wins / monthTrades.length) * 100) : 0
  const monthLabel = new Date(year, month - 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }).toUpperCase()

  // Unique pairs traded this month
  const pairs = Array.from(new Set(monthTrades.map(t => t.pair))).filter(Boolean).slice(0, 8)

  // Plan adherence — uses followed_plan boolean field; adjust if your field name differs
  const tradesWithPlan = monthTrades.filter(t => t.followed_plan !== null)
const planAdherence = tradesWithPlan.length > 0
  ? Math.round((tradesWithPlan.filter(t => t.followed_plan === true).length / tradesWithPlan.length) * 100)
  : 0

  const monthOptions = Array.from(new Set(trades.map(t => {
    const d = new Date(t.created_at)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }))).sort().reverse()
  const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  if (!monthOptions.includes(currentMonthKey)) monthOptions.unshift(currentMonthKey)

  useEffect(() => {
    if (!userId) return
    const start = new Date(year, month - 1, 1).toISOString()
    const end = new Date(year, month, 1).toISOString()
    supabase.from('wall_posts').select('*', { count: 'exact', head: true })
      .eq('user_id', userId).gte('created_at', start).lt('created_at', end)
      .then(({ count }) => setWallPosts(count || 0))
  }, [selectedMonth, userId])

  async function download() {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, { scale: 2.5, backgroundColor: null, logging: false, useCORS: true })
      const link = document.createElement('a')
      link.download = `flow-recap-${selectedMonth}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    }
    setDownloading(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', overflowY: 'auto' as const }} onClick={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '20px' }} onClick={e => e.stopPropagation()}>

        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ background: '#0f1825', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 20px', color: '#e0ecf8', fontFamily: 'var(--font-inter)', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
          {monthOptions.map(m => {
            const [y, mo] = m.split('-').map(Number)
            return <option key={m} value={m}>{new Date(y, mo - 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</option>
          })}
        </select>

        <MonthlyRecapCard
          cardRef={cardRef}
          monthLabel={monthLabel}
          pnl={pnl}
          winRate={winRate}
          tradeCount={monthTrades.length}
          wallPosts={wallPosts}
          firstName={firstName}
          pairs={pairs}
          planAdherence={planAdherence}
        />

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={download} disabled={downloading} style={{ background: '#22c55e', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '13px 32px', border: 'none', borderRadius: '10px', cursor: downloading ? 'not-allowed' : 'pointer', opacity: downloading ? 0.7 : 1 }}>
            {downloading ? 'Generating...' : '↓ Download Card'}
          </button>
          <button onClick={onClose} style={{ background: 'none', border: '0.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter)', fontSize: '12px', padding: '13px 24px', borderRadius: '10px', cursor: 'pointer' }}>
            Close
          </button>
        </div>

        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'rgba(255,255,255,0.25)', textAlign: 'center' as const }}>Share on Instagram · TikTok · WhatsApp stories</p>
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
  const dark = useDarkMode()
  const [trades, setTrades] = useState<Trade[]>([])
  const [chartMode, setChartMode] = useState('daily')
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showRecap, setShowRecap] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [firstName, setFirstName] = useState<string | undefined>(undefined)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      setUserId(session.user.id)
      const { data } = await supabase.from('trades').select('*').eq('user_id', session.user.id).order('created_at', { ascending: true })
      if (data) setTrades(data)
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single()
      if (profile?.full_name) setFirstName(profile.full_name.split(' ')[0])
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

  const t = getTheme(dark)
  const { bg, cardBg, cardBorder, cardShadow, textPrimary, textMuted, accent, tableBorder } = t
  const card = getCard(dark)
  const pnlCardBg = totalPnl > 0 ? dark ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.06)' : totalPnl < 0 ? dark ? 'rgba(220,50,50,0.08)' : 'rgba(220,50,50,0.06)' : cardBg
  const pnlCardBorder = totalPnl > 0 ? 'rgba(34,197,94,0.25)' : totalPnl < 0 ? 'rgba(220,50,50,0.25)' : cardBorder

  const RecapButton = () => (
    <button onClick={() => setShowRecap(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #0d1e36, #1a3a6b)', color: '#7aaee8', fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '10px 18px', border: '0.5px solid rgba(122,174,232,0.3)', borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
      <span>✦</span> Monthly Recap
    </button>
  )

  // ── MOBILE ──
  if (isMobile) {
    return (
      <div style={{ padding: '20px 16px', background: bg, minHeight: '100vh' }}>
        {showRecap && <RecapModal onClose={() => setShowRecap(false)} trades={trades} dark={dark} firstName={firstName} userId={userId} />}

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '1px', background: accent }} />Trading Journal
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: textPrimary, letterSpacing: '-1px', lineHeight: 1 }}>Overview.</h1>
            <RecapButton />
          </div>
          <SegmentedControl
            options={TABS.map(tab => ({ label: tab.label, value: tab.value }))}
            value="overview"
            onChange={v => { const tab = TABS.find(tb => tb.value === v); if (tab) window.location.href = tab.href }}
            dark={dark}
          />
        </div>

        <div style={{ background: pnlCardBg, border: `0.5px solid ${pnlCardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '4px' }}>Total Net P&L</div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: totalPnl >= 0 ? '#22c55e' : '#dc3232', lineHeight: 1 }}>{totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(0)}€</div>
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.04)', padding: '6px 12px', borderRadius: '20px' }}>{total} trades</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div style={{ ...card, padding: '14px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '10px' }}>Win Rate</div>
            <WinRateGauge winRate={winRate} beRate={beRate} dark={dark} size={60} />
          </div>
          <div style={{ ...card, padding: '14px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '10px' }}>Trades</div>
            <ThreeArcGauge wins={wins.length} losses={losses.length} be={be.length} total={total} dark={dark} size={60} />
          </div>
        </div>

        <div style={{ ...card, padding: '14px', marginBottom: '10px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '10px' }}>Avg Win / Loss Ratio</div>
          <AvgWinLossGauge avgWin={avgWin} avgLoss={avgLoss} dark={dark} accent={accent} size={60} />
        </div>

        <div style={{ ...card, padding: '16px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '3px' }}>Cumulative P&L</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: '700', color: totalPnl >= 0 ? '#22c55e' : '#dc3232' }}>{totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(0)}€</div>
            </div>
            <SegmentedControl options={[{ label: 'Day', value: 'daily' }, { label: 'Wk', value: 'weekly' }, { label: 'Mo', value: 'monthly' }]} value={chartMode} onChange={setChartMode} dark={dark} />
          </div>
          <div style={{ height: '160px' }}><PnlChart data={chartData} trades={trades} dark={dark} /></div>
        </div>

        <div style={{ ...card, overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ padding: '14px 14px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted }}>Recent Trades</div>
            <a href="/dashboard/journal/trades" style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, textDecoration: 'none' }}>All →</a>
          </div>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center' as const, fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>Loading...</div>
          ) : recentTrades.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center' as const, fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted, fontSize: '13px' }}>No trades yet</div>
          ) : recentTrades.map(trade => (
            <div key={trade.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderTop: `0.5px solid ${tableBorder}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PairIcon pair={trade.pair} />
                <div>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '13px', fontWeight: '600', color: textPrimary }}>{trade.pair}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted }}>{trade.direction}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' as const }}>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '13px', fontWeight: '700', color: trade.pnl > 0 ? '#22c55e' : trade.pnl < 0 ? '#dc3232' : textMuted }}>{trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(0)}€</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted }}>{new Date(trade.created_at).toLocaleDateString('en-GB')}</div>
              </div>
            </div>
          ))}
        </div>

        <MonthCalendar trades={trades} dark={dark} cardBg={cardBg} cardBorder={cardBorder} cardShadow={cardShadow} textPrimary={textPrimary} textMuted={textMuted} accent={accent} tableBorder={tableBorder} isMobile={true} />
      </div>
    )
  }

  // ── DESKTOP ──
  return (
    <div style={{ padding: '40px 48px', background: bg, minHeight: '100vh' }}>
      {showRecap && <RecapModal onClose={() => setShowRecap(false)} trades={trades} dark={dark} firstName={firstName} userId={userId} />}

      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: accent }} />Trading Journal
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1 }}>Overview.</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <RecapButton />
            <SegmentedControl options={TABS.map(t => ({ label: t.label, value: t.value }))} value="overview" onChange={v => { const tab = TABS.find(t => t.value === v); if (tab) window.location.href = tab.href }} dark={dark} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: pnlCardBg, border: `0.5px solid ${pnlCardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '8px' }}>Total Net P&L</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: totalPnl >= 0 ? '#22c55e' : '#dc3232', lineHeight: 1, marginBottom: '4px' }}>{totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(0)}€</div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{total} trades</div>
        </div>
        <div style={{ ...card, padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '12px' }}>Total Trades</div>
          <ThreeArcGauge wins={wins.length} losses={losses.length} be={be.length} total={total} dark={dark} />
        </div>
        <div style={{ ...card, padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '12px' }}>Win Rate</div>
          <WinRateGauge winRate={winRate} beRate={beRate} dark={dark} />
        </div>
        <div style={{ ...card, padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '12px' }}>Avg Win / Loss</div>
          <AvgWinLossGauge avgWin={avgWin} avgLoss={avgLoss} dark={dark} accent={accent} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div style={{ ...card, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '4px' }}>Cumulative P&L</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '24px', fontWeight: '700', color: totalPnl >= 0 ? '#22c55e' : '#dc3232' }}>{totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(0)}€</div>
            </div>
            <SegmentedControl options={[{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }]} value={chartMode} onChange={setChartMode} dark={dark} />
          </div>
          <div style={{ height: '200px' }}><PnlChart data={chartData} trades={trades} dark={dark} /></div>
        </div>

        <div style={{ ...card, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ padding: '20px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted }}>Recent Trades</div>
            <a href="/dashboard/journal/trades" style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, textDecoration: 'none' }}>View all →</a>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' as const }}>
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center' as const, fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>Loading...</div>
            ) : recentTrades.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center' as const, fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted, fontSize: '14px' }}>No trades yet</div>
            ) : recentTrades.map(trade => (
              <div key={trade.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderTop: `0.5px solid ${tableBorder}`, transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.03)' : 'rgba(43,94,167,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PairIcon pair={trade.pair} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '13px', fontWeight: '600', color: textPrimary }}>{trade.pair}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted }}>{trade.direction} · {trade.emotion}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', fontWeight: '700', color: trade.pnl > 0 ? '#22c55e' : trade.pnl < 0 ? '#dc3232' : '#94a3b8', background: trade.pnl > 0 ? 'rgba(34,197,94,0.1)' : trade.pnl < 0 ? 'rgba(220,50,50,0.1)' : 'rgba(148,163,184,0.1)', padding: '2px 7px', borderRadius: '4px' }}>
                    {trade.pnl > 0 ? 'WIN' : trade.pnl < 0 ? 'LOSS' : 'BE'}
                  </span>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '13px', fontWeight: '700', color: trade.pnl > 0 ? '#22c55e' : trade.pnl < 0 ? '#dc3232' : textMuted }}>{trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(0)}€</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted }}>{new Date(trade.created_at).toLocaleDateString('en-GB')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MonthCalendar trades={trades} dark={dark} cardBg={cardBg} cardBorder={cardBorder} cardShadow={cardShadow} textPrimary={textPrimary} textMuted={textMuted} accent={accent} tableBorder={tableBorder} isMobile={false} />
    </div>
  )
}