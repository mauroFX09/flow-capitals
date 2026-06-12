'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'

export default function Membership() {
  const [premiumPeriod, setPremiumPeriod] = useState<'3' | '6'>('3')
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  return (
    <div style={{ background: '#F5F2EC', fontFamily: 'Georgia, serif', paddingTop: '88px' }}>
      <Nav />

      {/* PAGE HEADER */}
      <section style={{ padding: '80px 80px 60px', background: '#ffffff', borderBottom: '0.5px solid rgba(26,26,26,0.08)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />Membership
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '64px', fontWeight: '700', lineHeight: '1', letterSpacing: '-2px', color: '#1a1a1a', marginBottom: '0', maxWidth: '700px' }}>
            Choose your path.<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>Start your journey.</span>
          </h1>
          <div style={{ width: '60px', height: '3px', background: '#2B5EA7', margin: '28px 0 16px' }} />
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '16px', color: '#8a8070', maxWidth: '560px', lineHeight: '1.7' }}>
            Two paths. One destination. The blueprint that cost years of failure and every euro I had — yours from day one.
          </p>
        </div>
      </section>

      {/* PLANS */}
      <section style={{ padding: '80px', background: '#F5F2EC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

            {/* STANDARD */}
            <div style={{ background: '#ffffff', border: '1px solid rgba(26,26,26,0.08)', padding: '52px' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#8a8070', marginBottom: '14px' }}>Standard</div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px', letterSpacing: '-0.5px' }}>Community Access</h2>
              <div style={{ width: '32px', height: '2px', background: '#2B5EA7', margin: '20px 0 24px' }} />
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#6a6060', marginBottom: '12px', lineHeight: '1.8' }}>
                The complete platform — course library, trading journal, weekly live sessions, market breakdowns, and the Discord community. Everything you need to follow the blueprint at your own pace.
              </p>
              <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '14px', color: '#8a8070', marginBottom: '36px', lineHeight: '1.7' }}>
                2 live sessions per week — Sunday market breakdown and Tuesday live reading.
              </p>

              <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  ['Full platform & course library', 'Every technical pillar, psychology module, tape reading session and market breakdown.'],
                  ['Discord community', 'A serious community of traders following the same blueprint. Ask questions, share progress, stay accountable.'],
                  ['Trading journal', 'Log every trade. Track your emotions, your performance, your growth. The data that builds your edge.'],
                  ['Sunday market breakdown', 'Weekly live analysis of Gold, Nasdaq, EUR/USD, GBP/USD and DXY before the week opens.'],
                  ['Tuesday live reading', 'Mid-week live price action session — key levels, structure, and setups for the days ahead.'],
                ].map(([title, desc]) => (
                  <div key={title} style={{ paddingBottom: '14px', borderBottom: '0.5px solid rgba(26,26,26,0.06)' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div style={{ width: '5px', height: '5px', background: '#2B5EA7', borderRadius: '50%', flexShrink: 0, marginTop: '8px' }} />
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>{title}</div>
                    </div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#8a8070', lineHeight: '1.6', paddingLeft: '15px' }}>{desc}</div>
                  </div>
                ))}
              </div>

              <a href="/contact" style={{ display: 'block', textAlign: 'center', background: 'none', border: '1.5px solid #2B5EA7', color: '#2B5EA7', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '16px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: '600' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2B5EA7'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#2B5EA7' }}
              >Get Started — Contact Us</a>
            </div>

            {/* PREMIUM */}
            <div style={{ background: '#0d1e36', border: '1px solid #2B5EA7', padding: '52px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: '#2B5EA7', color: '#fff', fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', fontWeight: '700', padding: '5px 20px', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const }}>Direct Access</div>

              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#7aaee8', marginBottom: '14px', marginTop: '12px' }}>Premium</div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.5px' }}>Personal Guidance</h2>
              <div style={{ width: '32px', height: '2px', background: '#2B5EA7', margin: '20px 0 24px' }} />

              <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', lineHeight: '1.8' }}>
                Everything in Standard — plus something that cannot be replicated by any course or recording. Direct, personal access to someone who has done this, who is still doing this, and who is choosing to invest their time in you specifically.
              </p>
              <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '15px', color: '#7aaee8', marginBottom: '36px', lineHeight: '1.7' }}>
                &ldquo;My time is the most valuable thing I can give you. Premium is the decision to use it on your journey.&rdquo;
              </p>

              {/* Period toggle */}
              <div style={{ marginBottom: '36px' }}>
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#7aaee8', letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>Commitment period</div>
                <div style={{ display: 'flex', gap: '0', border: '1px solid rgba(255,255,255,0.1)', width: 'fit-content', marginBottom: '12px' }}>
                  {(['3', '6'] as const).map(p => (
                    <button key={p} onClick={() => setPremiumPeriod(p)} style={{ padding: '12px 36px', background: premiumPeriod === p ? '#2B5EA7' : 'none', border: 'none', color: premiumPeriod === p ? '#ffffff' : 'rgba(255,255,255,0.35)', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s', fontWeight: premiumPeriod === p ? '600' : '400' }}>
                      {p} Months
                    </button>
                  ))}
                </div>
                <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.3)', lineHeight: '1.6' }}>
                  {premiumPeriod === '6'
                    ? 'Six months allows for deeper transformation. Most breakthroughs happen between month 3 and month 6.'
                    : 'Three months of focused, intensive guidance. Enough time to build a real foundation and reach your first milestones.'}
                </p>
              </div>

              <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  ['4–5 live sessions per week', 'Sunday through Thursday — daily live sessions that go deeper than Standard. You are in the room where it happens, every day.'],
                  ['Your personal weekly call', 'Every Friday, one call. Just you and your mentor. Your trades reviewed, your journal analysed, your questions answered. No distractions, no group — just your growth.'],
                  ['Saturday psychology session', 'Emotional control, discipline under pressure, and the mindset work that separates consistent traders from everyone else.'],
                  ['A plan built for you', 'Your strategy, your schedule, your personality. Nothing generic. A trading path designed around who you are and how you think.'],
                  ['Direct feedback on your work', 'Send a setup, share a journal entry, ask about a specific situation. You get a real answer from someone with real experience — the same day.'],
                ].map(([title, desc]) => (
                  <div key={title} style={{ paddingBottom: '14px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div style={{ width: '5px', height: '5px', background: '#7aaee8', borderRadius: '50%', flexShrink: 0, marginTop: '8px' }} />
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>{title}</div>
                    </div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', paddingLeft: '15px' }}>{desc}</div>
                  </div>
                ))}
              </div>

              {/* Premium note */}
              <div style={{ padding: '20px 22px', background: 'rgba(43,94,167,0.12)', border: '0.5px solid rgba(43,94,167,0.25)', marginBottom: '32px' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', margin: 0 }}>
                  Premium spots are limited. Personal guidance at this level requires real time and real commitment from both sides. If you are serious about making trading work, this is the fastest path — because it is the path I wish I had.
                </p>
              </div>

              <a href="/contact" style={{ display: 'block', textAlign: 'center', background: '#2B5EA7', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '16px', textDecoration: 'none', fontWeight: '700', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
                onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
              >Apply for Premium — Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* THE PREMIUM DIFFERENCE — editorial section */}
      <section style={{ padding: '80px', background: '#ffffff' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />What Premium Really Means<div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', fontWeight: '700', color: '#1a1a1a', marginBottom: '0', letterSpacing: '-1.5px', lineHeight: '1.1' }}>
            You are not buying a course.<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>You are buying your freedom.</span>
          </h2>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '28px auto 36px' }} />
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#3a3530', lineHeight: '1.9', marginBottom: '24px' }}>
            I spent years and every euro I had trying to buy someone&apos;s time and knowledge. I never found it at the right price. What I found instead were courses, recordings, and strategies that were built for a general audience — not for me.
          </p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#3a3530', lineHeight: '1.9', marginBottom: '24px' }}>
            Premium is different. When you join Premium, I am choosing to put my personal time into your development. That means I am studying your journal. I am reviewing your trades. I am thinking about your specific situation between sessions. That is not something I can offer to everyone — and that is by design.
          </p>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '19px', color: '#2B5EA7', lineHeight: '1.7' }}>
            &ldquo;The fastest way to learn trading is to have someone who has already made every mistake stand next to you and tell you what they see. That is what Premium is.&rdquo;
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px', background: '#F5F2EC' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />Questions
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '700', color: '#1a1a1a', marginBottom: '0', letterSpacing: '-1px' }}>Membership FAQ.</h2>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px 0 40px' }} />
          {[
            { q: 'How do I join?', a: 'Reach out via the Contact page with your name, which membership you are interested in, and a brief description of where you are in your trading journey. We will get back to you within 24 hours.' },
            { q: 'Is Premium right for me if I am a beginner?', a: 'Yes — in fact, starting with Premium guidance means you avoid the years of expensive mistakes most traders make alone. Having a mentor from day one is the single biggest shortcut available.' },
            { q: 'Can I upgrade from Standard to Premium?', a: 'Yes. You can upgrade at any time. Your 1-on-1 sessions begin the following week and your personalised plan is built in the first call.' },
            { q: 'How many Premium spots are available?', a: 'Limited. Personal mentorship at this level requires genuine time and attention. When spots are full, we maintain a waiting list and contact you as soon as one opens.' },
            { q: 'What if I miss a live session?', a: 'All sessions are recorded and available in the platform within 24 hours. You never lose the content — but showing up live is strongly encouraged for the full benefit.' },
            { q: 'Is the weekly 1-on-1 call flexible?', a: 'Yes. The day and time are agreed between you and your mentor based on both schedules. It is designed to fit your life, not the other way around.' },
          ].map((faq, i) => (
            <div key={i} style={{ borderBottom: '0.5px solid rgba(26,26,26,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '16px', color: faqOpen === i ? '#2B5EA7' : '#1a1a1a', transition: 'color 0.2s' }}
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                {faq.q}
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#2B5EA7', transform: faqOpen === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.25s', display: 'inline-block', marginLeft: '16px', flexShrink: 0 }}>+</span>
              </div>
              {faqOpen === i && <div style={{ padding: '0 0 22px', fontSize: '15px', color: '#6a6060', lineHeight: '1.8', fontFamily: 'Georgia, serif' }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px', background: '#0d1e36', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '700', color: '#ffffff', marginBottom: '12px', letterSpacing: '-1px' }}>Ready to start?</h2>
        <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '16px', color: 'rgba(255,255,255,0.45)', marginBottom: '36px' }}>Reach out and we will get back to you within 24 hours.</p>
        <a href="/contact" style={{ background: '#2B5EA7', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '16px 48px', textDecoration: 'none', fontWeight: '700', transition: 'all 0.2s', display: 'inline-block' }}
          onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
          onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
        >Contact Us →</a>
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