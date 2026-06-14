'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', membership: 'standard', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  const socials = [
    { name: 'YouTube', handle: '@FlowCapitalsTV', color: '#ff0000', url: '#', icon: '▶' },
    { name: 'Instagram', handle: '@flow.capitals', color: '#e1306c', url: '#', icon: '◉' },
    { name: 'TikTok', handle: '@flow_capitals', color: '#00f2ea', url: '#', icon: '♪' },
    { name: 'Telegram', handle: '@FLOWCAPITALS', color: '#0088cc', url: '#', icon: '✈' },
    { name: 'X / Twitter', handle: '@FlowCapitals01', color: '#1da1f2', url: '#', icon: '𝕏' },
  ]

  return (
    <div style={{ background: '#F5F2EC', fontFamily: 'var(--font-playfair)', paddingTop: '88px' }}>
      <Nav />

      {/* PAGE HEADER */}
      <section style={{ padding: '80px 80px 60px', background: '#ffffff', borderBottom: '0.5px solid rgba(26,26,26,0.08)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: '#2B5EA7' }} />Contact
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '64px', fontWeight: '700', lineHeight: '1', letterSpacing: '-2px', color: '#1a1a1a', marginBottom: '0', maxWidth: '700px' }}>
            Get in touch.<br /><span style={{ color: '#2B5EA7', fontStyle: 'italic' }}>We respond within 24h.</span>
          </h1>
          <div style={{ width: '60px', height: '3px', background: '#2B5EA7', margin: '28px 0 0' }} />
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section style={{ padding: '80px', background: '#F5F2EC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '80px', alignItems: 'start' }}>

          {/* LEFT — info */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', letterSpacing: '-0.5px' }}>Let&apos;s talk.</h2>
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '15px', color: '#6a6060', lineHeight: '1.85', marginBottom: '36px' }}>
              Whether you have a question about the program, want to understand which membership is right for you, or are ready to start — reach out. Every message is read personally.
            </p>

            {/* Email */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: '14px' }}>Email</div>
              <a href="mailto:hello@flowcapitals.com" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', padding: '20px 24px', background: '#ffffff', border: '0.5px solid rgba(26,26,26,0.08)', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#2B5EA7'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(26,26,26,0.08)'}
              >
                <div style={{ width: '40px', height: '40px', background: 'rgba(43,94,167,0.08)', border: '0.5px solid rgba(43,94,167,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>✉</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' }}>hello@flowcapitals.com</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#8a8070' }}>Response within 24 hours</div>
                </div>
              </a>
            </div>

            {/* Socials */}
            <div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: '14px' }}>Follow us</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {socials.map(s => (
                  <a key={s.name} href={s.url} style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', padding: '14px 20px', background: '#ffffff', border: '0.5px solid rgba(26,26,26,0.08)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = 'rgba(26,26,26,0.01)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,26,26,0.08)'; e.currentTarget.style.background = '#ffffff' }}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', color: s.color }}>{s.icon}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '1px' }}>{s.name}</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#8a8070' }}>{s.handle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={{ background: '#ffffff', border: '0.5px solid rgba(26,26,26,0.08)', padding: '52px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>✉</div>
                <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>Message received.</h3>
                <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '15px', color: '#8a8070', lineHeight: '1.7' }}>
                  Thank you for reaching out. We will get back to you personally within 24 hours.
                </p>
                <div style={{ width: '40px', height: '2px', background: '#2B5EA7', margin: '28px auto 0' }} />
              </div>
            ) : (
              <>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: '28px' }}>Send a message</div>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Full name</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" style={{ width: '100%', background: '#F5F2EC', border: '0.5px solid rgba(26,26,26,0.12)', padding: '12px 14px', fontFamily: 'var(--font-playfair)', fontSize: '14px', color: '#1a1a1a', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={e => e.currentTarget.style.borderColor = '#2B5EA7'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(26,26,26,0.12)'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Email address</label>
                      <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="your@email.com" style={{ width: '100%', background: '#F5F2EC', border: '0.5px solid rgba(26,26,26,0.12)', padding: '12px 14px', fontFamily: 'var(--font-playfair)', fontSize: '14px', color: '#1a1a1a', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={e => e.currentTarget.style.borderColor = '#2B5EA7'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(26,26,26,0.12)'}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Interested in</label>
                    <select name="membership" value={form.membership} onChange={handleChange} style={{ width: '100%', background: '#F5F2EC', border: '0.5px solid rgba(26,26,26,0.12)', padding: '12px 14px', fontFamily: 'var(--font-playfair)', fontSize: '14px', color: '#1a1a1a', outline: 'none', cursor: 'pointer' }}>
                      <option value="standard">Standard — Community Access</option>
                      <option value="premium">Premium — Personal Guidance (3 months)</option>
                      <option value="premium6">Premium — Personal Guidance (6 months)</option>
                      <option value="question">Just a question</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '28px' }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Your message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell us where you are in your trading journey and what you are looking for..." style={{ width: '100%', background: '#F5F2EC', border: '0.5px solid rgba(26,26,26,0.12)', padding: '12px 14px', fontFamily: 'var(--font-playfair)', fontSize: '14px', color: '#1a1a1a', outline: 'none', resize: 'vertical' as const, transition: 'border-color 0.2s' }}
                      onFocus={e => e.currentTarget.style.borderColor = '#2B5EA7'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(26,26,26,0.12)'}
                    />
                  </div>

                  <button type="submit" style={{ width: '100%', background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '16px', border: 'none', cursor: 'pointer', fontWeight: '700', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1a4a8f'}
                    onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
                  >Send Message →</button>

                  <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '12px', color: '#8a8070', textAlign: 'center', marginTop: '16px', lineHeight: '1.6' }}>
                    Every message is read personally. We will get back to you within 24 hours.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}