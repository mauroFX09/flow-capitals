'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'

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
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: c.label, marginBottom: '5px' }}>{item.type === 'rest' ? 'Rest' : item.type === 'personal' ? '1-on-1' : item.type}</div>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px', lineHeight: '1.3' }}>{item.label}</div>
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#8a8070', lineHeight: '1.4' }}>{item.desc}</div>
    </div>
  )
}

export default function Method() {
  const [activeStage, setActiveStage] = useState(0)
  const [scheduleTab, setScheduleTab] = useState<'standard' | 'premium'>('standard')

  return (
    <div style={{ background: '#F5F2EC', fontFamily: 'Georgia, serif', paddingTop: '88px' }}>
      <Nav />

      {/* PAGE HEADER */}
      <section style={{ padding: '80px 80px 60px', background: '#ffffff', borderBottom: '0.5px solid rgba(26,26,26,0.08)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />Our Method
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '64px', fontWeight: '700', lineHeight: '1', letterSpacing: '-2px', color: '#1a1a1a', marginBottom: '0', maxWidth: '700px' }}>
            The blueprint.<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>Step by step.</span>
          </h1>
          <div style={{ width: '60px', height: '3px', background: '#2B5EA7', margin: '28px 0 0' }} />
        </div>
      </section>

      {/* ROADMAP */}
      <section style={{ padding: '80px', background: '#F5F2EC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>7-Stage Roadmap</h2>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '15px', color: '#8a8070', marginBottom: '40px' }}>From knowing nothing to scaling funded accounts. No guessing. No wasted money.</p>

          {/* Stage tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(26,26,26,0.1)', marginBottom: '0' }}>
            {ROADMAP.map((stage, i) => (
              <button key={i} onClick={() => setActiveStage(i)} style={{ flex: 1, padding: '14px 6px', background: 'none', border: 'none', borderBottom: activeStage === i ? '2px solid #2B5EA7' : '2px solid transparent', color: activeStage === i ? '#2B5EA7' : '#8a8070', fontFamily: 'Arial, sans-serif', fontSize: '10px', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-1px', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                <div style={{ fontSize: '9px', marginBottom: '3px', opacity: 0.5 }}>{stage.num}</div>
                <div>{stage.title.split(' ')[0]}</div>
              </button>
            ))}
          </div>

          <div style={{ background: '#ffffff', padding: '56px', border: '0.5px solid rgba(26,26,26,0.08)', borderTop: 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '72px', alignItems: 'start' }}>
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '96px', fontWeight: '700', color: 'rgba(43,94,167,0.07)', lineHeight: 1 }}>{ROADMAP[activeStage].num}</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: '-12px 0 8px', lineHeight: '1.2' }}>{ROADMAP[activeStage].title}</h3>
                <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '14px', color: '#2B5EA7', margin: '0 0 28px' }}>{ROADMAP[activeStage].sub}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginBottom: '28px' }}>
                  {ROADMAP.map((_, i) => (
                    <div key={i} onClick={() => setActiveStage(i)} style={{ width: '26px', height: '3px', background: i === activeStage ? '#2B5EA7' : 'rgba(43,94,167,0.15)', cursor: 'pointer', borderRadius: '2px', transition: 'background 0.2s' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setActiveStage(Math.max(0, activeStage - 1))} style={{ background: 'none', border: '1px solid rgba(26,26,26,0.15)', color: '#8a8070', fontFamily: 'Arial, sans-serif', fontSize: '11px', padding: '8px 18px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#2B5EA7'; e.currentTarget.style.color = '#2B5EA7' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,26,26,0.15)'; e.currentTarget.style.color = '#8a8070' }}
                  >← Prev</button>
                  <button onClick={() => setActiveStage(Math.min(6, activeStage + 1))} style={{ background: activeStage === 6 ? 'none' : '#2B5EA7', border: `1px solid ${activeStage === 6 ? 'rgba(26,26,26,0.15)' : '#2B5EA7'}`, color: activeStage === 6 ? '#8a8070' : '#fff', fontFamily: 'Arial, sans-serif', fontSize: '11px', padding: '8px 18px', cursor: 'pointer', fontWeight: '600' }}>
                    {activeStage === 6 ? 'Complete ✓' : 'Next →'}
                  </button>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {ROADMAP[activeStage].points.map((point, i) => {
                  const isPremium = point.startsWith('Premium:')
                  return (
                    <li key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '14px 0', borderBottom: '0.5px solid rgba(26,26,26,0.06)' }}>
                      <div style={{ width: '6px', height: '6px', background: isPremium ? '#7aaee8' : '#2B5EA7', borderRadius: '50%', flexShrink: 0, marginTop: '8px' }} />
                      <span style={{ fontSize: '15px', color: isPremium ? '#2B5EA7' : '#3a3530', lineHeight: '1.65', fontFamily: 'Georgia, serif', fontStyle: isPremium ? 'italic' : 'normal', fontWeight: isPremium ? '500' : '400' }}>{point}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WEEKLY SCHEDULE */}
      <section style={{ padding: '80px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Weekly Schedule</h2>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '15px', color: '#8a8070', marginBottom: '36px' }}>Standard members get 2 live sessions per week. Premium members get 4–5 live sessions plus a personal 1-on-1 call every week.</p>

          {/* Schedule toggle */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '32px', border: '1px solid rgba(26,26,26,0.1)', width: 'fit-content' }}>
            {(['standard', 'premium'] as const).map(tab => (
              <button key={tab} onClick={() => setScheduleTab(tab)} style={{ padding: '12px 32px', background: scheduleTab === tab ? '#2B5EA7' : 'none', border: 'none', color: scheduleTab === tab ? '#ffffff' : '#8a8070', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.2s', fontWeight: scheduleTab === tab ? '600' : '400' }}>
                {tab === 'standard' ? 'Standard' : 'Premium'}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
            {(scheduleTab === 'standard' ? STANDARD_SCHEDULE : PREMIUM_SCHEDULE).map(item => (
              <div key={item.day}>
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#8a8070', letterSpacing: '0.12em', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase' as const }}>{item.day}</div>
                <ScheduleCard item={item} />
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' as const }}>
            {[
              { color: '#2B5EA7', label: 'Live Session' },
              { color: '#7850b4', label: 'Psychology' },
              { color: '#b47800', label: '1-on-1 Personal' },
              { color: '#8a8070', label: 'Study / Async' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#8a8070' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                {label}
              </div>
            ))}
          </div>

          {/* Premium note */}
          {scheduleTab === 'premium' && (
            <div style={{ marginTop: '28px', padding: '20px 24px', background: 'rgba(43,94,167,0.04)', border: '0.5px solid rgba(43,94,167,0.15)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '6px', height: '6px', background: '#2B5EA7', borderRadius: '50%', flexShrink: 0, marginTop: '6px' }} />
              <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '14px', color: '#2B5EA7', margin: 0, lineHeight: '1.6' }}>
                The Friday 1-on-1 call is flexible and scheduled around your availability. This is your dedicated weekly session — your trades, your journal, your specific questions answered directly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section style={{ padding: '80px', background: '#F5F2EC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />The Philosophy
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '700', color: '#1a1a1a', marginBottom: '0', lineHeight: '1.1', letterSpacing: '-1px' }}>
              Slow down to<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>go faster.</span>
            </h2>
            <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px 0' }} />
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#3a3530', lineHeight: '1.85', marginBottom: '18px' }}>Every mistake I made — losing my entire account, paying €15K for the wrong education, moving to live capital too soon — happened because I rushed.</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#3a3530', lineHeight: '1.85', marginBottom: '18px' }}>The Flow Capitals method is built on the opposite principle. Each stage has a gate. You do not move forward until your data proves you are ready. Not your feelings — your data.</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#3a3530', lineHeight: '1.85' }}>This is how you build a trading career that lasts. Not a winning streak — a career.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
            {[
              { num: '01', title: 'Data over feelings', desc: 'Every decision is based on your journal data, your backtest results, your real performance — never on how you feel about a trade.' },
              { num: '02', title: 'Gates between stages', desc: 'You earn the right to move to the next stage. No rushing, no skipping. Each gate protects your capital and your psychology.' },
              { num: '03', title: 'Psychology first', desc: 'The strategy is the easy part. The hard part is executing it under pressure. We spend as much time on the mind as on the chart.' },
              { num: '04', title: 'Personalised path', desc: 'Your trading plan is built around your life — your schedule, your personality, your risk tolerance. Not a one-size-fits-all system.' },
            ].map(item => (
              <div key={item.num} style={{ display: 'flex', gap: '20px', padding: '20px 24px', background: '#ffffff', border: '0.5px solid rgba(26,26,26,0.08)' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '700', color: 'rgba(43,94,167,0.15)', flexShrink: 0, lineHeight: 1, paddingTop: '2px' }}>{item.num}</div>
                <div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#8a8070', lineHeight: '1.6' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px', background: '#1a2a4a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>Ready to follow the blueprint?</h2>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>Choose your membership and start your journey today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/membership" style={{ background: '#2B5EA7', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 32px', textDecoration: 'none', fontWeight: '700', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
            onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
          >View Membership →</a>
          <a href="/discovery" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '13px 28px', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
          >Our Story</a>
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