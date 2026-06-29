'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Professional']
const PAIR_OPTIONS = ['EUR/USD', 'GBP/USD', 'XAU/USD', 'NAS100', 'US500', 'GBP/JPY', 'USD/JPY', 'AUD/USD', 'BTC/USD', 'USOIL']

export default function ProfilePage() {
  const router = useRouter()
  const [dark, setDark] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState({
    email: '',
    full_name: '',
    country: '',
    experience: '',
    goals: '',
    preferred_pairs: [] as string[],
    bio: '',
    avatar_url: '',
    role: '',
    created_at: '',
  })

  // Password change state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const savedDark = localStorage.getItem('fc-dark-mode')
    if (savedDark === 'true') setDark(true)
    const handler = () => setDark(localStorage.getItem('fc-dark-mode') === 'true')
    window.addEventListener('storage', handler)
    window.addEventListener('fc-theme-change', handler)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('fc-theme-change', handler)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (data) {
        setProfile({
          email: session.user.email || '',
          full_name: data.full_name || '',
          country: data.country || '',
          experience: data.experience || '',
          goals: data.goals || '',
          preferred_pairs: data.preferred_pairs || [],
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          role: data.role || 'standard',
          created_at: data.created_at || session.user.created_at || '',
        })
      }
      setLoading(false)
    })
  }, [])

  async function uploadAvatar(file: File) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${session.user.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      setProfile(p => ({ ...p, avatar_url: data.publicUrl + '?t=' + Date.now() }))
    }
    setUploading(false)
  }

  async function saveProfile() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setSaving(true)
    await supabase.from('profiles').update({
      full_name: profile.full_name,
      country: profile.country,
      experience: profile.experience,
      goals: profile.goals,
      preferred_pairs: profile.preferred_pairs,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
    }).eq('id', session.user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function changePassword() {
    setPasswordError('')
    if (newPassword.length < 8) { setPasswordError('Password must be at least 8 characters.'); return }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) { setPasswordError(error.message); setSavingPassword(false); return }
    setNewPassword('')
    setConfirmPassword('')
    setPasswordSaved(true)
    setSavingPassword(false)
    setTimeout(() => setPasswordSaved(false), 3000)
  }

  function togglePair(pair: string) {
    setProfile(p => ({
      ...p,
      preferred_pairs: p.preferred_pairs.includes(pair)
        ? p.preferred_pairs.filter(x => x !== pair)
        : [...p.preferred_pairs, pair]
    }))
  }

  const bg = dark ? '#080d14' : '#F5F2EC'
  const cardBg = dark ? '#0f1825' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const cardShadow = dark ? '0 4px 20px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset' : '0 4px 20px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset'
  const textPrimary = dark ? '#e0ecf8' : '#1a1a1a'
  const textMuted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const accent = dark ? '#7aaee8' : '#2B5EA7'
  const inputBg = dark ? '#0a1018' : '#F5F2EC'
  const inputBorder = dark ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,26,0.12)'
  const card = { background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow }

  const inputStyle = { width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }

  if (loading) return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>Loading...</div>
    </div>
  )

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px 48px', background: bg, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: isMobile ? '16px' : '28px' }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: isMobile ? '6px' : '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: isMobile ? '16px' : '24px', height: '1px', background: accent }} />Profile
        </div>
        {isMobile ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: textPrimary, letterSpacing: '-1px', lineHeight: 1, marginBottom: '14px' }}>Your Profile.</h1>
            <button onClick={saveProfile} disabled={saving} style={{ width: '100%', background: saved ? '#22c55e' : accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '13px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: '10px', fontWeight: '700', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes →'}
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '40px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1 }}>Your Profile.</h1>
            <button onClick={saveProfile} disabled={saving} style={{ background: saved ? '#22c55e' : accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '11px 24px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: '10px', fontWeight: '700', opacity: saving ? 0.7 : 1, transition: 'all 0.2s' }}>
              {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes →'}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: '12px', alignItems: 'start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>

          {/* Avatar */}
          <div style={{ ...card, padding: isMobile ? '20px' : '28px', display: 'flex', flexDirection: isMobile ? 'row' : 'column' as const, alignItems: 'center', gap: isMobile ? '16px' : '0', textAlign: isMobile ? 'left' : 'center' as const }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: isMobile ? '0' : '16px', flexShrink: 0 }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" style={{ width: isMobile ? '64px' : '80px', height: isMobile ? '64px' : '80px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}` }} />
              ) : (
                <div style={{ width: isMobile ? '64px' : '80px', height: isMobile ? '64px' : '80px', borderRadius: '50%', background: '#2B5EA7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '22px' : '28px', color: '#ffffff', fontWeight: '700' }}>
                    {(profile.full_name || profile.email || 'M')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ position: 'absolute', bottom: '0', right: '0', width: '26px', height: '26px', background: accent, border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                {uploading ? '⏳' : '✎'}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => { const file = e.target.files?.[0]; if (file) await uploadAvatar(file) }} />
            <div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '15px' : '16px', fontWeight: '700', color: textPrimary, marginBottom: '4px' }}>{profile.full_name || 'Your Name'}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{profile.email}</div>
            </div>
          </div>

          {/* Account info */}
          <div style={{ ...card, padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '14px' }}>Account Info</div>
            {isMobile ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Email', value: profile.email, colSpan: '1 / -1' },
                  { label: 'Membership', value: profile.role.charAt(0).toUpperCase() + profile.role.slice(1) },
                  { label: 'Member Since', value: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
                ].map(item => (
                  <div key={item.label} style={{ gridColumn: (item as any).colSpan }}>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '3px' }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '12px', color: textPrimary, wordBreak: 'break-all' as const }}>{item.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              [
                { label: 'Email', value: profile.email },
                { label: 'Membership', value: profile.role.charAt(0).toUpperCase() + profile.role.slice(1) },
                { label: 'Member Since', value: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: '12px' }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '3px' }}>{item.label}</div>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary }}>{item.value}</div>
                </div>
              ))
            )}
          </div>

          {/* Security — password change */}
          <div style={{ ...card, padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '16px' }}>Security</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
              <div>
                <label style={labelStyle}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  onKeyDown={e => e.key === 'Enter' && changePassword()}
                  style={inputStyle}
                />
              </div>
              {passwordError && (
                <div style={{ padding: '8px 12px', background: 'rgba(220,50,50,0.06)', border: '0.5px solid rgba(220,50,50,0.2)', borderRadius: '8px' }}>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#dc3232', margin: 0 }}>{passwordError}</p>
                </div>
              )}
              {passwordSaved && (
                <div style={{ padding: '8px 12px', background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: '8px' }}>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#22c55e', margin: 0 }}>✓ Password updated successfully.</p>
                </div>
              )}
              <button
                onClick={changePassword}
                disabled={savingPassword || !newPassword || !confirmPassword}
                style={{ background: passwordSaved ? '#22c55e' : accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '11px', border: 'none', borderRadius: '10px', cursor: savingPassword || !newPassword || !confirmPassword ? 'not-allowed' : 'pointer', opacity: savingPassword || (!newPassword || !confirmPassword) ? 0.6 : 1, transition: 'all 0.2s' }}
              >
                {savingPassword ? 'Updating...' : passwordSaved ? '✓ Updated' : 'Update Password →'}
              </button>
            </div>
          </div>
        </div>

        {/* Right column — editable fields */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>

          {/* Personal */}
          <div style={{ ...card, padding: isMobile ? '20px' : '28px 32px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '16px' }}>Personal Information</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} placeholder="Mauro Steenhoudt" />
              </div>
              <div>
                <label style={labelStyle}>Country</label>
                <input style={inputStyle} value={profile.country} onChange={e => setProfile(p => ({ ...p, country: e.target.value }))} placeholder="Belgium" />
              </div>
            </div>
          </div>

          {/* Trading */}
          <div style={{ ...card, padding: isMobile ? '20px' : '28px 32px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '16px' }}>Trading Profile</div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Experience Level</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                {EXPERIENCE_OPTIONS.map(exp => (
                  <button key={exp} onClick={() => setProfile(p => ({ ...p, experience: exp }))} style={{ padding: isMobile ? '8px 14px' : '7px 16px', background: profile.experience === exp ? accent : inputBg, border: `0.5px solid ${profile.experience === exp ? accent : inputBorder}`, borderRadius: '20px', color: profile.experience === exp ? '#ffffff' : textMuted, fontFamily: 'var(--font-inter)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Preferred Pairs</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                {PAIR_OPTIONS.map(pair => (
                  <button key={pair} onClick={() => togglePair(pair)} style={{ padding: isMobile ? '7px 12px' : '6px 12px', background: profile.preferred_pairs.includes(pair) ? accent : inputBg, border: `0.5px solid ${profile.preferred_pairs.includes(pair) ? accent : inputBorder}`, borderRadius: '20px', color: profile.preferred_pairs.includes(pair) ? '#ffffff' : textMuted, fontFamily: 'var(--font-inter)', fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {pair}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Trading Goals</label>
              <textarea value={profile.goals} onChange={e => setProfile(p => ({ ...p, goals: e.target.value }))} rows={3} placeholder="What do you want to achieve? What is your target monthly income from trading?" style={{ ...inputStyle, resize: 'vertical' as const }} />
            </div>

            <div>
              <label style={labelStyle}>Bio <span style={{ opacity: 0.5 }}>(optional)</span></label>
              <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={2} placeholder="A short description about yourself..." style={{ ...inputStyle, resize: 'vertical' as const }} />
            </div>
          </div>

          {isMobile && (
            <button onClick={saveProfile} disabled={saving} style={{ background: saved ? '#22c55e' : accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '14px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: '10px', fontWeight: '700', opacity: saving ? 0.7 : 1, marginBottom: 'env(safe-area-inset-bottom)' }}>
              {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}