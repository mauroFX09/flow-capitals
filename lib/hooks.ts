import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState(false)

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

  return dark
}

export function useSupabaseUser() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('@/lib/supabase').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUserId(session?.user?.id || null)
        setLoading(false)
      })
    })
  }, [])

  return { userId, loading }
}