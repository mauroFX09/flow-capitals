'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useDarkMode, useIncognito } from '@/lib/hooks'
import type { Trade } from '@/lib/types'

const ACCENT = '#2B5EA7'

function PairIcon({ pair, size = 28 }: { pair: string; size?: number }) {
  const colors: Record<string, string> = {
    USD: '#2B5EA7', EUR: '#003399', GBP: '#00247D', JPY: '#BC002D',
    CHF: '#FF0000', CAD: '#FF0000', AUD: '#00008B', NZD: '#00247D',
    XAU: '#FFD700', XAG: '#C0C0C0', BTC: '#F7931A', ETH: '#627EEA',
  }
  const clean = pair?.replace('/', '').toUpperCase() || ''
  const base = clean.slice(0, 3)
  const quote = clean.slice(3, 6)
  const c1 = colors[base] || '#6b7280'
  const c2 = colors[quote] || '#9ca3af'
  return (
    <svg width={size} height={size} viewBox="0 0 28 28">
      <circle cx="10" cy="14" r="9" fill={c1} />
      <circle cx="18" cy="14" r="9" fill={c2} opacity="0.85" />
    </svg>
  )
}

function SessionIcon({ session, size = 36 }: { session: string; size?: number }) {
  const wrap: React.CSSProperties = {
    width: size, height: size, borderRadius: '50%', overflow: 'hidden',
    display: 'inline-flex', flexShrink: 0,
    boxShadow: '0 1px 4px rgba(0,0,0,0.22)',
  }
  if (session === 'london') return (
    <span style={wrap}>
      <svg viewBox="0 0 36 36" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" fill="#00247D"/>
        <line x1="0" y1="0" x2="36" y2="36" stroke="#fff" strokeWidth="6"/>
        <line x1="36" y1="0" x2="0" y2="36" stroke="#fff" strokeWidth="6"/>
        <line x1="0" y1="0" x2="36" y2="36" stroke="#C8102E" strokeWidth="3.6"/>
        <line x1="36" y1="0" x2="0" y2="36" stroke="#C8102E" strokeWidth="3.6"/>
        <rect x="0" y="14" width="36" height="8" fill="#fff"/>
        <rect x="14" y="0" width="8" height="36" fill="#fff"/>
        <rect x="0" y="15.2" width="36" height="5.6" fill="#C8102E"/>
        <rect x="15.2" y="0" width="5.6" height="36" fill="#C8102E"/>
      </svg>
    </span>
  )
  if (session === 'ny') return (
    <span style={wrap}>
      <svg viewBox="0 0 36 36" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" fill="#B22234"/>
        <rect x="0" y="2.57" width="36" height="2.57" fill="#fff"/>
        <rect x="0" y="7.71" width="36" height="2.57" fill="#fff"/>
        <rect x="0" y="12.85" width="36" height="2.57" fill="#fff"/>
        <rect x="0" y="17.99" width="36" height="2.57" fill="#fff"/>
        <rect x="0" y="23.13" width="36" height="2.57" fill="#fff"/>
        <rect x="0" y="28.27" width="36" height="2.57" fill="#fff"/>
        <rect x="0" y="0" width="15" height="19" fill="#3C3B6E"/>
        {([[3,3],[7,3],[11,3],[5,6],[9,6],[3,9],[7,9],[11,9],[5,12],[9,12],[3,15],[7,15],[11,15],[5,18],[9,18]] as [number,number][]).map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="1.1" fill="#fff"/>
        ))}
      </svg>
    </span>
  )
  if (session === 'asia') return (
    <span style={wrap}>
      <svg viewBox="0 0 36 36" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" fill="#0e4f9e"/>
        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/>
        <ellipse cx="18" cy="18" rx="6" ry="14" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/>
        <ellipse cx="18" cy="18" rx="14" ry="5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/>
        <line x1="4" y1="18" x2="32" y2="18" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
        <line x1="18" y1="4" x2="18" y2="32" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
      </svg>
    </span>
  )
  return (
    <span style={{ ...wrap, background: 'linear-gradient(135deg, #2B5EA7 0%, #7c3aed 100%)' }}>
      <svg viewBox="0 0 36 36" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <circle cx="13" cy="18" r="9" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
        <circle cx="23" cy="18" r="9" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
      </svg>
    </span>
  )
}

function AvgWinLossGauge({ avgWin, avgLoss, dark }: { avgWin: number; avgLoss: number; dark: boolean }) {
  const incognito = useIncognito()
  const mask: React.CSSProperties = incognito
    ? { filter: 'blur(8px)', userSelect: 'none', transition: 'filter 0.2s', display: 'inline-block' }
    : { transition: 'filter 0.2s', display: 'inline-block' }
  const total = avgWin + avgLoss
  const winPct = total > 0 ? avgWin / total : 0.5
  const W = 160, H = 20
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '20px' }}>
        <rect x="0" y="4" width={W} height="12" rx="6" fill={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
        <rect x="0" y="4" width={winPct * W} height="12" rx="6" fill="#22c55e" />
        <rect x={winPct * W} y="4" width={(1 - winPct) * W} height="12" rx="6" fill="#dc3232" />
        <circle cx={winPct * W} cy="10" r="7" fill="white" stroke={dark ? '#1a1a1a' : '#f5f5f0'} strokeWidth="2" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-inter)' }}>
        <span style={{ color: '#22c55e' }}>Avg Win: <span style={mask}>€{avgWin.toFixed(0)}</span></span>
        <span style={{ color: '#dc3232' }}>Avg Loss: <span style={mask}>€{avgLoss.toFixed(0)}</span></span>
      </div>
    </div>
  )
}

function smoothLinePath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x},${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const x0 = i > 0 ? pts[i - 1].x : pts[0].x
    const y0 = i > 0 ? pts[i - 1].y : pts[0].y
    const x1 = pts[i].x, y1 = pts[i].y
    const x2 = pts[i + 1].x, y2 = pts[i + 1].y
    const x3 = i < pts.length - 2 ? pts[i + 2].x : x2
    const y3 = i < pts.length - 2 ? pts[i + 2].y : y2
    const cp1x = x1 + (x2 - x0) / 6
    const cp1y = y1 + (y2 - y0) / 6
    const cp2x = x2 - (x3 - x1) / 6
    const cp2y = y2 - (y3 - y1) / 6
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`
  }
  return d
}

function PnlChart({ trades, period, dark, card, textPrimary, textMuted, tableBorder }: {
  trades: Trade[]; period: string; dark: boolean
  card: string; textPrimary: string; textMuted: string; tableBorder: string
}) {
  const [hover, setHover] = useState<{ x: number; y: number; label: string; val: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  function getChartData() {
    if (!trades.length) return []
    const sorted = [...trades].sort((a, b) => (a.trade_date > b.trade_date ? 1 : -1))
    if (period === 'Daily') {
      const map = new Map<string, number>()
      sorted.forEach(t => {
        const [_y, _m, _d] = t.trade_date.split('-').map(Number)
        const d = new Date(_y, _m - 1, _d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
        map.set(d, (map.get(d) || 0) + (t.pnl || 0))
      })
      let cum = 0
      return Array.from(map.entries()).map(([label, val]) => { cum += val; return { label, val: parseFloat(cum.toFixed(2)) } })
    }
    if (period === 'Weekly') {
      const map = new Map<string, number>()
      sorted.forEach(t => {
        const [_y, _m, _d] = t.trade_date.split('-').map(Number)
        const d = new Date(_y, _m - 1, _d)
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1)
        const mon = new Date(d); mon.setDate(diff)
        const key = `W${mon.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`
        map.set(key, (map.get(key) || 0) + (t.pnl || 0))
      })
      let cum = 0
      return Array.from(map.entries()).map(([label, val]) => { cum += val; return { label, val: parseFloat(cum.toFixed(2)) } })
    }
    const map = new Map<string, number>()
    sorted.forEach(t => {
      const [_y, _m, _d] = t.trade_date.split('-').map(Number)
      const d = new Date(_y, _m - 1, _d).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
      map.set(d, (map.get(d) || 0) + (t.pnl || 0))
    })
    let cum = 0
    return Array.from(map.entries()).map(([label, val]) => { cum += val; return { label, val: parseFloat(cum.toFixed(2)) } })
  }

  const data = getChartData()
  if (!data.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', color: textMuted, fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
        No trade data yet
      </div>
    )
  }

  const W = 600, H = 180, padL = 52, padR = 16, padT = 16, padB = 32
  const vals = data.map(d => d.val)
  const minV = Math.min(0, ...vals), maxV = Math.max(0, ...vals)
  const range = maxV - minV || 1
  const toX = (i: number) => padL + (i / Math.max(data.length - 1, 1)) * (W - padL - padR)
  const toY = (v: number) => padT + ((maxV - v) / range) * (H - padT - padB)
  const zeroY = toY(0)
  const points = data.map((d, i) => ({ x: toX(i), y: toY(d.val) }))
  const linePath = smoothLinePath(points)
  const areaPath = linePath + ` L ${toX(data.length - 1)},${zeroY} L ${toX(0)},${zeroY} Z`
  const last = vals[vals.length - 1]
  const color = last >= 0 ? '#22c55e' : '#dc3232'
  const gradId = `pnlGrad${last >= 0 ? 'g' : 'r'}`
  const ticks = 4
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => minV + (i / ticks) * (maxV - minV))

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    const mx = ((e.clientX - rect.left) / rect.width) * W
    let closest = 0, minDist = Infinity
    data.forEach((_, i) => {
      const dist = Math.abs(toX(i) - mx)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setHover({ x: toX(closest), y: toY(data[closest].val), label: data[closest].label, val: data[closest].val })
  }

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '180px', overflow: 'visible', cursor: 'crosshair' }} onMouseMove={handleMouseMove} onMouseLeave={() => setHover(null)}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
        <clipPath id="chartClip">
          <rect x={padL} y={padT} width={W - padL - padR} height={H - padT - padB} />
        </clipPath>
      </defs>
      {tickVals.map((v, i) => {
        const y = toY(v)
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="9" fontFamily="var(--font-inter)" fill={textMuted}>
              {Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)}
            </text>
          </g>
        )
      })}
      {minV < 0 && maxV > 0 && (
        <line x1={padL} x2={W - padR} y1={zeroY} y2={zeroY} stroke={dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)'} strokeDasharray="3 3" />
      )}
      <g clipPath="url(#chartClip)">
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {hover && (
        <g>
          <line x1={hover.x} x2={hover.x} y1={padT} y2={H - padB} stroke={dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'} strokeDasharray="4 3" />
          <circle cx={hover.x} cy={hover.y} r="4" fill={color} />
          <rect x={Math.min(hover.x - 44, W - 96)} y={hover.y - 36} width="88" height="28" rx="5" fill={dark ? '#2a2a2a' : '#fff'} stroke={dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
          <text x={Math.min(hover.x, W - 52)} y={hover.y - 24} textAnchor="middle" fontSize="9" fontFamily="var(--font-inter)" fill={textMuted}>{hover.label}</text>
          <text x={Math.min(hover.x, W - 52)} y={hover.y - 13} textAnchor="middle" fontSize="11" fontFamily="var(--font-inter)" fontWeight="600" fill={hover.val >= 0 ? '#22c55e' : '#dc3232'}>
            {hover.val >= 0 ? '+' : ''}€{hover.val.toFixed(2)}
          </text>
        </g>
      )}
      {data.length <= 20 && data.map((d, i) => (
        <text key={i} x={toX(i)} y={H - padB + 14} textAnchor="middle" fontSize="8" fontFamily="var(--font-inter)" fill={textMuted}>{d.label}</text>
      ))}
    </svg>
  )
}

function SegmentedControl({ options, value, onChange, dark }: {
  options: string[]; value: string; onChange: (v: string) => void; dark: boolean
}) {
  return (
    <div style={{ display: 'inline-flex', borderRadius: '8px', padding: '3px', gap: '2px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} style={{
          padding: '4px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
          fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 500,
          background: value === opt ? (dark ? 'rgba(255,255,255,0.12)' : '#fff') : 'transparent',
          color: value === opt ? (dark ? '#fff' : '#1a1a1a') : dark ? 'rgba(255,255,255,0.45)' : 'rgba(26,26,26,0.45)',
          boxShadow: value === opt ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
          transition: 'all 0.15s',
        }}>{opt}</button>
      ))}
    </div>
  )
}

function ProfitFactorDisplay({ value, dark, textMuted }: { value: number; dark: boolean; textMuted: string }) {
  const color = value >= 2 ? '#22c55e' : value >= 1 ? ACCENT : value === 0 ? (dark ? 'rgba(255,255,255,0.25)' : '#bbb') : '#dc3232'
  const label = value === Infinity ? 'Perfect' : value >= 2 ? 'Strong' : value >= 1.5 ? 'Good' : value >= 1 ? 'Breakeven+' : value > 0 ? 'Losing' : '—'
  const disp = value === Infinity ? '∞' : value > 0 ? value.toFixed(2) : '—'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '32px', fontFamily: 'Georgia, serif', fontWeight: 700, color, lineHeight: 1 }}>{disp}</span>
      <span style={{ fontSize: '11px', fontFamily: 'var(--font-inter)', fontWeight: 600, color, background: `${color}18`, borderRadius: '20px', padding: '3px 10px', whiteSpace: 'nowrap' as const }}>{label}</span>
    </div>
  )
}

function WeeklyBarChart({ trades, dark, textMuted, tableBorder }: {
  trades: Trade[]; dark: boolean; textMuted: string; tableBorder: string
}) {
  const [hoverDay, setHoverDay] = useState<number | null>(null)
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dayIndex = (d: Date) => (d.getDay() + 6) % 7
  const byDay = DAYS.map((_, di) => {
    const dt = trades.filter(t => {
      const p = (t.trade_date || '').split('-').map(Number)
      return dayIndex(new Date(p[0], p[1] - 1, p[2])) === di
    })
    const pnl = dt.reduce((s, t) => s + (t.pnl || 0), 0)
    return { pnl, wins: dt.filter(t => t.pnl > 0).length, losses: dt.filter(t => t.pnl < 0).length, be: dt.filter(t => t.pnl === 0).length, count: dt.length }
  })
  const maxAbs = Math.max(1, ...byDay.map(d => Math.abs(d.pnl)))
  const W = 340, H = 140, padL = 8, padR = 8, padT = 18, padB = 32
  const barW = (W - padL - padR) / 7
  const chartH = H - padT - padB
  const midY = padT + chartH / 2
  const scale = chartH / 2 / maxAbs

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '140px', overflow: 'visible' }} onMouseLeave={() => setHoverDay(null)}>
        <defs>
          <linearGradient id="wk-green" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e"/>
            <stop offset="100%" stopColor="#15803d"/>
          </linearGradient>
          <linearGradient id="wk-red" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#dc2626"/>
            <stop offset="100%" stopColor="#ef4444"/>
          </linearGradient>
        </defs>
        <line x1={padL} x2={W - padR} y1={midY} y2={midY} stroke={dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'} />
        <line x1={padL} x2={W - padR} y1={padT} y2={padT} stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeDasharray="3 3" />
        <line x1={padL} x2={W - padR} y1={padT + chartH} y2={padT + chartH} stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeDasharray="3 3" />
        {byDay.map((d, i) => {
          const x = padL + i * barW + barW * 0.15
          const bw = barW * 0.70
          const barH = Math.max(2, Math.abs(d.pnl) * scale)
          const y = d.pnl >= 0 ? midY - barH : midY
          const isHover = hoverDay === i
          const fill = d.pnl > 0 ? 'url(#wk-green)' : d.pnl < 0 ? 'url(#wk-red)' : dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
          const labelY = d.pnl >= 0 ? y - 4 : y + barH + 12
          const pnlLabel = d.count > 0 && d.pnl !== 0
            ? `${d.pnl > 0 ? '+' : ''}€${Math.abs(d.pnl) >= 1000 ? `${(d.pnl / 1000).toFixed(1)}k` : d.pnl.toFixed(0)}`
            : ''
          return (
            <g key={i} style={{ cursor: d.count > 0 ? 'pointer' : 'default' }} onMouseEnter={() => d.count > 0 && setHoverDay(i)}>
              {isHover && <rect x={x - barW * 0.07} y={padT} width={bw + barW * 0.14} height={chartH} rx="4" fill={dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'} />}
              <rect x={x} y={y} width={bw} height={barH} rx="3" fill={fill} opacity={isHover ? 1 : 0.82} />
              {pnlLabel !== '' && (
                <text x={x + bw / 2} y={labelY} textAnchor="middle" fontSize="9" fontFamily="var(--font-inter)" fontWeight="700"
                  fill={d.pnl > 0 ? '#22c55e' : '#dc2626'}>{pnlLabel}</text>
              )}
              <text x={x + bw / 2} y={H - padB + 14} textAnchor="middle" fontSize="9" fontFamily="var(--font-inter)" fill={textMuted}>{DAYS[i]}</text>
              {d.count > 0 && (
                <text x={x + bw / 2} y={H - padB + 24} textAnchor="middle" fontSize="7.5" fontFamily="var(--font-inter)" fill={dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'}>{d.count}t</text>
              )}
            </g>
          )
        })}
      </svg>
      {hoverDay !== null && (
        <div style={{ position: 'absolute', top: 0, left: `${(hoverDay / 7) * 100 + 7}%`, background: dark ? '#0d1e36' : '#fff', border: `1px solid ${tableBorder}`, borderRadius: '10px', padding: '10px 14px', fontSize: '11px', fontFamily: 'var(--font-inter)', zIndex: 10, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', transform: hoverDay > 4 ? 'translateX(-110%)' : 'none' }}>
          <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '3px', color: byDay[hoverDay].pnl >= 0 ? '#22c55e' : '#dc2626' }}>{byDay[hoverDay].pnl >= 0 ? '+' : ''}€{byDay[hoverDay].pnl.toFixed(2)}</div>
          <div style={{ color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)', fontSize: '10px' }}>{byDay[hoverDay].count} trades · W{byDay[hoverDay].wins} L{byDay[hoverDay].losses}</div>
        </div>
      )}
    </div>
  )
}

function SessionCards({ trades, dark, card, textPrimary, textMuted, tableBorder }: {
  trades: Trade[]; dark: boolean; card: string; textPrimary: string; textMuted: string; tableBorder: string
}) {
  const incognito = useIncognito()
  const mask: React.CSSProperties = incognito
    ? { filter: 'blur(8px)', userSelect: 'none', transition: 'filter 0.2s', display: 'inline-block' }
    : { transition: 'filter 0.2s', display: 'inline-block' }
  const sessions = [
    { key: 'london', label: 'London', hours: '2AM – 5AM' },
    { key: 'ny', label: 'New York', hours: '7AM – 11AM' },
    { key: 'asia', label: 'Asia', hours: '8PM – 00:00' },
    { key: 'overlap', label: 'Overlap', hours: null },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
      {sessions.map(sess => {
        const st = trades.filter(t => (t as any).session === sess.key)
        const pnl = st.reduce((s, t) => s + (t.pnl || 0), 0)
        const wins = st.filter(t => t.pnl > 0).length
        const winRate = st.length > 0 ? Math.round((wins / st.length) * 100) : 0
        const pnlColor = pnl > 0 ? '#22c55e' : pnl < 0 ? '#dc3232' : textMuted
        const statusLabel = pnl > 0 ? 'Profitable' : pnl < 0 ? 'Loss' : 'Breakeven'
        const statusBg = pnl > 0 ? 'rgba(34,197,94,0.1)' : pnl < 0 ? 'rgba(220,50,50,0.1)' : dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
        return (
          <div key={sess.key} style={{ background: card, borderRadius: '14px', padding: '18px 16px', border: `1px solid ${tableBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SessionIcon session={sess.key} size={30} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)' }}>{sess.label}</div>
                  {sess.hours && <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)' }}>{sess.hours}</div>}
                </div>
              </div>
              {st.length > 0 && <span style={{ fontSize: '9px', fontFamily: 'var(--font-inter)', fontWeight: 600, padding: '3px 8px', borderRadius: '20px', background: statusBg, color: pnlColor }}>{statusLabel}</span>}
            </div>
            <div style={{ fontSize: '24px', fontFamily: 'var(--font-inter)', fontWeight: 700, color: pnlColor, marginBottom: '8px', letterSpacing: '-0.02em' }}>
              {st.length > 0 ? <span style={mask}>{pnl >= 0 ? '+' : ''}€{pnl.toFixed(0)}</span> : '—'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-inter)', color: textMuted }}>
              <span>{st.length} trade{st.length !== 1 ? 's' : ''}</span>
              {st.length > 0 && <span style={{ color: winRate >= 50 ? '#22c55e' : '#dc3232' }}>{winRate}% WR</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

type Recap = {
  id: string; month: string; best_trade: string; worst_trade: string
  biggest_lesson: string; what_worked: string; what_to_improve: string; created_at: string
}

function MonthlyRecapCard({ recap, dark, card, textPrimary, textMuted, tableBorder, onEdit }: {
  recap: Recap; dark: boolean; card: string; textPrimary: string; textMuted: string; tableBorder: string; onEdit: () => void
}) {
  return (
    <div style={{ background: card, borderRadius: '16px', padding: '20px 24px', border: `1px solid ${tableBorder}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontFamily: 'Georgia, serif', color: textPrimary }}>{recap.month} Recap</h3>
        <button onClick={onEdit} style={{ background: 'transparent', border: `1px solid ${tableBorder}`, borderRadius: '8px', padding: '4px 12px', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-inter)', color: textMuted }}>Edit</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[{ label: 'Best Trade', val: recap.best_trade }, { label: 'Worst Trade', val: recap.worst_trade }, { label: 'Biggest Lesson', val: recap.biggest_lesson }, { label: 'What Worked', val: recap.what_worked }, { label: 'To Improve', val: recap.what_to_improve }].map(f => (
          <div key={f.label}>
            <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</div>
            <div style={{ fontSize: '12px', color: textPrimary, fontFamily: 'var(--font-inter)', lineHeight: 1.4 }}>{f.val || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecapModal({ recap, dark, textPrimary, textMuted, tableBorder, onClose, onSave }: {
  recap: Partial<Recap> | null; dark: boolean; textPrimary: string; textMuted: string; tableBorder: string
  onClose: () => void; onSave: (r: Partial<Recap>) => void
}) {
  const now = new Date()
  const defaultMonth = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const [form, setForm] = useState<Partial<Recap>>(recap || { month: defaultMonth })
  const fields: Array<{ key: keyof Recap; label: string; placeholder: string }> = [
    { key: 'month', label: 'Month', placeholder: 'e.g. June 2025' },
    { key: 'best_trade', label: 'Best Trade', placeholder: 'What was your best setup?' },
    { key: 'worst_trade', label: 'Worst Trade', placeholder: 'What went wrong?' },
    { key: 'biggest_lesson', label: 'Biggest Lesson', placeholder: 'Key takeaway this month' },
    { key: 'what_worked', label: 'What Worked', placeholder: 'Strategies or habits that paid off' },
    { key: 'what_to_improve', label: 'To Improve', placeholder: 'Focus for next month' },
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: dark ? '#0d1e36' : '#fafaf7', borderRadius: '18px', padding: '28px 32px', width: '480px', maxWidth: '94vw', border: `1px solid ${tableBorder}`, boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 20px', fontFamily: 'Georgia, serif', fontSize: '20px', color: textPrimary }}>Monthly Recap</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '11px', color: textMuted, fontFamily: 'var(--font-inter)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</label>
              <textarea rows={f.key === 'month' ? 1 : 2} placeholder={f.placeholder} value={(form[f.key] as string) || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', resize: 'vertical', borderRadius: '8px', border: `1px solid ${tableBorder}`, padding: '8px 10px', background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', color: textPrimary, fontFamily: 'var(--font-inter)', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '22px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: '8px', border: `1px solid ${tableBorder}`, background: 'transparent', color: textMuted, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: '13px' }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ padding: '8px 22px', borderRadius: '8px', border: 'none', background: ACCENT, color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 600 }}>Save Recap</button>
        </div>
      </div>
    </div>
  )
}

export default function JournalDashboard() {
  const dark = useDarkMode()
  const incognito = useIncognito()
  const mask: React.CSSProperties = incognito
    ? { filter: 'blur(8px)', userSelect: 'none', transition: 'filter 0.2s', display: 'inline-block' }
    : { transition: 'filter 0.2s', display: 'inline-block' }

  const router = useRouter()
  const pageBg = dark ? '#071428' : '#f4f4f6'
  const card = dark ? '#0d1e36' : '#ffffff'
  const textPrimary = dark ? '#f5f5f0' : '#1a1a1a'
  const textMuted = dark ? 'rgba(245,245,240,0.45)' : 'rgba(26,26,26,0.45)'
  const tableBorder = dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.08)'

  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('Daily')
  const [recaps, setRecaps] = useState<Recap[]>([])
  const [showRecapModal, setShowRecapModal] = useState(false)
  const [editingRecap, setEditingRecap] = useState<Partial<Recap> | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const [{ data: tradeData }, { data: recapData }] = await Promise.all([
        supabase.from('trades').select('*').eq('user_id', user.id).order('trade_date', { ascending: false }),
        supabase.from('monthly_recaps').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])
      setTrades((tradeData as Trade[]) || [])
      setRecaps((recapData as Recap[]) || [])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSaveRecap(form: Partial<Recap>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (form.id) {
      await supabase.from('monthly_recaps').update(form).eq('id', form.id)
    } else {
      await supabase.from('monthly_recaps').insert({ ...form, user_id: user.id })
    }
    const { data } = await supabase.from('monthly_recaps').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setRecaps((data as Recap[]) || [])
    setShowRecapModal(false)
    setEditingRecap(null)
  }

  const sorted = [...trades].sort((a, b) => (a.trade_date > b.trade_date ? 1 : -1))
  const totalPnl = trades.reduce((s, t) => s + (t.pnl || 0), 0)
  const wins = trades.filter(t => t.pnl > 0)
  const losses = trades.filter(t => t.pnl < 0)
  const be = trades.filter(t => t.pnl === 0)
  const winRate = trades.length > 0 ? Math.round((wins.length / trades.length) * 100) : 0
  const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((s, t) => s + t.pnl, 0) / losses.length) : 0
  const grossProfit = wins.reduce((s, t) => s + t.pnl, 0)
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0))
  const profitFactor = grossLoss > 0 ? parseFloat((grossProfit / grossLoss).toFixed(2)) : grossProfit > 0 ? Infinity : 0
  const pnlColor = totalPnl >= 0 ? '#22c55e' : '#dc3232'
  const recentTrades = [...trades].sort((a, b) => (b.trade_date > a.trade_date ? 1 : -1)).slice(0, 8)

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: textMuted, fontFamily: 'var(--font-inter)', fontSize: '14px' }}>Loading…</div>
      </div>
    )
  }

  const statCards = (
    <>
      <div style={{ background: card, borderRadius: '16px', padding: '22px 24px', border: `1px solid ${tableBorder}` }}>
        <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Net P&L</div>
        <div style={{ fontSize: '32px', fontFamily: 'var(--font-inter)', fontWeight: 700, color: pnlColor, lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '10px' }}>
          <span style={mask}>{totalPnl >= 0 ? '+' : ''}€{totalPnl.toFixed(2)}</span>
        </div>
        <div style={{ fontSize: '11px', color: textMuted, fontFamily: 'var(--font-inter)' }}>{trades.length} trades total</div>
      </div>
      <div style={{ background: card, borderRadius: '16px', padding: '22px 24px', border: `1px solid ${tableBorder}` }}>
        <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Win Rate</div>
        <div style={{ fontSize: '32px', fontFamily: 'var(--font-inter)', fontWeight: 700, color: winRate >= 50 ? '#22c55e' : '#dc3232', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '10px' }}>{winRate}%</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ c: '#22c55e', l: `W ${wins.length}` }, { c: '#dc3232', l: `L ${losses.length}` }, { c: textMuted, l: `BE ${be.length}` }].map(b => (
            <span key={b.l} style={{ fontSize: '10px', fontFamily: 'var(--font-inter)', color: b.c, background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', borderRadius: '6px', padding: '3px 8px' }}>{b.l}</span>
          ))}
        </div>
      </div>
      <div style={{ background: card, borderRadius: '16px', padding: '22px 24px', border: `1px solid ${tableBorder}` }}>
        <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Avg Win / Loss</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '10px' }}>
          <span style={{ fontSize: '32px', fontFamily: 'var(--font-inter)', fontWeight: 700, color: '#22c55e', lineHeight: 1, letterSpacing: '-0.02em' }}>
            <span style={mask}>€{avgWin.toFixed(0)}</span>
          </span>
          <span style={{ fontSize: '28px', fontFamily: 'var(--font-inter)', fontWeight: 300, color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)', lineHeight: 1 }}>/</span>
          <span style={{ fontSize: '32px', fontFamily: 'var(--font-inter)', fontWeight: 700, color: '#dc3232', lineHeight: 1, letterSpacing: '-0.02em' }}>
            <span style={mask}>€{avgLoss.toFixed(0)}</span>
          </span>
        </div>
        <AvgWinLossGauge avgWin={avgWin} avgLoss={avgLoss} dark={dark} />
      </div>
      <div style={{ background: card, borderRadius: '16px', padding: '22px 24px', border: `1px solid ${tableBorder}` }}>
        <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Profit Factor</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '32px', fontFamily: 'var(--font-inter)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', color: profitFactor >= 2 ? '#22c55e' : profitFactor >= 1 ? ACCENT : profitFactor === 0 ? textMuted : '#dc3232' }}>
            {profitFactor === Infinity ? '∞' : profitFactor > 0 ? profitFactor.toFixed(2) : '—'}
          </span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-inter)', fontWeight: 600, color: profitFactor >= 2 ? '#22c55e' : profitFactor >= 1 ? ACCENT : '#dc3232', background: `${profitFactor >= 2 ? '#22c55e' : profitFactor >= 1 ? ACCENT : '#dc3232'}18`, borderRadius: '20px', padding: '3px 10px' }}>
            {profitFactor === Infinity ? 'Perfect' : profitFactor >= 2 ? 'Strong' : profitFactor >= 1.5 ? 'Good' : profitFactor >= 1 ? 'Breakeven+' : profitFactor > 0 ? 'Losing' : '—'}
          </span>
        </div>
        <div style={{ fontSize: '11px', color: textMuted, fontFamily: 'var(--font-inter)' }}>€{grossProfit.toFixed(0)} gross profit</div>
      </div>
    </>
  )

  const mobile = (
    <div style={{ minHeight: '100vh', background: pageBg, padding: '20px 16px 40px', boxSizing: 'border-box' as const }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 700, color: textPrimary }}>Overview.</h1>
        <button onClick={() => { setEditingRecap(null); setShowRecapModal(true) }} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 600, cursor: 'pointer' }}>+ Recap</button>
      </div>

      <div style={{ display: 'flex', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: '10px', padding: '3px', marginBottom: '20px' }}>
        {[{ label: 'Overview', path: '/dashboard/journal' }, { label: 'Trades', path: '/dashboard/journal/trades' }].map(tab => (
          <button key={tab.label} onClick={() => router.push(tab.path)} style={{
            flex: 1, padding: '9px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: tab.label === 'Overview' ? (dark ? 'rgba(255,255,255,0.12)' : '#fff') : 'transparent',
            color: tab.label === 'Overview' ? (dark ? '#fff' : '#1a1a1a') : textMuted,
            fontFamily: 'var(--font-inter)', fontSize: '13px',
            fontWeight: tab.label === 'Overview' ? 600 : 400,
            boxShadow: tab.label === 'Overview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ background: card, borderRadius: '14px', padding: '16px', border: `1px solid ${tableBorder}` }}>
            <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Net P&L</div>
            <div style={{ fontSize: '32px', fontFamily: 'Georgia, serif', fontWeight: 700, color: pnlColor, marginBottom: '4px' }}>
              <span style={mask}>{totalPnl >= 0 ? '+' : ''}€{totalPnl.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: '11px', color: textMuted, fontFamily: 'var(--font-inter)' }}>{trades.length} trades</div>
          </div>
        </div>
        <div style={{ background: card, borderRadius: '14px', padding: '14px', border: `1px solid ${tableBorder}` }}>
          <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Win Rate</div>
          <div style={{ fontSize: '26px', fontFamily: 'Georgia, serif', fontWeight: 700, color: winRate >= 50 ? '#22c55e' : '#dc3232', marginBottom: '6px' }}>{winRate}%</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' as const }}>
            {[{ c: '#22c55e', l: `W ${wins.length}` }, { c: '#dc3232', l: `L ${losses.length}` }, { c: textMuted, l: `BE ${be.length}` }].map(b => (
              <span key={b.l} style={{ fontSize: '9px', fontFamily: 'var(--font-inter)', color: b.c, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRadius: '5px', padding: '2px 6px' }}>{b.l}</span>
            ))}
          </div>
        </div>
        <div style={{ background: card, borderRadius: '14px', padding: '14px', border: `1px solid ${tableBorder}` }}>
          <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Profit Factor</div>
          <ProfitFactorDisplay value={profitFactor} dark={dark} textMuted={textMuted} />
        </div>
      </div>
      <div style={{ background: card, borderRadius: '14px', padding: '14px', border: `1px solid ${tableBorder}`, marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>Avg Win / Loss</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '18px', fontFamily: 'Georgia, serif', fontWeight: 700, color: '#22c55e' }}>
            <span style={mask}>€{avgWin.toFixed(0)}</span>
          </span>
          <span style={{ fontSize: '18px', fontFamily: 'Georgia, serif', fontWeight: 700, color: '#dc3232' }}>
            <span style={mask}>€{avgLoss.toFixed(0)}</span>
          </span>
        </div>
        <AvgWinLossGauge avgWin={avgWin} avgLoss={avgLoss} dark={dark} />
      </div>
      <div style={{ background: card, borderRadius: '14px', padding: '16px', border: `1px solid ${tableBorder}`, marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)' }}>Cumulative P&L</div>
          <SegmentedControl options={['Daily', 'Weekly', 'Monthly']} value={period} onChange={setPeriod} dark={dark} />
        </div>
        <PnlChart trades={sorted} period={period} dark={dark} card={card} textPrimary={textPrimary} textMuted={textMuted} tableBorder={tableBorder} />
      </div>
      <div style={{ background: card, borderRadius: '14px', padding: '16px', border: `1px solid ${tableBorder}`, marginBottom: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)', marginBottom: '12px' }}>Weekly Distribution</div>
        <WeeklyBarChart trades={trades} dark={dark} textMuted={textMuted} tableBorder={tableBorder} />
      </div>
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)', marginBottom: '10px' }}>Session Performance</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { key: 'london', label: 'London', hours: '2AM – 5AM' },
            { key: 'ny', label: 'New York', hours: '7AM – 11AM' },
            { key: 'asia', label: 'Asia', hours: '8PM – 00:00' },
            { key: 'overlap', label: 'Overlap', hours: null },
          ].map(sess => {
            const st = trades.filter(t => (t as any).session === sess.key)
            const pnl = st.reduce((s, t) => s + (t.pnl || 0), 0)
            const pc = pnl > 0 ? '#22c55e' : pnl < 0 ? '#dc3232' : textMuted
            return (
              <div key={sess.key} style={{ background: card, borderRadius: '12px', padding: '12px', border: `1px solid ${tableBorder}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <SessionIcon session={sess.key} size={24} />
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)' }}>{sess.label}</span>
                    {sess.hours && <div style={{ fontSize: '9px', color: textMuted, fontFamily: 'var(--font-inter)', marginTop: '1px' }}>{sess.hours}</div>}
                  </div>
                </div>
                <div style={{ fontSize: '20px', fontFamily: 'var(--font-inter)', fontWeight: 700, color: pc, letterSpacing: '-0.02em' }}>
                  {st.length > 0 ? <span style={mask}>{pnl >= 0 ? '+' : ''}€{pnl.toFixed(0)}</span> : '—'}
                </div>
                <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', marginTop: '2px' }}>{st.length} trades</div>
              </div>
            )
          })}
        </div>
      </div>
      {recentTrades.length > 0 && (
        <div style={{ background: card, borderRadius: '14px', padding: '16px', border: `1px solid ${tableBorder}` }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)', marginBottom: '12px' }}>Recent Trades</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentTrades.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PairIcon pair={t.pair} size={22} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)' }}>{t.pair}</div>
                    <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)' }}>{new Date(t.trade_date + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontFamily: 'Georgia, serif', fontWeight: 700, color: t.pnl >= 0 ? '#22c55e' : '#dc3232' }}>
                  <span style={mask}>{t.pnl >= 0 ? '+' : ''}€{t.pnl.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showRecapModal && (
        <RecapModal recap={editingRecap} dark={dark} textPrimary={textPrimary} textMuted={textMuted} tableBorder={tableBorder}
          onClose={() => { setShowRecapModal(false); setEditingRecap(null) }} onSave={handleSaveRecap} />
      )}
    </div>
  )

  const desktop = (
    <div style={{ minHeight: '100vh', background: pageBg, padding: '36px 40px 56px', boxSizing: 'border-box' as const }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: 700, color: textPrimary }}>Overview.</h1>
        <button onClick={() => { setEditingRecap(null); setShowRecapModal(true) }} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontFamily: 'var(--font-inter)', fontWeight: 600, cursor: 'pointer' }}>+ Monthly Recap</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>{statCards}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: card, borderRadius: '16px', padding: '20px 22px', border: `1px solid ${tableBorder}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)' }}>Cumulative P&L</div>
            <SegmentedControl options={['Daily', 'Weekly', 'Monthly']} value={period} onChange={setPeriod} dark={dark} />
          </div>
          <PnlChart trades={sorted} period={period} dark={dark} card={card} textPrimary={textPrimary} textMuted={textMuted} tableBorder={tableBorder} />
        </div>
        <div style={{ background: card, borderRadius: '16px', padding: '20px 22px', border: `1px solid ${tableBorder}` }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)', marginBottom: '14px' }}>Weekly Distribution</div>
          <WeeklyBarChart trades={trades} dark={dark} textMuted={textMuted} tableBorder={tableBorder} />
          <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', marginTop: '8px', textAlign: 'center' as const }}>P&L by day · hover for details</div>
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)', marginBottom: '12px' }}>Session Performance</div>
        <SessionCards trades={trades} dark={dark} card={card} textPrimary={textPrimary} textMuted={textMuted} tableBorder={tableBorder} />
      </div>
      {recentTrades.length > 0 && (
        <div style={{ background: card, borderRadius: '16px', padding: '20px 24px', border: `1px solid ${tableBorder}`, marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)' }}>Recent Trades</div>
            <button onClick={() => router.push('/dashboard/journal/trades')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', color: ACCENT, fontFamily: 'var(--font-inter)', fontWeight: 500 }}>View all →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {recentTrades.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: `1px solid ${tableBorder}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PairIcon pair={t.pair} size={22} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)' }}>{t.pair}</div>
                    <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)' }}>{new Date(t.trade_date + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontFamily: 'var(--font-inter)', fontWeight: 700, letterSpacing: '-0.02em', color: t.pnl >= 0 ? '#22c55e' : '#dc3232' }}>
                  <span style={mask}>{t.pnl >= 0 ? '+' : ''}€{t.pnl.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {recaps.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, fontFamily: 'var(--font-inter)', marginBottom: '12px' }}>Monthly Recaps</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {recaps.map(r => (
              <MonthlyRecapCard key={r.id} recap={r} dark={dark} card={card} textPrimary={textPrimary} textMuted={textMuted} tableBorder={tableBorder}
                onEdit={() => { setEditingRecap(r); setShowRecapModal(true) }} />
            ))}
          </div>
        </div>
      )}
      {showRecapModal && (
        <RecapModal recap={editingRecap} dark={dark} textPrimary={textPrimary} textMuted={textMuted} tableBorder={tableBorder}
          onClose={() => { setShowRecapModal(false); setEditingRecap(null) }} onSave={handleSaveRecap} />
      )}
    </div>
  )

  return (
    <>
      <style>{`
        @media (max-width: 768px) { .fc-desktop { display: none !important; } }
        @media (min-width: 769px) { .fc-mobile  { display: none !important; } }
      `}</style>
      <div className="fc-mobile">{mobile}</div>
      <div className="fc-desktop">{desktop}</div>
    </>
  )
}