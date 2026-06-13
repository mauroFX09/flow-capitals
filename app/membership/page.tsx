'use client'
import Nav from '@/components/Nav'

export default function Membership() {
  return (
    <div style={{ background: '#F5F2EC', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <Nav />

      {/* Hero */}
      <div style={{ paddingTop: '140px', paddingBottom: '80px', textAlign: 'center', maxWidth: '720px', margin: '0 auto', padding: '140px 24px 80px' }}>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#2B5EA7', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '1px', background: '#2B5EA7' }} />
          Membership
          <div style={{ width: '32px', height: '1px', background: '#2B5EA7' }} />
        </div>
        <h1 style={{ fontSize: '52px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-2px', lineHeight: '1.05', marginBottom: '20px' }}>
          Choose your path.
        </h1>
        <p style={{ fontStyle: 'italic', fontSize: '17px', color: '#8a8070', lineHeight: '1.7' }}>
          Two ways to join Flow Capitals. One built for independence. One built for transformation.
        </p>
      </div>

      {/* Is this for you */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
          {/* For you */}
          <div style={{ background: '#ffffff', padding: '40px 44px' }}>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#2B5EA7', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#2B5EA7' }} />
              This is for you
            </div>
            {[
              'You are a beginner and want to start the right way.',
              'You got stuck and need a proven blueprint to move forward.',
              'You are prepared to put in real time every single day.',
              'You want to learn a real strategy — not shortcuts.',
              'You take full responsibility for your own results.',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(43,94,167,0.08)', border: '0.5px solid rgba(43,94,167,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <span style={{ color: '#2B5EA7', fontSize: '10px' }}>✓</span>
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '14px', color: '#3a3530', lineHeight: '1.6', margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Not for you */}
          <div style={{ background: '#0d1e36', padding: '40px 44px' }}>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#7aaee8', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#7aaee8' }} />
              This is not for you
            </div>
            {[
              'You are looking for a get-rich-quick scheme.',
              'You expect guaranteed results without doing the work.',
              'You are not prepared to study and improve every day.',
              'You want someone else to trade for you.',
              'You are not willing to take responsibility for your losses.',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(220,50,50,0.1)', border: '0.5px solid rgba(220,50,50,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <span style={{ color: '#dc3232', fontSize: '10px' }}>✕</span>
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Packages */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 120px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#2B5EA7', marginBottom: '16px' }}>The packages</div>
          <h2 style={{ fontSize: '38px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-1.5px' }}>Two ways in.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>

          {/* Standard */}
          <div style={{ background: '#ffffff', padding: '48px 44px' }}>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#8a8070', marginBottom: '8px' }}>Standard</div>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-1px', marginBottom: '4px' }}>Self-Directed</h3>
            <p style={{ fontStyle: 'italic', fontSize: '14px', color: '#8a8070', marginBottom: '32px', lineHeight: '1.6' }}>Everything you need to learn the strategy independently.</p>

            <div style={{ marginBottom: '32px' }}>
              {[
                'Pre-market analysis every session',
                'Full trading journal access',
                'Wall of payouts — community wins',
                'Discord community access',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#2B5EA7', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#3a3530' }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '0.5px solid rgba(26,26,26,0.08)', paddingTop: '28px' }}>
              {/* Stripe-ready button — placeholder for now */}
              <button
                onClick={() => alert('Payment coming soon — Stripe integration in progress.')}
                style={{ width: '100%', background: '#2B5EA7', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '16px', border: 'none', cursor: 'pointer', fontWeight: '700', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Join Standard →
              </button>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#8a8070', textAlign: 'center', marginTop: '12px' }}>Instant access after payment</p>
            </div>
          </div>

          {/* Premium */}
          <div style={{ background: '#0d1e36', padding: '48px 44px', position: 'relative' as const }}>
            <div style={{ position: 'absolute' as const, top: '20px', right: '20px', fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#7aaee8', background: 'rgba(122,174,232,0.1)', border: '0.5px solid rgba(122,174,232,0.2)', padding: '4px 12px' }}>
              By application
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#7aaee8', marginBottom: '8px' }}>Premium</div>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', letterSpacing: '-1px', marginBottom: '4px' }}>Personal Guidance</h3>
            <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px', lineHeight: '1.6' }}>Full access. Direct mentorship. Built for serious traders only.</p>

            <div style={{ marginBottom: '32px' }}>
              {[
                'Everything in Standard',
                'Full course library — all categories',
                'Live sessions 5x per week',
                'Weekly 1-on-1 personal call',
                'Saturday psychology session',
                'Direct access to Mauro',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7aaee8', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)', paddingTop: '28px' }}>
              <a href="/contact" style={{ display: 'block', width: '100%', background: 'transparent', color: '#7aaee8', fontFamily: 'Arial, sans-serif', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '16px', border: '0.5px solid #7aaee8', cursor: 'pointer', fontWeight: '700', textAlign: 'center', textDecoration: 'none', transition: 'all 0.2s', boxSizing: 'border-box' as const }}
                onMouseEnter={e => { e.currentTarget.style.background = '#7aaee8'; e.currentTarget.style.color = '#0d1e36' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7aaee8' }}
              >
                Apply to Join →
              </a>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '12px' }}>We review every application personally</p>
            </div>
          </div>
        </div>

        {/* Bottom quote */}
        <div style={{ marginTop: '2px', background: '#1a1a1a', padding: '36px 44px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '3px', height: '40px', background: '#2B5EA7', flexShrink: 0 }} />
          <p style={{ fontStyle: 'italic', fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.65', margin: 0 }}>
            "You are not buying a course. You are buying your freedom. The difference is in how seriously you treat what you are given."
          </p>
        </div>
      </div>
    </div>
  )
}