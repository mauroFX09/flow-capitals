'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type WallPost = {
  id: string
  user_id: string
  screenshot_url: string
  amount: number
  caption: string
  is_public: boolean
  created_at: string
  profiles?: { full_name: string }
}

const TABS = [
  { label: 'Public Wall', value: 'public' },
  { label: 'My Wall', value: 'personal' },
]

function SegmentedControl({ options, value, onChange, dark }: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  dark: boolean
}) {
  const cardBg = dark ? '#0f1825' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const textMuted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const activeIdx = options.findIndex(o => o.value === value)
  return (
    <div style={{ position: 'relative', display: 'flex', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.05)', borderRadius: '10px', padding: '3px' }}>
      <div style={{ position: 'absolute', top: '3px', left: `calc(3px + ${activeIdx} * (100% - 6px) / ${options.length})`, width: `calc((100% - 6px) / ${options.length})`, height: 'calc(100% - 6px)', background: cardBg, borderRadius: '7px', boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.12)', border: `0.5px solid ${cardBorder}`, transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 0 }} />
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{ flex: 1, padding: '7px 20px', background: 'transparent', border: 'none', color: value === opt.value ? (dark ? '#e0ecf8' : '#1a1a1a') : textMuted, fontFamily: 'var(--font-inter)', fontSize: '11px', cursor: 'pointer', position: 'relative', zIndex: 1, fontWeight: value === opt.value ? '600' : '400', transition: 'color 0.2s ease', borderRadius: '7px', whiteSpace: 'nowrap' as const }}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function TradingWall() {
  const [dark, setDark] = useState(false)
  const [tab, setTab] = useState('public')
  const [posts, setPosts] = useState<WallPost[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [profileNames, setProfileNames] = useState<Record<string, string>>({})
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [screenshotUrl, setScreenshotUrl] = useState('')
  const [form, setForm] = useState({ amount: '', caption: '', is_public: true })
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('fc-dark-mode')
    if (saved === 'true') setDark(true)
    const handler = () => setDark(localStorage.getItem('fc-dark-mode') === 'true')
    window.addEventListener('storage', handler)
    window.addEventListener('fc-theme-change', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('fc-theme-change', handler)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      setUserId(session.user.id)
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single()
      if (profile?.full_name) setFirstName(profile.full_name.split(' ')[0])
      loadPosts(session.user.id)
    })
  }, [])

  async function loadPosts(uid: string) {
  setLoading(true)
  let data: any[] = []
  if (tab === 'public') {
    const { data: d } = await supabase.from('wall_posts').select('*').eq('is_public', true).order('created_at', { ascending: false })
    if (d) data = d
  } else {
    const { data: d } = await supabase.from('wall_posts').select('*').eq('user_id', uid).order('created_at', { ascending: false })
    if (d) data = d
  }
  setPosts(data)
  // Fetch names for all unique user_ids
  const userIds = [...new Set(data.map((p: any) => p.user_id))]
  if (userIds.length > 0) {
    const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds)
    if (profiles) {
      const nameMap: Record<string, string> = {}
      profiles.forEach((p: any) => { nameMap[p.id] = p.full_name?.split(' ')[0] || 'Member' })
      setProfileNames(nameMap)
    }
  }
  setLoading(false)
}

  useEffect(() => {
    if (userId) loadPosts(userId)
  }, [tab, userId])

  async function uploadScreenshot(file: File) {
  if (!userId) return
  setUploading(true)
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`
  console.log('Uploading to path:', path)
  const { data: uploadData, error } = await supabase.storage.from('wall-screenshots').upload(path, file)
  console.log('Upload result:', uploadData, 'Error:', error)
  if (!error && uploadData) {
    const { data: urlData } = supabase.storage.from('wall-screenshots').getPublicUrl(uploadData.path)
    console.log('Public URL:', urlData.publicUrl)
    setScreenshotUrl(urlData.publicUrl)
  }
  setUploading(false)
}

  async function savePost() {
    if (!userId || !form.amount) return
    setSaving(true)
    await supabase.from('wall_posts').insert({
      user_id: userId,
      screenshot_url: screenshotUrl,
      amount: parseFloat(form.amount),
      caption: form.caption,
      is_public: form.is_public,
    })
    setForm({ amount: '', caption: '', is_public: true })
    setScreenshotUrl('')
    setShowForm(false)
    loadPosts(userId)
    setSaving(false)
  }

  async function deletePost(id: string) {
    await supabase.from('wall_posts').delete().eq('id', id)
    if (userId) loadPosts(userId)
  }

  async function togglePublic(post: WallPost) {
    await supabase.from('wall_posts').update({ is_public: !post.is_public }).eq('id', post.id)
    if (userId) loadPosts(userId)
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

  return (
    <div style={{ padding: '40px 48px', background: bg, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: accent }} />Trading Wall
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1 }}>Wall of Proof.</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SegmentedControl options={TABS} value={tab} onChange={setTab} dark={dark} />
            <button onClick={() => setShowForm(!showForm)} style={{ background: accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '10px 20px', border: 'none', cursor: 'pointer', borderRadius: '10px', fontWeight: '700', whiteSpace: 'nowrap' as const }}>
              {showForm ? '— Cancel' : '+ Post Payout'}
            </button>
          </div>
        </div>
      </div>

      {/* Post form */}
      {showForm && (
        <div style={{ ...card, padding: '32px', marginBottom: '24px' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: '20px' }}>New Payout Post</div>

          {/* Screenshot upload */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Screenshot</label>
            {screenshotUrl ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={screenshotUrl} alt="payout" style={{ width: '200px', height: '130px', objectFit: 'cover', borderRadius: '10px', border: `0.5px solid ${cardBorder}` }} />
                <button onClick={() => setScreenshotUrl('')} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', color: '#ffffff', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ width: '200px', height: '130px', background: inputBg, border: `1px dashed ${inputBorder}`, borderRadius: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: textMuted, transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = inputBorder}
              >
                <span style={{ fontSize: '28px' }}>{uploading ? '⏳' : '📸'}</span>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px' }}>{uploading ? 'Uploading...' : 'Upload screenshot'}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
  const file = e.target.files?.[0]
  if (file) {
    await uploadScreenshot(file)
  }
}} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Amount (€)</label>
              <input type="number" step="any" placeholder="1250" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: parseFloat(form.amount) > 0 ? '#22c55e' : textPrimary, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Caption</label>
              <input type="text" placeholder="First funded payout. The blueprint works." value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, outline: 'none' }} />
            </div>
          </div>

          {/* Public / Private toggle */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Visibility</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setForm({ ...form, is_public: true })} style={{ padding: '10px 24px', background: form.is_public ? accent : inputBg, border: `0.5px solid ${form.is_public ? accent : inputBorder}`, borderRadius: '10px', color: form.is_public ? '#ffffff' : textMuted, fontFamily: 'var(--font-inter)', fontSize: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌍 Post on Public Wall
              </button>
              <button onClick={() => setForm({ ...form, is_public: false })} style={{ padding: '10px 24px', background: !form.is_public ? dark ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,26,0.08)' : inputBg, border: `0.5px solid ${!form.is_public ? (dark ? 'rgba(255,255,255,0.2)' : 'rgba(26,26,26,0.2)') : inputBorder}`, borderRadius: '10px', color: !form.is_public ? textPrimary : textMuted, fontFamily: 'var(--font-inter)', fontSize: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔒 Keep Private
              </button>
            </div>
          </div>

          <button onClick={savePost} disabled={saving || !form.amount} style={{ background: accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '13px 32px', border: 'none', cursor: saving || !form.amount ? 'not-allowed' : 'pointer', borderRadius: '10px', fontWeight: '700', opacity: saving || !form.amount ? 0.7 : 1 }}>
            {saving ? 'Posting...' : 'Post Payout →'}
          </button>
        </div>
      )}

      {/* Posts grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>Loading...</div>
      ) : posts.length === 0 ? (
        <div style={{ ...card, padding: '80px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏆</div>
          <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '20px', color: textMuted, marginBottom: '8px' }}>
            {tab === 'public' ? 'No payouts posted yet.' : 'You have not posted any payouts yet.'}
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted }}>
            {tab === 'public' ? 'Be the first to post your payout.' : 'Post your first payout and inspire the community.'}
          </div>
        </div>
      ) : (
        <div style={{ columns: '3', columnGap: '12px' }}>
          {posts.map(post => (
            <div key={post.id} style={{ ...card, marginBottom: '12px', breakInside: 'avoid', overflow: 'hidden', display: 'inline-block', width: '100%' }}>
              {/* Screenshot */}
              {post.screenshot_url && (
                <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img src={post.screenshot_url} alt="payout" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Content */}
              <div style={{ padding: '18px 20px' }}>
                {/* Amount */}
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#22c55e', lineHeight: 1, marginBottom: '6px' }}>
                  +{post.amount.toFixed(0)}€
                </div>

                {/* Caption */}
                {post.caption && (
                  <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '13px', color: textPrimary, lineHeight: '1.6', marginBottom: '12px' }}>
                    &ldquo;{post.caption}&rdquo;
                  </p>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', background: '#2B5EA7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#ffffff', fontWeight: '700' }}>
                        {(profileNames[post.user_id] || 'M')[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textPrimary, fontWeight: '600' }}>{profileNames[post.user_id] || 'Member'}</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted }}>{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>

                  {/* Owner actions */}
                  {post.user_id === userId && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => togglePublic(post)} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted, transition: 'all 0.2s' }}
                        title={post.is_public ? 'Make private' : 'Make public'}
                      >
                        {post.is_public ? '🌍' : '🔒'}
                      </button>
                      <button onClick={() => deletePost(post.id)} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc3232'; e.currentTarget.style.color = '#dc3232' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.color = textMuted }}
                      >✕</button>
                    </div>
                  )}

                  {/* Private badge */}
                  {!post.is_public && (
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.04)', padding: '3px 8px', borderRadius: '4px' }}>🔒 Private</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}