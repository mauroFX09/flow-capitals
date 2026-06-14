'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type Trade = {
  id: string
  pair: string
  direction: string
  entry_price: number
  stop_loss: number
  take_profit: number
  lot_size: number
  pnl: number
  rr: number
  emotion: string
  notes: string
  followed_plan: boolean | null
  screenshot_urls: string[]
  created_at: string
}

const PAIR_CATEGORIES = {
  'Forex Majors': ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD'],
  'Forex Minors': ['EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'EUR/AUD', 'GBP/AUD', 'AUD/JPY', 'EUR/CAD', 'GBP/CAD'],
  'Indices': ['NAS100', 'US500', 'US30', 'DAX40', 'FTSE100', 'JP225'],
  'Commodities': ['XAU/USD', 'XAG/USD', 'USOIL', 'UKOIL'],
  'Crypto': ['BTC/USD', 'ETH/USD', 'SOL/USD'],
}

const EMOTIONS = [
  { label: 'Calm', emoji: '😌' },
  { label: 'Confident', emoji: '💪' },
  { label: 'Patient', emoji: '🧘' },
  { label: 'Focused', emoji: '🎯' },
  { label: 'Nervous', emoji: '😰' },
  { label: 'FOMO', emoji: '😱' },
  { label: 'Revenge', emoji: '😤' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Greedy', emoji: '🤑' },
  { label: 'Bored', emoji: '😑' },
]

const PAIR_ICONS: Record<string, string> = {
  'EUR': '🇪🇺', 'GBP': '🇬🇧', 'USD': '🇺🇸', 'JPY': '🇯🇵',
  'CHF': '🇨🇭', 'AUD': '🇦🇺', 'CAD': '🇨🇦', 'NZD': '🇳🇿',
  'XAU': '🥇', 'XAG': '🥈', 'NAS': '📈', 'US5': '📊',
  'US3': '📊', 'DAX': '🇩🇪', 'FTS': '🇬🇧', 'JP2': '🇯🇵',
  'BTC': '₿', 'ETH': '⟠', 'SOL': '◎', 'USO': '🛢️', 'UKO': '🛢️',
}

function getPairIcon(pair: string) {
  const base = pair.replace('/', '').substring(0, 3).toUpperCase()
  return PAIR_ICONS[base] || '💱'
}

const PER_PAGE = 10

const TABS = [
  { label: 'Overview', href: '/dashboard/journal', value: 'overview' },
  { label: 'Trade Log', href: '/dashboard/journal/trades', value: 'trades' },
  { label: 'Analytics', href: '/dashboard/journal/analytics', value: 'analytics' },
]

function SegmentedControl({ options, value, onChange, dark }: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  dark: boolean
}) {
  const cardBg = dark ? '#0f1825' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(26,26,26,0.08)'
  const textMuted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const activeIdx = options.findIndex(o => o.value === value)
  return (
    <div style={{ position: 'relative', display: 'flex', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.05)', borderRadius: '10px', padding: '3px' }}>
      <div style={{ position: 'absolute', top: '3px', left: `calc(3px + ${activeIdx} * (100% - 6px) / ${options.length})`, width: `calc((100% - 6px) / ${options.length})`, height: 'calc(100% - 6px)', background: cardBg, borderRadius: '7px', boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.12)', border: `0.5px solid ${cardBorder}`, transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 0 }} />
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{ flex: 1, padding: '7px 14px', background: 'transparent', border: 'none', color: value === opt.value ? (dark ? '#e0ecf8' : '#1a1a1a') : textMuted, fontFamily: 'var(--font-inter)', fontSize: '11px', cursor: 'pointer', position: 'relative', zIndex: 1, fontWeight: value === opt.value ? '600' : '400', transition: 'color 0.2s ease', borderRadius: '7px' }}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function PairSelector({ value, onChange, dark }: { value: string; onChange: (v: string) => void; dark: boolean }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const cardBg = dark ? '#0f1825' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,26,0.1)'
  const textPrimary = dark ? '#e0ecf8' : '#1a1a1a'
  const textMuted = dark ? 'rgba(255,255,255,0.4)' : '#8a8070'
  const accent = dark ? '#7aaee8' : '#2B5EA7'
  const inputBg = dark ? '#0a1018' : '#F5F2EC'

  const filtered = Object.entries(PAIR_CATEGORIES).reduce((acc, [cat, pairs]) => {
    const f = pairs.filter(p => p.toLowerCase().includes(search.toLowerCase()))
    if (f.length) acc[cat] = f
    return acc
  }, {} as Record<string, string[]>)

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', background: inputBg, border: `0.5px solid ${cardBorder}`, borderRadius: '10px', padding: '10px 14px', cursor: 'pointer' }}>
        <span style={{ fontSize: '16px' }}>{getPairIcon(value)}</span>
        <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '14px', color: textPrimary, flex: 1, textAlign: 'left' as const }}>{value}</span>
        <span style={{ fontSize: '10px', color: textMuted }}>▼</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '12px', boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, maxHeight: '320px', overflowY: 'auto' as const }}>
          <div style={{ padding: '10px' }}>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pairs..." style={{ width: '100%', background: inputBg, border: `0.5px solid ${cardBorder}`, borderRadius: '8px', padding: '8px 12px', fontFamily: 'var(--font-inter)', fontSize: '12px', color: textPrimary, outline: 'none' }} />
          </div>
          {Object.entries(filtered).map(([cat, pairs]) => (
            <div key={cat}>
              <div style={{ padding: '6px 14px', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{cat}</div>
              {pairs.map(pair => (
                <button key={pair} onClick={() => { onChange(pair); setOpen(false); setSearch('') }} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 14px', background: pair === value ? (dark ? 'rgba(122,174,232,0.1)' : 'rgba(43,94,167,0.06)') : 'transparent', border: 'none', cursor: 'pointer' }}>
                  <span style={{ fontSize: '16px' }}>{getPairIcon(pair)}</span>
                  <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '13px', color: pair === value ? accent : textPrimary }}>{pair}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const emptyForm = () => ({
  trade_date: new Date().toISOString().split('T')[0],
  pair: 'EUR/USD', direction: 'Long', entry_price: '',
  stop_loss: '', take_profit: '', lot_size: '', pnl: '',
  emotion: 'Calm', notes: '', followed_plan: null as boolean | null,
})

export default function TradeLog() {
  const [dark, setDark] = useState(false)
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [detailTrade, setDetailTrade] = useState<Trade | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState(emptyForm())

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
      if (!session) return
      setUserId(session.user.id)
      loadTrades(session.user.id)
    })
  }, [])

  async function loadTrades(uid: string) {
    setLoading(true)
    const { data } = await supabase.from('trades').select('*').eq('user_id', uid).order('created_at', { ascending: false })
    if (data) setTrades(data)
    setLoading(false)
  }

  async function uploadScreenshot(file: File) {
    if (!userId || screenshots.length >= 3) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('trade-screenshots').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('trade-screenshots').getPublicUrl(path)
      setScreenshots(prev => [...prev, data.publicUrl])
    }
    setUploading(false)
  }

  function openEdit(trade: Trade) {
    setEditingId(trade.id)
    setForm({
      trade_date: trade.created_at.split('T')[0],
      pair: trade.pair,
      direction: trade.direction,
      entry_price: trade.entry_price?.toString() || '',
      stop_loss: trade.stop_loss?.toString() || '',
      take_profit: trade.take_profit?.toString() || '',
      lot_size: trade.lot_size?.toString() || '',
      pnl: trade.pnl?.toString() || '',
      emotion: trade.emotion || 'Calm',
      notes: trade.notes || '',
      followed_plan: trade.followed_plan,
    })
    setScreenshots(trade.screenshot_urls || [])
    setShowForm(true)
    setDetailTrade(null)
  }

  function openNew() {
    setEditingId(null)
    setForm(emptyForm())
    setScreenshots([])
    setShowForm(true)
    setDetailTrade(null)
  }

  async function saveTrade() {
    if (!userId) return
    setSaving(true)
    const entry = parseFloat(form.entry_price)
    const sl = parseFloat(form.stop_loss)
    const tp = parseFloat(form.take_profit)
    const rr = sl && tp && entry ? Math.abs(tp - entry) / Math.abs(entry - sl) : 0
    const payload = {
      pair: form.pair, direction: form.direction,
      entry_price: entry || null, stop_loss: sl || null,
      take_profit: tp || null, lot_size: parseFloat(form.lot_size) || null,
      pnl: parseFloat(form.pnl) || 0, rr: parseFloat(rr.toFixed(2)),
      emotion: form.emotion, notes: form.notes,
      followed_plan: form.followed_plan, screenshot_urls: screenshots,
      created_at: new Date(form.trade_date).toISOString(),
    }
    if (editingId) {
      await supabase.from('trades').update(payload).eq('id', editingId)
    } else {
      await supabase.from('trades').insert({ ...payload, user_id: userId })
    }
    setForm(emptyForm())
    setScreenshots([])
    setShowForm(false)
    setEditingId(null)
    loadTrades(userId)
    setSaving(false)
  }

  async function deleteTrade(id: string) {
    await supabase.from('trades').delete().eq('id', id)
    if (userId) loadTrades(userId)
    setDetailTrade(null)
  }

  const totalPages = Math.ceil(trades.length / PER_PAGE)
  const paginated = trades.slice((page - 1) * PER_PAGE, page * PER_PAGE)

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

  return (
    <div style={{ padding: '40px 48px', background: bg, minHeight: '100vh' }}>

      {/* Detail popup modal */}
      {detailTrade && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setDetailTrade(null)}
        >
          <div style={{ ...card, maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto' as const, padding: '36px' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{getPairIcon(detailTrade.pair)}</span>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: textPrimary }}>{detailTrade.pair}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{new Date(detailTrade.created_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
              <button onClick={() => setDetailTrade(null)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>✕</button>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' as const }}>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: '700', color: detailTrade.pnl > 0 ? '#22c55e' : detailTrade.pnl < 0 ? '#dc3232' : '#94a3b8', background: detailTrade.pnl > 0 ? 'rgba(34,197,94,0.1)' : detailTrade.pnl < 0 ? 'rgba(220,50,50,0.1)' : 'rgba(148,163,184,0.1)', padding: '4px 12px', borderRadius: '6px' }}>
                {detailTrade.pnl > 0 ? 'WIN' : detailTrade.pnl < 0 ? 'LOSS' : 'BE'}
              </span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: '700', color: detailTrade.direction === 'Long' ? '#22c55e' : '#dc3232', background: detailTrade.direction === 'Long' ? 'rgba(34,197,94,0.1)' : 'rgba(220,50,50,0.1)', padding: '4px 12px', borderRadius: '6px' }}>
                {detailTrade.direction === 'Long' ? '↑ Long' : '↓ Short'}
              </span>
              {detailTrade.followed_plan !== null && (
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: '700', color: detailTrade.followed_plan ? '#22c55e' : '#dc3232', background: detailTrade.followed_plan ? 'rgba(34,197,94,0.1)' : 'rgba(220,50,50,0.1)', padding: '4px 12px', borderRadius: '6px' }}>
                  {detailTrade.followed_plan ? '✓ Followed Plan' : '✕ Broke Plan'}
                </span>
              )}
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,26,0.05)', padding: '4px 12px', borderRadius: '6px' }}>
                {EMOTIONS.find(e => e.label === detailTrade.emotion)?.emoji} {detailTrade.emotion}
              </span>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
              {[
                { label: 'P&L', value: `${detailTrade.pnl > 0 ? '+' : ''}${detailTrade.pnl?.toFixed(0)}€`, color: detailTrade.pnl > 0 ? '#22c55e' : detailTrade.pnl < 0 ? '#dc3232' : textPrimary },
                { label: 'R:R', value: detailTrade.rr ? `1:${detailTrade.rr}` : '—', color: textPrimary },
                { label: 'Entry', value: detailTrade.entry_price?.toString() || '—', color: textPrimary },
                { label: 'Stop Loss', value: detailTrade.stop_loss?.toString() || '—', color: textPrimary },
                { label: 'Take Profit', value: detailTrade.take_profit?.toString() || '—', color: textPrimary },
                { label: 'Lot Size', value: detailTrade.lot_size?.toString() || '—', color: textPrimary },
              ].map(stat => (
                <div key={stat.label} style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(26,26,26,0.03)', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>{stat.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Notes */}
            {detailTrade.notes && (
              <div style={{ marginBottom: '24px', padding: '16px', background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(26,26,26,0.03)', borderRadius: '10px' }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Notes & Thesis</div>
                <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '14px', color: textPrimary, lineHeight: '1.7', margin: 0 }}>{detailTrade.notes}</p>
              </div>
            )}

            {/* Screenshots */}
            {detailTrade.screenshot_urls?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Charts</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
                  {detailTrade.screenshot_urls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <img src={url} alt={`chart ${i + 1}`} style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: `0.5px solid ${cardBorder}`, cursor: 'pointer', transition: 'transform 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: `0.5px solid ${tableBorder}` }}>
              <button onClick={() => openEdit(detailTrade)} style={{ flex: 1, padding: '11px', background: accent, border: 'none', borderRadius: '10px', color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                ✎ Edit Trade
              </button>
              <button onClick={() => deleteTrade(detailTrade.id)} style={{ padding: '11px 20px', background: 'none', border: `0.5px solid rgba(220,50,50,0.3)`, borderRadius: '10px', color: '#dc3232', fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '1px', background: accent }} />Trading Journal
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '700', color: textPrimary, letterSpacing: '-1.5px', lineHeight: 1 }}>Trade Log.</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SegmentedControl
              options={TABS.map(t => ({ label: t.label, value: t.value }))}
              value="trades"
              onChange={v => { const tab = TABS.find(t => t.value === v); if (tab) window.location.href = tab.href }}
              dark={dark}
            />
            <button onClick={openNew} style={{ background: accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '10px 20px', border: 'none', cursor: 'pointer', borderRadius: '10px', fontWeight: '700', whiteSpace: 'nowrap' as const }}>
              + Log Trade
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ ...card, padding: '32px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.16em', textTransform: 'uppercase' as const }}>
              {editingId ? 'Edit Trade' : 'New Trade Entry'}
            </div>
            <button onClick={() => { setShowForm(false); setEditingId(null) }} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '18px' }}>✕</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Trade Date</label>
              <input type="date" value={form.trade_date} onChange={e => setForm({ ...form, trade_date: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Pair</label>
              <PairSelector value={form.pair} onChange={pair => setForm({ ...form, pair })} dark={dark} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Direction</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Long', 'Short'].map(d => (
                  <button key={d} onClick={() => setForm({ ...form, direction: d })} style={{ flex: 1, padding: '10px', background: form.direction === d ? (d === 'Long' ? '#22c55e' : '#dc3232') : inputBg, border: `0.5px solid ${form.direction === d ? 'transparent' : inputBorder}`, borderRadius: '10px', color: form.direction === d ? '#ffffff' : textMuted, fontFamily: 'var(--font-inter)', fontSize: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>
                    {d === 'Long' ? '↑ Long' : '↓ Short'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Entry Price</label>
              <input type="number" step="any" placeholder="1.08500" value={form.entry_price} onChange={e => setForm({ ...form, entry_price: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Stop Loss</label>
              <input type="number" step="any" placeholder="1.08200" value={form.stop_loss} onChange={e => setForm({ ...form, stop_loss: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Take Profit</label>
              <input type="number" step="any" placeholder="1.09500" value={form.take_profit} onChange={e => setForm({ ...form, take_profit: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Lot Size</label>
              <input type="number" step="any" placeholder="0.10" value={form.lot_size} onChange={e => setForm({ ...form, lot_size: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>P&L (€)</label>
              <input type="number" step="any" placeholder="+120.00" value={form.pnl} onChange={e => setForm({ ...form, pnl: e.target.value })} style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: parseFloat(form.pnl) > 0 ? '#22c55e' : parseFloat(form.pnl) < 0 ? '#dc3232' : textPrimary, outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Emotion</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
              {EMOTIONS.map(em => (
                <button key={em.label} onClick={() => setForm({ ...form, emotion: em.label })} style={{ padding: '7px 14px', background: form.emotion === em.label ? accent : inputBg, border: `0.5px solid ${form.emotion === em.label ? accent : inputBorder}`, borderRadius: '20px', color: form.emotion === em.label ? '#ffffff' : textMuted, fontFamily: 'var(--font-inter)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{em.emoji}</span><span>{em.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Followed Trading Plan?</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setForm({ ...form, followed_plan: true })} style={{ padding: '10px 28px', background: form.followed_plan === true ? '#22c55e' : inputBg, border: `0.5px solid ${form.followed_plan === true ? '#22c55e' : inputBorder}`, borderRadius: '10px', color: form.followed_plan === true ? '#ffffff' : textMuted, fontFamily: 'var(--font-inter)', fontSize: '13px', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✓</span> Yes
              </button>
              <button onClick={() => setForm({ ...form, followed_plan: false })} style={{ padding: '10px 28px', background: form.followed_plan === false ? '#dc3232' : inputBg, border: `0.5px solid ${form.followed_plan === false ? '#dc3232' : inputBorder}`, borderRadius: '10px', color: form.followed_plan === false ? '#ffffff' : textMuted, fontFamily: 'var(--font-inter)', fontSize: '13px', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✕</span> No
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Notes & Thesis</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="What was your reasoning? What did you see on the chart?" style={{ width: '100%', background: inputBg, border: `0.5px solid ${inputBorder}`, borderRadius: '10px', padding: '10px 12px', fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, outline: 'none', resize: 'vertical' as const }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Screenshots <span style={{ opacity: 0.5 }}>(optional · max 3)</span></label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
              {screenshots.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: '100px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: `0.5px solid ${inputBorder}` }}>
                  <img src={url} alt={`screenshot ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setScreenshots(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '18px', height: '18px', color: '#ffffff', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              ))}
              {screenshots.length < 3 && (
                <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ width: '100px', height: '70px', background: inputBg, border: `1px dashed ${inputBorder}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: textMuted }}>
                  <span style={{ fontSize: '20px' }}>{uploading ? '⏳' : '📎'}</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px' }}>{uploading ? 'Uploading...' : 'Add chart'}</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => { const file = e.target.files?.[0]; if (file) await uploadScreenshot(file); e.target.value = '' }} />
            </div>
          </div>

          <button onClick={saveTrade} disabled={saving} style={{ background: accent, color: '#ffffff', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '13px 32px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: '10px', fontWeight: '700', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : editingId ? 'Update Trade →' : 'Save Trade →'}
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: `0.5px solid ${tableBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: accent, letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>All Trades</div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{trades.length} total</div>
        </div>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: textMuted }}>Loading...</div>
        ) : trades.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '18px', color: textMuted, marginBottom: '8px' }}>No trades logged yet.</div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted }}>Click &quot;+ Log Trade&quot; to add your first entry.</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' as const }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ borderBottom: `0.5px solid ${tableBorder}` }}>
                    {['Date', 'Pair', 'Direction', 'Result', 'Entry', 'R:R', 'P&L', 'Emotion', 'Plan', 'Charts', ''].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: textMuted, fontWeight: '400', whiteSpace: 'nowrap' as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(trade => (
                    <tr key={trade.id} style={{ borderBottom: `0.5px solid ${tableBorder}`, cursor: 'pointer' }}
                      onClick={() => setDetailTrade(trade)}
                      onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.03)' : 'rgba(43,94,167,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, whiteSpace: 'nowrap' as const }}>{new Date(trade.created_at).toLocaleDateString('en-GB')}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>{getPairIcon(trade.pair)}</span>
                          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '13px', color: textPrimary, fontWeight: '600' }}>{trade.pair}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: '700', color: trade.direction === 'Long' ? '#22c55e' : '#dc3232', background: trade.direction === 'Long' ? 'rgba(34,197,94,0.1)' : 'rgba(220,50,50,0.1)', padding: '3px 9px', borderRadius: '4px' }}>
                          {trade.direction === 'Long' ? '↑ Long' : '↓ Short'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: '700', color: trade.pnl > 0 ? '#22c55e' : trade.pnl < 0 ? '#dc3232' : '#94a3b8', background: trade.pnl > 0 ? 'rgba(34,197,94,0.1)' : trade.pnl < 0 ? 'rgba(220,50,50,0.1)' : 'rgba(148,163,184,0.1)', padding: '3px 9px', borderRadius: '4px' }}>
                          {trade.pnl > 0 ? 'WIN' : trade.pnl < 0 ? 'LOSS' : 'BE'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted }}>{trade.entry_price || '—'}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted }}>{trade.rr ? `1:${trade.rr}` : '—'}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-playfair)', fontSize: '13px', fontWeight: '700', color: trade.pnl > 0 ? '#22c55e' : trade.pnl < 0 ? '#dc3232' : textMuted }}>{trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(0)}€</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>
                          {EMOTIONS.find(e => e.label === trade.emotion)?.emoji} {trade.emotion}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {trade.followed_plan === null
                          ? <span style={{ color: textMuted, fontSize: '11px' }}>—</span>
                          : trade.followed_plan
                          ? <span style={{ color: '#22c55e', fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: '700', background: 'rgba(34,197,94,0.1)', padding: '3px 8px', borderRadius: '4px' }}>✓ YES</span>
                          : <span style={{ color: '#dc3232', fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: '700', background: 'rgba(220,50,50,0.1)', padding: '3px 8px', borderRadius: '4px' }}>✕ NO</span>
                        }
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {trade.screenshot_urls?.length > 0 ? (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {trade.screenshot_urls.slice(0, 3).map((url, i) => (
                              <img key={i} src={url} alt="chart" style={{ width: '28px', height: '20px', objectFit: 'cover', borderRadius: '3px', border: `0.5px solid ${tableBorder}` }} />
                            ))}
                          </div>
                        ) : <span style={{ color: textMuted, fontSize: '11px' }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 14px' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => openEdit(trade)} style={{ background: 'none', border: 'none', color: accent, cursor: 'pointer', fontSize: '14px', opacity: 0.6, marginRight: '8px' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                        >✎</button>
                        <button onClick={() => deleteTrade(trade.id)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '14px', opacity: 0.5 }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#dc3232'; e.currentTarget.style.opacity = '1' }}
                          onMouseLeave={e => { e.currentTarget.style.color = textMuted; e.currentTarget.style.opacity = '0.5' }}
                        >✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div style={{ padding: '16px 24px', borderTop: `0.5px solid ${tableBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, trades.length)} of {trades.length}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 12px', background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', color: page === 1 ? textMuted : textPrimary, cursor: page === 1 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-inter)', fontSize: '11px', opacity: page === 1 ? 0.4 : 1 }}>←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{ padding: '6px 10px', background: p === page ? accent : 'none', border: `0.5px solid ${p === page ? accent : cardBorder}`, borderRadius: '6px', color: p === page ? '#ffffff' : textPrimary, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: '11px' }}>{p}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 12px', background: 'none', border: `0.5px solid ${cardBorder}`, borderRadius: '6px', color: page === totalPages ? textMuted : textPrimary, cursor: page === totalPages ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-inter)', fontSize: '11px', opacity: page === totalPages ? 0.4 : 1 }}>→</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}