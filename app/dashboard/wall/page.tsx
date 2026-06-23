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
}

function SegmentedControl({ options, value, onChange, dark }: {
  options: { label: string; value: string; count?: number }[]
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
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{ flex: 1, padding: '7px 16px', background: 'transparent', border: 'none', color: value === opt.value ? (dark ? '#e0ecf8' : '#1a1a1a') : textMuted, fontFamily: 'var(--font-inter)', fontSize: '11px', cursor: 'pointer', position: 'relative', zIndex: 1, fontWeight: value === opt.value ? '600' : '400', transition: 'color 0.2s ease', borderRadius: '7px', whiteSpace: 'nowrap' as const, display: 'flex', alignItems: 'center', gap: '6px' }}>
          {opt.label}
          {opt.count !== undefined && (
            <span style={{ background: value === opt.value ? (dark ? 'rgba(122,174,232,0.2)' : 'rgba(43,94,167,0.1)') : (dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.06)'), color: value === opt.value ? (dark ? '#7aaee8' : '#2B5EA7') : textMuted, fontSize: '9px', fontWeight: '700', padding: '1px 6px', borderRadius: '10px', lineHeight: '14px' }}>{opt.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}

export default function TradingWall() {
  const [dark, setDark] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [tab, setTab] = useState('public')
  const [allPublic, setAllPublic] = useState<WallPost[]>([])
  const [myPosts, setMyPosts] = useState<WallPost[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
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
      if (!session) return
      setUserId(session.user.id)
      loadAll(session.user.id)
    })
  }, [])

  async function loadAll(uid: string) {
    setLoading(true)
    const [{ data: pub }, { data: mine }] = await Promise.all([
      supabase.from('wall_posts').select('*').eq('is_public', true).order('created_at', { ascending: false }),
      supabase.from('wall_posts').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
    ])
    setAllPublic(pub || [])
    setMyPosts(mine || [])
    const allPosts = [...(pub || []), ...(mine || [])]
    const userIds = [...new Set(allPosts.map(p => p.user_id))]
    if (userIds.length > 0) {
      const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds)
      if (profiles) {
        const nameMap: Record<string, string> = {}
        profiles.forEach(p => { nameMap[p.id] = p.full_name?.split(' ')[0] || 'Member' })
        setProfileNames(nameMap)
      }
    }
    setLoading(false)
  }

  async function uploadScreenshot(file: File) {
    if (!userId) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`
    const { data: uploadData, error } = await supabase.storage.from('wall-screenshots').upload(path, file)
    if (!error && uploadData) {
      const { data: urlData } = supabase.storage.from('wall-screenshots').getPublicUrl(uploadData.path)
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
    loadAll(userId)
    setSaving(false)
  }

  async function deletePost(id: string) {
    await supabase.from('wall_posts').delete().eq('id', id)
    if (userId) loadAll(userId)
  }

  async function togglePublic(post: WallPost) {
    await supabase.from('wall_posts').update({ is_public: !post.is_public }).eq('id', post.id)
    if (userId) loadAll(userId)
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

  const posts = tab === 'public' ? allPublic : myPosts
  const totalCommunityPnl = allPublic.reduce((s, p) => s + (p.amount || 0), 0)
  const biggestPayout = allPublic.length > 0 ? Math.max(...allPublic.map(p => p.amount)) : 0
  const maxAmount = posts.length > 0 ? Math.max(...posts.map(p => p.amount)) : 1

  // Form panel — side panel on desktop, bottom sheet on mobile
  const FormPanel = () => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: isMobile ? 'column' : 'row' as const }} onClick={() => setShowForm(false)}>
      {!isMobile && <div style={{ flex: 1 }} />}
      {isMobile && <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)' }} />}
      <div
        style={{
          width: isMobile ? '100%' : '440px',
          height: isMobile ? 'auto' : '100vh',
          maxHeight: isMobile ? '92vh' : '100vh',
          background: cardBg,
          boxShadow: isMobile ? '0 -4px 40px rgba(0,0,0,0.3)' : '-4px 0 40px rgba(0,0,0,0.3)',
          padding: isMobile ? '20px 20px calc(20px + env(safe-area-inset-bottom))' : '40px 36px',
          overflowY: 'auto' as const,
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '18px',
          borderRadius: isMobile ? '20px 20px 0 0' : '0',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle on mobile */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-6px', marginTop: '-4px' }}>
            <div style={{ width: '36px', height: '4px', background: dark ? 'rgba(255,255,255,0.15)' : 'rgba(26,26,26,0.12)', borderRadius: '2px' }} />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '20px' : '22px', fontWeight: '700', color: textPrimary }}>Post Payout</div>
          <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '20px' }}>✕</button>
        </div>

        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted, lineHeight: '1.6', padding: '12px 16px', background: dark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.04)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: '10px' }}>
          Share your payout with the community. Every post is proof that the blueprint works.
        </div>

        {/* Screenshot */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Screenshot</label>
          {screenshotUrl ? (
            <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', border: `0.5px solid ${cardBorder}` }}>
              <img src={screenshotUrl} alt="payout" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setScreenshotUrl('')} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#ffffff', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ width: '100%', height: '130px', background: inputBg, border: `1.5px dashed ${inputBorder}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: '10px', color: textMuted }}>
              <span style={{ fontSize: '28px' }}>{uploading ? '⏳' : '📸'}</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px' }}>{uploading ? 'Uploading...' : 'Upload payout screenshot'}</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => { const file = e.target.files?.[0]; if (file) await uploadScreenshot(file) }} />
        </div>

        {/* Amount */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Payout Amount (€)</label>
          <input type="number" step="any" placeholder="1,250" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '12px 14px', fontFamily: 'var(--font-playfair)', fontSize: '20px', color: parseFloat(form.amount) > 0 ? '#22c55e' : textPrimary, outline: 'none' }} />
        </div>

        {/* Caption */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Caption <span style={{ opacity: 0.5 }}>(optional)</span></label>
          <textarea value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} rows={3} placeholder="First funded payout. The blueprint works." style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '12px 14px', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '14px', color: textPrimary, outline: 'none', resize: 'none' as const }} />
        </div>

        {/* Visibility */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Visibility</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setForm({ ...form, is_public: true })} style={{ flex: 1, padding: '12px', background: form.is_public ? accent : inputBg, border: `0.5px solid ${form.is_public ? accent : inputBorder}`, borderRadius: '10px', color: form.is_public ? '#ffffff' : textMuted, fontFamily: 'var(--font-inter)', fontSize: '12px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              🌍 Public
            </button>
            <button onClick={() => setForm({ ...form, is_public: false })} style={{ flex: 1, padding: '12px', background: !form.is_public ? (dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.06)') : inputBg, border: `0.5px solid ${!form.is_public ? (dark ? 'rgba(255,255,255,0.15)' : 'rgba(26,26,26,0.15)') : inputBorder}`, borderRadius: '10px', color: !form.is_public ? textPrimary : textMuted, fontFamily: 'var(--font-inter)', fontSize: '12px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              🔒 Private
            </button>
          </div>
        </div>

        <button onClick={savePost} disabled={saving || !form.amount} style={{ background: '#22c55e', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '14px', border: 'none', cursor: saving || !form.amount ? 'not-allowed' : 'pointer', borderRadius: '10px', fontWeight: '700', opacity: saving || !form.amount ? 0.7 : 1, marginTop: 'auto' }}>
          {saving ? 'Posting...' : 'Post to Wall →'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px 48px', background: bg, minHeight: '100vh' }}>

      {showForm && <FormPanel />}

      {/* Header */}
      <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: isMobile ? '6px' : '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: isMobile ? '16px' : '24px', height: '1px', background: accent }} />Trading Wall
        </div>
        {isMobile ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: textPrimary, letterSpacing: '-1px', lineHeight: 1, marginBottom: '12px' }}>Wall of Proof.</h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <SegmentedControl
                  options={[
                    { label: 'Public', value: 'public', count: allPublic.length },
                    { label: 'My Posts', value: 'personal', count: myPosts.length },
                  ]}
                  value={tab}
                  onChange={setTab}
                  dark={dark}
                />
              </div>
              <button onClick={() => setShowForm(true)} style={{ background: '#22c55e', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '10px 14px', border: 'none', cursor: 'pointer', borderRadius: '10px', fontWeight: '700', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
                + Post
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '40px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1 }}>Wall of Proof.</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <SegmentedControl
                options={[
                  { label: 'Public Wall', value: 'public', count: allPublic.length },
                  { label: 'My Wall', value: 'personal', count: myPosts.length },
                ]}
                value={tab}
                onChange={setTab}
                dark={dark}
              />
              <button onClick={() => setShowForm(true)} style={{ background: '#22c55e', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '10px 20px', border: 'none', cursor: 'pointer', borderRadius: '10px', fontWeight: '700', whiteSpace: 'nowrap' as const }}>
                + Post Payout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Community stats banner */}
      <div style={{ background: '#0d1e36', borderRadius: '16px', padding: isMobile ? '16px' : '20px 28px', marginBottom: isMobile ? '16px' : '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(34,197,94,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? '14px' : '0', position: 'relative' }}>
          {[
            { label: 'Total Payouts', value: `+${totalCommunityPnl.toFixed(0)}€`, color: '#22c55e' },
            { label: 'Members Posted', value: `${new Set(allPublic.map(p => p.user_id)).size}`, color: '#ffffff' },
            { label: 'Biggest Payout', value: biggestPayout > 0 ? `+${biggestPayout.toFixed(0)}€` : '—', color: '#7aaee8' },
            { label: 'Total Posts', value: allPublic.length.toString(), color: '#ffffff' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' as const }}>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '22px' : '28px', fontWeight: '700', color: stat.color, lineHeight: 1, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts grid */}
      {loading ? (
        <div style={{ textAlign: 'center' as const, padding: '80px', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>Loading...</div>
      ) : posts.length === 0 ? (
        <div style={{ background: '#0d1e36', borderRadius: '16px', padding: isMobile ? '48px 24px' : '80px', textAlign: 'center' as const }}>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '36px' : '48px', fontWeight: '700', color: 'rgba(34,197,94,0.15)', marginBottom: '16px' }}>0€</div>
          <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: isMobile ? '16px' : '20px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
            {tab === 'public' ? 'No payouts posted yet.' : 'You have not posted any payouts yet.'}
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginBottom: '28px' }}>
            {tab === 'public' ? 'Be the first to prove the blueprint works.' : 'Post your first payout and inspire the community.'}
          </div>
          <button onClick={() => setShowForm(true)} style={{ background: '#22c55e', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '12px 28px', border: 'none', cursor: 'pointer', borderRadius: '10px', fontWeight: '700' }}>
            + Post Your Payout
          </button>
        </div>
      ) : (
        <div style={isMobile ? { display: 'flex', flexDirection: 'column' as const, gap: '12px' } : { columns: '3', columnGap: '14px' }}>
          {posts.map(post => {
            const isOwner = post.user_id === userId
            const barWidth = maxAmount > 0 ? (post.amount / maxAmount) * 100 : 0
            const name = profileNames[post.user_id] || 'Member'
            return (
              <div key={post.id} style={{ ...card, marginBottom: isMobile ? '0' : '14px', breakInside: 'avoid', display: 'inline-block', width: '100%', overflow: 'hidden', borderTop: '3px solid #22c55e' }}>
                {/* Amount hero */}
                <div style={{ padding: isMobile ? '16px 16px 12px' : '20px 20px 14px', background: dark ? 'rgba(34,197,94,0.04)' : 'rgba(34,197,94,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>Certified Payout</div>
                      <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '28px' : '34px', fontWeight: '700', color: '#22c55e', lineHeight: 1, textShadow: dark ? '0 0 20px rgba(34,197,94,0.3)' : 'none' }}>
                        +{post.amount.toFixed(0)}€
                      </div>
                    </div>
                    {isOwner && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => togglePublic(post)} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', color: textMuted }} title={post.is_public ? 'Make private' : 'Make public'}>
                          {post.is_public ? '🌍' : '🔒'}
                        </button>
                        <button onClick={() => deletePost(post.id)} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', color: textMuted }}>
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Screenshot */}
                {post.screenshot_url && (
                  <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img src={post.screenshot_url} alt="payout" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: isMobile ? '14px 16px' : '16px 20px' }}>
                  {post.caption && (
                    <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '13px', color: textPrimary, lineHeight: '1.6', marginBottom: '14px' }}>
                      &ldquo;{post.caption}&rdquo;
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #2B5EA7, #7aaee8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#ffffff', fontWeight: '700' }}>{name[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textPrimary, fontWeight: '600' }}>{name}</div>
                        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted }}>{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                    </div>
                    {!post.is_public && isOwner && (
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.04)', padding: '3px 8px', borderRadius: '4px' }}>🔒 Private</span>
                    )}
                  </div>

                  <div style={{ height: '3px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${barWidth}%`, background: 'linear-gradient(90deg, #22c55e, #7aaee8)', borderRadius: '2px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}