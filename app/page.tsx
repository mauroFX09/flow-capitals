export default function Home() {
  return (
    <main style={{
      background: '#050e1a',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: '#f0f6ff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '80px',
          fontWeight: '900',
          letterSpacing: '-2px',
          margin: '0 0 8px',
          color: '#f0f6ff'
        }}>FLOW</h1>
        <div style={{
          width: '180px',
          height: '4px',
          background: '#4ecdc4',
          margin: '0 auto 16px'
        }}/>
        <p style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: '14px',
          letterSpacing: '6px',
          color: '#4ecdc4',
          margin: '0 0 40px'
        }}>Capitals.</p>
        <p style={{
          fontSize: '16px',
          color: '#4ecdc4',
          letterSpacing: '2px',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic'
        }}>Platform launching soon.</p>
      </div>
    </main>
  )
}