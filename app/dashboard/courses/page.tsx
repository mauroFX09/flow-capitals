'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Course = {
  id: string
  title: string
  description: string
  icon: string
  order_number: number
}

type Lesson = {
  id: string
  course_id: string
  title: string
  description: string
  video_url: string
  duration_minutes: number
  order_number: number
}

type Progress = {
  lesson_id: string
  completed: boolean
}

const LEVELS = [
  { min: 0, max: 29, label: 'Beginner', color: '#94a3b8', description: 'You are just getting started.' },
  { min: 30, max: 49, label: 'Average', color: '#f59e0b', description: 'You are building your foundation.' },
  { min: 50, max: 69, label: 'Mediocre', color: '#3b82f6', description: 'You are developing your edge.' },
  { min: 70, max: 99, label: 'Advanced', color: '#8b5cf6', description: 'You are mastering the strategy.' },
  { min: 100, max: 100, label: 'Expert', color: '#22c55e', description: 'You have mastered the blueprint.' },
]

function getLevel(pct: number) {
  return LEVELS.find(l => pct >= l.min && pct <= l.max) || LEVELS[0]
}

function CircleProgress({ pct, dark, color, size = 80 }: { pct: number; dark: boolean; color: string; size?: number }) {
  const sw = size < 70 ? 6 : 7
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const fill = (pct / 100) * circ
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)'} strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${fill} ${circ - fill}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-playfair)', fontSize: size < 70 ? '11px' : '14px', fontWeight: '700', color }}>{pct}%</span>
      </div>
    </div>
  )
}

export default function Courses() {
  const [dark, setDark] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

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
      const [{ data: c }, { data: l }, { data: p }] = await Promise.all([
        supabase.from('courses').select('*').order('order_number'),
        supabase.from('lessons').select('*').order('order_number'),
        supabase.from('lesson_progress').select('*').eq('user_id', session.user.id),
      ])
      if (c) setCourses(c)
      if (l) setLessons(l)
      if (p) setProgress(p)
      setLoading(false)
    })
  }, [])

  async function toggleComplete(lessonId: string) {
    if (!userId) return
    const existing = progress.find(p => p.lesson_id === lessonId)
    if (existing) {
      const newCompleted = !existing.completed
      await supabase.from('lesson_progress').update({ completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }).eq('user_id', userId).eq('lesson_id', lessonId)
      setProgress(prev => prev.map(p => p.lesson_id === lessonId ? { ...p, completed: newCompleted } : p))
    } else {
      await supabase.from('lesson_progress').insert({ user_id: userId, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() })
      setProgress(prev => [...prev, { lesson_id: lessonId, completed: true }])
    }
  }

  const totalLessons = lessons.length
  const completedLessons = progress.filter(p => p.completed).length
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const level = getLevel(overallPct)

  const bg = dark ? '#080d14' : '#F5F2EC'
  const cardBg = dark ? '#0f1825' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const cardShadow = dark ? '0 4px 20px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset' : '0 4px 20px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset'
  const textPrimary = dark ? '#e0ecf8' : '#1a1a1a'
  const textMuted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const accent = dark ? '#7aaee8' : '#2B5EA7'
  const tableBorder = dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.06)'
  const card = { background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow }

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px 48px', background: bg, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: isMobile ? '16px' : '28px' }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: isMobile ? '6px' : '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: isMobile ? '16px' : '24px', height: '1px', background: accent }} />Courses
        </div>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '28px' : '40px', fontWeight: '700', color: textPrimary, letterSpacing: isMobile ? '-1px' : '-1.5px', lineHeight: 1 }}>Your Learning Path.</h1>
      </div>

      {/* Stats */}
      {isMobile ? (
        // Mobile: compact single card with all 3 stats
        <div style={{ ...card, padding: '18px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: `0.5px solid ${tableBorder}` }}>
            <CircleProgress pct={overallPct} dark={dark} color={level.color} size={60} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>Overall Progress</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: '700', color: level.color, lineHeight: 1, marginBottom: '2px' }}>{level.label}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{level.description}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>Lessons Done</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '24px', fontWeight: '700', color: textPrimary, lineHeight: 1 }}>
                {completedLessons}<span style={{ fontSize: '14px', color: textMuted, fontWeight: '400' }}>/{totalLessons}</span>
              </div>
              <div style={{ height: '3px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${overallPct}%`, background: level.color, borderRadius: '2px' }} />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>Level Track</div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                {LEVELS.map((l, i) => (
                  <div key={i} style={{ flex: 1, height: '5px', borderRadius: '2px', background: overallPct >= l.min ? l.color : dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)' }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                {LEVELS.map((l, i) => (
                  <div key={i} style={{ fontFamily: 'var(--font-inter)', fontSize: '7px', color: overallPct >= l.min ? l.color : textMuted }}>{l.label[0]}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Desktop: 3-col stats
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{ ...card, padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <CircleProgress pct={overallPct} dark={dark} color={level.color} />
            <div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '4px' }}>Overall Progress</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: level.color, lineHeight: 1, marginBottom: '4px' }}>{overallPct}%</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{level.description}</div>
            </div>
          </div>
          <div style={{ ...card, padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '8px' }}>Lessons Completed</div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '36px', fontWeight: '700', color: textPrimary, lineHeight: 1, marginBottom: '4px' }}>{completedLessons}<span style={{ fontSize: '18px', color: textMuted, fontWeight: '400' }}>/{totalLessons}</span></div>
            <div style={{ height: '4px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${overallPct}%`, background: level.color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <div style={{ ...card, padding: '24px', background: dark ? `rgba(${level.color === '#22c55e' ? '34,197,94' : level.color === '#8b5cf6' ? '139,92,246' : level.color === '#3b82f6' ? '59,130,246' : level.color === '#f59e0b' ? '245,158,11' : '148,163,184'},0.08)` : cardBg, border: `0.5px solid ${level.color}30` }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '8px' }}>Current Level</div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', fontWeight: '700', color: level.color, lineHeight: 1, marginBottom: '6px' }}>{level.label}</div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              {LEVELS.map((l, i) => (
                <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: overallPct >= l.min ? l.color : dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {LEVELS.map((l, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: overallPct >= l.min ? l.color : textMuted }}>{l.label[0]}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Course list */}
      {loading ? (
        <div style={{ textAlign: 'center' as const, padding: '60px', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>Loading courses...</div>
      ) : courses.length === 0 ? (
        <div style={{ ...card, padding: isMobile ? '40px 24px' : '60px', textAlign: 'center' as const }}>
          <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '18px', color: textMuted, marginBottom: '8px' }}>No courses available yet.</div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted }}>Check back soon — content is being added.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {courses.map(course => {
            const courseLessons = lessons.filter(l => l.course_id === course.id).sort((a, b) => a.order_number - b.order_number)
            const courseCompleted = courseLessons.filter(l => progress.find(p => p.lesson_id === l.id && p.completed)).length
            const coursePct = courseLessons.length > 0 ? Math.round((courseCompleted / courseLessons.length) * 100) : 0
            const isExpanded = expandedCourse === course.id
            const courseLevel = getLevel(coursePct)

            return (
              <div key={course.id} style={{ ...card, overflow: 'hidden' }}>
                {/* Course header */}
                <div
                  onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                  style={{ padding: isMobile ? '16px' : '24px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px' }}
                >
                  {/* Icon */}
                  <div style={{ width: isMobile ? '36px' : '44px', height: isMobile ? '36px' : '44px', borderRadius: '12px', background: dark ? 'rgba(43,94,167,0.15)' : 'rgba(43,94,167,0.08)', border: `0.5px solid ${dark ? 'rgba(43,94,167,0.3)' : 'rgba(43,94,167,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '13px' : '16px', fontWeight: '700', color: accent }}>{course.icon}</span>
                  </div>

                  {/* Title + meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '14px' : '17px', fontWeight: '700', color: textPrimary, marginBottom: '2px', whiteSpace: isMobile ? 'normal' : 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.title}</div>
                    {isMobile ? (
                      // Mobile: progress bar below title
                      <div>
                        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted, marginBottom: '6px' }}>{courseLessons.length} lessons · {courseCompleted} done</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '4px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${coursePct}%`, background: courseLevel.color, borderRadius: '2px' }} />
                          </div>
                          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: courseLevel.color, fontWeight: '600', flexShrink: 0 }}>{coursePct}%</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{courseLessons.length} lessons · {courseCompleted} completed</div>
                    )}
                  </div>

                  {/* Desktop: progress bar */}
                  {!isMobile && (
                    <div style={{ width: '180px', flexShrink: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: courseLevel.color, fontWeight: '600' }}>{courseLevel.label}</span>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted }}>{coursePct}%</span>
                      </div>
                      <div style={{ height: '5px', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${coursePct}%`, background: courseLevel.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  )}

                  {/* Arrow */}
                  <div style={{ color: textMuted, fontSize: '11px', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▼</div>
                </div>

                {/* Lessons list */}
                {isExpanded && (
                  <div style={{ borderTop: `0.5px solid ${tableBorder}` }}>
                    {courseLessons.length === 0 ? (
                      <div style={{ padding: '32px', textAlign: 'center' as const, fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>No lessons added yet — check back soon.</div>
                    ) : (
                      courseLessons.map((lesson, idx) => {
                        const isCompleted = progress.find(p => p.lesson_id === lesson.id && p.completed)
                        const isActive = activeLesson?.id === lesson.id

                        return (
                          <div key={lesson.id} style={{ borderBottom: idx < courseLessons.length - 1 ? `0.5px solid ${tableBorder}` : 'none' }}>
                            <div style={{ padding: isMobile ? '14px 16px' : '16px 28px', display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px', opacity: isCompleted ? 0.7 : 1, background: isActive ? (dark ? 'rgba(43,94,167,0.08)' : 'rgba(43,94,167,0.04)') : 'transparent' }}>
                              {/* Number bubble */}
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isCompleted ? '#22c55e' : dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {isCompleted
                                  ? <span style={{ color: '#ffffff', fontSize: '12px' }}>✓</span>
                                  : <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted }}>{idx + 1}</span>
                                }
                              </div>

                              {/* Title */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: isCompleted ? textMuted : textPrimary, marginBottom: '2px', textDecoration: isCompleted ? 'line-through' : 'none' }}>{lesson.title}</div>
                                {lesson.description && !isMobile && <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{lesson.description}</div>}
                              </div>

                              {/* Actions */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px', flexShrink: 0 }}>
                                {lesson.video_url && (
                                  <button onClick={() => setActiveLesson(isActive ? null : lesson)}
                                    style={{ padding: isMobile ? '6px 10px' : '7px 16px', background: isActive ? accent : 'transparent', border: `0.5px solid ${isActive ? accent : dark ? 'rgba(255,255,255,0.15)' : 'rgba(26,26,26,0.15)'}`, borderRadius: '8px', color: isActive ? '#ffffff' : accent, fontFamily: 'var(--font-inter)', fontSize: isMobile ? '10px' : '11px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span>▶</span>{!isMobile && (isActive ? ' Close' : ' Watch')}
                                  </button>
                                )}
                                <button onClick={() => toggleComplete(lesson.id)}
                                  style={{ padding: isMobile ? '6px 10px' : '7px 16px', background: isCompleted ? 'rgba(34,197,94,0.1)' : 'transparent', border: `0.5px solid ${isCompleted ? '#22c55e' : dark ? 'rgba(255,255,255,0.15)' : 'rgba(26,26,26,0.15)'}`, borderRadius: '8px', color: isCompleted ? '#22c55e' : textMuted, fontFamily: 'var(--font-inter)', fontSize: isMobile ? '10px' : '11px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span>{isCompleted ? '✓' : '○'}</span>{!isMobile && (isCompleted ? ' Completed' : ' Mark done')}
                                </button>
                              </div>
                            </div>

                            {/* Video player */}
                            {isActive && lesson.video_url && (
                              <div style={{ padding: isMobile ? '0 16px 16px' : '0 28px 20px', background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
                                <video controls style={{ width: '100%', borderRadius: '10px', maxHeight: isMobile ? '220px' : '480px', background: '#000000' }} src={lesson.video_url}>
                                  Your browser does not support video playback.
                                </video>
                              </div>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}