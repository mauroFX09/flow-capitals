'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞', access: 'all' },
  { label: 'Journal', href: '/dashboard/journal', icon: '◫', access: 'all' },
  { label: 'Courses', href: '/dashboard/courses', icon: '▤', access: 'premium' },
  { label: 'Trading Wall', href: '/dashboard/wall', icon: '◈', access: 'all' },
  { label: 'Q & A', href: '/dashboard/qa', icon: '◎', access: 'premium', soon: true },
  { label: 'Admin', href: '/dashboard/admin', icon: '⚙', access: 'admin' },
]

const CHECKLIST_ITEMS = [
  { key: 'profile', label: 'Complete your profile', sub: 'Set your name', href: '/dashboard/profile' },
  { key: 'trade', label: 'Log your first trade', sub: 'Open the journal', href: '/dashboard/journal' },
  { key: 'lesson', label: 'Watch your first lesson', sub: 'Explore the courses', href: '/dashboard/courses' },
  { key: 'wall', label: 'Post on the Trading Wall', sub: 'Share an achievement', href: '/dashboard/wall' },
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

  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [onboardingName, setOnboardingName] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [savingOnboarding, setSavingOnboarding] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)

  const [checklist, setChecklist] = useState({ profile: false, trade: false, lesson: false, wall: false })

  useEffect(() => {
    const saved = localStorage.getItem('fc-dark-mode')
    if (saved === 'true') setDark(true)
    const savedCollapsed = localStorage.getItem('fc-sidebar-collapsed')
    if (savedCollapsed === 'true') setCollapsed(true)
  }, [])

  useEffect(() => { localStorage.setItem('fc-dark-mode', dark.toString()) }, [dark])
  useEffect(() => { localStorage.setItem('fc-sidebar-collapsed', collapsed.toString()) }, [collapsed])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, avatar_url, full_name, onboarding_completed')
        .eq('id', session.user.id)
        .single()

      if (profile?.role) setRole(profile.role)
      if (profile?.avatar_url) setAvatarUrl(profile.avatar_url)
      if (profile?.full_name) setOnboardingName(profile.full_name)
      if (!profile?.onboarding_completed) setShowOnboarding(true)

      const [{ count: tradeCount }, { count: lessonCount }, { count: wallCount }] = await Promise.all([
        supabase.from('trades').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
        supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
        supabase.from('wall_posts').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
      ])

      setChecklist({
        profile: !!(profile?.full_name),
        trade: (tradeCount || 0) > 0,
        lesson: (lessonCount || 0) > 0,
        wall: (wallCount || 0) > 0,
      })

      setLoading(false)
    })
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function uploadOnboardingAvatar(file: File) {
    setUploadingAvatar(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const ext = file.name.split('.').pop()
    const path = `${session.user.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', session.user.id)
      setAvatarUrl(data.publicUrl)
    }
    setUploadingAvatar(false)
  }

  async function completeOnboarding() {
    setSavingOnboarding(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await supabase.from('profiles').update({
      full_name: onboardingName,
      onboarding_completed: true,
    }).eq('id', session.user.id)
    setChecklist(prev => ({ ...prev, profile: !!(onboardingName) }))
    setShowOnboarding(false)
    setSavingOnboarding(false)
  }

  const isPremium = role === 'premium' || role === 'admin'
  const isAdmin = role === 'admin'
  const bg = dark ? '#080d14' : '#F5F2EC'
  const sidebar = dark ? '#0c1220' : '#ffffff'
  const border = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const text = dark ? '#e0ecf8' : '#1a1a1a'
  const muted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const navActive = dark ? 'rgba(43,94,167,0.25)' : 'rgba(43,94,167,0.07)'
  const navHover = dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.03)'
  const accent = dark ? '#7aaee8' : '#2B5EA7'
  const sidebarWidth = collapsed ? '64px' : '240px'

  const allDone = Object.values(checklist).every(Boolean)
  const doneCount = Object.values(checklist).filter(Boolean).length

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

  const visibleNav = NAV_ITEMS.filter(item => {
    if (item.access === 'admin') return isAdmin
    return true
  })

  // ── ONBOARDING MODAL ──
  const OnboardingModal = () => {
    const steps = [
      { num: 1, label: 'Welcome' },
      { num: 2, label: 'Profile' },
      { num: 3, label: 'Tour' },
      { num: 4, label: 'Ready' },
    ]

    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(8,13,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '520px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>

          {/* Progress bar */}
          <div style={{ height: '3px', background: '#f0ede8' }}>
            <div style={{ height: '100%', background: '#2B5EA7', width: `${(onboardingStep / 4) * 100}%`, transition: 'width 0.4s ease', borderRadius: '0 2px 2px 0' }} />
          </div>

          {/* Step dots */}
          <div style={{ padding: '20px 32px 0', display: 'flex', gap: '6px', alignItems: 'center' }}>
            {steps.map(s => (
              <div key={s.num} style={{ width: s.num === onboardingStep ? '20px' : '6px', height: '6px', borderRadius: '3px', background: s.num <= onboardingStep ? '#2B5EA7' : '#e5e2db', transition: 'all 0.3s ease' }} />
            ))}
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#8a8070', marginLeft: '8px' }}>{onboardingStep} of 4</span>
          </div>

          {/* STEP 1 — Welcome */}
          {onboardingStep === 1 && (
            <div style={{ padding: '32px 32px 36px' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(43,94,167,0.08)', border: '1px solid rgba(43,94,167,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid #2B5EA7', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '7px', height: '7px', background: '#2B5EA7', borderRadius: '2px' }} />
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Welcome</div>
              <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', fontWeight: '700', color: '#0d1e36', lineHeight: 1.1, marginBottom: '14px', letterSpacing: '-0.5px' }}>
                Welcome to<br />Flow Capitals.
              </h2>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#8a8070', lineHeight: '1.7', marginBottom: '28px' }}>
                This platform was built for traders who are serious about consistency. Your journal, your progress, your community — all in one place.
              </p>
              <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '13px', color: '#2B5EA7', marginBottom: '28px' }}>
                "The market rewards discipline, not intelligence."
              </p>
              <button onClick={() => setOnboardingStep(2)} style={{ width: '100%', background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                Let's get started →
              </button>
            </div>
          )}

          {/* STEP 2 — Profile */}
          {onboardingStep === 2 && (
            <div style={{ padding: '32px 32px 36px' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Your Profile</div>
              <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: '#0d1e36', lineHeight: 1.1, marginBottom: '6px', letterSpacing: '-0.5px' }}>Set up your profile</h2>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#8a8070', marginBottom: '28px' }}>Your name appears on the wall and in the community.</p>

              {/* Avatar upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#2B5EA7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {avatarUrl
                    ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontFamily: 'var(--font-inter)', fontSize: '22px', color: '#ffffff', fontWeight: '700' }}>{onboardingName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</span>
                  }
                </div>
                <div>
                  <button onClick={() => avatarRef.current?.click()} disabled={uploadingAvatar} style={{ background: 'none', border: '1px solid #e5e2db', borderRadius: '8px', padding: '8px 14px', fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#8a8070', cursor: 'pointer', display: 'block', marginBottom: '4px' }}>
                    {uploadingAvatar ? 'Uploading...' : avatarUrl ? 'Change photo' : 'Upload photo'}
                  </button>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#b0a898' }}>Optional</span>
                </div>
                <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => { const f = e.target.files?.[0]; if (f) await uploadOnboardingAvatar(f); e.target.value = '' }} />
              </div>

              {/* Name input */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#8a8070', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  value={onboardingName}
                  onChange={e => setOnboardingName(e.target.value)}
                  placeholder="Your full name"
                  style={{ width: '100%', background: '#f9f8f5', border: '1px solid #e5e2db', borderRadius: '10px', padding: '12px 14px', fontFamily: 'var(--font-playfair)', fontSize: '14px', color: '#0d1e36', outline: 'none', boxSizing: 'border-box' as const }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setOnboardingStep(1)} style={{ flex: 1, background: 'none', border: '1px solid #e5e2db', color: '#8a8070', fontFamily: 'var(--font-inter)', fontSize: '12px', padding: '13px', borderRadius: '10px', cursor: 'pointer' }}>← Back</button>
                <button onClick={() => setOnboardingStep(3)} style={{ flex: 2, background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '13px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Tour */}
          {onboardingStep === 3 && (
            <div style={{ padding: '32px 32px 36px' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#2B5EA7', letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Platform Tour</div>
              <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: '#0d1e36', lineHeight: 1.1, marginBottom: '6px', letterSpacing: '-0.5px' }}>Here's what's waiting</h2>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#8a8070', marginBottom: '24px' }}>Three tools built around your growth as a trader.</p>

              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '28px' }}>
                {[
                  { icon: '◫', title: 'Trading Journal', desc: 'Log every trade. Track your P&L, emotions, and patterns. Your data, your edge.' },
                  { icon: '▤', title: 'Courses', desc: 'Technical pillars, psychology, tape reading. Structured learning built for consistent traders.' },
                  { icon: '◈', title: 'Trading Wall', desc: 'Share your payouts with the community. Public or private — your choice.' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', gap: '14px', padding: '14px', background: '#f9f8f5', borderRadius: '12px', border: '0.5px solid #e5e2db' }}>
                    <div style={{ width: '36px', height: '36px', background: 'rgba(43,94,167,0.08)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px', color: '#2B5EA7' }}>{item.icon}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: '700', color: '#0d1e36', marginBottom: '3px' }}>{item.title}</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#8a8070', lineHeight: '1.5' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setOnboardingStep(2)} style={{ flex: 1, background: 'none', border: '1px solid #e5e2db', color: '#8a8070', fontFamily: 'var(--font-inter)', fontSize: '12px', padding: '13px', borderRadius: '10px', cursor: 'pointer' }}>← Back</button>
                <button onClick={() => setOnboardingStep(4)} style={{ flex: 2, background: '#2B5EA7', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '13px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                  I'm ready →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Done */}
          {onboardingStep === 4 && (
            <div style={{ padding: '40px 32px 36px', textAlign: 'center' as const }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <span style={{ fontSize: '22px' }}>✓</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '30px', fontWeight: '700', color: '#0d1e36', letterSpacing: '-0.5px', marginBottom: '10px' }}>
                You're all set{onboardingName ? `, ${onboardingName.split(' ')[0]}` : ''}.
              </h2>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#8a8070', lineHeight: '1.7', marginBottom: '12px' }}>
                Your platform is ready. Start by logging your first trade or exploring the courses.
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#b0a898', marginBottom: '32px' }}>
                You'll see a quick checklist in the sidebar to help you get started.
              </p>
              <button onClick={completeOnboarding} disabled={savingOnboarding} style={{ width: '100%', background: '#0d1e36', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '15px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                {savingOnboarding ? 'Saving...' : 'Enter Flow Capitals →'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: 'var(--font-playfair)' }}>

      {showOnboarding && <OnboardingModal />}

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
        <div style={{ padding: collapsed ? '12px 8px' : '16px 10px', flex: 1, overflowY: 'auto' as const }}>
          {!collapsed && (
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: muted, letterSpacing: '0.14em', textTransform: 'uppercase' as const, padding: '0 10px', marginBottom: '8px', whiteSpace: 'nowrap' as const }}>Platform</div>
          )}
          {visibleNav.map(item => {
            const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname === item.href || pathname.startsWith(item.href + '/')
            const locked = item.access === 'premium' && !isPremium
            const soon = (item as any).soon === true
            const adminItem = item.access === 'admin'
            return (
              <a key={item.href} href={locked ? '/dashboard/upgrade' : item.href}
                title={collapsed ? item.label : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: collapsed ? '0' : '12px', padding: collapsed ? '10px 0' : '10px 10px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: '8px', textDecoration: 'none', marginBottom: '2px', background: active ? navActive : 'transparent', borderLeft: collapsed ? 'none' : active ? '2px solid #2B5EA7' : '2px solid transparent', transition: 'all 0.15s', opacity: locked ? 0.5 : 1 }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = navHover }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: '18px', color: active ? '#2B5EA7' : adminItem ? accent : muted, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                {!collapsed && (
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: active ? accent : adminItem ? accent : muted, fontWeight: active ? '600' : adminItem ? '600' : '400', whiteSpace: 'nowrap' as const, flex: 1 }}>{item.label}</span>
                )}
                {!collapsed && locked && !soon && (
                  <span style={{ fontSize: '9px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '1px 6px', borderRadius: '4px', fontFamily: 'var(--font-inter)' }}>PRO</span>
                )}
                {!collapsed && soon && (
                  <span style={{ fontSize: '9px', color: accent, background: dark ? 'rgba(122,174,232,0.1)' : 'rgba(43,94,167,0.08)', padding: '1px 6px', borderRadius: '4px', fontFamily: 'var(--font-inter)', border: `0.5px solid ${dark ? 'rgba(122,174,232,0.2)' : 'rgba(43,94,167,0.15)'}` }}>Soon</span>
                )}
              </a>
            )
          })}

          {/* CHECKLIST */}
          {!collapsed && !allDone && (
            <div style={{ marginTop: '20px', padding: '14px', background: dark ? 'rgba(43,94,167,0.08)' : 'rgba(43,94,167,0.04)', border: `0.5px solid ${dark ? 'rgba(43,94,167,0.25)' : 'rgba(43,94,167,0.15)'}`, borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', fontWeight: '700', color: accent, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>Get Started</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: muted }}>{doneCount}/4</div>
              </div>

              {/* mini progress bar */}
              <div style={{ height: '3px', background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.08)', borderRadius: '2px', marginBottom: '12px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: accent, width: `${(doneCount / 4) * 100}%`, borderRadius: '2px', transition: 'width 0.4s ease' }} />
              </div>

              {CHECKLIST_ITEMS.map(item => {
                const done = checklist[item.key as keyof typeof checklist]
                return (
                  <a key={item.key} href={done ? '#' : item.href} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', textDecoration: 'none', cursor: done ? 'default' : 'pointer' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `1.5px solid ${done ? accent : dark ? 'rgba(255,255,255,0.2)' : 'rgba(26,26,26,0.2)'}`, background: done ? accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                      {done && <span style={{ color: '#fff', fontSize: '9px', fontWeight: '700' }}>✓</span>}
                    </div>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: done ? muted : text, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* Bottom */}
        <div style={{ padding: collapsed ? '12px 8px' : '14px', borderTop: `0.5px solid ${border}` }}>
          {!collapsed ? (
            <>
              <div style={{ marginBottom: '12px', padding: '6px 10px', background: isPremium ? 'rgba(43,94,167,0.08)' : 'rgba(245,158,11,0.08)', border: `0.5px solid ${isPremium ? 'rgba(43,94,167,0.2)' : 'rgba(245,158,11,0.2)'}`, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isPremium ? accent : '#f59e0b' }} />
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: isPremium ? accent : '#f59e0b', fontWeight: '600' }}>{isPremium ? 'Premium' : 'Standard'}</span>
                {!isPremium && <a href="/membership" style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#f59e0b', textDecoration: 'none', marginLeft: 'auto', opacity: 0.7 }}>Upgrade →</a>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px' }}>{dark ? '🌙' : '☀️'}</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: muted, whiteSpace: 'nowrap' as const }}>{dark ? 'Dark mode' : 'Light mode'}</span>
                </div>
                <button onClick={() => { const n = !dark; setDark(n); localStorage.setItem('fc-dark-mode', n.toString()); window.dispatchEvent(new Event('fc-theme-change')) }} style={{ width: '40px', height: '22px', background: dark ? '#2B5EA7' : 'rgba(26,26,26,0.12)', borderRadius: '11px', border: 'none', cursor: 'pointer', position: 'relative', padding: 0, flexShrink: 0 }}>
                  <div style={{ width: '16px', height: '16px', background: '#ffffff', borderRadius: '50%', position: 'absolute', top: '3px', left: dark ? '21px' : '3px', transition: 'left 0.25s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
                </button>
              </div>

              <a href="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', textDecoration: 'none', padding: '6px 4px', borderRadius: '8px', transition: 'background 0.15s' }}
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
              <button onClick={() => { const n = !dark; setDark(n); localStorage.setItem('fc-dark-mode', n.toString()); window.dispatchEvent(new Event('fc-theme-change')) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '6px 0' }}>
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