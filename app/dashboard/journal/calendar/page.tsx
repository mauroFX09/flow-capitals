'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useDarkMode } from '@/lib/hooks'
import { getTheme, getCard } from '@/lib/styles'
import type { Trade } from '@/lib/types'

export default function CalendarPage() {
  const dark = useDarkMode()
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const { data } = await supabase.from('trades').select('*').eq('user_id', session.user.id).order('trade_date', { ascending: true })
      if (data) setTrades(data)
      setLoading(false)
    })
  }, [])

  const t = getTheme(dark)
  const { bg, cardBg, cardBorder, cardShadow, textPrimary, textMuted, accent, tableBorder } = t
  const card = getCard(dark)

  const isCurrentMonth = calYear === today.getFullYear() && calMonth === today.getMonth()

  const dayMap: Record<number, { pnl: number; trades: Trade[] }> = {}
  trades.forEach(tr => {
    if (!tr.trade_date) return
    const [year, month, dayNum] = tr.trade_date.split('-').map(Number)
    if (year === calYear && month - 1 === calMonth) {
      const day = dayNum
      if (!dayMap[day]) dayMap[day] = { pnl: 0, trades: [] }
      dayMap[day].pnl += tr.pnl ?? 0
      dayMap[day].trades.push(tr)
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

  function prevMonth() {
    setSelectedDay(null)
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) } else setCalMonth(m => m - 1)
  }
  function nextMonth() {
    if (isCurrentMonth) return
    setSelectedDay(null)
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) } else setCalMonth(m => m + 1)
  }

  const monthLabel = new Date(calYear, calMonth).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const dayLabels = isMobile
    ? ['M','T','W','T','F','S','S','∑']
    : ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Week']

  const monthTrades = Object.values(dayMap).flatMap(d => d.trades)
  const monthPnl = monthTrades.reduce<number>((s, t) => s + (t.pnl ?? 0), 0)
  const profitDays = Object.values(dayMap).filter(d => d.pnl > 0).length
  const lossDays = Object.values(dayMap).filter(d => d.pnl < 0).length

  const selectedDayData = selectedDay ? dayMap[selectedDay] : null

  const gridCols = 'repeat(7, 1fr) auto'

  function getWeekPnl(week: (number | null)[]): number {
    return week.reduce<number>((sum, day) => {
      if (day === null) return sum
      return sum + (dayMap[day]?.pnl ?? 0)
    }, 0)
  }

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px 48px', background: bg, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: accent }} />Trading Journal
        </div>
        <h1 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1 }}>Calendar.</h1>
      </div>

      {/* Month navigation + stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap' as const, gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={prevMonth} style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', color: textMuted, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>←</button>
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '16px' : '20px', fontWeight: '700', color: textPrimary, minWidth: isMobile ? '130px' : '160px', textAlign: 'center' as const }}>{monthLabel}</span>
          <button onClick={nextMonth} style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '8px', width: '32px', height: '32px', cursor: isCurrentMonth ? 'not-allowed' : 'pointer', color: isCurrentMonth ? (dark ? 'rgba(255,255,255,0.15)' : 'rgba(26,26,26,0.2)') : textMuted, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow, opacity: isCurrentMonth ? 0.4 : 1 }}>→</button>
        </div>

        {monthTrades.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
            {[
              { label: 'Month P&L', value: `${monthPnl >= 0 ? '+' : ''}${monthPnl.toFixed(0)}€`, color: monthPnl >= 0 ? '#22c55e' : '#dc3232' },
              { label: 'Trades', value: String(monthTrades.length), color: textPrimary },
              { label: 'Profit Days', value: String(profitDays), color: '#22c55e' },
              { label: 'Loss Days', value: String(lossDays), color: '#dc3232' },
            ].map(stat => (
              <div key={stat.label} style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '10px', padding: '8px 14px', boxShadow: cardShadow }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '2px' }}>{stat.label}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '15px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedDayData && !isMobile ? '1fr 300px' : '1fr', gap: '16px', alignItems: 'start' }}>

        {/* Calendar grid */}
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: isMobile ? '14px' : '24px' }}>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: isMobile ? '4px' : '6px', marginBottom: isMobile ? '4px' : '6px' }}>
            {dayLabels.map((d, i) => (
              <div key={i} style={{
                textAlign: 'center' as const,
                fontFamily: 'var(--font-inter)',
                fontSize: '9px',
                color: i === 7 ? accent : textMuted,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                padding: '4px 0',
                fontWeight: i === 7 ? '600' : '400',
                minWidth: i === 7 ? (isMobile ? '32px' : '72px') : undefined,
              }}>{d}</div>
            ))}
          </div>

          {/* Week rows */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: isMobile ? '4px' : '6px' }}>
            {weeks.map((week, wi) => {
              const weekPnl = getWeekPnl(week)
              const weekHasTrades = week.some(day => day !== null && dayMap[day] !== undefined)
              const weekColor = weekPnl > 0 ? '#22c55e' : weekPnl < 0 ? '#dc3232' : textMuted
              const tradingDaysInWeek = week.filter(d => d !== null && dayMap[d] !== undefined).length

              return (
                <div key={wi} style={{ display: 'grid', gridTemplateColumns: gridCols, gap: isMobile ? '4px' : '6px' }}>
                  {week.map((day, di) => {
                    if (!day) return <div key={di} style={{ minHeight: isMobile ? '44px' : '72px' }} />
                    const data = dayMap[day]
                    const pnl = data?.pnl ?? 0
                    const tradeCount = data?.trades.length ?? 0
                    const isToday = isCurrentMonth && day === today.getDate()
                    const isSelected = selectedDay === day
                    const isProfit = data && pnl > 0
                    const isLoss = data && pnl < 0
                    const isBe = data && pnl === 0

                    let cellBg = 'transparent'
                    let borderCol = dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.07)'
                    let pnlColor = textMuted

                    if (isProfit) { cellBg = dark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.07)'; borderCol = 'rgba(34,197,94,0.3)'; pnlColor = '#22c55e' }
                    if (isLoss)   { cellBg = dark ? 'rgba(220,50,50,0.1)' : 'rgba(220,50,50,0.07)'; borderCol = 'rgba(220,50,50,0.3)'; pnlColor = '#dc3232' }
                    if (isBe)     { cellBg = dark ? 'rgba(148,163,184,0.07)' : 'rgba(148,163,184,0.05)'; borderCol = 'rgba(148,163,184,0.25)'; pnlColor = '#94a3b8' }
                    if (isSelected) borderCol = accent

                    return (
                      <div
                        key={di}
                        onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                        style={{ background: cellBg, border: `0.5px solid ${borderCol}`, borderRadius: isMobile ? '8px' : '10px', padding: isMobile ? '6px 4px' : '10px 10px', minHeight: isMobile ? '44px' : '72px', cursor: data ? 'pointer' : 'default', position: 'relative' as const, boxShadow: isToday ? `0 0 0 1.5px ${accent}` : isSelected ? `0 0 0 1.5px ${accent}40` : 'none', transition: 'transform 0.1s ease' }}
                        onMouseEnter={e => { if (data) e.currentTarget.style.transform = 'scale(1.02)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                      >
                        <div style={{ fontFamily: 'var(--font-inter)', fontSize: isMobile ? '10px' : '11px', color: isToday ? accent : textMuted, fontWeight: isToday ? '700' : '400', marginBottom: isMobile ? '2px' : '6px', textAlign: isMobile ? 'center' as const : 'left' as const }}>{day}</div>
                        {data && !isMobile && (
                          <>
                            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: '700', color: pnlColor, lineHeight: 1, marginBottom: '3px', letterSpacing: '-0.02em' }}>
                              {pnl > 0 ? '+' : ''}€{pnl.toFixed(0)}
                            </div>
                            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted }}>{tradeCount} trade{tradeCount !== 1 ? 's' : ''}</div>
                          </>
                        )}
                        {data && isMobile && (
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: pnlColor }} />
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Weekly total P&L cell */}
                  <div style={{
                    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center',
                    minHeight: isMobile ? '44px' : '72px',
                    minWidth: isMobile ? '32px' : '72px',
                    borderRadius: isMobile ? '8px' : '10px',
                    border: `0.5px solid ${
                      weekHasTrades
                        ? (weekPnl > 0 ? 'rgba(34,197,94,0.25)' : weekPnl < 0 ? 'rgba(220,50,50,0.25)' : 'rgba(148,163,184,0.2)')
                        : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(26,26,26,0.05)')
                    }`,
                    background: weekHasTrades
                      ? (weekPnl > 0
                          ? (dark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.04)')
                          : weekPnl < 0
                            ? (dark ? 'rgba(220,50,50,0.06)' : 'rgba(220,50,50,0.04)')
                            : (dark ? 'rgba(148,163,184,0.05)' : 'rgba(148,163,184,0.03)'))
                      : 'transparent',
                    padding: isMobile ? '4px 2px' : '10px 8px',
                  }}>
                    {weekHasTrades ? (
                      <>
                        <div style={{ fontFamily: 'var(--font-inter)', fontSize: isMobile ? '9px' : '12px', fontWeight: '700', color: weekColor, letterSpacing: '-0.02em', lineHeight: 1, textAlign: 'center' as const }}>
                          {weekPnl > 0 ? '+' : ''}€{Math.abs(weekPnl) >= 1000 ? `${(weekPnl / 1000).toFixed(1)}k` : weekPnl.toFixed(0)}
                        </div>
                        {!isMobile && (
                          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: textMuted, marginTop: '3px', opacity: 0.7 }}>
                            {tradingDaysInWeek}d
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ width: '12px', height: '1px', background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: `0.5px solid ${tableBorder}`, flexWrap: 'wrap' as const }}>
            {[{ color: '#22c55e', label: 'Profitable day' }, { color: '#dc3232', label: 'Loss day' }, { color: '#94a3b8', label: 'Breakeven' }].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color, opacity: 0.7 }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Day detail panel */}
        {selectedDayData && (
          <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: '20px', position: isMobile ? 'static' : 'sticky' as any, top: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '3px' }}>
                  {new Date(calYear, calMonth, selectedDay!).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '22px', fontWeight: '700', color: selectedDayData.pnl >= 0 ? '#22c55e' : '#dc3232', letterSpacing: '-0.02em' }}>
                  {selectedDayData.pnl >= 0 ? '+' : ''}€{selectedDayData.pnl.toFixed(0)}
                </div>
              </div>
              <button onClick={() => setSelectedDay(null)} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', color: textMuted, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
              {selectedDayData.trades.map(trade => (
                <div key={trade.id} style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(26,26,26,0.02)', border: `0.5px solid ${tableBorder}`, borderRadius: '10px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: '700', color: textPrimary }}>{trade.pair}</span>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', fontWeight: '700', color: trade.direction === 'long' ? '#22c55e' : '#dc3232', background: trade.direction === 'long' ? 'rgba(34,197,94,0.1)' : 'rgba(220,50,50,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{trade.direction?.toUpperCase()}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: '700', letterSpacing: '-0.02em', color: trade.pnl > 0 ? '#22c55e' : trade.pnl < 0 ? '#dc3232' : textMuted }}>
                      {trade.pnl > 0 ? '+' : ''}€{(trade.pnl ?? 0).toFixed(0)}
                    </span>
                  </div>
                  {trade.emotion && (
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted }}>Emotion: {trade.emotion}</div>
                  )}
                  {trade.followed_plan !== null && (
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: trade.followed_plan ? '#22c55e' : '#dc3232', marginTop: '2px' }}>
                      {trade.followed_plan ? '✓ Followed plan' : '✗ Deviated from plan'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!loading && monthTrades.length === 0 && (
        <div style={{ textAlign: 'center' as const, padding: '48px', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted, fontSize: '15px' }}>
          No trades logged in {monthLabel}
        </div>
      )}
    </div>
  )
}