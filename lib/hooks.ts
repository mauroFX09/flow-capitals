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

export function useIncognito() {
  const [incognito, setIncognito] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('fc-incognito')
    if (saved === 'true') setIncognito(true)
    const handler = () => setIncognito(localStorage.getItem('fc-incognito') === 'true')
    window.addEventListener('storage', handler)
    window.addEventListener('fc-incognito-change', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('fc-incognito-change', handler)
    }
  }, [])

  return incognito
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