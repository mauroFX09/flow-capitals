'use client'
import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'

export default function Discovery() {
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
      <section style={{ padding: isMobile ? '40px 24px 32px' : '80px 80px 60px', background: '#ffffff', borderBottom: '0.5px solid rgba(26,26,26,0.08)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />Discovery
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '40px' : '64px', fontWeight: '700', lineHeight: '1.05', letterSpacing: isMobile ? '-1px' : '-2px', color: '#1a1a1a', marginBottom: '0', maxWidth: '700px' }}>
            Who we are.<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>Why we exist.</span>
          </h1>
          <div style={{ width: '60px', height: '3px', background: '#2B5EA7', margin: '28px 0 0' }} />
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section style={{ padding: p, background: '#F5F2EC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '40px' : '80px', alignItems: 'start' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />The Founder
              </div>
              <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '44px', fontWeight: '700', lineHeight: '1.05', letterSpacing: '-1.5px', color: '#1a1a1a', marginBottom: '0' }}>
                Built from failure.<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>Proven by results.</span>
              </h2>
              <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px 0 28px' }} />
              <div style={{ width: '100%', height: isMobile ? '220px' : '340px', background: 'rgba(43,94,167,0.04)', border: '1px solid rgba(43,94,167,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '15px', color: '#8a8070', marginBottom: '8px' }}>Photo coming soon</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#c8c0b0', letterSpacing: '0.1em' }}>FOUNDER · FLOW CAPITALS</div>
                </div>
              </div>
              <div style={{ padding: '20px 24px', background: '#ffffff', borderLeft: '3px solid #2B5EA7' }}>
                <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '15px', color: '#2B5EA7', lineHeight: '1.7', margin: 0 }}>
                  &ldquo;I&apos;m 25 years old. I have the blueprint that cost me years of failure and every euro I had to build. I&apos;m giving it to you — with the mentorship I wish I had.&rdquo;
                </p>
              </div>
            </div>

            <div>
              {[
                'I dropped out of International Business at 20. Not because I was lazy — because I knew the corporate path wasn\'t mine. I spent months researching every online business model and trading was the one that truly fit. Numbers, data, markets. It matched who I am.',
                'So I went back to work for a boss. Saved every single euro. Over the next two years I invested more than <strong>€15,000 into trading education</strong> — multiple mentors, multiple programs. None of it worked the way I needed it to. The strategies didn\'t fit my personality. I absorbed some knowledge — risk management, journaling basics — but I was still searching for the real foundation.',
                'Then I found <strong>ICT on YouTube</strong>. I studied it like a university degree — deep, obsessive, methodical. After years of trial and error I built something that had never existed for me before: a strategy that was entirely my own. Personalised to my character, my schedule, and my psychology.',
                'Then I made the classic mistake every trader makes. I moved to live capital too soon. Lost everything. Went back to work. Saved again. Started completely over. But this time I had the blueprint — and I trusted the process instead of rushing it.',
                'It worked. Consistent payouts. Funded accounts. A real track record. <strong>Flow Capitals was built so that nobody has to pay what I paid or lose what I lost to find what I found.</strong>',
              ].map((text, i) => (
                <p key={i} style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', color: '#3a3530', lineHeight: '1.9', marginBottom: '22px' }} dangerouslySetInnerHTML={{ __html: text }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ padding: p, background: '#ffffff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />The Journey
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '28px' : '40px', fontWeight: '700', color: '#1a1a1a', marginBottom: '0', letterSpacing: '-1px' }}>Every step that led here.</h2>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px 0 48px' }} />

          {[
            { year: '2021', title: 'The decision', desc: 'Dropped out of International Business. Refused the corporate path. Started researching every online business model — trading was the one that matched who I am.', milestone: false },
            { year: '2022', title: 'First investment', desc: 'Went back to work and saved. Invested the first €5,000+ into trading education. The strategy never clicked — but the foundation of risk management and journaling was laid.', milestone: false },
            { year: '2023', title: '€15,000 spent. Still searching.', desc: 'Total invested in mentors and programs exceeded €15,000. Found ICT on YouTube. Studied it with the intensity of a university student. The missing piece was finally found.', milestone: false },
            { year: '2023', title: 'The expensive lesson', desc: 'Built a personalised strategy and moved to live capital too soon. Lost everything. Back to working for a boss. Saved again. But this time, the blueprint existed.', milestone: false },
            { year: '2024', title: 'Flow Capitals founded.', desc: 'Returned with patience. Followed the blueprint exactly. Consistent payouts. Multiple funded accounts. A verified track record. Flow Capitals was launched to give every serious trader the path I had to build alone.', milestone: true },
            { year: '2025', title: 'First members. First payouts.', desc: 'The first students joined the blueprint. Christian Arena and Oliwier Kowal — both students who mastered the strategy — were promoted to mentors and became partners in the mission.', milestone: false },
            { year: '2026', title: 'The community grows.', desc: 'Flow Capitals continues to grow — more members, more payouts, more proof. The platform you are on right now is the result of every lesson learned since 2021.', milestone: true },
          ].map((item, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: isMobile ? '20px' : '28px' }}>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', paddingTop: '4px' }}>
                <div style={{ width: item.milestone ? '16px' : '12px', height: item.milestone ? '16px' : '12px', borderRadius: '50%', background: item.milestone ? '#2B5EA7' : '#ffffff', border: '2px solid #2B5EA7', flexShrink: 0, boxShadow: item.milestone ? '0 0 0 4px rgba(43,94,167,0.1)' : 'none' }} />
                {i < arr.length - 1 && <div style={{ width: '1px', height: '64px', background: 'rgba(43,94,167,0.15)', marginTop: '3px' }} />}
              </div>
              <div style={{ paddingBottom: i < arr.length - 1 ? '16px' : '0' }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: item.milestone ? '#2B5EA7' : '#8a8070', letterSpacing: '0.1em', marginBottom: '4px', textTransform: 'uppercase' as const, fontWeight: item.milestone ? '700' : '400' }}>{item.year}{item.milestone ? ' — Milestone' : ''}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '15px' : '17px', fontWeight: '700', color: item.milestone ? '#2B5EA7' : '#1a1a1a', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '14px', color: '#6a6060', lineHeight: '1.7' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section style={{ padding: p, background: '#F5F2EC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />The Team
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '44px', fontWeight: '700', color: '#1a1a1a', marginBottom: '0', letterSpacing: '-1px' }}>
            Three traders.<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>One blueprint.</span>
          </h2>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px 0 40px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '2px', background: 'rgba(26,26,26,0.06)' }}>
            {[
              { name: 'Mauro Steenhoudt', role: 'Founder & Head Mentor', desc: "Dropped out of business school, spent €15K on trading education that didn't work, found his own path through ICT and years of obsessive study. Built Flow Capitals so no one else has to pay that price.", quote: 'The blueprint cost me everything. Now it costs you nothing compared to what I paid.' },
              { name: 'Christian Arena', role: 'Mentor & Partner', desc: 'One of the first students to master the Flow Capitals strategy from the ground up. Promoted to mentor after proving consistent results. Now helps guide the next generation of traders through the same blueprint.', quote: "I was a student here first. That's exactly why I know how to guide you." },
              { name: 'Oliwier Kowal', role: 'Mentor & Partner', desc: 'Started as a member, mastered the strategy, and became a partner. Oliwier brings a methodical and analytical approach to mentorship — breaking down complex concepts into clear, actionable frameworks.', quote: 'Consistency is not a talent. It is a system. We teach you the system.' },
            ].map((member) => (
              <div key={member.name} style={{ background: '#ffffff', padding: isMobile ? '32px 24px' : '44px 40px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#0d1e36', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: '#ffffff' }}>{member.name[0]}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#2B5EA7', letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>{member.role}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px', lineHeight: '1.2' }}>{member.name}</div>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#6a6060', lineHeight: '1.75', marginBottom: '20px' }}>{member.desc}</p>
                <div style={{ padding: '16px 20px', background: '#F5F2EC', borderLeft: '2px solid #2B5EA7' }}>
                  <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '13px', color: '#2B5EA7', lineHeight: '1.6', margin: 0 }}>&ldquo;{member.quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IS FLOW CAPITALS */}
      <section style={{ padding: p, background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />What We Are
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '32px' : '44px', fontWeight: '700', color: '#1a1a1a', marginBottom: '0', letterSpacing: '-1px', maxWidth: '700px', lineHeight: '1.1' }}>
            The trading education<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>I wish existed at 22.</span>
          </h2>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px 0 40px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '2px', background: 'rgba(26,26,26,0.06)' }}>
            {[
              { num: 'I', title: 'Real methodology', desc: 'Built from years of live trading, not from a course someone else sold. Every concept is battle-tested in real markets with real money.' },
              { num: 'II', title: 'Psychology first', desc: 'The strategy is 30% of the game. Psychology is 70%. We spend as much time on the mind as on the chart — because that is where trading is won or lost.' },
              { num: 'III', title: 'Journal-driven', desc: 'Every member tracks every trade. Performance is measured by data, not feelings. This is how you find your edge and keep it.' },
              { num: 'IV', title: 'Real mentorship', desc: 'Premium members get a real human being in their corner every week. Not a bot, not a pre-recorded course. A mentor who has done it and is still doing it.' },
              { num: 'V', title: 'Proof, not promises', desc: '$100K+ in certified payouts from real members. Every payout posted publicly. We do not ask you to trust us — we show you the results.' },
              { num: 'VI', title: 'The flow state', desc: 'Flow Capitals is named for the state where performance becomes effortless. That is what we are building toward — not a winning trade, but a way of trading.' },
            ].map((item) => (
              <div key={item.title}
                style={{ padding: isMobile ? '28px 24px' : '44px 36px', background: '#F5F2EC', position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'background 0.25s' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#0d1e36'
                  const title = e.currentTarget.querySelector('.card-title') as HTMLElement
                  const desc = e.currentTarget.querySelector('.card-desc') as HTMLElement
                  const num = e.currentTarget.querySelector('.card-num') as HTMLElement
                  const line = e.currentTarget.querySelector('.card-line') as HTMLElement
                  if (title) title.style.color = '#ffffff'
                  if (desc) desc.style.color = 'rgba(255,255,255,0.55)'
                  if (num) num.style.color = 'rgba(122,174,232,0.12)'
                  if (line) line.style.background = '#7aaee8'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#F5F2EC'
                  const title = e.currentTarget.querySelector('.card-title') as HTMLElement
                  const desc = e.currentTarget.querySelector('.card-desc') as HTMLElement
                  const num = e.currentTarget.querySelector('.card-num') as HTMLElement
                  const line = e.currentTarget.querySelector('.card-line') as HTMLElement
                  if (title) title.style.color = '#1a1a1a'
                  if (desc) desc.style.color = '#8a8070'
                  if (num) num.style.color = 'rgba(43,94,167,0.06)'
                  if (line) line.style.background = '#2B5EA7'
                }}
              >
                <div className="card-num" style={{ fontFamily: 'var(--font-playfair)', fontSize: '96px', fontWeight: '700', color: 'rgba(43,94,167,0.06)', lineHeight: 1, position: 'absolute', top: '12px', right: '20px', letterSpacing: '-2px', userSelect: 'none' as const, transition: 'color 0.25s', pointerEvents: 'none' }}>{item.num}</div>
                <div className="card-line" style={{ width: '28px', height: '2px', background: '#2B5EA7', marginBottom: '20px', transition: 'background 0.25s' }} />
                <div className="card-title" style={{ fontFamily: 'var(--font-playfair)', fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px', transition: 'color 0.25s' }}>{item.title}</div>
                <div className="card-desc" style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#8a8070', lineHeight: '1.75', transition: 'color 0.25s' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: p, background: '#1a2a4a' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' as const }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#7aaee8', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#7aaee8' }} />Our Values<div style={{ width: '28px', height: '1px', background: '#7aaee8' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '28px' : '44px', fontWeight: '700', color: '#ffffff', marginBottom: '0', letterSpacing: '-1px' }}>What Flow Capitals stands for.</h2>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px auto 48px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? '12px' : '24px', textAlign: 'left' as const }}>
            {[
              { title: 'Honesty', desc: 'We tell you what trading actually takes. No overnight success stories. No magic strategies. Just the truth about the work required.' },
              { title: 'Data', desc: 'Every decision is backed by data. Your journal, your backtest, your live results. Never feelings, never hope.' },
              { title: 'Patience', desc: 'The biggest edge in trading is time. We build slow and we build right. Rushing has cost everyone here — we do not let it cost you.' },
              { title: 'Flow', desc: 'The end goal is effortless performance. When your process is so ingrained that execution becomes natural — that is the flow state.' },
            ].map(item => (
              <div key={item.title} style={{ padding: isMobile ? '20px 16px' : '28px 24px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#ffffff', marginBottom: '10px' }}>{item.title}</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? '48px 24px' : '80px', background: '#F5F2EC', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: isMobile ? '28px' : '0' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '26px' : '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Ready to join Flow Capitals?</h2>
          <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '15px', color: '#8a8070' }}>See the full roadmap or choose your membership today.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
          <a href="/membership" style={{ background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 32px', textDecoration: 'none', fontWeight: '700', textAlign: 'center' as const }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
            onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
          >View Membership →</a>
          <a href="/method" style={{ background: 'none', border: '1.5px solid #2B5EA7', color: '#2B5EA7', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '13px 28px', textDecoration: 'none', textAlign: 'center' as const }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2B5EA7'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#2B5EA7' }}
          >Our Method</a>
        </div>
      </section>
    </div>
  )
}