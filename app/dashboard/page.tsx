'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    })
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ background: '#F5F2EC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#8a8070', fontSize: '16px' }}>Loading...</div>
    </div>
  )

  return (
    <div style={{ background: '#F5F2EC', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      {/* Topbar */}
      <div style={{ background: '#ffffff', borderBottom: '0.5px solid rgba(26,26,26,0.08)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '1px' }}>
          FLOW <span style={{ color: '#2B5EA7' }}>CAPITALS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#8a8070' }}>{user?.email}</div>
          <button onClick={handleLogout} style={{ background: 'none', border: '0.5px solid rgba(26,26,26,0.15)', color: '#8a8070', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.08em', padding: '6px 14px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc3232'; e.currentTarget.style.color = '#dc3232' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,26,26,0.15)'; e.currentTarget.style.color = '#8a8070' }}
          >Sign out</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '64px 80px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Greeting */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '24px', height: '1px', background: '#2B5EA7' }} />Member Dashboard
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-1.5px', lineHeight: 1, marginBottom: '8px' }}>
            Welcome back.
          </h1>
          <p style={{ fontStyle: 'italic', fontSize: '16px', color: '#8a8070' }}>Your journey continues here.</p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '40px' }}>
          {[
            { label: 'Courses', value: 'Coming soon', icon: '📐', desc: 'Technical & psychology modules' },
            { label: 'Journal', value: 'Coming soon', icon: '📓', desc: 'Track your trades and growth' },
            { label: 'Trading Wall', value: 'Coming soon', icon: '🏆', desc: 'Payout proofs and achievements' },
            { label: 'Q & A', value: 'Coming soon', icon: '💬', desc: 'Ask your mentor directly' },
          ].map(card => (
            <div key={card.label} style={{ background: '#ffffff', border: '0.5px solid rgba(26,26,26,0.08)', padding: '24px', cursor: 'default', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#2B5EA7'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(26,26,26,0.08)'}
            >
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>{card.icon}</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#8a8070', marginBottom: '6px' }}>{card.label}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#2B5EA7', marginBottom: '4px' }}>{card.value}</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#8a8070', lineHeight: '1.5' }}>{card.desc}</div>
            </div>
          ))}
        </div>

        {/* Welcome message */}
        <div style={{ background: '#0d1e36', padding: '40px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#7aaee8', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '24px', height: '1px', background: '#7aaee8' }} />You are in
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', letterSpacing: '-1px', lineHeight: '1.1', marginBottom: '16px' }}>
              The platform is<br /><span style={{ color: '#7aaee8', fontStyle: 'italic' }}>being built for you.</span>
            </h2>
            <p style={{ fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7' }}>
              Courses, journal, trading wall, and Q&A are all coming very soon. You are among the first members of Flow Capitals.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
            {[
              'Access to all courses when released',
              'Trading journal to track your progress',
              'Direct Q&A with your mentor',
              'Trading wall — share your payouts',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.5' }}>
                <div style={{ width: '5px', height: '5px', background: '#7aaee8', borderRadius: '50%', flexShrink: 0, marginTop: '8px' }} />
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}