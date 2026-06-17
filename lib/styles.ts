export function getTheme(dark: boolean) {
  return {
    bg: dark ? '#080d14' : '#F5F2EC',
    cardBg: dark ? '#0f1825' : '#ffffff',
    cardBorder: dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)',
    cardShadow: dark
      ? '0 4px 20px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset'
      : '0 4px 20px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset',
    textPrimary: dark ? '#e0ecf8' : '#1a1a1a',
    textMuted: dark ? 'rgba(255,255,255,0.4)' : '#8a8070',
    accent: dark ? '#7aaee8' : '#2B5EA7',
    inputBg: dark ? '#0a1018' : '#F5F2EC',
    inputBorder: dark ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,26,0.12)',
    tableBorder: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.06)',
    navActive: dark ? 'rgba(43,94,167,0.25)' : 'rgba(43,94,167,0.07)',
    navHover: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.03)',
  }
}

export function getCard(dark: boolean) {
  const t = getTheme(dark)
  return {
    background: t.cardBg,
    border: `0.5px solid ${t.cardBorder}`,
    borderRadius: '16px',
    boxShadow: t.cardShadow,
  }
}