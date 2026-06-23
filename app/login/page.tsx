'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [mode] = useState<'login'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  async function handleSubmit() {
    setLoading(true)
    setError('')
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-inter)', flexDirection: isMobile ? 'column' : 'row' }}>

      {/* Left — dark brand panel (hidden on mobile) */}
      {!isMobile && (
        <div style={{ flex: '1', background: '#0d1e36', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 56px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(43,94,167,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(122,174,232,0.08) 0%, transparent 50%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            <div style={{ width: '32px', height: '32px', border: '1.5px solid #7aaee8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '8px', height: '8px', background: '#7aaee8', borderRadius: '2px' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', fontWeight: '700', letterSpacing: '0.5px', color: '#ffffff' }}>
              FLOW <span style={{ color: '#7aaee8' }}>CAPITALS</span>
            </div>
          </div>

          <div style={{ position: 'relative', maxWidth: '480px' }}>
            <div style={{ width: '3px', height: '60px', background: '#2B5EA7', marginBottom: '32px', borderRadius: '2px' }} />
            <blockquote style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', fontWeight: '700', color: '#ffffff', lineHeight: '1.3', letterSpacing: '-0.5px', marginBottom: '24px' }}>
              "Years of failure.<br />Every euro saved.<br />Every mistake made twice.<br />This is what it took."
            </blockquote>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
              — Mauro Steenhoudt, Founder
            </p>
          </div>

          <div style={{ display: 'flex', gap: '40px', position: 'relative' }}>
            {[{ value: '47+', label: 'Active Members' }, { value: '€200K', label: 'Max Funded Capital' }, { value: '3+', label: 'Years of Research' }].map(stat => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>{stat.value}</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right — login form */}
      <div style={{ width: isMobile ? '100%' : '480px', flexShrink: 0, background: '#F5F2EC', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '48px 24px' : '48px 56px', minHeight: isMobile ? '100vh' : 'auto' }}>

        {/* Mobile logo */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
            <div style={{ width: '28px', height: '28px', border: '1.5px solid #2B5EA7', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '7px', height: '7px', background: '#2B5EA7', borderRadius: '2px' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '14px', fontWeight: '700', letterSpacing: '0.5px', color: '#1a1a1a' }}>
              FLOW <span style={{ color: '#2B5EA7' }}>CAPITALS</span>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '20px', height: '1px', background: '#2B5EA7' }} />Member Portal
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '36px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-1px', lineHeight: 1, marginBottom: '8px' }}>
            Welcome back.
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: '#8a8070', fontStyle: 'italic' }}>
            Sign in to access your dashboard.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              style={{ width: '100%', background: '#ffffff', border: '0.5px solid rgba(26,26,26,0.12)', borderRadius: '10px', padding: '12px 14px', fontFamily: 'var(--font-inter)', fontSize: '14px', color: '#1a1a1a', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const }}
              onFocus={e => e.target.style.borderColor = '#2B5EA7'}
              onBlur={e => e.target.style.borderColor = 'rgba(26,26,26,0.12)'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', background: '#ffffff', border: '0.5px solid rgba(26,26,26,0.12)', borderRadius: '10px', padding: '12px 14px', fontFamily: 'var(--font-inter)', fontSize: '14px', color: '#1a1a1a', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const }}
              onFocus={e => e.target.style.borderColor = '#2B5EA7'}
              onBlur={e => e.target.style.borderColor = 'rgba(26,26,26,0.12)'}
            />
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 14px', background: 'rgba(220,50,50,0.06)', border: '0.5px solid rgba(220,50,50,0.2)', borderRadius: '8px', marginBottom: '16px' }}>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#dc3232', margin: 0 }}>{error}</p>
          </div>
        )}
        {message && (
          <div style={{ padding: '12px 14px', background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: '8px', marginBottom: '16px' }}>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#22c55e', margin: 0 }}>{message}</p>
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '10px', fontWeight: '700', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', marginBottom: '20px' }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1a4a8f' }}
          onMouseLeave={e => e.currentTarget.style.background = '#2B5EA7'}
        >
          {loading ? 'Please wait...' : 'Sign In →'}
        </button>

        <div style={{ textAlign: 'center' as const }}>
          <a href="/" style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#8a8070', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#2B5EA7'}
            onMouseLeave={e => e.currentTarget.style.color = '#8a8070'}
          >← Back to Flow Capitals</a>
        </div>
      </div>
    </div>
  )
}