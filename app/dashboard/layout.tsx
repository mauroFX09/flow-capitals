'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
  { label: 'Journal', href: '/dashboard/journal', icon: '◫' },
  { label: 'Courses', href: '/dashboard/courses', icon: '▤' },
  { label: 'Trading Wall', href: '/dashboard/wall', icon: '◈' },
  { label: 'Q & A', href: '/dashboard/qa', icon: '◎' },
  { label: 'Achievements', href: '/dashboard/achievements', icon: '◇' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('fc-dark-mode')
    if (saved === 'true') setDark(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('fc-dark-mode', dark.toString())
  }, [dark])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login') } else { setUser(session.user); setLoading(false) }
    })
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const bg = dark ? '#080d14' : '#F5F2EC'
  const sidebar = dark ? '#0c1220' : '#ffffff'
  const border = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const text = dark ? '#e0ecf8' : '#1a1a1a'
  const muted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const navActive = dark ? 'rgba(43,94,167,0.25)' : 'rgba(43,94,167,0.07)'
  const navHover = dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.03)'
  const accent = dark ? '#7aaee8' : '#2B5EA7'

  if (loading) return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: muted }}>Loading...</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: 'Georgia, serif' }}>

      {/* SIDEBAR */}
      <div style={{ width: '240px', flexShrink: 0, background: sidebar, borderRight: `0.5px solid ${border}`, display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50 }}>

        {/* Logo */}
        <div style={{ padding: '24px 24px 20px', borderBottom: `0.5px solid ${border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '28px', height: '28px', border: '1.5px solid #2B5EA7', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '7px', height: '7px', background: '#2B5EA7', borderRadius: '2px' }} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', color: text }}>
              FLOW <span style={{ color: '#2B5EA7' }}>CAPITALS</span>
            </div>
          </div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: muted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, paddingLeft: '38px' }}>Member Area</div>
        </div>

        {/* Nav */}
        <div style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '8px', color: muted, letterSpacing: '0.14em', textTransform: 'uppercase' as const, padding: '0 12px', marginBottom: '8px' }}>Platform</div>
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href
            return (
              <a key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', textDecoration: 'none', marginBottom: '2px', background: active ? navActive : 'transparent', borderLeft: active ? '2px solid #2B5EA7' : '2px solid transparent' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = navHover }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: '16px', color: active ? '#2B5EA7' : muted, width: '20px', textAlign: 'center' }}>{item.icon}</span>
                <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: active ? accent : muted, fontWeight: active ? '600' : '400' }}>{item.label}</span>
              </a>
            )
          })}
        </div>

        {/* Bottom */}
        <div style={{ padding: '16px', borderTop: `0.5px solid ${border}` }}>

          {/* Dark mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px' }}>{dark ? '🌙' : '☀️'}</span>
              <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: muted }}>{dark ? 'Dark mode' : 'Light mode'}</span>
            </div>
            <button onClick={() => {
  const newDark = !dark
  setDark(newDark)
  localStorage.setItem('fc-dark-mode', newDark.toString())
  window.dispatchEvent(new Event('fc-theme-change'))
}} style={{ width: '40px', height: '22px', background: dark ? '#2B5EA7' : 'rgba(26,26,26,0.12)', borderRadius: '11px', border: 'none', cursor: 'pointer', position: 'relative', padding: 0 }}>
              <div style={{ width: '16px', height: '16px', background: '#ffffff', borderRadius: '50%', position: 'absolute', top: '3px', left: dark ? '21px' : '3px', transition: 'left 0.25s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
            </button>
          </div>

          {/* User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: '#2B5EA7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#ffffff', fontWeight: '700' }}>{user?.email?.[0]?.toUpperCase()}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: text, fontWeight: '500', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: muted, textTransform: 'uppercase' as const }}>Member</div>
            </div>
          </div>

          <button onClick={handleLogout} style={{ width: '100%', background: 'none', border: `0.5px solid ${border}`, color: muted, fontFamily: 'Arial, sans-serif', fontSize: '10px', textTransform: 'uppercase' as const, padding: '8px', cursor: 'pointer', borderRadius: '4px' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc3232'; e.currentTarget.style.color = '#dc3232' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}
          >Sign out</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', background: bg }}>
        {children}
      </div>

    </div>
  )
}