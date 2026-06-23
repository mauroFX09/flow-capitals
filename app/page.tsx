'use client'
import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

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
  const [times, setTimes] = useState(CLOCKS.map(c => getTime(c.offset)))
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setTimes(CLOCKS.map(c => getTime(c.offset))), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ background: '#F5F2EC', fontFamily: 'var(--font-playfair)' }}>
      <Nav />

      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src="/18680290-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.8) 100%)' }} />

        {/* Clocks — desktop only */}
        {!isMobile && (
          <div style={{ position: 'absolute', left: '28px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 2 }}>
            {CLOCKS.map((c, i) => (
              <div key={c.city}>
                <div style={{ fontSize: '8px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', marginBottom: '1px', fontFamily: 'var(--font-inter)' }}>{c.city}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '15px', color: 'rgba(255,255,255,0.75)' }}>{times[i]}</div>
              </div>
            ))}
          </div>
        )}

        {/* Hero content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2, textAlign: 'center', padding: isMobile ? '0 24px' : '0 20px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isMobile && <div style={{ width: '32px', height: '0.5px', background: 'rgba(255,255,255,0.4)' }} />}
            Prestigious Trading Club · Est. 2025
            {!isMobile && <div style={{ width: '32px', height: '0.5px', background: 'rgba(255,255,255,0.4)' }} />}
          </div>

          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '72px' : '110px', fontWeight: '700', lineHeight: '0.9', letterSpacing: isMobile ? '-2px' : '-4px', margin: '0 0 6px', color: '#ffffff' }}>FLOW</h1>
          <div style={{ width: '120px', height: '3px', background: '#2B5EA7', margin: '0 auto 14px' }} />
          <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: isMobile ? '16px' : '20px', color: 'rgba(255,255,255,0.8)', letterSpacing: isMobile ? '3px' : '5px', margin: '0 0 28px' }}>Capitals.</p>

          <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: isMobile ? '16px' : '21px', color: '#ffffff', lineHeight: '1.6', maxWidth: '600px', margin: '0 0 8px' }}>
            &ldquo;Years of failure. Every euro saved. Every mistake made twice.
          </p>
          <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: isMobile ? '16px' : '21px', color: '#7aaee8', lineHeight: '1.6', maxWidth: '600px', margin: isMobile ? '0 0 32px' : '0 0 48px' }}>
            This is what it took to find the blueprint. Now it is yours.&rdquo;
          </p>

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '320px' : 'none' }}>
            <a href="/method" style={{ background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '15px 36px', textDecoration: 'none', fontWeight: '700', textAlign: 'center' as const }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
              onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
            >SEE THE ROADMAP →</a>
            <a href="/discovery" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.35)', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 32px', textDecoration: 'none', textAlign: 'center' as const }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >MY STORY</a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ position: 'absolute', bottom: isMobile ? '32px' : '48px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: isMobile ? '32px' : '80px', zIndex: 2, width: isMobile ? '100%' : 'auto', justifyContent: 'center', padding: isMobile ? '0 16px' : '0' }}>
          {[['$100K+', 'Certified Payouts'], ['25', 'Age of Founder'], ['3+', 'Years in Market']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '24px' : '34px', fontWeight: '600', color: '#ffffff', lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THREE PILLARS */}
      <section style={{ background: '#ffffff' }}>

        {/* I — The Blueprint */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', borderBottom: '0.5px solid rgba(26,26,26,0.08)' }}>
          <div style={{ padding: isMobile ? '48px 32px' : '80px', borderRight: isMobile ? 'none' : '0.5px solid rgba(26,26,26,0.08)', borderBottom: isMobile ? '0.5px solid rgba(26,26,26,0.08)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1e36', minHeight: isMobile ? '180px' : '360px', order: isMobile ? 0 : 0 }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '80px' : '120px', fontWeight: '700', color: 'rgba(122,174,232,0.15)', lineHeight: 1, letterSpacing: '-4px' }}>I</div>
              <div style={{ width: '40px', height: '2px', background: '#2B5EA7', margin: '0 auto' }} />
            </div>
          </div>
          <div style={{ padding: isMobile ? '40px 32px' : '80px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px' }}>The Foundation</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '44px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '16px' }}>The Blueprint.</h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: isMobile ? '14px' : '16px', color: '#6a6060', lineHeight: '1.8', marginBottom: '28px' }}>A 7-stage roadmap built from years of expensive trial and error and obsessive study. Not theory — a proven path that has been walked, tested, and refined in live markets. Every stage has a gate. You earn the right to move forward.</p>
            <a href="/method" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#2B5EA7', textDecoration: 'none', fontWeight: '600' }}>See the roadmap <span>→</span></a>
          </div>
        </div>

        {/* II — The Mentorship */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', borderBottom: '0.5px solid rgba(26,26,26,0.08)' }}>
          <div style={{ padding: isMobile ? '40px 32px' : '80px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', order: isMobile ? 1 : 0 }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px' }}>The Support</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '44px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '16px' }}>The Mentorship.</h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: isMobile ? '14px' : '16px', color: '#6a6060', lineHeight: '1.8', marginBottom: '28px' }}>Weekly live sessions, 1-on-1 calls, and direct feedback on your trades and journal. Three mentors who have walked this path. The support we never had when we started — now available to you every single week.</p>
            <a href="/membership" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#2B5EA7', textDecoration: 'none', fontWeight: '600' }}>View membership <span>→</span></a>
          </div>
          <div style={{ padding: isMobile ? '48px 32px' : '80px', borderLeft: isMobile ? 'none' : '0.5px solid rgba(26,26,26,0.08)', borderBottom: isMobile ? '0.5px solid rgba(26,26,26,0.08)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1e36', minHeight: isMobile ? '180px' : '360px', order: isMobile ? 0 : 1 }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '80px' : '120px', fontWeight: '700', color: 'rgba(122,174,232,0.15)', lineHeight: 1, letterSpacing: '-4px' }}>II</div>
              <div style={{ width: '40px', height: '2px', background: '#2B5EA7', margin: '0 auto' }} />
            </div>
          </div>
        </div>

        {/* III — The Proof */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
          <div style={{ padding: isMobile ? '48px 32px' : '80px', borderRight: isMobile ? 'none' : '0.5px solid rgba(26,26,26,0.08)', borderBottom: isMobile ? '0.5px solid rgba(26,26,26,0.08)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1e36', minHeight: isMobile ? '180px' : '360px' }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '80px' : '120px', fontWeight: '700', color: 'rgba(122,174,232,0.15)', lineHeight: 1, letterSpacing: '-4px' }}>III</div>
              <div style={{ width: '40px', height: '2px', background: '#2B5EA7', margin: '0 auto' }} />
            </div>
          </div>
          <div style={{ padding: isMobile ? '40px 32px' : '80px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px' }}>The Results</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '44px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '16px' }}>The Proof.</h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: isMobile ? '14px' : '16px', color: '#6a6060', lineHeight: '1.8', marginBottom: '28px' }}>$100K+ in certified payouts from real members. Posted publicly on the Trading Wall. We do not ask you to trust us — we show you the results. Every payout is real, every name is real, every number is verified.</p>
            <a href="/membership" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#2B5EA7', textDecoration: 'none', fontWeight: '600' }}>Join the community <span>→</span></a>
          </div>
        </div>

      </section>

      {/* QUOTE SECTION */}
      <section style={{ padding: isMobile ? '64px 24px' : '100px 80px', background: '#F5F2EC', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '0 auto 36px' }} />
          <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: isMobile ? '18px' : '28px', color: '#1a1a1a', lineHeight: '1.7', marginBottom: '28px' }}>
            &ldquo;Flow Capitals was born from years of expensive trial and error — every euro saved, every mistake made twice, every mentor who did not deliver. Every lesson here is battle-tested in live markets. This is the trading education I wish existed when I started.&rdquo;
          </p>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#2B5EA7' }}>— Founder, Flow Capitals · Age 25</div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? '48px 24px' : '80px', background: '#1a2a4a', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: isMobile ? '32px' : '0' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '26px' : '36px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>Ready to start your journey?</h2>
          <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>Explore the 7-stage roadmap or discover who we are.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
          <a href="/method" style={{ background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 32px', textDecoration: 'none', fontWeight: '700', textAlign: 'center' as const }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
            onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
          >Our Method →</a>
          <a href="/membership" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '13px 28px', textDecoration: 'none', textAlign: 'center' as const }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
          >View Membership</a>
        </div>
      </section>

      <Footer />
    </div>
  )
}