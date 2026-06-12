'use client'
import Nav from '@/components/Nav'

export default function Discovery() {
  return (
    <div style={{ background: '#F5F2EC', fontFamily: 'Georgia, serif', paddingTop: '88px' }}>
      <Nav />

      {/* PAGE HEADER */}
      <section style={{ padding: '80px 80px 60px', background: '#ffffff', borderBottom: '0.5px solid rgba(26,26,26,0.08)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />Discovery
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '64px', fontWeight: '700', lineHeight: '1', letterSpacing: '-2px', color: '#1a1a1a', marginBottom: '0', maxWidth: '700px' }}>
            Who we are.<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>Why we exist.</span>
          </h1>
          <div style={{ width: '60px', height: '3px', background: '#2B5EA7', margin: '28px 0 0' }} />
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section style={{ padding: '80px', background: '#F5F2EC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
            <div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />The Founder
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', fontWeight: '700', lineHeight: '1.05', letterSpacing: '-1.5px', color: '#1a1a1a', marginBottom: '0' }}>
                Built from failure.<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>Proven by results.</span>
              </h2>
              <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px 0 28px' }} />

              {/* Photo placeholder */}
              <div style={{ width: '100%', height: '340px', background: 'rgba(43,94,167,0.04)', border: '1px solid rgba(43,94,167,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '15px', color: '#8a8070', marginBottom: '8px' }}>Photo coming soon</div>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#c8c0b0', letterSpacing: '0.1em' }}>FOUNDER · FLOW CAPITALS</div>
                </div>
              </div>

              <div style={{ padding: '20px 24px', background: '#ffffff', borderLeft: '3px solid #2B5EA7' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '15px', color: '#2B5EA7', lineHeight: '1.7', margin: 0 }}>
                  &ldquo;I&apos;m 25 years old. I have the blueprint that cost me years of failure and every euro I had to build. I&apos;m giving it to you — with the mentorship I wish I had.&rdquo;
                </p>
              </div>
            </div>

            <div>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#3a3530', lineHeight: '1.9', marginBottom: '22px' }}>
                I dropped out of International Business at 20. Not because I was lazy — because I knew the corporate path wasn&apos;t mine. I spent months researching every online business model and trading was the one that truly fit. Numbers, data, markets. It matched who I am.
              </p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#3a3530', lineHeight: '1.9', marginBottom: '22px' }}>
                So I went back to work for a boss. Saved every single euro. Over the next two years I invested more than <strong>invested every euro I had into trading education</strong> — multiple mentors, multiple programs. None of it worked the way I needed it to. The strategies didn&apos;t fit my personality. I absorbed some knowledge — risk management, journaling basics — but I was still searching for the real foundation.
              </p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#3a3530', lineHeight: '1.9', marginBottom: '22px' }}>
                Then I found <strong>ICT on YouTube</strong>. I studied it like a university degree — deep, obsessive, methodical. After years of trial and error I built something that had never existed for me before: a strategy that was entirely my own. Personalised to my character, my schedule, and my psychology.
              </p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#3a3530', lineHeight: '1.9', marginBottom: '22px' }}>
                Then I made the classic mistake every trader makes. I moved to live capital too soon. Lost everything. Went back to work. Saved again. Started completely over. But this time I had the blueprint — and I trusted the process instead of rushing it.
              </p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#3a3530', lineHeight: '1.9' }}>
                It worked. Consistent payouts. Funded accounts. A real track record. <strong>Flow Capitals was built so that nobody has to pay what I paid or lose what I lost to find what I found.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ padding: '80px', background: '#ffffff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />The Journey
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '700', color: '#1a1a1a', marginBottom: '0', letterSpacing: '-1px' }}>Every step that led here.</h2>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px 0 48px' }} />

          {[
            { year: '2020', title: 'The decision', desc: 'Dropped out of International Business. Refused the corporate path. Started searching for something that matched who I really am.' },
            { year: '2022', title: 'First investment', desc: 'Started working to save capital. Invested the first €5,000+ into trading education. The strategy never clicked — but the foundation of risk management and journaling was laid.' },
            { year: '2022–23', title: '€15,000 in education', desc: 'Continued investing in mentors and programs. Total spent exceeded €15,000. Still searching. Still not finding a strategy that fit my personality and schedule.' },
            { year: '2023', title: 'The discovery', desc: 'Found ICT on YouTube. Studied it with the intensity of a university student. Months of deep obsessive learning. This was the missing piece.' },
            { year: '2023–24', title: 'The expensive lesson', desc: 'Built a personalised strategy and moved to live capital too soon. Lost everything. Back to working for a boss. Saved again. But this time, the blueprint existed.' },
            { year: '2024', title: 'The process', desc: 'Returned with patience. Followed the blueprint exactly — demo phase, data collection, refinement, proper evaluation. No rushing. Just process.' },
            { year: '2025', title: 'Flow Capitals', desc: 'Consistent payouts. Multiple funded accounts. A verified track record. Flow Capitals launched to give every serious trader the path I had to build alone.' },
          ].map((item, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: '28px' }}>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: i === arr.length - 1 ? '#2B5EA7' : '#ffffff', border: `2px solid #2B5EA7`, flexShrink: 0 }} />
                {i < arr.length - 1 && <div style={{ width: '1px', height: '64px', background: 'rgba(43,94,167,0.15)', marginTop: '3px' }} />}
              </div>
              <div style={{ paddingBottom: i < arr.length - 1 ? '16px' : '0' }}>
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.1em', marginBottom: '4px', textTransform: 'uppercase' as const }}>{item.year}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '14px', color: '#6a6060', lineHeight: '1.7' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT IS FLOW CAPITALS */}
      <section style={{ padding: '80px', background: '#F5F2EC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />What We Are
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', fontWeight: '700', color: '#1a1a1a', marginBottom: '0', letterSpacing: '-1px', maxWidth: '700px', lineHeight: '1.1' }}>
            The trading education<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>I wish existed at 22.</span>
          </h2>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px 0 48px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(26,26,26,0.06)' }}>
            {[
              { icon: '📐', title: 'Real methodology', desc: 'Built from years of live trading, not from a course someone else sold. Every concept is battle-tested in real markets with real money.' },
              { icon: '🧠', title: 'Psychology first', desc: 'The strategy is 30% of the game. Psychology is 70%. We spend as much time on the mind as on the chart — because that is where trading is actually won or lost.' },
              { icon: '📓', title: 'Journal-driven', desc: 'Every member tracks every trade. Performance is measured by data, not feelings. This is how you find your edge and keep it.' },
              { icon: '🤝', title: 'Real mentorship', desc: 'Premium members get a real human being in their corner every week. Not a bot, not a pre-recorded course. A mentor who has done it and is still doing it.' },
              { icon: '🏆', title: 'Proof, not promises', desc: '$100K+ in certified payouts from real members. Every payout posted publicly. We do not ask you to trust us — we show you the results.' },
              { icon: '🌊', title: 'The flow state', desc: 'Flow Capitals is named for the state where performance becomes effortless. That is what we are building toward — not a winning trade, but a way of trading.' },
            ].map((item, i) => (
              <div key={item.title} style={{ padding: '36px 32px', background: '#ffffff', transition: 'background 0.2s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F5F2EC'}
                onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
              >
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{item.icon}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#8a8070', lineHeight: '1.75' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: '80px', background: '#1a2a4a' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#7aaee8', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#7aaee8' }} />Our Values<div style={{ width: '28px', height: '1px', background: '#7aaee8' }} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', fontWeight: '700', color: '#ffffff', marginBottom: '0', letterSpacing: '-1px' }}>What Flow Capitals stands for.</h2>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '24px auto 56px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px' }}>
            {[
              { title: 'Honesty', desc: 'We tell you what trading actually takes. No overnight success stories. No magic strategies. Just the truth about the work required.' },
              { title: 'Data', desc: 'Every decision is backed by data. Your journal, your backtest, your live results. Never feelings, never hope.' },
              { title: 'Patience', desc: 'The biggest edge in trading is time. We build slow and we build right. Rushing has cost everyone here — we do not let it cost you.' },
              { title: 'Flow', desc: 'The end goal is effortless performance. When your process is so ingrained that execution becomes natural — that is the flow state.' },
            ].map(item => (
              <div key={item.title} style={{ padding: '28px 24px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '10px' }}>{item.title}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px', background: '#F5F2EC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Ready to join Flow Capitals?</h2>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '15px', color: '#8a8070' }}>See the full roadmap or choose your membership today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/membership" style={{ background: '#2B5EA7', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 32px', textDecoration: 'none', fontWeight: '700', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
            onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
          >View Membership →</a>
          <a href="/method" style={{ background: 'none', border: '1.5px solid #2B5EA7', color: '#2B5EA7', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '13px 28px', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2B5EA7'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#2B5EA7' }}
          >Our Method</a>
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