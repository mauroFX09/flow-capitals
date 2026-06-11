'use client'
import { useEffect, useRef, useState } from 'react'

const CLOCKS = [
  { city: 'LONDON', offset: 1 },
  { city: 'NEW YORK', offset: -4 },
  { city: 'TOKYO', offset: 9 },
  { city: 'DUBAI', offset: 4 },
  { city: 'CHICAGO', offset: -5 },
  { city: 'HONG KONG', offset: 8 },
  { city: 'SYDNEY', offset: 10 },
  { city: 'FRANKFURT', offset: 2 },
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

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [times, setTimes] = useState(CLOCKS.map(c => getTime(c.offset)))
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimes(CLOCKS.map(c => getTime(c.offset)))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

 useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      if (!canvas || !ctx) return
      const W = canvas.width
      const H = canvas.height

      // Deep void base
      ctx.fillStyle = '#020810'
      ctx.fillRect(0, 0, W, H)

      // === DEPTH GRADIENT — darkness fading to abyss ===
      const depthGrad = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.5, H * 0.9)
      depthGrad.addColorStop(0, 'rgba(7, 30, 48, 0.9)')
      depthGrad.addColorStop(0.4, 'rgba(4, 18, 30, 0.95)')
      depthGrad.addColorStop(1, 'rgba(1, 5, 10, 1)')
      ctx.fillStyle = depthGrad
      ctx.fillRect(0, 0, W, H)

      // === CAUSTIC LIGHT PATTERNS — dancing light on ocean floor ===
      for (let i = 0; i < 28; i++) {
        const seed = i * 137.508
        const cx = W * 0.5 + Math.sin(seed * 0.1 + t * 0.004) * W * 0.45
        const cy = H * 0.15 + Math.sin(seed * 0.07 + t * 0.003) * H * 0.35
        const r = 30 + Math.sin(seed * 0.13 + t * 0.006) * 20
        const alpha = 0.03 + Math.sin(seed * 0.09 + t * 0.005) * 0.02

        const caustic = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        caustic.addColorStop(0, `rgba(78, 205, 196, ${alpha + 0.015})`)
        caustic.addColorStop(0.5, `rgba(30, 120, 140, ${alpha * 0.5})`)
        caustic.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = caustic
        ctx.beginPath()
        ctx.ellipse(cx, cy, r * 1.8, r * 0.6, seed * 0.5 + t * 0.002, 0, Math.PI * 2)
        ctx.fill()
      }

      // === GOD RAYS — volumetric light shafts from surface ===
      const numRays = 7
      for (let i = 0; i < numRays; i++) {
        const rayOffset = (i / numRays) * W
        const sway = Math.sin(t * 0.003 + i * 0.8) * 60
        const x1 = rayOffset + sway
        const x2 = W * 0.5 + (x1 - W * 0.5) * 0.3 + Math.sin(t * 0.002 + i) * 40
        const alpha = 0.018 + Math.sin(t * 0.004 + i * 1.2) * 0.010
        const width = 40 + Math.sin(t * 0.003 + i * 0.6) * 20

        const rayGrad = ctx.createLinearGradient(x1, 0, x2, H)
        rayGrad.addColorStop(0, `rgba(100, 220, 210, ${alpha})`)
        rayGrad.addColorStop(0.3, `rgba(60, 160, 180, ${alpha * 0.6})`)
        rayGrad.addColorStop(0.7, `rgba(30, 80, 120, ${alpha * 0.3})`)
        rayGrad.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.beginPath()
        ctx.moveTo(x1 - width, 0)
        ctx.lineTo(x1 + width, 0)
        ctx.lineTo(x2 + width * 0.3, H)
        ctx.lineTo(x2 - width * 0.3, H)
        ctx.closePath()
        ctx.fillStyle = rayGrad
        ctx.fill()
      }

      // === SURFACE DISTORTION — looking up at the water surface ===
      for (let layer = 0; layer < 4; layer++) {
        const y = H * (0.06 + layer * 0.04)
        const amp = 6 + layer * 3
        const freq = 0.008 - layer * 0.001
        const speed = t * (0.008 - layer * 0.001)
        const alpha = 0.12 - layer * 0.025

        ctx.beginPath()
        ctx.moveTo(0, y)
        for (let x = 0; x <= W; x += 3) {
          const dy = Math.sin(x * freq + speed) * amp
            + Math.sin(x * freq * 2.1 - speed * 0.7) * (amp * 0.4)
            + Math.sin(x * freq * 0.5 + speed * 0.3) * (amp * 0.6)
          ctx.lineTo(x, y + dy)
        }
        ctx.lineTo(W, 0)
        ctx.lineTo(0, 0)
        ctx.closePath()

        const surfGrad = ctx.createLinearGradient(0, 0, 0, y + amp)
        surfGrad.addColorStop(0, `rgba(120, 240, 230, ${alpha + 0.04})`)
        surfGrad.addColorStop(1, `rgba(40, 140, 160, ${alpha})`)
        ctx.fillStyle = surfGrad
        ctx.fill()
      }

      // === PARTICLES — suspended micro-organisms / sediment ===
      for (let i = 0; i < 80; i++) {
        const seed = i * 47.3
        const x = (seed * 13.7 + t * (0.2 + (i % 5) * 0.08)) % W
        const y = (seed * 7.1 + t * (0.1 + (i % 3) * 0.05)) % H
        const size = 0.5 + (i % 3) * 0.4
        const alpha = 0.06 + Math.sin(t * 0.01 + seed) * 0.04

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168, 230, 226, ${alpha})`
        ctx.fill()
      }

      // === DEEP VIGNETTE — darkness at the edges ===
      const vignette = ctx.createRadialGradient(W * 0.5, H * 0.5, H * 0.2, W * 0.5, H * 0.5, H * 0.85)
      vignette.addColorStop(0, 'rgba(0,0,0,0)')
      vignette.addColorStop(1, 'rgba(0,4,8,0.7)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, W, H)

      t++
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const faqs = [
    { q: 'Is the program accessible to everyone?', a: 'Flow Capitals is selective by design. We work with serious individuals who are committed to the craft of trading. No prerequisites in experience — but you must be ready to do the work.' },
    { q: 'How long is the program?', a: 'The Premium mentorship program runs for either 3 or 6 months with weekly 1-on-1 sessions. The Standard membership gives you lifetime platform and Discord access.' },
    { q: 'What markets does the program cover?', a: 'Primary focus is Forex (EUR/USD, GBP/USD, GBP/JPY), Gold, Nasdaq and S&P 500. The methodology applies across all liquid markets.' },
    { q: 'How soon can I see results?', a: 'Most members report improved clarity and discipline within the first month. Consistent payout-level performance typically develops after 3–6 months of focused work.' },
    { q: 'How much capital do I need?', a: 'You can start with a funded account through one of our prop firm partners — trading significant capital without personal risk. We guide you through the evaluation process.' },
  ]

  return (
    <div style={{ background: '#050e1a', color: '#f0f6ff', fontFamily: 'Arial, sans-serif', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '64px',
        background: 'rgba(5,14,26,0.88)', backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(78,205,196,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', border: '1.5px solid #4ecdc4',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
          }}>
            <div style={{ width: '8px', height: '8px', background: '#4ecdc4', borderRadius: '50%' }} />
          </div>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: '700', letterSpacing: '1px' }}>
            FLOW <span style={{ color: '#4ecdc4' }}>CAPITALS</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {['About', 'Method', 'Services', 'Proof', 'FAQ'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} style={{
              fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#4a6070', textDecoration: 'none', transition: 'color 0.2s'
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f0f6ff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4a6070')}
            >{link}</a>
          ))}
        </div>

        <a href="/login" style={{
          border: '1px solid #4ecdc4', background: 'transparent', color: '#4ecdc4',
          fontFamily: 'Georgia, serif', fontSize: '11px', letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '8px 20px', cursor: 'pointer',
          textDecoration: 'none', transition: 'all 0.2s'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4ecdc4'; e.currentTarget.style.color = '#050e1a' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4ecdc4' }}
        >LOGIN</a>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

        {/* City clocks left */}
        <div style={{
          position: 'absolute', left: '28px', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 2
        }}>
          {CLOCKS.map((c, i) => (
            <div key={c.city}>
              <div style={{ fontSize: '8px', letterSpacing: '0.12em', color: '#4a6070', marginBottom: '1px', fontFamily: 'Georgia, serif' }}>{c.city}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#e0eef0', letterSpacing: '0.02em' }}>{times[i]}</div>
            </div>
          ))}
        </div>

        {/* Hero content center */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 2, textAlign: 'center'
        }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '11px', color: '#4ecdc4', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '24px', height: '1px', background: '#4ecdc4' }} />
            Finance Club · Est. 2025
            <div style={{ width: '24px', height: '1px', background: '#4ecdc4' }} />
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '96px', fontWeight: '700', lineHeight: '0.95', letterSpacing: '-3px', margin: '0 0 8px', color: '#fff' }}>FLOW</h1>
          <div style={{ width: '200px', height: '4px', background: '#4ecdc4', margin: '0 auto 12px' }} />
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '18px', color: '#4ecdc4', letterSpacing: '4px', margin: '0 0 28px' }}>Capitals.</p>

          <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#7a9aaa', lineHeight: '1.7', maxWidth: '480px', margin: '0 0 40px' }}>
            The trader&apos;s sanctuary. A serious place, for equally serious individuals.<br />
            For those who want to reach the top of the mountain.
          </p>

          <div style={{ display: 'flex', gap: '14px' }}>
            <a href="#services" style={{
              background: '#4ecdc4', color: '#050e1a', fontFamily: 'Georgia, serif',
              fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '14px 32px', textDecoration: 'none', fontWeight: '700', transition: 'all 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#3ab8b0'}
              onMouseLeave={e => e.currentTarget.style.background = '#4ecdc4'}
            >DISCOVER THE PLATFORM →</a>
            <a href="/login" style={{
              background: 'none', border: '1px solid rgba(78,205,196,0.4)', color: '#f0f6ff',
              fontFamily: 'Georgia, serif', fontSize: '11px', letterSpacing: '0.12em',
              textTransform: 'uppercase', padding: '13px 28px', textDecoration: 'none', transition: 'all 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4ecdc4'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(78,205,196,0.4)'}
            >MEMBER LOGIN</a>
          </div>
        </div>

        {/* Stats bottom */}
        <div style={{
          position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '80px', zIndex: 2
        }}>
          {[['$100K+', 'Certified Payouts'], ['8+', 'Years Experience'], ['2', 'Membership Tiers']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '600', color: '#4ecdc4', lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a6070', marginTop: '6px' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '100px 80px', background: '#071828' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '10px', color: '#4ecdc4', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: '#4ecdc4' }} />About the Club
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '52px', fontWeight: '700', lineHeight: 1, letterSpacing: '-1px', color: '#fff', marginBottom: '16px' }}>The Finance Club</h2>
        <p style={{ fontSize: '14px', color: '#4a6070', lineHeight: '1.8', maxWidth: '560px', marginBottom: '48px' }}>
          Founded in 2025, Flow Capitals is a digital space designed to equip serious traders. We know that truth and secret knowledge are the cutting edge of financial markets.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', background: 'rgba(78,205,196,0.08)' }}>
          {[
            ['📐', 'Price Action Models', 'Technical pillars built through real trading experience, not theory.'],
            ['🧠', 'Psychology & Mindset', 'Live sessions and 1-on-1 guidance to build unshakeable discipline.'],
            ['📓', 'Integrated Journal', 'Log every trade, track emotions, and measure your growth over time.'],
            ['🏆', 'Payout Wall', 'Certified prop firm payouts posted by real members. Proof, not promises.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ padding: '32px', background: '#050e1a', borderBottom: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#4ecdc4')}
              onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
            >
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>{icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#f0f6ff' }}>{title}</div>
              <div style={{ fontSize: '13px', color: '#4a6070', lineHeight: '1.6' }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* METHOD */}
      <section id="method" style={{ padding: '100px 80px', background: '#050e1a' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '10px', color: '#4ecdc4', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: '#4ecdc4' }} />Our Method
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '52px', fontWeight: '700', lineHeight: 1, letterSpacing: '-1px', color: '#fff', marginBottom: '16px' }}>How We Work</h2>
        <p style={{ fontSize: '14px', color: '#4a6070', lineHeight: '1.8', maxWidth: '560px', marginBottom: '60px' }}>A structured weekly rhythm combining live sessions, async content, and psychological development.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {[
            { day: 'SUN', events: [{ type: 'analysis', label: 'Premarket Analysis', desc: 'Full weekly outlook on major pairs' }] },
            { day: 'MON', events: [{ type: 'live', label: 'Market Open', desc: 'Live session 09:50 EST' }, { type: 'async', label: 'Pillar Drop', desc: 'New technical content' }] },
            { day: 'TUE', events: [{ type: 'async', label: 'Study & Practice', desc: 'Exercises & chat support' }] },
            { day: 'WED', events: [{ type: 'live', label: 'Price Action', desc: 'Live reading session' }, { type: 'analysis', label: 'Midweek Review', desc: 'Adjusted outlook' }] },
            { day: 'THU', events: [{ type: 'psych', label: 'Psychology', desc: 'Bi-weekly mindset session' }] },
            { day: 'FRI', events: [{ type: 'live', label: 'Trade Review', desc: 'Full week recap' }, { type: 'async', label: 'Quiz & Exercises', desc: 'Weekly assessment' }] },
            { day: 'SAT', events: [] },
          ].map(({ day, events }) => (
            <div key={day}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '9px', color: '#4a6070', letterSpacing: '0.12em', textAlign: 'center', marginBottom: '12px' }}>{day}</div>
              {events.length === 0
                ? <div style={{ fontSize: '10px', color: '#1a3040', textAlign: 'center', marginTop: '8px', fontStyle: 'italic' }}>Rest</div>
                : events.map(ev => (
                  <div key={ev.label} style={{
                    padding: '8px', marginBottom: '6px',
                    background: ev.type === 'live' ? 'rgba(255,74,106,0.06)' : ev.type === 'analysis' ? 'rgba(78,205,196,0.06)' : ev.type === 'psych' ? 'rgba(167,139,250,0.06)' : 'rgba(0,184,212,0.06)',
                    border: `0.5px solid ${ev.type === 'live' ? 'rgba(255,74,106,0.2)' : ev.type === 'analysis' ? 'rgba(78,205,196,0.15)' : ev.type === 'psych' ? 'rgba(167,139,250,0.2)' : 'rgba(0,184,212,0.2)'}`,
                  }}>
                    <div style={{ fontSize: '8px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px', color: ev.type === 'live' ? '#ff4a6a' : ev.type === 'analysis' ? '#4ecdc4' : ev.type === 'psych' ? '#a78bfa' : '#00b8d4' }}>{ev.type}</div>
                    <div style={{ fontSize: '10px', fontWeight: '500', color: '#f0f6ff', lineHeight: '1.3' }}>{ev.label}</div>
                    <div style={{ fontSize: '9px', color: '#4a6070', marginTop: '2px', lineHeight: '1.3' }}>{ev.desc}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
          {[['#ff4a6a', 'Live Session'], ['#4ecdc4', 'Analysis'], ['#a78bfa', 'Psychology'], ['#00b8d4', 'Study / Async']].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '10px', color: '#4a6070', fontFamily: 'Georgia, serif' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color }} />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '100px 80px', background: '#071828' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '10px', color: '#4ecdc4', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: '#4ecdc4' }} />Membership
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '52px', fontWeight: '700', lineHeight: 1, letterSpacing: '-1px', color: '#fff', marginBottom: '16px' }}>Choose Your Path</h2>
        <p style={{ fontSize: '14px', color: '#4a6070', lineHeight: '1.8', maxWidth: '560px', marginBottom: '60px' }}>Two paths. One destination. Both include full platform and Discord access.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px', maxWidth: '860px' }}>
          {/* Standard */}
          <div style={{ background: '#050e1a', border: '0.5px solid rgba(78,205,196,0.15)', padding: '36px', position: 'relative' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4ecdc4', marginBottom: '10px' }}>Standard</div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#fff', marginBottom: '6px' }}>Community Access</h3>
            <p style={{ fontSize: '13px', color: '#4a6070', marginBottom: '24px', lineHeight: '1.6' }}>Full platform access + Discord community. Learn at your own pace with all course content, trading journal, and the payout wall.</p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px' }}>
              {['Full platform access', 'Discord community', 'Trading journal', 'Course library', 'Payout wall', 'Market breakdowns', 'Q&A access'].map(item => (
                <li key={item} style={{ fontSize: '13px', color: '#7a9aaa', padding: '6px 0', borderBottom: '0.5px solid rgba(78,205,196,0.06)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#4ecdc4', fontSize: '12px' }}>✓</span>{item}
                </li>
              ))}
            </ul>
            <a href="/login" style={{
              display: 'block', textAlign: 'center', background: 'none',
              border: '1px solid rgba(78,205,196,0.4)', color: '#4ecdc4',
              fontFamily: 'Georgia, serif', fontSize: '11px', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '12px', textDecoration: 'none', transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#4ecdc4'; e.currentTarget.style.color = '#050e1a' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#4ecdc4' }}
            >Get Started</a>
          </div>

          {/* Premium */}
          <div style={{ background: '#050e1a', border: '1.5px solid #4ecdc4', padding: '36px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: '#4ecdc4', color: '#050e1a', fontFamily: 'Georgia, serif', fontSize: '9px', letterSpacing: '0.1em', fontWeight: '700', padding: '4px 16px', textTransform: 'uppercase' }}>Most Popular</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4ecdc4', marginBottom: '10px', marginTop: '12px' }}>Premium</div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#fff', marginBottom: '6px' }}>1-on-1 Mentorship</h3>
            <p style={{ fontSize: '13px', color: '#4a6070', marginBottom: '16px', lineHeight: '1.6' }}>Everything in Standard plus direct weekly 1-on-1 sessions with your mentor. Available in 3 or 6 month packages.</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {['3 Months', '6 Months'].map(opt => (
                <div key={opt} style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'rgba(78,205,196,0.08)', border: '0.5px solid rgba(78,205,196,0.3)', fontFamily: 'Georgia, serif', fontSize: '12px', color: '#4ecdc4' }}>{opt}</div>
              ))}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px' }}>
              {['Everything in Standard', 'Weekly 1-on-1 sessions', 'Personalised trading path', 'Direct mentor feedback', 'Custom strategy development', 'Priority support', 'Accountability tracking'].map(item => (
                <li key={item} style={{ fontSize: '13px', color: '#7a9aaa', padding: '6px 0', borderBottom: '0.5px solid rgba(78,205,196,0.06)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#4ecdc4', fontSize: '12px' }}>✓</span>{item}
                </li>
              ))}
            </ul>
            <a href="/login" style={{
              display: 'block', textAlign: 'center', background: '#4ecdc4',
              color: '#050e1a', fontFamily: 'Georgia, serif', fontSize: '11px',
              letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px',
              textDecoration: 'none', fontWeight: '700', transition: 'all 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#3ab8b0'}
              onMouseLeave={e => e.currentTarget.style.background = '#4ecdc4'}
            >Join Premium</a>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section id="proof" style={{ padding: '100px 80px', background: '#050e1a', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '10px', color: '#4ecdc4', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: '#4ecdc4' }} />Proof of Results<div style={{ width: '24px', height: '1px', background: '#4ecdc4' }} />
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '52px', fontWeight: '700', lineHeight: 1, letterSpacing: '-1px', color: '#fff', marginBottom: '16px' }}>Certified Payouts</h2>
        <p style={{ fontSize: '14px', color: '#4a6070', marginBottom: '60px' }}>Real results from real members. Every payout is verified.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '100px', marginBottom: '48px' }}>
          {[['$100K+', 'Total Certified Payouts'], ['8+', 'Years Experience'], ['4', 'Prop Firm Partners']].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '64px', fontWeight: '600', color: '#4ecdc4', lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a6070', marginTop: '8px' }}>{lbl}</div>
            </div>
          ))}
        </div>
        <a href="/login" style={{
          border: '1px solid rgba(78,205,196,0.4)', background: 'none', color: '#4ecdc4',
          fontFamily: 'Georgia, serif', fontSize: '11px', letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '14px 40px', textDecoration: 'none', transition: 'all 0.2s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(78,205,196,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >VIEW PAYOUT PROOF →</a>
      </section>

      {/* COMMUNITY */}
      <section id="community" style={{ padding: '100px 80px', background: '#071828', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '10px', color: '#4ecdc4', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: '#4ecdc4' }} />Community<div style={{ width: '24px', height: '1px', background: '#4ecdc4' }} />
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '52px', fontWeight: '700', lineHeight: 1, letterSpacing: '-1px', color: '#fff', marginBottom: '16px' }}>Follow Us</h2>
        <p style={{ fontSize: '14px', color: '#4a6070', marginBottom: '48px' }}>Real insights, real trades, real results.</p>
        <div style={{ display: 'flex', borderTop: '0.5px solid rgba(78,205,196,0.1)', borderLeft: '0.5px solid rgba(78,205,196,0.1)' }}>
          {[
            { name: 'YouTube', handle: '@FlowCapitalsTV', color: '#ff0000' },
            { name: 'Instagram', handle: '@flow.capitals', color: '#e1306c' },
            { name: 'TikTok', handle: '@flow_capitals', color: '#00f2ea' },
            { name: 'Telegram', handle: '@FLOWCAPITALS', color: '#0088cc' },
            { name: 'X / Twitter', handle: '@FlowCapitals01', color: '#1da1f2' },
          ].map(s => (
            <div key={s.name} style={{
              flex: 1, padding: '36px 20px', borderRight: '0.5px solid rgba(78,205,196,0.1)',
              borderBottom: '0.5px solid rgba(78,205,196,0.1)', cursor: 'pointer', transition: 'background 0.2s',
              position: 'relative', overflow: 'hidden'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(78,205,196,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#f0f6ff', marginBottom: '6px' }}>{s.name}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '11px', color: '#4a6070' }}>{s.handle}</div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: s.color, transform: 'scaleX(0)', transition: 'transform 0.25s', transformOrigin: 'left' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scaleX(1)'}
              />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '100px 80px', background: '#050e1a' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '10px', color: '#4ecdc4', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: '#4ecdc4' }} />Frequently Asked
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '52px', fontWeight: '700', lineHeight: 1, letterSpacing: '-1px', color: '#fff', marginBottom: '60px' }}>FAQ</h2>
        <div style={{ maxWidth: '760px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '0.5px solid rgba(78,205,196,0.1)' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 0', cursor: 'pointer', fontSize: '14px', color: faqOpen === i ? '#4ecdc4' : '#f0f6ff', transition: 'color 0.2s'
              }} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                {faq.q}
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#4ecdc4', transform: faqOpen === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.25s' }}>+</span>
              </div>
              {faqOpen === i && (
                <div style={{ padding: '0 0 20px', fontSize: '13px', color: '#4a6070', lineHeight: '1.7' }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#050e1a', borderTop: '0.5px solid rgba(78,205,196,0.1)', padding: '28px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: '700', letterSpacing: '1px' }}>
          FLOW <span style={{ color: '#4ecdc4' }}>CAPITALS</span>
        </div>
        <div style={{ fontSize: '11px', color: '#2a4050', maxWidth: '500px', textAlign: 'center', lineHeight: '1.5' }}>
          The content on this platform is for educational purposes only and does not constitute financial advice. Trading involves significant risk of capital loss.
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy Policy', 'Terms & Conditions'].map(link => (
            <a key={link} href="#" style={{ fontSize: '11px', color: '#4a6070', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#4ecdc4'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a6070'}
            >{link}</a>
          ))}
        </div>
      </footer>

    </div>
  )
}