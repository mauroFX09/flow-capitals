'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [success, setSuccess] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess('Check your email to confirm your account.')
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#F5F2EC', minHeight: '100vh', fontFamily: 'var(--font-playfair)', paddingTop: '88px' }}>
      <Nav />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 88px)', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: '700', letterSpacing: '1px', color: '#1a1a1a', marginBottom: '6px' }}>
              FLOW <span style={{ color: '#2B5EA7' }}>CAPITALS</span>
            </div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Member Area</div>
          </div>

          {/* Card */}
          <div style={{ background: '#ffffff', border: '0.5px solid rgba(26,26,26,0.08)', padding: '48px' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '0.5px solid rgba(26,26,26,0.08)', marginBottom: '32px' }}>
              {(['login', 'register'] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); setError(''); setSuccess('') }} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #2B5EA7' : '2px solid transparent', color: tab === t ? '#2B5EA7' : '#8a8070', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.2s', fontWeight: tab === t ? '600' : '400', marginBottom: '-0.5px' }}>
                  {t === 'login' ? 'Login' : 'Create Account'}
                </button>
              ))}
            </div>

            <form onSubmit={tab === 'login' ? handleLogin : handleRegister}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  style={{ width: '100%', background: '#F5F2EC', border: '0.5px solid rgba(26,26,26,0.12)', padding: '12px 14px', fontFamily: 'var(--font-playfair)', fontSize: '14px', color: '#1a1a1a', outline: 'none' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#2B5EA7'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(26,26,26,0.12)'}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ width: '100%', background: '#F5F2EC', border: '0.5px solid rgba(26,26,26,0.12)', padding: '12px 14px', fontFamily: 'var(--font-playfair)', fontSize: '14px', color: '#1a1a1a', outline: 'none' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#2B5EA7'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(26,26,26,0.12)'}
                />
              </div>

              {tab === 'login' && (
                <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#8a8070', cursor: 'pointer' }}>Forgot password?</span>
                </div>
              )}

              {error && (
                <div style={{ background: 'rgba(220,50,50,0.06)', border: '0.5px solid rgba(220,50,50,0.2)', padding: '10px 14px', marginBottom: '16px', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '13px', color: '#dc3232' }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{ background: 'rgba(43,94,167,0.06)', border: '0.5px solid rgba(43,94,167,0.2)', padding: '10px 14px', marginBottom: '16px', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '13px', color: '#2B5EA7' }}>
                  {success}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ width: '100%', background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '700', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', marginTop: tab === 'register' ? '24px' : '0' }}>
                {loading ? 'Please wait...' : tab === 'login' ? 'Login →' : 'Create Account →'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '12px', color: '#8a8070' }}>
              Every message is read personally. Access is granted within 24 hours.
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="/" style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, textDecoration: 'none' }}>← Back to home page</a>
          </div>
        </div>
      </div>
    </div>
  )
}