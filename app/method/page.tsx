'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const ROADMAP = [
  { num: '01', title: 'Market Foundations', sub: 'Understanding the world you are entering', points: ['How the global economy is structured and what drives it', 'The different markets — Forex, Indices, Commodities explained clearly', 'How central banks and institutions move price', 'Market sessions, liquidity windows, and timing', 'Price action fundamentals — reading charts without indicators', 'Market structure, order flow, and ICT core concepts', 'Premium: weekly 1-on-1 call to guide your foundation personally'] },
  { num: '02', title: 'Build Your Edge', sub: 'A strategy built on data, not feelings', points: ['Identify the concepts that match your personality and schedule', 'Swing, intraday or scalping — find what fits your life', 'Build a fully rules-based trading plan from scratch', 'Backtest your strategy across 100+ historical setups', 'Risk management framework — protect capital above everything', 'Journal setup — every trade logged and analysed from day one', 'Premium: weekly 1-on-1 call to build your personal edge together'] },
  { num: '03', title: 'Demo Trading', sub: 'Build confidence before risking a single euro', points: ['Execute your plan in real market conditions with zero risk', 'Collect live data — what works, what does not, and why', 'Track every entry, exit, emotion, and result meticulously', 'Refine and optimise based on real performance data', 'Build the habits and discipline of a professional trader', 'Only advance when your data proves consistency', 'Premium: weekly 1-on-1 call to review your demo performance and accelerate progress'] },
  { num: '04', title: 'Go Live — Your Choice', sub: 'Prop firm or own capital — both paths fully mapped', points: ['Option A: Prop Firm — trade up to $200K with zero personal risk', 'Option B: Live capital — trade your own account with full control', 'Prop firm evaluation strategy — how to pass on the first attempt', 'Risk/reward on funded accounts is unmatched when executed correctly', 'Capital allocation and position sizing rules for live trading', 'The psychological shift when real money is on the line', 'Premium: weekly 1-on-1 call to prepare you for going live with confidence'] },
  { num: '05', title: 'Consistency Phase', sub: 'Where real traders are built', points: ['Managing the psychological pressure of real capital', 'Every mistake studied, documented, and eliminated — no exceptions', 'Weekly 1-on-1 trade reviews for Premium members', 'Emotional control under drawdown — the hardest and most important skill', 'Drawdown management and recovery protocols', 'Building the daily routine that elite traders follow', 'Premium: weekly 1-on-1 call — every mistake turned into a lesson'] },
  { num: '06', title: 'First Payout', sub: 'The moment the blueprint is proven', points: ['Your first certified withdrawal — proof that the system works', 'Payout posted on the Flow Capitals Trading Wall', 'Full performance review — what got you here and how to repeat it', 'Refining the edge for larger and more consistent returns', 'Community recognition and accountability', 'This is the beginning of your verified track record', 'Premium: weekly 1-on-1 call to lock in what worked and scale it'] },
  { num: '07', title: 'Scale & Grow', sub: 'Now we go to the next level', points: ['Scaling funded accounts from $50K to $200K and beyond', 'Managing multiple prop firm accounts simultaneously', 'Portfolio thinking — diversify across markets and strategies', 'Building trading as a real sustainable income stream', 'Advanced psychology for high-capital high-pressure trading', 'The life the top 1% of traders live — within reach', 'Premium: weekly 1-on-1 call to build your scaling strategy together'] },
]

const STANDARD_SCHEDULE = [
  { day: 'SUN', label: 'Market Analysis', type: 'live', desc: 'Full weekly outlook — Gold, Nasdaq, EUR/USD, GBP/USD, DXY' },
  { day: 'MON', label: 'Study Day', type: 'async', desc: 'Review Sunday breakdown, work through course content' },
  { day: 'TUE', label: 'Live Reading', type: 'live', desc: 'Live price action reading session — key levels and structure' },
  { day: 'WED', label: 'Study Day', type: 'async', desc: 'Apply concepts, practice exercises, community support' },
  { day: 'THU', label: 'Study Day', type: 'async', desc: 'Journal review, self-assessment, Q&A' },
  { day: 'FRI', label: 'Study Day', type: 'async', desc: 'Weekly recap, prepare for Sunday breakdown' },
  { day: 'SAT', label: 'Rest', type: 'rest', desc: 'Recovery and reflection' },
]

const PREMIUM_SCHEDULE = [
  { day: 'SUN', label: 'Market Analysis', type: 'live', desc: 'Full weekly outlook — Gold, Nasdaq, EUR/USD, GBP/USD, DXY' },
  { day: 'MON', label: 'Live Session', type: 'live', desc: 'Extra premium live session — deeper market analysis' },
  { day: 'TUE', label: 'Live Reading', type: 'live', desc: 'Live price action reading session — key levels and structure' },
  { day: 'WED', label: 'Live Session', type: 'live', desc: 'Premium live deep dive — setups, concepts, execution' },
  { day: 'THU', label: 'Live Session', type: 'live', desc: 'Premium live session — trade review and planning' },
  { day: 'FRI', label: '1-on-1 Call', type: 'personal', desc: 'Personal weekly call — your trades, your journal, your progress' },
  { day: 'SAT', label: 'Psychology Call', type: 'psych', desc: 'Mindset and psychology session — emotional control and discipline' },
]

function RoadmapChart({ stages, isMobile }: { stages: typeof ROADMAP, isMobile: boolean }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(1200)

  const W = 420
  const H = 520
  const padX = 50
  const padY = 50

  const pts = stages.map((_, i) => ({
    x: padX + (i / (stages.length - 1)) * (W - padX * 2),
    y: H - padY - (i / (stages.length - 1)) * (H - padY * 2),
  }))

  function bezierPath(points: { x: number; y: number }[]) {
    if (points.length < 2) return ''
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]; const curr = points[i]
      const cpx = (prev.x + curr.x) / 2
      d += ` C ${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`
    }
    return d
  }

  const fullPath = bezierPath(pts)

  useEffect(() => {
    if (svgRef.current) setPathLength(svgRef.current.getTotalLength())
  }, [])

  useEffect(() => {
    function onScroll() {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalHeight = containerRef.current.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const progress = Math.max(0, Math.min(1, scrolled / totalHeight))
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const activeIdx = Math.min(stages.length - 1, Math.floor(scrollProgress * stages.length))
  const active = stages[activeIdx]
  const drawnLength = scrollProgress * pathLength

  // Mobile: vertical card list instead of scroll-driven chart
  if (isMobile) {
    return (
      <div style={{ padding: '0 0 40px' }}>
        {stages.map((stage, i) => (
          <div key={stage.num} style={{ borderBottom: '0.5px solid rgba(26,26,26,0.08)' }}>
            {/* Stage header */}
            <div style={{ background: '#0d1e36', padding: '28px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '48px', fontWeight: '700', color: 'rgba(122,174,232,0.2)', lineHeight: 1, flexShrink: 0 }}>{stage.num}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#7aaee8', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>Stage {stage.num}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: '700', color: '#ffffff', lineHeight: 1.2 }}>{stage.title}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '12px', color: '#7aaee8', marginTop: '4px' }}>{stage.sub}</div>
              </div>
            </div>
            {/* Stage content */}
            <div style={{ background: '#ffffff', padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                {stage.points.map((point, j) => {
                  const isPremium = point.startsWith('Premium:')
                  return (
                    <div key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ width: '5px', height: '5px', background: isPremium ? '#7aaee8' : '#2B5EA7', borderRadius: '50%', flexShrink: 0, marginTop: '6px' }} />
                      <span style={{ fontFamily: isPremium ? 'var(--font-playfair)' : 'var(--font-inter)', fontStyle: isPremium ? 'italic' : 'normal', fontSize: '13px', color: isPremium ? '#2B5EA7' : '#3a3530', lineHeight: '1.65' }}>{point}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Desktop: original scroll-driven chart
  return (
    <div ref={containerRef} style={{ height: `${stages.length * 100}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0d1e36', padding: '60px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 70%, rgba(43,94,167,0.2) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '32px', left: '32px', background: 'rgba(43,94,167,0.15)', border: '0.5px solid rgba(122,174,232,0.3)', borderRadius: '8px', padding: '8px 16px', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#7aaee8', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '2px' }}>Stage {active.num}</div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>{active.title}</div>
          </div>
          <svg ref={null} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: '380px', height: 'auto', overflow: 'visible', position: 'relative', zIndex: 1 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#1a3a6a" />
                <stop offset="50%" stopColor="#2B5EA7" />
                <stop offset="100%" stopColor="#7aaee8" />
              </linearGradient>
              <linearGradient id="glowGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#2B5EA7" stopOpacity="0" />
                <stop offset="100%" stopColor="#7aaee8" stopOpacity="0.4" />
              </linearGradient>
              <filter id="dotGlow"><feGaussianBlur stdDeviation="6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <filter id="lineGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {[0, 1, 2, 3, 4].map(i => (
              <line key={i} x1={padX} y1={padY + (i / 4) * (H - padY * 2)} x2={W - padX} y2={padY + (i / 4) * (H - padY * 2)} stroke="rgba(122,174,232,0.05)" strokeWidth="1" strokeDasharray="4,6" />
            ))}
            <path d={fullPath} fill="none" stroke="rgba(122,174,232,0.08)" strokeWidth="2" />
            <path ref={svgRef} d={fullPath} fill="none" stroke="url(#glowGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${drawnLength} ${pathLength}`} filter="url(#lineGlow)" />
            <path d={fullPath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${drawnLength} ${pathLength}`} />
            {pts.map((pt, i) => {
              const dotThreshold = i / (stages.length - 1)
              const reached = scrollProgress >= dotThreshold - 0.02
              const isActive = i === activeIdx
              return (
                <g key={i}>
                  {isActive && <circle cx={pt.x} cy={pt.y} r="20" fill="rgba(122,174,232,0.06)" stroke="rgba(122,174,232,0.15)" strokeWidth="1" />}
                  {reached && <circle cx={pt.x} cy={pt.y} r={isActive ? 12 : 7} fill="rgba(43,94,167,0.4)" filter="url(#dotGlow)" />}
                  <circle cx={pt.x} cy={pt.y} r={isActive ? 9 : reached ? 6 : 4} fill={reached ? (isActive ? '#7aaee8' : '#2B5EA7') : 'rgba(255,255,255,0.1)'} stroke={reached ? (isActive ? '#ffffff' : '#7aaee8') : 'rgba(122,174,232,0.3)'} strokeWidth={isActive ? '2' : '1.5'} style={{ transition: 'all 0.4s ease' }} />
                  {reached && <text x={pt.x} y={pt.y + 1} textAnchor="middle" dominantBaseline="middle" fontFamily="var(--font-inter)" fontSize={isActive ? '8' : '6'} fontWeight="700" fill="#ffffff">{i + 1}</text>}
                  {reached && !isActive && <text x={pt.x} y={i % 2 === 0 ? pt.y - 14 : pt.y + 18} textAnchor="middle" fontFamily="var(--font-inter)" fontSize="8" fill="rgba(122,174,232,0.5)">{stages[i].title.split(' ')[0]}</text>}
                </g>
              )
            })}
            {scrollProgress > 0 && scrollProgress < 1 && (() => {
              const currentPtIdx = Math.min(stages.length - 2, activeIdx)
              const nextPtIdx = Math.min(stages.length - 1, currentPtIdx + 1)
              const segProgress = (scrollProgress * stages.length) - currentPtIdx
              const cx = pts[currentPtIdx].x + (pts[nextPtIdx].x - pts[currentPtIdx].x) * Math.min(1, segProgress)
              const cy = pts[currentPtIdx].y + (pts[nextPtIdx].y - pts[currentPtIdx].y) * Math.min(1, segProgress)
              return <circle cx={cx} cy={cy} r="3" fill="#ffffff" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" /></circle>
            })()}
          </svg>
        </div>
        <div style={{ padding: '60px 64px', height: '100%', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', background: '#ffffff', overflowY: 'auto' as const }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#2B5EA7', letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '1px', background: '#2B5EA7' }} />Stage {active.num} of 07
          </div>
          <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '38px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '8px' }}>{active.title}</h3>
          <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '15px', color: '#2B5EA7', marginBottom: '28px' }}>{active.sub}</p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '9px', marginBottom: '36px' }}>
            {active.points.map((point, i) => {
              const isPremium = point.startsWith('Premium:')
              return (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '5px', height: '5px', background: isPremium ? '#7aaee8' : '#2B5EA7', borderRadius: '50%', flexShrink: 0, marginTop: '7px' }} />
                  <span style={{ fontFamily: isPremium ? 'var(--font-playfair)' : 'var(--font-inter)', fontStyle: isPremium ? 'italic' : 'normal', fontSize: '13px', color: isPremium ? '#2B5EA7' : '#3a3530', lineHeight: '1.65' }}>{point}</span>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {stages.map((_, i) => (
              <div key={i} style={{ width: i === activeIdx ? '28px' : '6px', height: '6px', borderRadius: '3px', background: i <= activeIdx ? '#2B5EA7' : 'rgba(43,94,167,0.12)', transition: 'all 0.35s ease' }} />
            ))}
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#8a8070', marginLeft: '8px' }}>{activeIdx + 1} / {stages.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScheduleCard({ item }: { item: typeof STANDARD_SCHEDULE[0] }) {
  const colors: Record<string, { bg: string; border: string; label: string }> = {
    live: { bg: 'rgba(43,94,167,0.05)', border: 'rgba(43,94,167,0.2)', label: '#2B5EA7' },
    async: { bg: 'rgba(26,26,26,0.03)', border: 'rgba(26,26,26,0.1)', label: '#8a8070' },
    personal: { bg: 'rgba(180,120,0,0.05)', border: 'rgba(180,120,0,0.2)', label: '#b47800' },
    psych: { bg: 'rgba(120,80,180,0.05)', border: 'rgba(120,80,180,0.2)', label: '#7850b4' },
    rest: { bg: 'transparent', border: 'rgba(26,26,26,0.06)', label: '#c8c0b0' },
  }
  const c = colors[item.type]
  return (
    <div style={{ background: c.bg, border: `0.5px solid ${c.border}`, padding: '14px', borderRadius: '2px' }}>
      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: c.label, marginBottom: '5px' }}>{item.type === 'rest' ? 'Rest' : item.type === 'personal' ? '1-on-1' : item.type}</div>
      <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px', lineHeight: '1.3' }}>{item.label}</div>
      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#8a8070', lineHeight: '1.4' }}>{item.desc}</div>
    </div>
  )
}

export default function Method() {
  const [scheduleTab, setScheduleTab] = useState<'standard' | 'premium'>('standard')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const p = isMobile ? '48px 24px' : '80px'

  return (
    <div style={{ background: '#F5F2EC', fontFamily: 'var(--font-playfair)', paddingTop: '88px' }}>
      <Nav />

      {/* PAGE HEADER */}
      <section style={{ padding: isMobile ? '48px 24px 40px' : '80px 80px 60px', background: '#ffffff', borderBottom: '0.5px solid rgba(26,26,26,0.08)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />Our Method
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '40px' : '64px', fontWeight: '700', lineHeight: '1.1', letterSpacing: isMobile ? '-1px' : '-2px', color: '#1a1a1a', marginBottom: '0', maxWidth: '700px' }}>
            The blueprint.<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>Step by step.</span>
          </h1>
          <div style={{ width: '60px', height: '3px', background: '#2B5EA7', margin: '28px 0 0' }} />
        </div>
      </section>

      {/* ROADMAP */}
      <section style={{ background: '#F5F2EC' }}>
        <div style={{ padding: isMobile ? '40px 24px 24px' : '80px 80px 40px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '28px' : '36px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>7-Stage Roadmap</h2>
          <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '15px', color: '#8a8070' }}>From knowing nothing to scaling funded accounts. No guessing. No wasted money.</p>
        </div>
        <RoadmapChart stages={ROADMAP} isMobile={isMobile} />
      </section>

      {/* WEEKLY SCHEDULE */}
      <section style={{ padding: p, background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '28px' : '36px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Weekly Schedule</h2>
          <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '15px', color: '#8a8070', marginBottom: '28px' }}>Standard members get 2 live sessions per week. Premium members get 4–5 live sessions plus a personal 1-on-1 call every week.</p>

          <div style={{ display: 'flex', gap: '0', marginBottom: '28px', border: '1px solid rgba(26,26,26,0.1)', width: 'fit-content' }}>
            {(['standard', 'premium'] as const).map(tab => (
              <button key={tab} onClick={() => setScheduleTab(tab)} style={{ padding: '12px 28px', background: scheduleTab === tab ? '#2B5EA7' : 'none', border: 'none', color: scheduleTab === tab ? '#ffffff' : '#8a8070', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.2s', fontWeight: scheduleTab === tab ? '600' : '400' }}>
                {tab === 'standard' ? 'Standard' : 'Premium'}
              </button>
            ))}
          </div>

          {/* Schedule grid — 7 cols on desktop, 1 col on mobile */}
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
              {(scheduleTab === 'standard' ? STANDARD_SCHEDULE : PREMIUM_SCHEDULE).map(item => (
                <div key={item.day} style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
                  <div style={{ width: '36px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070', letterSpacing: '0.12em', textTransform: 'uppercase' as const, writingMode: 'vertical-rl' as const, transform: 'rotate(180deg)' }}>{item.day}</div>
                  </div>
                  <div style={{ flex: 1 }}><ScheduleCard item={item} /></div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
              {(scheduleTab === 'standard' ? STANDARD_SCHEDULE : PREMIUM_SCHEDULE).map(item => (
                <div key={item.day}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070', letterSpacing: '0.12em', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase' as const }}>{item.day}</div>
                  <ScheduleCard item={item} />
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' as const }}>
            {[{ color: '#2B5EA7', label: 'Live Session' }, { color: '#7850b4', label: 'Psychology' }, { color: '#b47800', label: '1-on-1 Personal' }, { color: '#8a8070', label: 'Study / Async' }].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#8a8070' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                {label}
              </div>
            ))}
          </div>

          {scheduleTab === 'premium' && (
            <div style={{ marginTop: '24px', padding: '20px 24px', background: 'rgba(43,94,167,0.04)', border: '0.5px solid rgba(43,94,167,0.15)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '6px', height: '6px', background: '#2B5EA7', borderRadius: '50%', flexShrink: 0, marginTop: '6px' }} />
              <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '14px', color: '#2B5EA7', margin: 0, lineHeight: '1.6' }}>
                The Friday 1-on-1 call is flexible and scheduled around your availability. This is your dedicated weekly session — your trades, your journal, your specific questions answered directly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* STANDARD VS PREMIUM */}
      <section style={{ padding: p, background: '#F5F2EC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />Your Membership
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '44px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-1px', marginBottom: '0', lineHeight: '1.1' }}>
            Two ways to learn.<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>One blueprint.</span>
          </h2>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px 0 40px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2px', background: 'rgba(26,26,26,0.06)' }}>
            <div style={{ background: '#ffffff', padding: isMobile ? '32px 24px' : '48px 44px' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#8a8070', marginBottom: '8px' }}>Standard</div>
              <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-0.5px', marginBottom: '16px' }}>The Self-Directed Path.</h3>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: '#6a6060', lineHeight: '1.85', marginBottom: '16px' }}>As a Standard member you are the observer — and that is a position of strength. You move at your own pace, in a context where clarity grows without pressure.</p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: '#6a6060', lineHeight: '1.85', marginBottom: '28px' }}>You watch. You learn. You apply. You build your own rhythm. For the self-motivated trader who knows how to take information and work with it independently — this is your path.</p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '28px' }}>
                {['Pre-market analysis every session', 'Full trading journal access', 'Wall of payouts — community proof', 'Discord community — peer support'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#2B5EA7', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#3a3530' }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px 20px', background: '#F5F2EC', borderLeft: '2px solid rgba(26,26,26,0.15)' }}>
                <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '13px', color: '#8a8070', lineHeight: '1.6', margin: 0 }}>&ldquo;The right environment, the right tools, the right analysis — at your own pace.&rdquo;</p>
              </div>
            </div>
            <div style={{ background: '#0d1e36', padding: isMobile ? '32px 24px' : '48px 44px' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#7aaee8', marginBottom: '8px' }}>Premium</div>
              <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '16px' }}>Personal Guidance.</h3>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.85', marginBottom: '16px' }}>As a Premium member you have a mentor in your corner every single week. Not a recording. Not a chatbot. A real trader who has walked this path.</p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.85', marginBottom: '28px' }}>The weekly 1-on-1 call is the core of this membership. Every Friday you sit down with your mentor and go through exactly where you are — what is working, what is not, and what to focus on next.</p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '28px' }}>
                {['Everything in Standard', 'Full course library — all 6 categories', 'Live sessions 5x per week', 'Weekly 1-on-1 personal call every Friday', 'Saturday psychology session', 'Direct access to your mentor'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7aaee8', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px 20px', background: 'rgba(122,174,232,0.08)', borderLeft: '2px solid #7aaee8' }}>
                <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '13px', color: '#7aaee8', lineHeight: '1.6', margin: 0 }}>&ldquo;Every week, someone who has done this is in your corner. That changes everything.&rdquo;</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2px', background: '#1a1a1a', padding: isMobile ? '24px' : '32px 44px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: isMobile ? '20px' : '0' }}>
            <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: isMobile ? '14px' : '16px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.6' }}>&ldquo;Not everyone needs a mentor. But everyone who has one moves faster.&rdquo;</p>
            <a href="/membership" style={{ background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 32px', textDecoration: 'none', fontWeight: '700', whiteSpace: 'nowrap' as const, flexShrink: 0, textAlign: 'center' as const }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
              onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
            >Choose your path →</a>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section style={{ padding: p, background: '#F5F2EC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '40px' : '80px', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />The Philosophy
            </div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '40px', fontWeight: '700', color: '#1a1a1a', marginBottom: '0', lineHeight: '1.1', letterSpacing: '-1px' }}>
              Slow down to<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>go faster.</span>
            </h2>
            <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px 0' }} />
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '15px', color: '#3a3530', lineHeight: '1.85', marginBottom: '18px' }}>Every mistake I made — losing my entire account, paying €15K for the wrong education, moving to live capital too soon — happened because I rushed.</p>
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '15px', color: '#3a3530', lineHeight: '1.85', marginBottom: '18px' }}>The Flow Capitals method is built on the opposite principle. Each stage has a gate. You do not move forward until your data proves you are ready. Not your feelings — your data.</p>
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '15px', color: '#3a3530', lineHeight: '1.85' }}>This is how you build a trading career that lasts. Not a winning streak — a career.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
            {[
              { num: '01', title: 'Data over feelings', desc: 'Every decision is based on your journal data, your backtest results, your real performance — never on how you feel about a trade.' },
              { num: '02', title: 'Gates between stages', desc: 'You earn the right to move to the next stage. No rushing, no skipping. Each gate protects your capital and your psychology.' },
              { num: '03', title: 'Psychology first', desc: 'The strategy is the easy part. The hard part is executing it under pressure. We spend as much time on the mind as on the chart.' },
              { num: '04', title: 'Personalised path', desc: 'Your trading plan is built around your life — your schedule, your personality, your risk tolerance. Not a one-size-fits-all system.' },
            ].map(item => (
              <div key={item.num} style={{ display: 'flex', gap: '20px', padding: '20px 24px', background: '#ffffff', border: '0.5px solid rgba(26,26,26,0.08)' }}>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: '700', color: 'rgba(43,94,167,0.15)', flexShrink: 0, lineHeight: 1, paddingTop: '2px' }}>{item.num}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '13px', color: '#8a8070', lineHeight: '1.6' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? '48px 24px' : '80px', background: '#1a2a4a', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: isMobile ? '28px' : '0' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '26px' : '32px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>Ready to follow the blueprint?</h2>
          <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>Choose your membership and start your journey today.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
          <a href="/membership" style={{ background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 32px', textDecoration: 'none', fontWeight: '700', textAlign: 'center' as const }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
            onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
          >View Membership →</a>
          <a href="/discovery" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '13px 28px', textDecoration: 'none', textAlign: 'center' as const }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
          >Our Story</a>
        </div>
      </section>

      <Footer />
    </div>
  )
}