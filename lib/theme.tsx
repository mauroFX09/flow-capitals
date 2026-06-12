'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type ThemeContextType = {
  dark: boolean
  toggleDark: () => void
  t: Record<string, string>
}

const ThemeContext = createContext<ThemeContextType>({
  dark: false,
  toggleDark: () => {},
  t: {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('fc-dark-mode')
    if (saved === 'true') setDark(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('fc-dark-mode', dark.toString())
  }, [dark])

  function toggleDark() {
    setTransitioning(true)
    setTimeout(() => {
      setDark(d => !d)
      setTimeout(() => setTransitioning(false), 400)
    }, 150)
  }

  const t: Record<string, string> = {
    bg: dark ? '#080d14' : '#F5F2EC',
    bgSecondary: dark ? '#0c1220' : '#ffffff',
    sidebar: dark ? '#0c1220' : '#ffffff',
    sidebarBorder: dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)',
    text: dark ? '#e0ecf8' : '#1a1a1a',
    textSecondary: dark ? '#a0c0d8' : '#3a3530',
    muted: dark ? 'rgba(255,255,255,0.4)' : '#8a8070',
    accent: '#2B5EA7',
    accentLight: dark ? '#7aaee8' : '#2B5EA7',
    navActive: dark ? 'rgba(43,94,167,0.25)' : 'rgba(43,94,167,0.07)',
    navHover: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.03)',
    navBorder: dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.06)',
    subText: dark ? 'rgba(255,255,255,0.25)' : '#c8c0b0',
    cardBg: dark ? '#0f1825' : '#ffffff',
    cardBorder: dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)',
    cardHover: dark ? 'rgba(43,94,167,0.2)' : '#2B5EA7',
    inputBg: dark ? '#0a1018' : '#F5F2EC',
    inputBorder: dark ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,26,0.12)',
    inputText: dark ? '#e0ecf8' : '#1a1a1a',
    tableBorder: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.06)',
    tableRowHover: dark ? 'rgba(255,255,255,0.03)' : 'rgba(26,26,26,0.02)',
    ruleColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.08)',
    quoteText: dark ? '#ffffff' : '#ffffff',
    darkPanel: dark ? '#0a1018' : '#0d1e36',
    greenText: dark ? '#4ade80' : '#2B5EA7',
    redText: '#dc3232',
    sessionLiveBg: dark ? 'rgba(43,94,167,0.12)' : 'rgba(43,94,167,0.06)',
    sessionLiveBorder: dark ? 'rgba(43,94,167,0.3)' : 'rgba(43,94,167,0.2)',
    sessionLiveLabel: dark ? '#7aaee8' : '#2B5EA7',
    sessionPsychBg: dark ? 'rgba(120,80,180,0.12)' : 'rgba(120,80,180,0.05)',
    sessionPsychBorder: dark ? 'rgba(120,80,180,0.3)' : 'rgba(120,80,180,0.2)',
    sessionPsychLabel: dark ? '#c4b5fd' : '#7850b4',
    sessionPersonalBg: dark ? 'rgba(180,120,0,0.12)' : 'rgba(180,120,0,0.05)',
    sessionPersonalBorder: dark ? 'rgba(180,120,0,0.3)' : 'rgba(180,120,0,0.2)',
    sessionPersonalLabel: dark ? '#fbbf24' : '#b47800',
    sessionRestBg: dark ? 'rgba(255,255,255,0.03)' : 'rgba(26,26,26,0.02)',
    sessionRestBorder: dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,26,0.08)',
    sessionRestLabel: dark ? 'rgba(255,255,255,0.3)' : '#8a8070',
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleDark, t }}>
      <style>{`
        @keyframes waveIn {
          0% { transform: translateX(-100%); opacity: 0.9; }
          50% { transform: translateX(0%); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(43,94,167,0.4); }
          50% { opacity: 0.8; box-shadow: 0 0 0 4px rgba(43,94,167,0); }
        }
      `}</style>

      {transitioning && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          pointerEvents: 'none',
          background: dark
            ? 'linear-gradient(105deg, transparent 0%, rgba(43,94,167,0.15) 40%, rgba(8,13,20,0.95) 60%, transparent 100%)'
            : 'linear-gradient(105deg, transparent 0%, rgba(245,242,236,0.95) 40%, rgba(255,255,255,0.8) 60%, transparent 100%)',
          animation: 'waveIn 0.5s ease-in-out forwards',
        }} />
      )}

      <div style={{ transition: 'background-color 0.35s ease' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}