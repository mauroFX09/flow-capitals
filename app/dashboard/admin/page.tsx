'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const ADMIN_EMAIL = 'mauro.steenhoudt@gmail.com'

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

export default function AdminPage() {
  const router = useRouter()
  const [dark, setDark] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    course_id: '',
    title: '',
    description: '',
    order_number: '1',
    video_url: '',
  })

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
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.push('/dashboard')
        return
      }
      setAuthorized(true)
      loadData()
    })
  }, [])

  async function loadData() {
    const [{ data: c }, { data: l }] = await Promise.all([
      supabase.from('courses').select('*').order('order_number'),
      supabase.from('lessons').select('*').order('order_number'),
    ])
    if (c) setCourses(c)
    if (l) setLessons(l)
    if (form.course_id === '' && c && c.length > 0) setForm(f => ({ ...f, course_id: c[0].id }))
    setLoading(false)
  }

  async function uploadVideo(file: File) {
    setUploading(true)
    setUploadProgress(0)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('course-videos').upload(path, file, { upsert: false })
    if (!error) {
      const { data } = supabase.storage.from('course-videos').getPublicUrl(path)
      setForm(f => ({ ...f, video_url: data.publicUrl }))
    }
    setUploading(false)
    setUploadProgress(100)
  }

  async function saveLesson() {
    if (!form.title || !form.course_id) return
    setSaving(true)
    const { error } = await supabase.from('lessons').insert({
      course_id: form.course_id,
      title: form.title,
      description: form.description,
      video_url: form.video_url,
      order_number: parseInt(form.order_number) || 1,
    })
    if (!error) {
      setForm(f => ({ ...f, title: '', description: '', video_url: '', order_number: '1' }))
      setShowForm(false)
      loadData()
    }
    setSaving(false)
  }

  async function deleteLesson(id: string) {
    if (!confirm('Delete this lesson?')) return
    await supabase.from('lessons').delete().eq('id', id)
    loadData()
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
  const tableBorder = dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.06)'
  const card = { background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow }

  if (!authorized) return null

  return (
    <div style={{ padding: '40px 48px', background: bg, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: accent }} />Admin Panel
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1 }}>Course Manager.</h1>
          <button onClick={() => setShowForm(!showForm)} style={{ background: accent, color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '10px 20px', border: 'none', cursor: 'pointer', borderRadius: '10px', fontWeight: '700' }}>
            {showForm ? '— Cancel' : '+ Add Lesson'}
          </button>
        </div>
      </div>

      {/* Add lesson form */}
      {showForm && (
        <div style={{ ...card, padding: '32px', marginBottom: '24px' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: accent, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: '20px' }}>New Lesson</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Arial, sans-serif', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Category</label>
              <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'Georgia, serif', fontSize: '13px', color: textPrimary, outline: 'none' }}>
                {courses.map(c => <option key={c.id} value={c.id}>{c.icon} {c.title}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Arial, sans-serif', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Order Number</label>
              <input type="number" value={form.order_number} onChange={e => setForm({ ...form, order_number: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'Georgia, serif', fontSize: '13px', color: textPrimary, outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontFamily: 'Arial, sans-serif', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Lesson Title</label>
            <input type="text" placeholder="e.g. Understanding Market Structure" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'Georgia, serif', fontSize: '13px', color: textPrimary, outline: 'none' }} />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontFamily: 'Arial, sans-serif', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brief description of what this lesson covers..." style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'Georgia, serif', fontSize: '13px', color: textPrimary, outline: 'none', resize: 'vertical' as const }} />
          </div>

          {/* Video upload */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontFamily: 'Arial, sans-serif', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Video</label>
            {form.video_url ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: '10px' }}>
                <span style={{ fontSize: '20px' }}>✅</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#22c55e', fontWeight: '600' }}>Video uploaded successfully</div>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: textMuted, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{form.video_url}</div>
                </div>
                <button onClick={() => setForm(f => ({ ...f, video_url: '' }))} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '14px' }}>✕</button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ width: '100%', padding: '20px', background: inputBg, border: `1px dashed ${inputBorder}`, borderRadius: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: textMuted, transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = inputBorder}
              >
                <span style={{ fontSize: '28px' }}>{uploading ? '⏳' : '🎬'}</span>
                <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>{uploading ? `Uploading... ${uploadProgress}%` : 'Click to upload video'}</span>
                <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: textMuted }}>MP4, MOV, WebM — large files supported</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={async e => { const file = e.target.files?.[0]; if (file) await uploadVideo(file); e.target.value = '' }} />
          </div>

          <button onClick={saveLesson} disabled={saving || !form.title} style={{ background: accent, color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '12px 28px', border: 'none', cursor: saving || !form.title ? 'not-allowed' : 'pointer', borderRadius: '10px', fontWeight: '700', opacity: saving || !form.title ? 0.6 : 1 }}>
            {saving ? 'Saving...' : 'Save Lesson →'}
          </button>
        </div>
      )}

      {/* Lessons by course */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: textMuted }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {courses.map(course => {
            const courseLessons = lessons.filter(l => l.course_id === course.id).sort((a, b) => a.order_number - b.order_number)
            return (
              <div key={course.id} style={{ ...card, overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: `0.5px solid ${tableBorder}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '700', color: accent }}>{course.icon}</span>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: textPrimary }}>{course.title}</span>
                  <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted, marginLeft: 'auto' }}>{courseLessons.length} lessons</span>
                </div>
                {courseLessons.length === 0 ? (
                  <div style={{ padding: '24px', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: textMuted, textAlign: 'center' }}>No lessons yet</div>
                ) : (
                  courseLessons.map((lesson, idx) => (
                    <div key={lesson.id} style={{ padding: '14px 24px', borderBottom: idx < courseLessons.length - 1 ? `0.5px solid ${tableBorder}` : 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: textMuted }}>{lesson.order_number}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: textPrimary, marginBottom: '2px' }}>{lesson.title}</div>
                        {lesson.description && <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: textMuted }}>{lesson.description}</div>}
                      </div>
                      {lesson.video_url && <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '3px 8px', borderRadius: '4px' }}>▶ Video</span>}
                      <button onClick={() => deleteLesson(lesson.id)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '14px', opacity: 0.5 }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#dc3232'; e.currentTarget.style.opacity = '1' }}
                        onMouseLeave={e => { e.currentTarget.style.color = textMuted; e.currentTarget.style.opacity = '0.5' }}
                      >✕</button>
                    </div>
                  ))
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}