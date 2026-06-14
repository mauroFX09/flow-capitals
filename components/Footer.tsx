export default function Footer() {
  return (
    <footer style={{ background: '#0d1e36', fontFamily: 'var(--font-inter)' }}>

      {/* Main footer grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 80px 48px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '60px' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '28px', height: '28px', border: '1.5px solid #7aaee8', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '7px', height: '7px', background: '#7aaee8', borderRadius: '2px' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '14px', fontWeight: '700', letterSpacing: '0.5px', color: '#ffffff' }}>
              FLOW <span style={{ color: '#7aaee8' }}>CAPITALS</span>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.8', marginBottom: '24px', maxWidth: '240px' }}>
            Trading education built from years of failure. The blueprint. Now it is yours.
          </p>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            hello@flowcapitals.com
          </div>
        </div>

        {/* Platform */}
        <div>
          <div style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.25)', marginBottom: '20px' }}>Platform</div>
          {[
            { label: 'Home', href: '/' },
            { label: 'Our Method', href: '/method' },
            { label: 'Discovery', href: '/discovery' },
            { label: 'Membership', href: '/membership' },
            { label: 'Contact', href: '/contact' },
          ].map(link => (
            <a key={link.label} href={link.href} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: '10px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >{link.label}</a>
          ))}
        </div>

        {/* Socials */}
        <div>
          <div style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.25)', marginBottom: '20px' }}>Socials</div>
          {[
            { label: 'Instagram', href: '#' },
            { label: 'Facebook', href: '#' },
            { label: 'YouTube', href: '#' },
            { label: 'Discord (Free)', href: '#' },
          ].map(link => (
            <a key={link.label} href={link.href} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: '10px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#7aaee8'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >{link.label}</a>
          ))}
        </div>

        {/* Legal */}
        <div>
          <div style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.25)', marginBottom: '20px' }}>Legal</div>
          {[
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms & Conditions', href: '#' },
            { label: 'Cookie Policy', href: '#' },
          ].map(link => (
            <a key={link.label} href={link.href} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: '10px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >{link.label}</a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', maxWidth: '1100px', margin: '0 auto', padding: '20px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>© 2026 Flow Capitals. All rights reserved.</div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', maxWidth: '400px', textAlign: 'center' as const, lineHeight: '1.6' }}>
          Educational purposes only. Does not constitute financial advice. Trading involves significant risk.
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>Belgium · EST. 2024</div>
      </div>
    </footer>
  )
}