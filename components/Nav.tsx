'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/method', label: 'Our Method' },
    { href: '/discovery', label: 'Discovery' },
    { href: '/membership', label: 'Membership' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      width: 'calc(100% - 80px)',
      maxWidth: '1100px',
    }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        height: '58px',
        background: 'rgba(245,242,236,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '14px',
        border: '0.5px solid rgba(26,26,26,0.08)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.6) inset',
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '26px', height: '26px',
            border: '1.5px solid #2B5EA7',
            borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '7px', height: '7px',
              background: '#2B5EA7',
              borderRadius: '2px',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
          </div>
          <span style={{
            fontSize: '13px', fontWeight: '700',
            letterSpacing: '0.5px',
            fontFamily: 'var(--font-playfair)',
            color: '#1a1a1a',
            whiteSpace: 'nowrap' as const,
          }}>
            FLOW <span style={{ color: '#2B5EA7' }}>CAPITALS</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
          {links.map(link => {
            const active = pathname === link.href
            return (
              <Link key={link.href} href={link.href} style={{
                fontSize: '11px',
                letterSpacing: '0.06em',
                padding: '7px 14px',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter)',
                color: active ? '#ffffff' : '#6a6060',
                background: active ? '#2B5EA7' : 'transparent',
                borderRadius: '8px',
                transition: 'all 0.18s',
                fontWeight: active ? '600' : '400',
                whiteSpace: 'nowrap' as const,
              }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.color = '#1a1a1a'
                    e.currentTarget.style.background = 'rgba(26,26,26,0.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.color = '#6a6060'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >{link.label}</Link>
            )
          })}
        </div>

        {/* Login */}
        <Link href="/login" style={{
          border: '1.5px solid #2B5EA7',
          background: 'transparent',
          color: '#2B5EA7',
          fontSize: '11px',
          letterSpacing: '0.08em',
          padding: '7px 18px',
          textDecoration: 'none',
          transition: 'all 0.18s',
          fontFamily: 'var(--font-inter)',
          fontWeight: '600',
          borderRadius: '8px',
          flexShrink: 0,
          whiteSpace: 'nowrap' as const,
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#2B5EA7'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#2B5EA7'
          }}
        >Login</Link>
      </nav>
    </div>
  )
}