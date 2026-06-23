'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'membership', message: '' })
  const [sent, setSent] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const subjects = [
    { value: 'membership', label: 'Membership & Pricing' },
    { value: 'premium', label: 'Premium Application' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'other', label: 'Something Else' },
  ]

  const p = isMobile ? '48px 24px' : '80px'

  return (
    <div style={{ background: '#F5F2EC', fontFamily: 'var(--font-playfair)', paddingTop: '88px' }}>
      <Nav />

      {/* HEADER */}
      <section style={{ padding: isMobile ? '40px 24px 32px' : '80px 80px 60px', background: '#ffffff', borderBottom: '0.5px solid rgba(26,26,26,0.08)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />Contact
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '40px' : '64px', fontWeight: '700', lineHeight: '1.05', letterSpacing: isMobile ? '-1px' : '-2px', color: '#1a1a1a', marginBottom: '0', maxWidth: '700px' }}>
            Let&apos;s talk.<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>We answer everything.</span>
          </h1>
          <div style={{ width: '60px', height: '3px', background: '#2B5EA7', margin: '28px 0 0' }} />
        </div>
      </section>

      {/* MAIN */}
      <section style={{ padding: p, background: '#F5F2EC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', gap: isMobile ? '40px' : '80px', alignItems: 'start' }}>

          {/* Left — info */}
          <div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />Get in touch
            </div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '26px' : '36px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-1px', lineHeight: '1.1', marginBottom: '16px' }}>
              We read every message personally.
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: '#6a6060', lineHeight: '1.85', marginBottom: '32px' }}>
              Whether you have a question about membership, want to apply for Premium, or just want to know if Flow Capitals is the right fit — send us a message and we will get back to you within 24 hours.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Email</div>
              <a href="mailto:hello@flowcapitals.com" style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '16px' : '20px', fontWeight: '700', color: '#2B5EA7', textDecoration: 'none' }}>
                hello@flowcapitals.com
              </a>
            </div>

            <div style={{ padding: '20px 24px', background: '#ffffff', borderLeft: '3px solid #2B5EA7', marginBottom: '28px' }}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#6a6060', lineHeight: '1.7', margin: 0 }}>
                We typically respond within <strong style={{ color: '#1a1a1a' }}>24 hours</strong>. For urgent questions about Premium membership, mention it in your subject and we will prioritise your message.
              </p>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '14px' }}>Common questions we answer</div>
              {[
                'Is Flow Capitals right for my experience level?',
                'How does the Premium application process work?',
                'What prop firms do you recommend?',
                'Can I join if I have a full-time job?',
              ].map((q, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#2B5EA7', flexShrink: 0, marginTop: '6px' }} />
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#6a6060', lineHeight: '1.6' }}>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div style={{ background: '#ffffff', padding: isMobile ? '28px 24px' : '48px 44px', border: '0.5px solid rgba(26,26,26,0.08)', boxShadow: '0 4px 40px rgba(0,0,0,0.04)' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(43,94,167,0.08)', border: '0.5px solid rgba(43,94,167,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }}>✓</div>
                <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Message sent.</h3>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: '#6a6060', lineHeight: '1.7' }}>We will get back to you within 24 hours at <strong>{form.email}</strong></p>
              </div>
            ) : (
              <>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: '24px' }}>Send a message</div>

                {/* Name + Email — stack on mobile */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Your Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Mauro Steenhoudt"
                      style={{ width: '100%', background: '#F5F2EC', border: '0.5px solid rgba(26,26,26,0.1)', borderRadius: '8px', padding: '11px 14px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#1a1a1a', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const }}
                      onFocus={e => e.target.style.borderColor = '#2B5EA7'}
                      onBlur={e => e.target.style.borderColor = 'rgba(26,26,26,0.1)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Email Address</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"
                      style={{ width: '100%', background: '#F5F2EC', border: '0.5px solid rgba(26,26,26,0.1)', borderRadius: '8px', padding: '11px 14px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#1a1a1a', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const }}
                      onFocus={e => e.target.style.borderColor = '#2B5EA7'}
                      onBlur={e => e.target.style.borderColor = 'rgba(26,26,26,0.1)'}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Subject</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {subjects.map(s => (
                      <button key={s.value} onClick={() => setForm({ ...form, subject: s.value })}
                        style={{ padding: '10px 14px', background: form.subject === s.value ? 'rgba(43,94,167,0.06)' : '#F5F2EC', border: `0.5px solid ${form.subject === s.value ? '#2B5EA7' : 'rgba(26,26,26,0.1)'}`, borderRadius: '8px', cursor: 'pointer', textAlign: 'left' as const, transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: `2px solid ${form.subject === s.value ? '#2B5EA7' : 'rgba(26,26,26,0.2)'}`, background: form.subject === s.value ? '#2B5EA7' : 'transparent', flexShrink: 0, transition: 'all 0.2s' }} />
                          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: form.subject === s.value ? '#2B5EA7' : '#6a6060', fontWeight: form.subject === s.value ? '600' : '400' }}>{s.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} placeholder="Tell us what you want to know..."
                    style={{ width: '100%', background: '#F5F2EC', border: '0.5px solid rgba(26,26,26,0.1)', borderRadius: '8px', padding: '11px 14px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#1a1a1a', outline: 'none', resize: 'vertical' as const, transition: 'border-color 0.2s', boxSizing: 'border-box' as const }}
                    onFocus={e => e.target.style.borderColor = '#2B5EA7'}
                    onBlur={e => e.target.style.borderColor = 'rgba(26,26,26,0.1)'}
                  />
                </div>

                <button onClick={() => { if (form.name && form.email && form.message) setSent(true) }}
                  style={{ width: '100%', background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '14px', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '700', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
                >
                  Send Message →
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* DARK QUOTE */}
      <section style={{ padding: isMobile ? '48px 24px' : '80px', background: '#0d1e36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '600px', textAlign: 'center' as const }}>
          <div style={{ width: '40px', height: '3px', background: '#2B5EA7', margin: '0 auto 32px' }} />
          <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: isMobile ? '18px' : '22px', color: '#ffffff', lineHeight: '1.65', marginBottom: '20px' }}>
            &ldquo;There are no stupid questions. The only mistake is not asking.&rdquo;
          </p>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Flow Capitals Team</div>
        </div>
      </section>

      <Footer />
    </div>
  )
}