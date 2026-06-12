'use client'
import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'

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

  useEffect(() => {
    const interval = setInterval(() => setTimes(CLOCKS.map(c => getTime(c.offset))), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ background: '#F5F2EC', fontFamily: 'Georgia, serif' }}>
      <Nav />

      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src="/18680290-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.8) 100%)' }} />

        {/* Clocks */}
        <div style={{ position: 'absolute', left: '28px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 2 }}>
          {CLOCKS.map((c, i) => (
            <div key={c.city}>
              <div style={{ fontSize: '8px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', marginBottom: '1px', fontFamily: 'Arial, sans-serif' }}>{c.city}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: 'rgba(255,255,255,0.75)' }}>{times[i]}</div>
            </div>
          ))}
        </div>

        {/* Hero content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2, textAlign: 'center', padding: '0 20px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '32px', height: '0.5px', background: 'rgba(255,255,255,0.4)' }} />
            Prestigious Trading Club · Est. 2025
            <div style={{ width: '32px', height: '0.5px', background: 'rgba(255,255,255,0.4)' }} />
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '110px', fontWeight: '700', lineHeight: '0.9', letterSpacing: '-4px', margin: '0 0 6px', color: '#ffffff' }}>FLOW</h1>
          <div style={{ width: '180px', height: '3px', background: '#2B5EA7', margin: '0 auto 14px' }} />
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '20px', color: 'rgba(255,255,255,0.8)', letterSpacing: '5px', margin: '0 0 36px' }}>Capitals.</p>

          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '21px', color: '#ffffff', lineHeight: '1.6', maxWidth: '600px', margin: '0 0 10px' }}>
            &ldquo;Years of failure. Every euro saved. Every mistake made twice.
          </p>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '21px', color: '#7aaee8', lineHeight: '1.6', maxWidth: '600px', margin: '0 0 48px' }}>
            This is what it took to find the blueprint. Now it is yours.&rdquo;
          </p>

          <div style={{ display: 'flex', gap: '14px' }}>
            <a href="/method" style={{ background: '#2B5EA7', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '15px 36px', textDecoration: 'none', fontWeight: '700', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
              onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
            >SEE THE ROADMAP →</a>
            <a href="/discovery" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.35)', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 32px', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >MY STORY</a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '80px', zIndex: 2 }}>
          {[['$100K+', 'Certified Payouts'], ['25', 'Age of Founder'], ['3+', 'Years in the Market']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '34px', fontWeight: '600', color: '#ffffff', lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INTRO STRIP */}
      <section style={{ padding: '80px', background: '#ffffff', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0', borderBottom: '0.5px solid rgba(26,26,26,0.08)' }}>
        {[
  { num: 'I', title: 'The Blueprint', desc: 'A 7-stage roadmap built from years of expensive trial and error and obsessive study. The path that actually works.' },
  { num: 'II', title: 'The Mentorship', desc: 'Weekly live sessions, 1-on-1 calls, and direct feedback on your trades and journal. The support I never had when I started.' },
  { num: 'III', title: 'The Proof', desc: '$100K+ in certified payouts from real members. Posted publicly on the Trading Wall. We do not ask you to trust us — we show you the results.' },
].map((item, i) => (
  <div key={item.title} style={{ padding: '44px 48px', borderRight: i < 2 ? '0.5px solid rgba(26,26,26,0.08)' : 'none', position: 'relative', overflow: 'hidden' }}>
    <div style={{ fontFamily: 'Georgia, serif', fontSize: '88px', fontWeight: '700', color: 'rgba(43,94,167,0.06)', lineHeight: 1, position: 'absolute', top: '16px', right: '24px', letterSpacing: '-2px', userSelect: 'none' as const }}>{item.num}</div>
    <div style={{ width: '28px', height: '2px', background: '#2B5EA7', marginBottom: '20px' }} />
    <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>{item.title}</div>
    <div style={{ fontFamily: 'Georgia, serif', fontSize: '14px', color: '#8a8070', lineHeight: '1.75' }}>{item.desc}</div>
  </div>
))}
      </section>

      {/* QUOTE SECTION */}
      <section style={{ padding: '100px 80px', background: '#F5F2EC', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '0 auto 36px' }} />
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '28px', color: '#1a1a1a', lineHeight: '1.6', marginBottom: '28px' }}>
            &ldquo;Flow Capitals was born from years of expensive trial and error — every euro saved, every mistake made twice, every mentor who did not deliver. Every lesson here is battle-tested in live markets. This is the trading education I wish existed when I started.&rdquo;
          </p>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#2B5EA7' }}>— Founder, Flow Capitals · Age 25</div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px', background: '#1a2a4a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>Ready to start your journey?</h2>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>Explore the 7-stage roadmap or discover who we are.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/method" style={{ background: '#2B5EA7', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 32px', textDecoration: 'none', fontWeight: '700', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
            onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
          >Our Method →</a>
          <a href="/membership" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '13px 28px', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
          >View Membership</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1a1a1a', padding: '36px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', color: '#ffffff' }}>FLOW <span style={{ color: '#7aaee8' }}>CAPITALS</span></div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', maxWidth: '500px', textAlign: 'center', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>Educational purposes only. Does not constitute financial advice. Trading involves significant risk.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy Policy', 'Terms & Conditions'].map(link => (
            <a key={link} href="#" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontFamily: 'Arial, sans-serif' }}>{link}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}