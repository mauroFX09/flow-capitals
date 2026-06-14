'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞', access: 'all' },
  { label: 'Journal', href: '/dashboard/journal', icon: '◫', access: 'all' },
  { label: 'Courses', href: '/dashboard/courses', icon: '▤', access: 'premium' },
  { label: 'Trading Wall', href: '/dashboard/wall', icon: '◈', access: 'all' },
  { label: 'Q & A', href: '/dashboard/qa', icon: '◎', access: 'premium' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string>('standard')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('fc-dark-mode')
    if (saved === 'true') setDark(true)
    const savedCollapsed = localStorage.getItem('fc-sidebar-collapsed')
    if (savedCollapsed === 'true') setCollapsed(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('fc-dark-mode', dark.toString())
  }, [dark])

  useEffect(() => {
    localStorage.setItem('fc-sidebar-collapsed', collapsed.toString())
  }, [collapsed])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      const { data: profile } = await supabase.from('profiles').select('role, avatar_url').eq('id', session.user.id).single()
      if (profile?.role) setRole(profile.role)
      if (profile?.avatar_url) setAvatarUrl(profile.avatar_url)
      setLoading(false)
    })
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isPremium = role === 'premium' || role === 'admin'
  const bg = dark ? '#080d14' : '#F5F2EC'
  const sidebar = dark ? '#0c1220' : '#ffffff'
  const border = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const text = dark ? '#e0ecf8' : '#1a1a1a'
  const muted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const navActive = dark ? 'rgba(43,94,167,0.25)' : 'rgba(43,94,167,0.07)'
  const navHover = dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.03)'
  const accent = dark ? '#7aaee8' : '#2B5EA7'
  const sidebarWidth = collapsed ? '64px' : '240px'

  if (loading) return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: muted }}>Loading...</div>
    </div>
  )

  const AvatarCircle = ({ size = 30 }: { size?: number }) => (
    <div style={{ width: `${size}px`, height: `${size}px`, background: '#2B5EA7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
      {avatarUrl
        ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ fontFamily: 'var(--font-inter)', fontSize: `${size * 0.4}px`, color: '#ffffff', fontWeight: '700' }}>{user?.email?.[0]?.toUpperCase()}</span>
      }
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: 'var(--font-playfair)' }}>

      {/* SIDEBAR */}
      <div style={{ width: sidebarWidth, flexShrink: 0, background: sidebar, borderRight: `0.5px solid ${border}`, display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50, transition: 'width 0.25s ease', overflow: 'hidden' }}>

        {/* Logo + collapse */}
        <div style={{ padding: collapsed ? '20px 0' : '20px 16px', borderBottom: `0.5px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', transition: 'padding 0.25s ease' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', border: '1.5px solid #2B5EA7', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: '7px', height: '7px', background: '#2B5EA7', borderRadius: '2px' }} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', color: text, whiteSpace: 'nowrap' as const }}>
                FLOW <span style={{ color: '#2B5EA7' }}>CAPITALS</span>
              </div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ width: '28px', height: '28px', background: 'none', border: `0.5px solid ${border}`, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted, fontSize: '12px', flexShrink: 0, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Nav */}
        <div style={{ padding: collapsed ? '12px 8px' : '16px 10px', flex: 1 }}>
          {!collapsed && (
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: muted, letterSpacing: '0.14em', textTransform: 'uppercase' as const, padding: '0 10px', marginBottom: '8px', whiteSpace: 'nowrap' as const }}>Platform</div>
          )}
          {NAV_ITEMS.map(item => {
            const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname === item.href || pathname.startsWith(item.href + '/')
            const locked = item.access === 'premium' && !isPremium
            return (
              <a key={item.href} href={locked ? '/dashboard/upgrade' : item.href}
                title={collapsed ? item.label : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: collapsed ? '0' : '12px', padding: collapsed ? '10px 0' : '10px 10px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: '8px', textDecoration: 'none', marginBottom: '2px', background: active ? navActive : 'transparent', borderLeft: collapsed ? 'none' : active ? '2px solid #2B5EA7' : '2px solid transparent', transition: 'all 0.15s', opacity: locked ? 0.5 : 1 }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = navHover }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: '18px', color: active ? '#2B5EA7' : muted, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                {!collapsed && (
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: active ? accent : muted, fontWeight: active ? '600' : '400', whiteSpace: 'nowrap' as const, flex: 1 }}>{item.label}</span>
                )}
                {!collapsed && locked && (
                  <span style={{ fontSize: '9px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '1px 6px', borderRadius: '4px', fontFamily: 'var(--font-inter)' }}>PRO</span>
                )}
              </a>
            )
          })}
        </div>

        {/* Bottom */}
        <div style={{ padding: collapsed ? '12px 8px' : '14px', borderTop: `0.5px solid ${border}` }}>
          {!collapsed ? (
            <>
              {/* Role badge */}
              <div style={{ marginBottom: '12px', padding: '6px 10px', background: isPremium ? 'rgba(43,94,167,0.08)' : 'rgba(245,158,11,0.08)', border: `0.5px solid ${isPremium ? 'rgba(43,94,167,0.2)' : 'rgba(245,158,11,0.2)'}`, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isPremium ? accent : '#f59e0b' }} />
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: isPremium ? accent : '#f59e0b', fontWeight: '600' }}>{isPremium ? 'Premium' : 'Standard'}</span>
                {!isPremium && <a href="/membership" style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#f59e0b', textDecoration: 'none', marginLeft: 'auto', opacity: 0.7 }}>Upgrade →</a>}
              </div>

              {/* Dark mode toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px' }}>{dark ? '🌙' : '☀️'}</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: muted, whiteSpace: 'nowrap' as const }}>{dark ? 'Dark mode' : 'Light mode'}</span>
                </div>
                <button onClick={() => {
                  const newDark = !dark
                  setDark(newDark)
                  localStorage.setItem('fc-dark-mode', newDark.toString())
                  window.dispatchEvent(new Event('fc-theme-change'))
                }} style={{ width: '40px', height: '22px', background: dark ? '#2B5EA7' : 'rgba(26,26,26,0.12)', borderRadius: '11px', border: 'none', cursor: 'pointer', position: 'relative', padding: 0, flexShrink: 0 }}>
                  <div style={{ width: '16px', height: '16px', background: '#ffffff', borderRadius: '50%', position: 'absolute', top: '3px', left: dark ? '21px' : '3px', transition: 'left 0.25s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
                </button>
              </div>

              {/* User — clickable avatar */}
              <a href="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', textDecoration: 'none', cursor: 'pointer', padding: '6px 4px', borderRadius: '8px', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = navHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <AvatarCircle size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: text, fontWeight: '500', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: muted, textTransform: 'uppercase' as const }}>{role}</div>
                </div>
              </a>

              <button onClick={handleLogout} style={{ width: '100%', background: 'none', border: `0.5px solid ${border}`, color: muted, fontFamily: 'var(--font-inter)', fontSize: '10px', textTransform: 'uppercase' as const, padding: '7px', cursor: 'pointer', borderRadius: '6px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc3232'; e.currentTarget.style.color = '#dc3232' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}
              >Sign out</button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => {
                const newDark = !dark
                setDark(newDark)
                localStorage.setItem('fc-dark-mode', newDark.toString())
                window.dispatchEvent(new Event('fc-theme-change'))
              }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '6px 0' }}>
                {dark ? '🌙' : '☀️'}
              </button>
              <a href="/dashboard/profile" title={user?.email} style={{ textDecoration: 'none' }}>
                <AvatarCircle size={30} />
              </a>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: muted, padding: '4px' }}
                title="Sign out"
                onMouseEnter={e => e.currentTarget.style.color = '#dc3232'}
                onMouseLeave={e => e.currentTarget.style.color = muted}
              >⏻</button>
            </div>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ marginLeft: sidebarWidth, flex: 1, minHeight: '100vh', background: bg, transition: 'margin-left 0.25s ease' }}>
        {children}
      </div>
    </div>
  )
}