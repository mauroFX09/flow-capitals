'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useDarkMode } from '@/lib/hooks'
import { getTheme } from '@/lib/styles'

const ADMIN_EMAIL = 'mauro.steenhoudt@gmail.com'
const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

type Member = {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
  last_sign_in_at?: string
}

type Course = {
  id: string
  title: string
  icon: string
  order_number: number
}

type Lesson = {
  id: string
  course_id: string
  title: string
  description: string
  video_url: string
  order_number: number
}

type WallPost = {
  id: string
  user_id: string
  screenshot_url: string | null
  amount: number
  caption: string | null
  is_public: boolean
  created_at: string
}

type ScheduleRow = {
  id: string
  day: number
  session_type: string
  description: string
  discord_url: string | null
}

type CreatedMember = {
  full_name: string
  email: string
  password: string
  role: string
}

type Stats = {
  totalMembers: number
  premiumMembers: number
  standardMembers: number
  totalTrades: number
  totalWallPosts: number
}

export default function AdminPage() {
  const router = useRouter()
  const dark = useDarkMode()
  const [authorized, setAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<'members' | 'content' | 'wall' | 'schedule'>('members')

  const [stats, setStats] = useState<Stats | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [membersLoading, setMembersLoading] = useState(true)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [savingMember, setSavingMember] = useState(false)
  const [createdMember, setCreatedMember] = useState<CreatedMember | null>(null)
  const [memberError, setMemberError] = useState('')
  const [copied, setCopied] = useState(false)
  const [resetSuccess, setResetSuccess] = useState('')
  const [memberForm, setMemberForm] = useState({ full_name: '', email: '', password: '', role: 'standard' as 'standard' | 'premium' })

  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [contentLoading, setContentLoading] = useState(true)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ course_id: '', title: '', description: '', order_number: '1', video_url: '' })

  const [wallPosts, setWallPosts] = useState<WallPost[]>([])
  const [wallLoading, setWallLoading] = useState(true)
  const [wallFilter, setWallFilter] = useState('')
  const [profileNames, setProfileNames] = useState<Record<string, string>>({})

  const [schedule, setSchedule] = useState<ScheduleRow[]>([])
  const [scheduleLoading, setScheduleLoading] = useState(true)
  const [scheduleSaving, setScheduleSaving] = useState<number | null>(null)
  const [scheduleEdits, setScheduleEdits] = useState<Record<number, Partial<ScheduleRow>>>({})

  const { bg, cardBg, cardBorder, cardShadow, textPrimary, textMuted, accent, inputBg, inputBorder, tableBorder } = getTheme(dark)
  const card = { background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow }

  async function authHeaders() {
  await supabase.auth.getUser() // triggers refresh automatically if needed
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token ?? ''}`,
  }
}

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session || session.user.email !== ADMIN_EMAIL) { router.push('/dashboard'); return }
      setAuthorized(true)
      loadMembers()
      loadContent()
      loadStats()
      loadWall()
      loadSchedule()
    })
  }, [])

  async function loadStats() {
    const [{ data: profiles }, { count: trades }, { count: wallPostsCount }] = await Promise.all([
      supabase.from('profiles').select('role'),
      supabase.from('trades').select('*', { count: 'exact', head: true }),
      supabase.from('wall_posts').select('*', { count: 'exact', head: true }),
    ])
    if (profiles) {
      setStats({
        totalMembers: profiles.length,
        premiumMembers: profiles.filter(p => p.role === 'premium').length,
        standardMembers: profiles.filter(p => p.role === 'standard').length,
        totalTrades: trades || 0,
        totalWallPosts: wallPostsCount || 0,
      })
    }
  }

  async function loadMembers() {
    setMembersLoading(true)
    try {
      const res = await fetch('/api/admin/list-users', { headers: await authHeaders() })
      const { users } = await res.json()
      const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      if (profiles && users) {
        const merged = profiles.map((p: any) => {
          const authUser = users.find((u: any) => u.id === p.id)
          return { ...p, last_sign_in_at: authUser?.last_sign_in_at }
        })
        setMembers(merged)
      }
    } catch (e) {}
    setMembersLoading(false)
  }

  async function loadContent() {
    setContentLoading(true)
    const [{ data: c }, { data: l }] = await Promise.all([
      supabase.from('courses').select('*').order('order_number'),
      supabase.from('lessons').select('*').order('order_number'),
    ])
    if (c) setCourses(c)
    if (l) setLessons(l)
    if (form.course_id === '' && c && c.length > 0) setForm(f => ({ ...f, course_id: c[0].id }))
    setContentLoading(false)
  }

  async function loadWall() {
    setWallLoading(true)
    const { data: posts } = await supabase.from('wall_posts').select('*').order('created_at', { ascending: false })
    if (posts) {
      setWallPosts(posts)
      const userIds = [...new Set(posts.map(p => p.user_id))]
      if (userIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds)
        if (profiles) {
          const map: Record<string, string> = {}
          profiles.forEach(p => { map[p.id] = p.full_name || 'Member' })
          setProfileNames(map)
        }
      }
    }
    setWallLoading(false)
  }

  async function loadSchedule() {
    setScheduleLoading(true)
    const { data } = await supabase.from('weekly_schedule').select('*').order('day')
    if (data) setSchedule(data)
    setScheduleLoading(false)
  }

  function getScheduleValue(row: ScheduleRow, field: keyof ScheduleRow): string {
    const edit = scheduleEdits[row.day]
    if (edit && field in edit) return (edit as any)[field] ?? ''
    return (row as any)[field] ?? ''
  }

  function updateScheduleEdit(day: number, field: keyof ScheduleRow, value: string) {
    setScheduleEdits(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }))
  }

  async function saveScheduleRow(row: ScheduleRow) {
    const edits = scheduleEdits[row.day] || {}
    const updated = {
      session_type: edits.session_type ?? row.session_type,
      description: edits.description ?? row.description,
      discord_url: edits.discord_url !== undefined ? (edits.discord_url || null) : row.discord_url,
    }
    setScheduleSaving(row.day)
    await supabase.from('weekly_schedule').update(updated).eq('id', row.id)
    setScheduleEdits(prev => { const next = { ...prev }; delete next[row.day]; return next })
    await loadSchedule()
    setScheduleSaving(null)
  }

  function clearDiscordLink(row: ScheduleRow) {
    updateScheduleEdit(row.day, 'discord_url', '')
  }

  async function changeRole(memberId: string, newRole: string) {
    await supabase.from('profiles').update({ role: newRole }).eq('id', memberId)
    loadMembers()
    loadStats()
  }

  async function deleteMember(memberId: string, name: string) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    await fetch('/api/admin/delete-user', {
      method: 'DELETE',
      headers: await authHeaders(),
      body: JSON.stringify({ memberId }),
    })
    loadMembers()
    loadStats()
  }

  async function resetSession(memberId: string, name: string) {
    await fetch('/api/admin/reset-session', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ memberId, name }),
    })
    setResetSuccess(`Session reset for ${name}. They can now log in on a new device.`)
    setTimeout(() => setResetSuccess(''), 6000)
  }

  async function resetPassword(email: string) {
    const res = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (data.newPassword) {
      setResetSuccess(`New password for ${email}: ${data.newPassword}`)
      setTimeout(() => setResetSuccess(''), 10000)
    }
  }

  async function createMember() {
    if (!memberForm.email || !memberForm.full_name || !memberForm.password) return
    setSavingMember(true)
    setMemberError('')
    setCreatedMember(null)
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(memberForm),
      })
      const data = await res.json()
      if (!res.ok) { setMemberError(data.error || 'Failed to create member.'); setSavingMember(false); return }
      setCreatedMember({ full_name: memberForm.full_name, email: memberForm.email, password: memberForm.password, role: memberForm.role })
      setMemberForm({ full_name: '', email: '', password: '', role: 'standard' })
      setShowMemberForm(false)
      loadMembers()
      loadStats()
    } catch (err) {
      setMemberError('Failed to create member.')
    }
    setSavingMember(false)
  }

  function copyCredentials() {
    if (!createdMember) return
    const text = `Welcome to Flow Capitals!\n\nEmail: ${createdMember.email}\nPassword: ${createdMember.password}\n\nLogin at: https://flow-capitals.vercel.app/login\n\nPlease change your password after first login.`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function saveLesson() {
    if (!form.title || !form.course_id) return
    setSaving(true)
    if (editingLesson) {
      await supabase.from('lessons').update({ title: form.title, description: form.description, video_url: form.video_url, order_number: parseInt(form.order_number) || 1 }).eq('id', editingLesson.id)
    } else {
      await supabase.from('lessons').insert({ course_id: form.course_id, title: form.title, description: form.description, video_url: form.video_url, order_number: parseInt(form.order_number) || 1 })
    }
    setForm(f => ({ ...f, title: '', description: '', video_url: '', order_number: '1' }))
    setShowLessonForm(false)
    setEditingLesson(null)
    loadContent()
    setSaving(false)
  }

  async function deleteLesson(id: string) {
    if (!confirm('Delete this lesson?')) return
    await supabase.from('lessons').delete().eq('id', id)
    loadContent()
  }

  async function moveLesson(lesson: Lesson, direction: 'up' | 'down', courseLessons: Lesson[]) {
    const idx = courseLessons.findIndex(l => l.id === lesson.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= courseLessons.length) return
    const swap = courseLessons[swapIdx]
    await Promise.all([
      supabase.from('lessons').update({ order_number: swap.order_number }).eq('id', lesson.id),
      supabase.from('lessons').update({ order_number: lesson.order_number }).eq('id', swap.id),
    ])
    loadContent()
  }

  async function uploadVideo(file: File) {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const res = await fetch('/api/admin/upload-url', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ path }),
    })
    const { token, error: urlError } = await res.json()
    if (urlError) { console.error('Upload URL error:', urlError); setUploading(false); return }
    const { error } = await supabase.storage.from('course-videos').uploadToSignedUrl(path, token, file)
    if (error) { console.error('Upload error:', error.message); setUploading(false); return }
    const { data } = supabase.storage.from('course-videos').getPublicUrl(path)
    setForm(f => ({ ...f, video_url: data.publicUrl }))
    setUploading(false)
  }

  function startEdit(lesson: Lesson) {
    setEditingLesson(lesson)
    setForm({ course_id: lesson.course_id, title: lesson.title, description: lesson.description || '', video_url: lesson.video_url || '', order_number: String(lesson.order_number) })
    setShowLessonForm(true)
    setShowMemberForm(false)
  }

  async function toggleWallPost(post: WallPost) {
    await supabase.from('wall_posts').update({ is_public: !post.is_public }).eq('id', post.id)
    loadWall()
    loadStats()
  }

  async function deleteWallPost(id: string) {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await supabase.from('wall_posts').delete().eq('id', id)
    loadWall()
    loadStats()
  }

  function formatDate(str?: string) {
    if (!str) return '—'
    return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function timeAgo(str?: string) {
    if (!str) return 'Never'
    const diff = Date.now() - new Date(str).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return `${Math.floor(days / 30)}mo ago`
  }

  if (!authorized) return null

  const TAB_STYLE = (active: boolean) => ({
    padding: '8px 20px',
    background: active ? accent : 'transparent',
    color: active ? '#ffffff' : textMuted,
    fontFamily: 'var(--font-inter)',
    fontSize: '11px',
    fontWeight: '700' as const,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    border: `1px solid ${active ? accent : cardBorder}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  })

  const filteredWall = wallFilter
    ? wallPosts.filter(p => (profileNames[p.user_id] || '').toLowerCase().includes(wallFilter.toLowerCase()))
    : wallPosts

  const todayIndex = (new Date().getDay() + 6) % 7

  return (
    <div style={{ padding: '40px 48px', background: bg, minHeight: '100vh' }}>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: accent }} />Admin Panel
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1 }}>Admin.</h1>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '28px' }}>
          {[
            { label: 'Total Members', value: stats.totalMembers, color: accent },
            { label: 'Premium', value: stats.premiumMembers, color: '#22c55e' },
            { label: 'Standard', value: stats.standardMembers, color: '#f59e0b' },
            { label: 'Total Trades', value: stats.totalTrades, color: textPrimary },
            { label: 'Wall Posts', value: stats.totalWallPosts, color: textPrimary },
          ].map(s => (
            <div key={s.label} style={{ ...card, padding: '16px 20px' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: s.color, lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button style={TAB_STYLE(activeTab === 'members')} onClick={() => setActiveTab('members')}>Members</button>
        <button style={TAB_STYLE(activeTab === 'content')} onClick={() => setActiveTab('content')}>Content</button>
        <button style={TAB_STYLE(activeTab === 'wall')} onClick={() => setActiveTab('wall')}>Wall</button>
        <button style={TAB_STYLE(activeTab === 'schedule')} onClick={() => setActiveTab('schedule')}>Schedule</button>
      </div>

      {activeTab === 'members' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <button onClick={() => { setShowMemberForm(!showMemberForm); setCreatedMember(null) }} style={{ background: showMemberForm ? accent : 'none', color: showMemberForm ? '#ffffff' : accent, fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '10px 20px', border: `1px solid ${accent}`, cursor: 'pointer', borderRadius: '10px', fontWeight: '700' }}>
              {showMemberForm ? '— Cancel' : '+ Create Member'}
            </button>
          </div>

          {createdMember && (
            <div style={{ marginBottom: '20px', background: dark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ background: 'rgba(34,197,94,0.12)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>✓</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: '700', color: '#22c55e' }}>Member created — {createdMember.full_name}</span>
                </div>
                <button onClick={() => setCreatedMember(null)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  {[{ label: 'Email', value: createdMember.email }, { label: 'Password', value: createdMember.password }, { label: 'Membership', value: createdMember.role.charAt(0).toUpperCase() + createdMember.role.slice(1) }].map(({ label, value }) => (
                    <div key={label} style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(26,26,26,0.03)', border: `0.5px solid ${cardBorder}`, borderRadius: '10px', padding: '12px 14px' }}>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>{label}</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textPrimary, fontWeight: '600', wordBreak: 'break-all' as const }}>{value}</div>
                    </div>
                  ))}
                </div>
                <button onClick={copyCredentials} style={{ background: copied ? '#22c55e' : accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '10px 20px', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '700' }}>
                  {copied ? '✓ Copied!' : 'Copy Credentials'}
                </button>
              </div>
            </div>
          )}

          {resetSuccess && (
            <div style={{ padding: '14px 20px', background: 'rgba(43,94,167,0.08)', border: '0.5px solid rgba(43,94,167,0.25)', borderRadius: '10px', marginBottom: '16px', fontFamily: 'var(--font-inter)', fontSize: '12px', color: accent }}>
              🔑 {resetSuccess}
            </div>
          )}

          {memberError && (
            <div style={{ padding: '14px 20px', background: 'rgba(220,50,50,0.08)', border: '0.5px solid rgba(220,50,50,0.2)', borderRadius: '10px', marginBottom: '16px', fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#dc3232' }}>
              {memberError}
            </div>
          )}

          {showMemberForm && (
            <div style={{ ...card, padding: '28px', marginBottom: '20px', borderTop: `3px solid ${accent}` }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: '18px' }}>New Member</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Full Name</label>
                  <input type="text" placeholder="John Smith" value={memberForm.full_name} onChange={e => setMemberForm({ ...memberForm, full_name: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: textPrimary, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Email</label>
                  <input type="email" placeholder="john@example.com" value={memberForm.email} onChange={e => setMemberForm({ ...memberForm, email: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: textPrimary, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Temporary Password</label>
                  <input type="text" placeholder="FlowCapitals2025!" value={memberForm.password} onChange={e => setMemberForm({ ...memberForm, password: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: textPrimary, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Membership</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['standard', 'premium'] as const).map(r => (
                      <button key={r} onClick={() => setMemberForm({ ...memberForm, role: r })} style={{ flex: 1, padding: '10px', background: memberForm.role === r ? accent : inputBg, border: `0.5px solid ${memberForm.role === r ? accent : inputBorder}`, borderRadius: '10px', color: memberForm.role === r ? '#ffffff' : textMuted, fontFamily: 'var(--font-inter)', fontSize: '12px', cursor: 'pointer', fontWeight: '600', textTransform: 'capitalize' as const }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={createMember} disabled={savingMember || !memberForm.email || !memberForm.full_name || !memberForm.password} style={{ background: accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '12px 28px', border: 'none', cursor: 'pointer', borderRadius: '10px', fontWeight: '700', opacity: savingMember || !memberForm.email || !memberForm.full_name || !memberForm.password ? 0.6 : 1 }}>
                {savingMember ? 'Creating...' : 'Create Member →'}
              </button>
            </div>
          )}

          <div style={{ ...card, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: `0.5px solid ${tableBorder}`, display: 'grid', gridTemplateColumns: '2fr 1.5fr 100px 110px 100px 150px', gap: '12px' }}>
              {['Name', 'Email', 'Role', 'Joined', 'Last Active', 'Actions'].map(h => (
                <div key={h} style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{h}</div>
              ))}
            </div>
            {membersLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>Loading members...</div>
            ) : members.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>No members yet</div>
            ) : members.map((member, idx) => (
              <div key={member.id} style={{ padding: '14px 24px', borderBottom: idx < members.length - 1 ? `0.5px solid ${tableBorder}` : 'none', display: 'grid', gridTemplateColumns: '2fr 1.5fr 100px 110px 100px 150px', gap: '12px', alignItems: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{member.full_name}</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{member.email}</div>
                <div>
                  <select value={member.role} onChange={e => changeRole(member.id, e.target.value)} style={{ background: member.role === 'premium' ? 'rgba(34,197,94,0.1)' : member.role === 'admin' ? 'rgba(43,94,167,0.1)' : 'rgba(245,158,11,0.1)', border: `0.5px solid ${member.role === 'premium' ? 'rgba(34,197,94,0.3)' : member.role === 'admin' ? 'rgba(43,94,167,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: '6px', padding: '4px 8px', fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: '700', color: member.role === 'premium' ? '#22c55e' : member.role === 'admin' ? accent : '#f59e0b', cursor: 'pointer', outline: 'none', width: '100%' }}>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{formatDate(member.created_at)}</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{timeAgo(member.last_sign_in_at)}</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => resetSession(member.id, member.full_name)} title="Reset session" style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', color: textMuted }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.color = '#f59e0b' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.color = textMuted }}
                  >🔄</button>
                  <button onClick={() => resetPassword(member.email)} title="Reset password" style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', color: textMuted }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.color = textMuted }}
                  >🔑</button>
                  <button onClick={() => deleteMember(member.id, member.full_name)} title="Delete" style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', color: textMuted }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc3232'; e.currentTarget.style.color = '#dc3232' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.color = textMuted }}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <button onClick={() => { setShowLessonForm(!showLessonForm); setEditingLesson(null); setForm(f => ({ ...f, title: '', description: '', video_url: '', order_number: '1' })) }} style={{ background: showLessonForm && !editingLesson ? accent : 'none', color: showLessonForm && !editingLesson ? '#ffffff' : accent, fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '10px 20px', border: `1px solid ${accent}`, cursor: 'pointer', borderRadius: '10px', fontWeight: '700' }}>
              {showLessonForm && !editingLesson ? '— Cancel' : '+ Add Lesson'}
            </button>
          </div>

          {showLessonForm && (
            <div style={{ ...card, padding: '28px', marginBottom: '20px', borderTop: `3px solid ${accent}` }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: '18px' }}>{editingLesson ? 'Edit Lesson' : 'New Lesson'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Category</label>
                  <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, outline: 'none' }}>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.icon} {c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Order</label>
                  <input type="number" value={form.order_number} onChange={e => setForm({ ...form, order_number: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, outline: 'none' }} />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Title</label>
                <input type="text" placeholder="e.g. Understanding Market Structure" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, outline: 'none', resize: 'vertical' as const }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Video</label>
                {form.video_url ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: '10px' }}>
                    <span>✅</span>
                    <div style={{ flex: 1, fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#22c55e' }}>Video ready</div>
                    <button onClick={() => setForm(f => ({ ...f, video_url: '' }))} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer' }}>✕</button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ width: '100%', padding: '16px', background: inputBg, border: `1px dashed ${inputBorder}`, borderRadius: '10px', cursor: 'pointer', color: textMuted, fontFamily: 'var(--font-inter)', fontSize: '12px' }}>
                    {uploading ? 'Uploading...' : '🎬 Click to upload video'}
                  </button>
                )}
                <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={async e => { const file = e.target.files?.[0]; if (file) await uploadVideo(file); e.target.value = '' }} />
              </div>
              <button onClick={saveLesson} disabled={saving || !form.title} style={{ background: accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '12px 28px', border: 'none', cursor: 'pointer', borderRadius: '10px', fontWeight: '700', opacity: saving || !form.title ? 0.6 : 1 }}>
                {saving ? 'Saving...' : editingLesson ? 'Update Lesson →' : 'Save Lesson →'}
              </button>
            </div>
          )}

          {contentLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>Loading...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {courses.map(course => {
                const courseLessons = lessons.filter(l => l.course_id === course.id).sort((a, b) => a.order_number - b.order_number)
                return (
                  <div key={course.id} style={{ ...card, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', borderBottom: `0.5px solid ${tableBorder}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: accent }}>{course.icon}</span>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: textPrimary }}>{course.title}</span>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, marginLeft: 'auto' }}>{courseLessons.length} lessons</span>
                    </div>
                    {courseLessons.length === 0 ? (
                      <div style={{ padding: '24px', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted, textAlign: 'center' as const }}>No lessons yet</div>
                    ) : courseLessons.map((lesson, idx) => (
                      <div key={lesson.id} style={{ padding: '12px 24px', borderBottom: idx < courseLessons.length - 1 ? `0.5px solid ${tableBorder}` : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '2px' }}>
                          <button onClick={() => moveLesson(lesson, 'up', courseLessons)} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? 'transparent' : textMuted, fontSize: '10px', padding: 0 }}>▲</button>
                          <button onClick={() => moveLesson(lesson, 'down', courseLessons)} disabled={idx === courseLessons.length - 1} style={{ background: 'none', border: 'none', cursor: idx === courseLessons.length - 1 ? 'default' : 'pointer', color: idx === courseLessons.length - 1 ? 'transparent' : textMuted, fontSize: '10px', padding: 0 }}>▼</button>
                        </div>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted }}>{lesson.order_number}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: textPrimary }}>{lesson.title}</div>
                          {lesson.description && <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{lesson.description}</div>}
                        </div>
                        {lesson.video_url && <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '3px 8px', borderRadius: '4px' }}>▶ Video</span>}
                        <button onClick={() => startEdit(lesson)} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.color = textMuted }}
                        >Edit</button>
                        <button onClick={() => deleteLesson(lesson.id)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '14px', opacity: 0.5 }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#dc3232'; e.currentTarget.style.opacity = '1' }}
                          onMouseLeave={e => { e.currentTarget.style.color = textMuted; e.currentTarget.style.opacity = '0.5' }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'wall' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted }}>{wallPosts.length} posts total · {wallPosts.filter(p => p.is_public).length} public · {wallPosts.filter(p => !p.is_public).length} hidden</div>
            <input type="text" placeholder="Filter by member name..." value={wallFilter} onChange={e => setWallFilter(e.target.value)} style={{ background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '8px 14px', fontFamily: 'var(--font-inter)', fontSize: '12px', color: textPrimary, outline: 'none', width: '220px' }} />
          </div>
          <div style={{ ...card, overflow: 'hidden' }}>
            <div style={{ padding: '14px 24px', borderBottom: `0.5px solid ${tableBorder}`, display: 'grid', gridTemplateColumns: '80px 1.5fr 2fr 100px 110px 120px', gap: '12px' }}>
              {['Photo', 'Member', 'Caption', 'Amount', 'Date', 'Actions'].map(h => (
                <div key={h} style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{h}</div>
              ))}
            </div>
            {wallLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>Loading posts...</div>
            ) : filteredWall.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>No posts found</div>
            ) : filteredWall.map((post, idx) => (
              <div key={post.id} style={{ padding: '12px 24px', borderBottom: idx < filteredWall.length - 1 ? `0.5px solid ${tableBorder}` : 'none', display: 'grid', gridTemplateColumns: '80px 1.5fr 2fr 100px 110px 120px', gap: '12px', alignItems: 'center', opacity: post.is_public ? 1 : 0.5 }}>
                <div style={{ width: '64px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.05)', flexShrink: 0 }}>
                  {post.screenshot_url ? <img src={post.screenshot_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📸</div>}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: '600', color: textPrimary }}>{profileNames[post.user_id] || 'Member'}</div>
                  {!post.is_public && <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#f59e0b', marginTop: '2px' }}>Hidden from wall</div>}
                </div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{post.caption || '—'}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '14px', fontWeight: '700', color: '#22c55e' }}>+{post.amount.toFixed(0)}€</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{formatDate(post.created_at)}</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => toggleWallPost(post)} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', color: textMuted, whiteSpace: 'nowrap' as const }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.color = textMuted }}
                  >{post.is_public ? 'Hide' : 'Show'}</button>
                  <button onClick={() => deleteWallPost(post.id)} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', color: textMuted }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc3232'; e.currentTarget.style.color = '#dc3232' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.color = textMuted }}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted, marginBottom: '20px' }}>
            Edit each day's session. Paste a Discord link to activate the Join Now button for members — clear it to hide it.
          </div>
          {scheduleLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>Loading schedule...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
              {schedule.map(row => {
                const isToday = row.day === todayIndex
                const hasEdits = !!scheduleEdits[row.day]
                const isSaving = scheduleSaving === row.day
                const discordVal = getScheduleValue(row, 'discord_url')
                const hasLink = !!discordVal
                return (
                  <div key={row.id} style={{ ...card, padding: '20px 24px', border: isToday ? `1px solid ${accent}` : `0.5px solid ${cardBorder}`, boxShadow: isToday ? `0 0 0 1px ${accent}20` : cardShadow }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                      <div style={{ width: '100px', flexShrink: 0, paddingTop: '8px' }}>
                        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: '700', color: isToday ? accent : textPrimary, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{DAY_LABELS[row.day]}</div>
                        {isToday && <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: accent, marginTop: '2px' }}>Today</div>}
                      </div>
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '5px' }}>Session Type</label>
                          <select value={getScheduleValue(row, 'session_type')} onChange={e => updateScheduleEdit(row.day, 'session_type', e.target.value)} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '8px', padding: '8px 11px', fontFamily: 'var(--font-inter)', fontSize: '12px', color: textPrimary, outline: 'none', boxSizing: 'border-box' as const, cursor: 'pointer' }}>
                            <option value="General Group Call">General Group Call</option>
                            <option value="Live Price Action Reading">Live Price Action Reading</option>
                            <option value="Weekly Review">Weekly Review</option>
                            <option value="Sunday Market Breakdown">Sunday Market Breakdown</option>
                            <option value="Rest & Review">Rest & Review</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '5px' }}>Description</label>
                          <input type="text" value={getScheduleValue(row, 'description')} onChange={e => updateScheduleEdit(row.day, 'description', e.target.value)} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '8px', padding: '8px 11px', fontFamily: 'var(--font-inter)', fontSize: '12px', color: textPrimary, outline: 'none', boxSizing: 'border-box' as const }} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '5px' }}>
                            Discord Link {hasLink && <span style={{ marginLeft: '8px', color: '#22c55e' }}>● Join Now button active</span>}
                          </label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input type="url" placeholder="Paste Discord invite link to enable Join Now button…" value={discordVal} onChange={e => updateScheduleEdit(row.day, 'discord_url', e.target.value)} style={{ flex: 1, background: inputBg, border: `0.5px solid ${hasLink ? 'rgba(34,197,94,0.4)' : inputBorder}`, borderRadius: '8px', padding: '8px 11px', fontFamily: 'var(--font-inter)', fontSize: '12px', color: textPrimary, outline: 'none' }} />
                            {hasLink && (
                              <button onClick={() => clearDiscordLink(row)} style={{ background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', color: textMuted, fontSize: '11px', flexShrink: 0, fontFamily: 'var(--font-inter)' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc3232'; e.currentTarget.style.color = '#dc3232' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.color = textMuted }}
                              >✕ Clear</button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={{ flexShrink: 0, paddingTop: '22px' }}>
                        <button onClick={() => saveScheduleRow(row)} disabled={isSaving || !hasEdits} style={{ background: hasEdits ? accent : 'transparent', color: hasEdits ? '#ffffff' : textMuted, fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', padding: '8px 18px', border: `1px solid ${hasEdits ? accent : cardBorder}`, borderRadius: '8px', cursor: hasEdits ? 'pointer' : 'default', opacity: isSaving ? 0.6 : 1, transition: 'all 0.15s', whiteSpace: 'nowrap' as const }}>
                          {isSaving ? 'Saving…' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}