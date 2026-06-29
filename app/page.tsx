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

const STAGES = [
  { num: 'I', title: 'The Mindset', desc: 'Understanding why most traders fail before they start. Psychology, self-awareness, and building the right relationship with loss.' },
  { num: 'II', title: 'The Framework', desc: 'A structured system for reading the market. Entry rules, exit rules, and the exact conditions that must be met before you act.' },
  { num: 'III', title: 'Risk & Capital', desc: 'Position sizing, risk per trade, and protecting your account. The rules that keep you in the game long enough to win.' },
  { num: 'IV', title: 'Live Markets', desc: 'Your first live trades under mentorship. Execution, real-time feedback, and learning to manage emotions when money is on the line.' },
  { num: 'V', title: 'Consistency', desc: 'Building a repeatable routine. Trade logging, weekly reviews, and proving your edge over a meaningful sample of trades.' },
  { num: 'VI', title: 'Scaling Up', desc: 'Growing your position sizes and pursuing funded accounts. You scale when your track record earns the right — not before.' },
  { num: 'VII', title: 'Independence', desc: 'You no longer need to ask. You have the system, the data, and the discipline to trade on your own terms, at your own level.' },
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

function JournalMockup({ isMobile }: { isMobile: boolean }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tradelog' | 'analytics'>('overview')

  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Browser bar */}
      <div style={{ background: '#111827', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '4px 12px', marginLeft: '8px' }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>flowcapitals.be/dashboard/journal</span>
        </div>
      </div>

      <div style={{ display: 'flex', background: '#F5F2EC' }}>
        {/* Sidebar */}
        {!isMobile && (
          <div style={{ width: '170px', background: '#ffffff', borderRight: '1px solid rgba(0,0,0,0.06)', flexShrink: 0, padding: '16px 0' }}>
            <div style={{ padding: '0 16px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '20px', border: '1.5px solid #2B5EA7', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '7px', height: '7px', background: '#2B5EA7', borderRadius: '1px' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: '800', letterSpacing: '0.05em' }}>
                <span style={{ color: '#2B5EA7' }}>FLOW</span> <span style={{ color: '#1a1a1a' }}>CAPITALS</span>
              </span>
            </div>
            {[['Home', false], ['Journal', true], ['Courses', false], ['Wall', false]].map(([label, active]) => (
              <div key={String(label)} style={{ padding: '7px 16px', background: active ? 'rgba(43,94,167,0.08)' : 'transparent', borderLeft: active ? '2.5px solid #2B5EA7' : '2.5px solid transparent' }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: active ? '#2B5EA7' : '#8a8070', fontWeight: active ? '600' : '400' }}>{String(label)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Main */}
        <div style={{ flex: 1, padding: isMobile ? '16px' : '20px 24px', minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '18px' : '24px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Overview.</h3>
            {/* Tab switcher */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.06)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
              {([['overview', 'Overview'], ['tradelog', 'Trade Log'], ['analytics', 'Analytics']] as const).map(([tab, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '5px 10px', background: activeTab === tab ? '#ffffff' : 'transparent', border: 'none', borderRadius: '6px', fontFamily: 'var(--font-inter)', fontSize: '9px', fontWeight: activeTab === tab ? '700' : '400', color: activeTab === tab ? '#1a1a1a' : '#8a8070', cursor: 'pointer', boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s ease', whiteSpace: 'nowrap' as const }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '8px', marginBottom: '10px' }}>
                <div style={{ background: '#ffffff', borderRadius: '10px', padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '7px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Total Net P&L</div>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '14px' : '17px', fontWeight: '700', color: '#22c55e', marginBottom: '2px' }}>+2,856€</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: '#8a8070' }}>4 trades</div>
                </div>
                <div style={{ background: '#ffffff', borderRadius: '10px', padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="13" fill="none" stroke="#f0f0f0" strokeWidth="4"/><circle cx="17" cy="17" r="13" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="41 41" strokeLinecap="round" transform="rotate(-90 17 17)"/><circle cx="17" cy="17" r="13" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="41 41" strokeDashoffset="-41" strokeLinecap="round" transform="rotate(-90 17 17)"/><text x="17" y="21" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1a1a1a" fontFamily="serif">4</text></svg>
                  <div><div style={{ fontFamily: 'var(--font-inter)', fontSize: '7px', color: '#8a8070', marginBottom: '4px', letterSpacing: '0.1em' }}>TRADES</div><div style={{ display: 'flex', flexDirection: 'column' as const, gap: '2px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }}/><span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: '#3a3a3a' }}>2W</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444' }}/><span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: '#3a3a3a' }}>2L</span></div></div></div>
                </div>
                <div style={{ background: '#ffffff', borderRadius: '10px', padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="13" fill="none" stroke="#f0f0f0" strokeWidth="4"/><circle cx="17" cy="17" r="13" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="41 41" strokeLinecap="round" transform="rotate(-90 17 17)"/><circle cx="17" cy="17" r="13" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="41 41" strokeDashoffset="-41" strokeLinecap="round" transform="rotate(-90 17 17)"/><text x="17" y="21" textAnchor="middle" fontSize="7" fontWeight="700" fill="#1a1a1a" fontFamily="sans-serif">50%</text></svg>
                  <div><div style={{ fontFamily: 'var(--font-inter)', fontSize: '7px', color: '#8a8070', marginBottom: '4px', letterSpacing: '0.1em' }}>WIN RATE</div><div style={{ display: 'flex', flexDirection: 'column' as const, gap: '2px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }}/><span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: '#3a3a3a' }}>Win</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444' }}/><span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: '#3a3a3a' }}>Loss</span></div></div></div>
                </div>
                <div style={{ background: '#ffffff', borderRadius: '10px', padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="13" fill="none" stroke="#f0f0f0" strokeWidth="4"/><circle cx="17" cy="17" r="13" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="65 17" strokeLinecap="round" transform="rotate(-90 17 17)"/><text x="17" y="21" textAnchor="middle" fontSize="7" fontWeight="700" fill="#2B5EA7" fontFamily="sans-serif">3.13</text></svg>
                  <div><div style={{ fontFamily: 'var(--font-inter)', fontSize: '7px', color: '#8a8070', marginBottom: '4px', letterSpacing: '0.1em' }}>AVG WIN/LOSS</div><div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#22c55e', fontWeight: '700' }}>+2100€</div><div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#ef4444' }}>-672€</div></div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '3fr 2fr', gap: '8px' }}>
                <div style={{ background: '#ffffff', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '7px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '2px' }}>Cumulative P&L</div>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '15px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>+2,856€</div>
                  <svg width="100%" height="64" viewBox="0 0 280 64" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.18"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0"/></linearGradient></defs><path d="M0,58 C30,58 40,18 70,14 C100,10 115,28 145,22 C175,16 190,6 220,4 C250,2 265,8 280,6" fill="none" stroke="#22c55e" strokeWidth="1.8"/><path d="M0,58 C30,58 40,18 70,14 C100,10 115,28 145,22 C175,16 190,6 220,4 C250,2 265,8 280,6 L280,64 L0,64 Z" fill="url(#g)"/><text x="0" y="63" fontSize="7" fill="#8a8070" fontFamily="sans-serif">11 Jun</text><text x="115" y="63" fontSize="7" fill="#8a8070" fontFamily="sans-serif">17 Jun</text><text x="240" y="63" fontSize="7" fill="#8a8070" fontFamily="sans-serif">25 Jun</text></svg>
                </div>
                <div style={{ background: '#ffffff', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '7px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Recent Trades</div>
                  {[{ ab: 'NA', pair: 'NAS100', result: 'LOSS', pnl: '-344€', win: false }, { ab: 'EU', pair: 'EUR/USD', result: 'WIN', pnl: '+1200€', win: true }, { ab: 'US', pair: 'USD/JPY', result: 'LOSS', pnl: '-1000€', win: false }, { ab: 'GB', pair: 'GBP/USD', result: 'WIN', pnl: '+3000€', win: true }].map(t => (
                    <div key={t.pair} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(43,94,167,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontFamily: 'var(--font-inter)', fontSize: '7px', fontWeight: '700', color: '#2B5EA7' }}>{t.ab}</span></div>
                      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: '700', color: '#1a1a1a' }}>{t.pair}</div></div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', fontWeight: '700', color: t.win ? '#22c55e' : '#ef4444', background: t.win ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: '3px' }}>{t.result}</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: '700', color: t.win ? '#22c55e' : '#ef4444', minWidth: '44px', textAlign: 'right' as const }}>{t.pnl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TRADE LOG TAB */}
          {activeTab === 'tradelog' && (
            <div style={{ background: '#ffffff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '10px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>All Trades</span>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: '#8a8070' }}>4 total</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                    {['Date', 'Pair', 'Direction', 'Session', 'Result', 'P&L', 'R:R'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left' as const, fontFamily: 'var(--font-inter)', fontSize: '7px', color: '#8a8070', fontWeight: '400', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '25 Jun', pair: 'NAS100', dir: 'Short', session: 'NY KZ', result: 'LOSS', pnl: '-344€', rr: '—', win: false },
                    { date: '19 Jun', pair: 'GBP/USD', dir: 'Short', session: 'London KZ', result: 'WIN', pnl: '+390€', rr: '1:2.6', win: true },
                    { date: '16 Jun', pair: 'EUR/USD', dir: 'Long', session: 'NY KZ', result: 'WIN', pnl: '+210€', rr: '1:1.4', win: true },
                    { date: '11 Jun', pair: 'USD/CAD', dir: 'Short', session: 'London KZ', result: 'BE', pnl: '€0', rr: '—', win: false },
                  ].map(t => (
                    <tr key={t.date + t.pair} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.04)' }}>
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070' }}>{t.date}</td>
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: '700', color: '#1a1a1a' }}>{t.pair}</td>
                      <td style={{ padding: '9px 12px' }}><span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', fontWeight: '700', color: t.dir === 'Long' ? '#22c55e' : '#ef4444', background: t.dir === 'Long' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: '3px' }}>{t.dir === 'Long' ? '↑ Long' : '↓ Short'}</span></td>
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070' }}>{t.session}</td>
                      <td style={{ padding: '9px 12px' }}><span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', fontWeight: '700', color: t.win ? '#22c55e' : t.result === 'BE' ? '#94a3b8' : '#ef4444', background: t.win ? 'rgba(34,197,94,0.1)' : t.result === 'BE' ? 'rgba(148,163,184,0.1)' : 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: '3px' }}>{t.result}</span></td>
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: '700', color: t.win ? '#22c55e' : t.result === 'BE' ? '#94a3b8' : '#ef4444' }}>{t.pnl}</td>
                      <td style={{ padding: '9px 12px', fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070' }}>{t.rr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '8px' }}>
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '7px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>P&L by Session</div>
                {[['London KZ', 390, true], ['New York KZ', -344, false], ['Asia KZ', 480, true], ['Other', 150, true]].map(([label, val, pos]) => (
                  <div key={String(label)} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#3a3a3a' }}>{String(label)}</span>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', fontWeight: '700', color: pos ? '#22c55e' : '#ef4444' }}>{pos ? '+' : ''}{Number(val)}€</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.abs(Number(val)) / 5}%`, background: pos ? '#22c55e' : '#ef4444', borderRadius: '2px', maxWidth: '100%' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '7px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>Key Metrics</div>
                {[['Best trade', '+€480'], ['Worst trade', '-€344'], ['Avg R:R', '1:2.1'], ['Plan followed', '75%'], ['Most traded', 'EUR/USD'], ['Best session', 'London KZ']].map(([label, val]) => (
                  <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070' }}>{String(label)}</span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', fontWeight: '700', color: '#1a1a1a' }}>{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [times, setTimes] = useState(CLOCKS.map(() => ''))
  const [isMobile, setIsMobile] = useState(false)
  const [activeStage, setActiveStage] = useState<number | null>(null)

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

  const bg = 'linear-gradient(160deg, #eef3fb 0%, #f8faff 50%, #ffffff 100%)'

  return (
    <div style={{ background: '#ffffff', fontFamily: 'var(--font-playfair)' }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src="/18680290-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.8) 100%)' }} />
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
            <a href="/method" style={{ background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '15px 36px', textDecoration: 'none', fontWeight: '700', textAlign: 'center' as const, borderRadius: '4px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
              onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
            >See the Roadmap →</a>
            <a href="/discovery" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.35)', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 32px', textDecoration: 'none', textAlign: 'center' as const, borderRadius: '4px' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >My Story</a>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: isMobile ? '32px' : '48px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: isMobile ? '32px' : '80px', zIndex: 2, width: isMobile ? '100%' : 'auto', justifyContent: 'center', padding: isMobile ? '0 16px' : '0' }}>
          {[['$100K+', 'Certified Payouts'], ['25', 'Age of Founder'], ['3+', 'Years in Market']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '24px' : '34px', fontWeight: '600', color: '#ffffff', lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 1: What Flow Capitals does ── */}
      <section style={{ background: bg }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', minHeight: isMobile ? 'auto' : '600px' }}>
          <div style={{ background: '#0d1929', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isMobile ? '260px' : '600px', position: 'relative', overflow: 'hidden', order: isMobile ? -1 : 0 }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ width: '56px', height: '56px', border: '1.5px solid rgba(122,174,232,0.25)', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', color: 'rgba(122,174,232,0.35)' }}>M</div>
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase' as const }}>Photo coming July</div>
            </div>
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.95)', borderRadius: '10px', padding: '10px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', letterSpacing: '0.1em', color: '#8a8070', textTransform: 'uppercase' as const, marginBottom: '2px' }}>Founder · Age 25</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: '700', color: '#1a1a1a' }}>Real-time Insights</div>
            </div>
          </div>
          <div style={{ padding: isMobile ? '48px 24px' : '80px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '44px', fontWeight: '700', color: '#0d1929', lineHeight: 1.1, marginBottom: '24px' }}>
              What <span style={{ color: '#2B5EA7' }}>Flow Capitals</span> does.
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: '#3a3a3a', lineHeight: '1.8', marginBottom: '16px' }}>
              Flow Capitals is built by a <strong>trader who spent years failing, studying, and refining</strong> — until a repeatable system emerged. Now that system is yours.
            </p>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: '#6a6a7a', lineHeight: '1.8', marginBottom: '12px' }}>
              You learn to trade <strong style={{ color: '#0d1929' }}>beyond the chart</strong>.<br />Not just what you see — but how you deal with it.
            </p>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: '#6a6a7a', lineHeight: '1.8', marginBottom: '28px' }}>
              <strong style={{ color: '#0d1929' }}>Behaviour, discipline</strong> and <strong style={{ color: '#0d1929' }}>mental sharpness</strong> are not extras. They are the foundation.
            </p>
            <div style={{ borderLeft: '3px solid #2B5EA7', paddingLeft: '20px' }}>
              <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '16px', fontWeight: '600', color: '#0d1929', lineHeight: '1.7', margin: 0 }}>
                &ldquo;The blueprint I wish existed when I started. Now it is yours.&rdquo;
              </p>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#8a8a9a', marginTop: '8px', letterSpacing: '0.08em' }}>— Mauro, Founder of Flow Capitals</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: What's inside ── */}
      <section style={{ background: bg, padding: isMobile ? '0 24px 64px' : '0 48px 80px' }}>
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: isMobile ? '40px 28px' : '64px', boxShadow: '0 2px 40px rgba(43,94,167,0.06)' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '28px' : '40px', fontWeight: '700', color: '#0d1929', marginBottom: '8px' }}>
            What&rsquo;s inside a<br />
            <span style={{ color: '#2B5EA7' }}>Flow Capitals membership</span>
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isMobile ? '36px' : '48px' }}>
            <div style={{ width: '32px', height: '2px', background: '#2B5EA7' }} />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#6a6a7a', fontStyle: 'italic' }}>Everything you need. Nothing you don&rsquo;t.</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '40px' : '48px', marginBottom: '48px' }}>
            {[
              { num: '01', label: 'LIVE', items: [['Weekly', 'live trading sessions'], ['Analysis', 'with your mentors'], ['Sunday', 'market preparation call']] },
              { num: '02', label: 'MENTORSHIP', items: [['Discipline', 'and mindset coaching'], ['Feedback', 'on every trade you log'], ['Decisions', 'made under real pressure']] },
              { num: '03', label: 'COMMUNITY', items: [['Active', 'traders community'], ['Focus', 'on personal growth'], ['Network', 'that pushes you forward']] },
            ].map(col => (
              <div key={col.num}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '24px' }}>
                  <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '40px', fontWeight: '700', color: '#2B5EA7', lineHeight: 1 }}>{col.num}</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.14em', color: '#8a8a9a', textTransform: 'uppercase' as const }}>{col.label}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
                  {col.items.map(([bold, rest]) => (
                    <div key={bold} style={{ borderLeft: '2px solid #2B5EA7', paddingLeft: '14px' }}>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: '700', color: '#2B5EA7' }}>{bold}</span>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: '#3a3a4a' }}> {rest}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: isMobile ? '15px' : '17px', color: '#0d1929' }}>
            Learning to think and act like a <span style={{ color: '#2B5EA7', fontWeight: '700' }}>professional trader.</span>
          </p>
        </div>
      </section>

      {/* ── SECTION 3: Not for people who ── */}
      <section style={{ background: bg, padding: isMobile ? '64px 24px' : '80px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '48px' : '80px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '46px', fontWeight: '700', color: '#0d1929', lineHeight: 1.2, marginBottom: '4px' }}>This is not for people who</h2>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '46px', fontWeight: '700', textDecoration: 'line-through', color: 'rgba(13,25,41,0.22)', lineHeight: 1.3 }}>shortcuts</span>
              {'  '}
              <span style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '46px', fontWeight: '700', textDecoration: 'line-through', color: 'rgba(13,25,41,0.18)', lineHeight: 1.3 }}>excuses</span>
            </div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '46px', fontWeight: '700', color: 'rgba(13,25,41,0.18)', textDecoration: 'line-through', lineHeight: 1.3, marginBottom: '8px' }}>overnight wins</div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '28px' : '40px', fontWeight: '700', color: '#0d1929', lineHeight: 1.3, marginBottom: '36px' }}>
              seek. But for those who take <span style={{ color: '#2B5EA7' }}>full responsibility.</span>
            </div>
            <div style={{ display: 'flex', gap: isMobile ? '24px' : '40px', flexWrap: 'wrap' as const }}>
              {[['Timing', 'Knowing when'], ['Risk', 'Deploying it wisely'], ['Patience', 'Waiting for the setup'], ['Discipline', 'Staying in control']].map(([title, sub]) => (
                <div key={title}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: '700', color: '#0d1929', marginBottom: '2px' }}>{title}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#8a8a9a' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 40px rgba(43,94,167,0.1)' }}>
            <div style={{ background: '#0d1929', height: isMobile ? '160px' : '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase' as const }}>Photo coming July 2026</div>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(43,94,167,0.9)', borderRadius: '8px', padding: '6px 12px' }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.06em' }}>● FLOW CAPITALS</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '24px', gap: '8px' }}>
              {[['$100K+', 'Certified payouts'], ['25', 'Age of founder'], ['3+', 'Years active']].map(([val, lbl]) => (
                <div key={lbl} style={{ textAlign: 'center' as const, padding: '12px 0' }}>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#0d1929', lineHeight: 1, marginBottom: '4px' }}>{val}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#8a8a9a' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Software to analyse data & build a track record ── */}
      <section style={{ background: '#0d1929', padding: isMobile ? '64px 24px' : '80px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2B5EA7' }} />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.14em', color: '#2B5EA7', textTransform: 'uppercase' as const }}>Flow Capitals Platform</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '64px', alignItems: 'center', marginBottom: '48px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '28px' : '40px', fontWeight: '700', color: '#ffffff', lineHeight: 1.2, marginBottom: '16px' }}>
                We built our own software to analyse your data and build your track record.
              </h2>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', marginBottom: '24px' }}>
                Log every trade. Review your behaviour. Track your P&L over time. Based on your own data — you see exactly what works, what doesn&rsquo;t, and where your edge actually lives.
              </p>
              <a href="/membership" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#7aaee8', textDecoration: 'none' }}>
                See what&rsquo;s included →
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
              {[
                ['📊', 'Log every trade', 'Record your entry, exit, emotion and session — so nothing gets forgotten.'],
                ['🔍', 'Analyse your behaviour', 'Spot patterns. Understand when you win, when you lose, and why.'],
                ['📁', 'Build your track record', 'Export a professional, branded track record PDF at any time.'],
              ].map(([icon, title, desc]) => (
                <div key={String(title)} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(43,94,167,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>{title}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.6' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <JournalMockup isMobile={isMobile} />
        </div>
      </section>

      {/* ── SECTION 5: The 7-Stage Blueprint ── */}
      <section style={{ background: bg, padding: isMobile ? '64px 24px' : '80px 48px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.16em', color: '#8a8a9a', textTransform: 'uppercase' as const, marginBottom: '16px', textAlign: 'center' as const }}>The Roadmap</div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '48px', fontWeight: '700', color: '#0d1929', lineHeight: 1.15, marginBottom: '12px', textAlign: 'center' as const }}>
            A 7-stage blueprint.<br />
            <span style={{ color: '#2B5EA7' }}>Built from real experience.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: '#6a6a7a', lineHeight: '1.8', maxWidth: '480px', margin: '0 auto 56px', textAlign: 'center' as const }}>
            Not theory. A proven path walked, tested, and refined in live markets.<br />Click any stage to see what&rsquo;s inside.
          </p>

          {/* Stages */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(7, 1fr)', gap: isMobile ? '12px' : '8px', marginBottom: '24px' }}>
            {STAGES.map((stage, i) => (
              <div key={stage.num} style={{ textAlign: 'center' as const, position: 'relative' as const }}>
                <button
                  onClick={() => setActiveStage(activeStage === i ? null : i)}
                  style={{
                    width: isMobile ? '44px' : '48px', height: isMobile ? '44px' : '48px', borderRadius: '50%',
                    border: `2px solid ${activeStage === i ? '#2B5EA7' : 'rgba(43,94,167,0.3)'}`,
                    background: activeStage === i ? '#2B5EA7' : 'transparent',
                    margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    boxShadow: activeStage === i ? '0 4px 16px rgba(43,94,167,0.35)' : 'none',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '10px' : '12px', fontWeight: '700', color: activeStage === i ? '#ffffff' : '#2B5EA7' }}>{stage.num}</span>
                </button>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: isMobile ? '9px' : '10px', color: activeStage === i ? '#0d1929' : '#8a8a9a', fontWeight: activeStage === i ? '700' : '400', lineHeight: '1.3' }}>{stage.title}</div>
              </div>
            ))}
          </div>

          {/* Stage popup */}
          {activeStage !== null && (
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: isMobile ? '24px' : '32px', boxShadow: '0 8px 40px rgba(43,94,167,0.12)', border: '1px solid rgba(43,94,167,0.1)', marginBottom: '32px', position: 'relative' as const, transition: 'all 0.2s ease' }}>
              <button onClick={() => setActiveStage(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#8a8a9a', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>✕</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2B5EA7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>{STAGES[activeStage].num}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#2B5EA7', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '2px' }}>Stage {activeStage + 1} of 7</div>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '18px', fontWeight: '700', color: '#0d1929' }}>{STAGES[activeStage].title}</div>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: '#6a6a7a', lineHeight: '1.8', margin: 0 }}>{STAGES[activeStage].desc}</p>
            </div>
          )}

          <div style={{ textAlign: 'center' as const }}>
            <a href="/method" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '14px 32px', textDecoration: 'none', borderRadius: '8px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
              onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
            >Explore the full roadmap →</a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#0d1929', padding: isMobile ? '64px 24px' : '80px 80px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: isMobile ? '36px' : '0' }}>
        <div style={{ maxWidth: '520px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '28px' : '38px', fontWeight: '700', color: '#ffffff', lineHeight: 1.2, marginBottom: '12px' }}>We have nothing to prove.</h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7' }}>
            The results speak. The community is active. The method is proven.<br />The only question is whether you&rsquo;re ready.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
          <a href="/method" style={{ background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '15px 36px', textDecoration: 'none', fontWeight: '700', textAlign: 'center' as const, borderRadius: '8px' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
            onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
          >Our Method →</a>
          <a href="/membership" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 32px', textDecoration: 'none', textAlign: 'center' as const, borderRadius: '8px' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
          >View Membership</a>
        </div>
      </section>

      <Footer />
    </div>
  )
}