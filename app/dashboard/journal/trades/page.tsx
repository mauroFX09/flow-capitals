'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Trade {
  id: string
  user_id: string
  pair: string
  direction: 'long' | 'short'
  trade_date: string
  entry_price: number | null
  exit_price: number | null
  stop_loss: number | null
  take_profit: number | null
  lot_size: number | null
  pnl: number
  rr: number
  notes: string
  screenshots: string[]
  session: string
  emotion: string
  followed_plan: boolean
  created_at: string
}

const PAIRS = [
  'EUR/USD','GBP/USD','USD/JPY','USD/CHF','AUD/USD','NZD/USD','USD/CAD',
  'EUR/GBP','EUR/JPY','EUR/CHF','EUR/AUD','EUR/CAD','EUR/NZD',
  'GBP/JPY','GBP/CHF','GBP/AUD','GBP/CAD','GBP/NZD',
  'AUD/JPY','AUD/CHF','AUD/CAD','AUD/NZD',
  'NZD/JPY','CHF/JPY','CAD/JPY',
  'XAU/USD','XAG/USD',
  'BTC/USD','ETH/USD',
  'US30','NAS100','SPX500',
]

// ─── Trade Detail Modal ───────────────────────────────────────────────────────

function TradeModal({ trade, dark, onClose, onEdit, onDelete }: {
  trade: Trade
  dark: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const accent      = '#2B5EA7'
  const cardBg      = dark ? '#1a1a1a' : '#ffffff'
  const cardBorder  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.08)'
  const textPrimary = dark ? '#ffffff' : '#1a1a1a'
  const textMuted   = dark ? 'rgba(255,255,255,0.4)' : 'rgba(26,26,26,0.4)'
  const overlayBg   = dark ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.45)'
  const divider     = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const rowBg       = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'

  const pnlColor = trade.pnl > 0 ? '#22c55e' : trade.pnl < 0 ? '#dc3232' : textPrimary
  const date = new Date(trade.trade_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') lightboxUrl ? setLightboxUrl(null) : onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxUrl, onClose])

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.08em',
    textTransform: 'uppercase', color: textMuted,
  }
  const valueStyle: React.CSSProperties = {
    fontFamily: 'var(--font-inter)', fontSize: '13px', color: textPrimary, fontWeight: 500,
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleBackdrop} style={{
        position: 'fixed', inset: 0, background: overlayBg,
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', backdropFilter: 'blur(4px)',
      }}>
        {/* Modal */}
        <div style={{
          background: cardBg, border: `0.5px solid ${cardBorder}`,
          borderRadius: '20px', width: '100%', maxWidth: '520px',
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: dark ? '0 24px 80px rgba(0,0,0,0.7)' : '0 24px 80px rgba(0,0,0,0.18)',
        }}>
          {/* Header */}
          <div style={{ padding: '22px 24px 16px', borderBottom: `0.5px solid ${divider}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: textPrimary, marginBottom: '4px' }}>
                {trade.pair}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted }}>{date}</span>
                <span style={{
                  fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: trade.direction === 'long' ? '#22c55e' : '#dc3232',
                  background: trade.direction === 'long'
                    ? (dark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.08)')
                    : (dark ? 'rgba(220,50,50,0.12)' : 'rgba(220,50,50,0.08)'),
                  padding: '3px 8px', borderRadius: '6px',
                }}>{trade.direction}</span>
                {trade.session && (
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '6px', textTransform: 'capitalize' }}>
                    {trade.session}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '22px', lineHeight: 1, padding: '0 0 0 12px', flexShrink: 0 }}>×</button>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', background: divider, borderBottom: `0.5px solid ${divider}` }}>
            {[
              { label: 'P&L', value: `${trade.pnl > 0 ? '+' : ''}€${trade.pnl?.toFixed(0) ?? '—'}`, color: pnlColor },
              { label: 'R:R', value: trade.rr > 0 ? `1:${trade.rr}` : '—', color: textPrimary },
              { label: 'Emotion', value: trade.emotion || '—', color: textPrimary },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: rowBg, padding: '14px 16px' }}>
                <div style={{ ...labelStyle, marginBottom: '5px' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 700, color, letterSpacing: '-0.01em', textTransform: 'capitalize' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Price details */}
          {(trade.entry_price || trade.exit_price) && (
            <div style={{ padding: '16px 24px', borderBottom: `0.5px solid ${divider}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {trade.entry_price != null && (
                <div>
                  <div style={{ ...labelStyle, marginBottom: '4px' }}>Entry</div>
                  <div style={valueStyle}>{trade.entry_price}</div>
                </div>
              )}
              {trade.exit_price != null && (
                <div>
                  <div style={{ ...labelStyle, marginBottom: '4px' }}>Exit</div>
                  <div style={valueStyle}>{trade.exit_price}</div>
                </div>
              )}
            </div>
          )}

          {/* Followed plan */}
          <div style={{ padding: '12px 24px', borderBottom: `0.5px solid ${divider}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
              background: trade.followed_plan ? (dark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)') : (dark ? 'rgba(220,50,50,0.15)' : 'rgba(220,50,50,0.1)'),
              border: `1px solid ${trade.followed_plan ? '#22c55e' : '#dc3232'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {trade.followed_plan && <span style={{ color: '#22c55e', fontSize: '10px', fontWeight: 700, lineHeight: 1 }}>✓</span>}
            </div>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: trade.followed_plan ? '#22c55e' : '#dc3232' }}>
              {trade.followed_plan ? 'Followed the trading plan' : 'Did not follow the trading plan'}
            </span>
          </div>

          {/* Notes */}
          {trade.notes && (
            <div style={{ padding: '16px 24px', borderBottom: `0.5px solid ${divider}` }}>
              <div style={{ ...labelStyle, marginBottom: '8px' }}>Notes</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textPrimary, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {trade.notes}
              </div>
            </div>
          )}

          {/* Screenshots */}
          {trade.screenshots?.length > 0 && (
            <div style={{ padding: '16px 24px', borderBottom: `0.5px solid ${divider}` }}>
              <div style={{ ...labelStyle, marginBottom: '10px' }}>Screenshots</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {trade.screenshots.map((url, i) => (
                  <div key={i} onClick={() => setLightboxUrl(url)} style={{ cursor: 'zoom-in', borderRadius: '8px', overflow: 'hidden', border: `0.5px solid ${cardBorder}`, width: '110px', height: '78px', flexShrink: 0 }}>
                    <img src={url} alt={`screenshot ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            {confirmDelete ? (
              <>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#dc3232', alignSelf: 'center', marginRight: 'auto' }}>Delete this trade?</span>
                <button onClick={() => setConfirmDelete(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: `0.5px solid ${cardBorder}`, background: 'transparent', color: textMuted, fontFamily: 'var(--font-inter)', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={onDelete} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#dc3232', color: '#fff', fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
              </>
            ) : (
              <>
                <button onClick={() => setConfirmDelete(true)} style={{ padding: '8px 16px', borderRadius: '10px', border: '0.5px solid rgba(220,50,50,0.3)', background: 'transparent', color: '#dc3232', fontFamily: 'var(--font-inter)', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                <button onClick={onEdit} style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', background: accent, color: '#fff', fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Edit Trade</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div onClick={() => setLightboxUrl(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'zoom-out' }}>
          <img src={lightboxUrl} alt="screenshot" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
          <button onClick={() => setLightboxUrl(null)} style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer', lineHeight: 1, opacity: 0.7 }}>×</button>
        </div>
      )}
    </>
  )
}

// ─── Trade Form ───────────────────────────────────────────────────────────────

interface TradeFormProps {
  dark: boolean
  editingTrade: Trade | null
  onSave: (data: Partial<Trade>) => Promise<void>
  onCancel: () => void
  uploadScreenshot: (file: File) => Promise<string | null>
  deleteScreenshot: (url: string) => Promise<void>
}

function TradeForm({ dark, editingTrade, onSave, onCancel, uploadScreenshot, deleteScreenshot }: TradeFormProps) {
  const accent      = '#2B5EA7'
  const cardBg      = dark ? '#1a1a1a' : '#ffffff'
  const cardBorder  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.08)'
  const textPrimary = dark ? '#ffffff' : '#1a1a1a'
  const textMuted   = dark ? 'rgba(255,255,255,0.4)' : 'rgba(26,26,26,0.4)'
  const inputBg     = dark ? '#111111' : '#f9f9f9'

  const [pair,         setPair]         = useState(editingTrade?.pair || PAIRS[0])
  const [direction,    setDirection]    = useState<'long' | 'short'>(editingTrade?.direction ?? 'long')
  const [tradeDate,    setTradeDate]    = useState(editingTrade?.trade_date ?? new Date().toISOString().split('T')[0])
  const [entryPrice,   setEntryPrice]   = useState(editingTrade?.entry_price != null ? String(editingTrade.entry_price) : '')
  const [exitPrice,    setExitPrice]    = useState(editingTrade?.exit_price  != null ? String(editingTrade.exit_price)  : '')
  const [pnl,          setPnl]          = useState(editingTrade?.pnl != null ? String(editingTrade.pnl) : '')
  const [rr,           setRr]           = useState(editingTrade?.rr  != null ? String(editingTrade.rr)  : '')
  const [notes,        setNotes]        = useState(editingTrade?.notes ?? '')
  const [session,      setSession]      = useState(editingTrade?.session ?? '')
  const [emotion,      setEmotion]      = useState(editingTrade?.emotion ?? '')
  const [followedPlan, setFollowedPlan] = useState(editingTrade?.followed_plan ?? true)
  const [screenshots,  setScreenshots]  = useState<string[]>(editingTrade?.screenshots ?? [])
  const [uploading,    setUploading]    = useState(false)
  const [saving,       setSaving]       = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadScreenshot(file)
    if (url) setScreenshots(prev => [...prev, url])
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeScreenshot = async (i: number) => {
    const url = screenshots[i]
    setScreenshots(prev => prev.filter((_, idx) => idx !== i))
    await deleteScreenshot(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave({
      pair,
      direction,
      trade_date:  tradeDate,
      entry_price: entryPrice ? parseFloat(entryPrice) : null,
      exit_price:  exitPrice  ? parseFloat(exitPrice)  : null,
      pnl:         parseFloat(pnl) || 0,
      rr:          parseFloat(rr)  || 0,
      notes,
      screenshots,
      session,
      emotion,
      followed_plan: followedPlan,
    })
    setSaving(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: inputBg,
    border: `0.5px solid ${cardBorder}`, borderRadius: '8px',
    padding: '9px 12px', fontFamily: 'var(--font-inter)', fontSize: '13px',
    color: textPrimary, outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.08em',
    textTransform: 'uppercase' as const, color: textMuted,
    marginBottom: '5px', display: 'block',
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '20px' }}>
        {editingTrade ? 'Edit Trade' : 'Log New Trade'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
        <div>
          <label style={labelStyle}>Pair</label>
          <select value={pair} onChange={e => setPair(e.target.value)} style={{ ...inputStyle, appearance: 'none' as any }}>
            {PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Date</label>
          <input type="date" value={tradeDate} onChange={e => setTradeDate(e.target.value)} style={inputStyle} required />
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Direction</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['long', 'short'] as const).map(d => (
            <button key={d} type="button" onClick={() => setDirection(d)} style={{
              flex: 1, padding: '8px', borderRadius: '8px',
              border: `0.5px solid ${direction === d ? accent : cardBorder}`,
              background: direction === d ? (dark ? 'rgba(43,94,167,0.12)' : 'rgba(43,94,167,0.07)') : inputBg,
              color: direction === d ? accent : textMuted,
              fontFamily: 'var(--font-inter)', fontSize: '12px',
              fontWeight: direction === d ? 600 : 400, cursor: 'pointer',
              textTransform: 'uppercase' as const, letterSpacing: '0.06em',
            }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
        <div>
          <label style={labelStyle}>Entry Price</label>
          <input type="number" step="any" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} placeholder="0.00" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Exit Price</label>
          <input type="number" step="any" value={exitPrice} onChange={e => setExitPrice(e.target.value)} placeholder="0.00" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
        <div>
          <label style={labelStyle}>P&amp;L (€)</label>
          <input type="number" step="any" value={pnl} onChange={e => setPnl(e.target.value)} placeholder="0.00" style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>Realized R:R</label>
          <input type="number" step="any" value={rr} onChange={e => setRr(e.target.value)} placeholder="0.00" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
        <div>
          <label style={labelStyle}>Session</label>
          <select value={session} onChange={e => setSession(e.target.value)} style={{ ...inputStyle, appearance: 'none' as any }}>
            <option value="">—</option>
            <option value="london">London</option>
            <option value="ny">New York</option>
            <option value="asia">Asia</option>
            <option value="overlap">Overlap</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Emotion</label>
          <select value={emotion} onChange={e => setEmotion(e.target.value)} style={{ ...inputStyle, appearance: 'none' as any }}>
            <option value="">—</option>
            <option value="calm">Calm</option>
            <option value="confident">Confident</option>
            <option value="anxious">Anxious</option>
            <option value="fomo">FOMO</option>
            <option value="revenge">Revenge</option>
            <option value="disciplined">Disciplined</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="checkbox" id="followedPlan" checked={followedPlan} onChange={e => setFollowedPlan(e.target.checked)} style={{ width: '15px', height: '15px', accentColor: accent, cursor: 'pointer' }} />
        <label htmlFor="followedPlan" style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted, cursor: 'pointer' }}>Followed the trading plan</label>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="What happened? What did you learn?" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Screenshots</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {screenshots.map((url, i) => (
            <div key={i} style={{ position: 'relative', width: '90px', height: '65px', borderRadius: '8px', overflow: 'hidden', border: `0.5px solid ${cardBorder}` }}>
              <img src={url} alt={`screenshot ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button type="button" onClick={() => removeScreenshot(i)} style={{ position: 'absolute', top: '3px', right: '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: 0 }}>×</button>
            </div>
          ))}
          <button type="button" onClick={() => fileRef.current?.click()} style={{ width: '90px', height: '65px', borderRadius: '8px', border: `0.5px dashed ${cardBorder}`, background: inputBg, color: textMuted, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span style={{ fontSize: '20px', lineHeight: 1, fontWeight: 300 }}>+</span>
            <span>{uploading ? '…' : 'Add'}</span>
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={{ padding: '9px 20px', borderRadius: '10px', border: `0.5px solid ${cardBorder}`, background: 'transparent', color: textMuted, fontFamily: 'var(--font-inter)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
        <button type="submit" disabled={saving} style={{ padding: '9px 24px', borderRadius: '10px', border: 'none', background: accent, color: '#fff', fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving…' : editingTrade ? 'Update Trade' : 'Log Trade'}</button>
      </div>
    </form>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TradesPage() {
  const router = useRouter()

  const [trades,       setTrades]       = useState<Trade[]>([])
  const [loading,      setLoading]      = useState(true)
  const [showForm,     setShowForm]     = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [selectedTrade,setSelectedTrade]= useState<Trade | null>(null)
  const [error,        setError]        = useState('')
  const [dark,         setDark]         = useState(false)
  const [isMobile,     setIsMobile]     = useState(false)

  useEffect(() => {
    const check = () => setDark(localStorage.getItem('fc-dark-mode') === 'true')
    check()
    window.addEventListener('fc-theme-change', check)
    return () => window.removeEventListener('fc-theme-change', check)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const fetchTrades = useCallback(async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', session.user.id)
      .order('trade_date', { ascending: false })
    if (error) setError(error.message)
    else setTrades(data ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => { fetchTrades() }, [fetchTrades])

  const uploadScreenshot = async (file: File): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null
    const ext  = file.name.split('.').pop()
    const path = `${session.user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('trade-screenshots').upload(path, file)
    if (error) { console.error(error); return null }
    const { data } = supabase.storage.from('trade-screenshots').getPublicUrl(path)
    return data.publicUrl
  }

  const deleteScreenshot = async (url: string) => {
    const path = url.split('/trade-screenshots/')[1]
    if (path) await supabase.storage.from('trade-screenshots').remove([path])
  }

  const handleSave = async (formData: Partial<Trade>) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    if (editingTrade) {
      const { error } = await supabase.from('trades').update(formData).eq('id', editingTrade.id)
      if (error) { setError(error.message); return }
    } else {
      const { error } = await supabase.from('trades').insert({ ...formData, user_id: session.user.id })
      if (error) { setError(error.message); return }
    }
    setShowForm(false)
    setEditingTrade(null)
    setSelectedTrade(null)
    fetchTrades()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('trades').delete().eq('id', id)
    if (error) setError(error.message)
    else { setTrades(prev => prev.filter(t => t.id !== id)); setSelectedTrade(null) }
  }

  const totalPnl     = trades.reduce((s, t) => s + (t.pnl || 0), 0)
  const wins         = trades.filter(t => t.pnl > 0)
  const losses       = trades.filter(t => t.pnl < 0)
  const winRate      = trades.length > 0 ? Math.round((wins.length / trades.length) * 100) : 0
  const tradesWithRR = trades.filter(t => t.rr > 0)
  const avgRR        = tradesWithRR.length > 0
    ? parseFloat((tradesWithRR.reduce((s, t) => s + t.rr, 0) / tradesWithRR.length).toFixed(2))
    : 0
  const grossProfit  = wins.reduce((s, t) => s + t.pnl, 0)
  const grossLoss    = Math.abs(losses.reduce((s, t) => s + t.pnl, 0))
  const profitFactor = grossLoss > 0
    ? parseFloat((grossProfit / grossLoss).toFixed(2))
    : grossProfit > 0 ? Infinity : 0

  const accent      = '#2B5EA7'
  const cardBg      = dark ? '#1a1a1a' : '#ffffff'
  const cardBorder  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.08)'
  const cardShadow  = dark ? '0 1px 12px rgba(0,0,0,0.4)' : '0 1px 12px rgba(0,0,0,0.05)'
  const textPrimary = dark ? '#ffffff' : '#1a1a1a'
  const textMuted   = dark ? 'rgba(255,255,255,0.4)' : 'rgba(26,26,26,0.4)'
  const pageBg      = dark ? '#0f0f0f' : '#f7f7f7'

  const pnlColor = totalPnl > 0 ? '#22c55e' : totalPnl < 0 ? '#dc3232' : textPrimary
  const rrColor  = avgRR >= 1 ? '#22c55e' : avgRR > 0 ? '#dc3232' : textPrimary
  const wrColor  = winRate >= 50 ? '#22c55e' : '#dc3232'
  const pfColor  = profitFactor >= 2 ? '#22c55e' : profitFactor >= 1 ? accent : profitFactor === 0 ? textPrimary : '#dc3232'

  return (
    <div style={{ minHeight: '100vh', background: pageBg, padding: isMobile ? '20px 16px' : '32px 32px' }}>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? '24px' : '32px', fontWeight: 700, color: textPrimary, marginBottom: '4px' }}>Trade Journal.</div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textMuted }}>Track, review and improve every trade</div>
      </div>

      {!loading && trades.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: totalPnl < 0 ? (dark ? 'rgba(220,50,50,0.08)' : 'rgba(220,50,50,0.05)') : cardBg, border: `0.5px solid ${totalPnl < 0 ? 'rgba(220,50,50,0.2)' : cardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: '20px 22px' }}>
            <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Net P&L</div>
            <div style={{ fontSize: '28px', fontFamily: 'var(--font-inter)', fontWeight: 700, color: pnlColor, lineHeight: 1, letterSpacing: '-0.02em' }}>{totalPnl >= 0 ? '+' : ''}€{totalPnl.toFixed(0)}</div>
          </div>
          <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: '20px 22px' }}>
            <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Avg R:R</div>
            <div style={{ fontSize: '28px', fontFamily: 'var(--font-inter)', fontWeight: 700, color: rrColor, lineHeight: 1, letterSpacing: '-0.02em' }}>{avgRR > 0 ? `1:${avgRR}` : '—'}</div>
          </div>
          <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: '20px 22px' }}>
            <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Win Rate</div>
            <div style={{ fontSize: '28px', fontFamily: 'var(--font-inter)', fontWeight: 700, color: wrColor, lineHeight: 1, letterSpacing: '-0.02em' }}>{winRate}%</div>
          </div>
          <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow, padding: '20px 22px' }}>
            <div style={{ fontSize: '10px', color: textMuted, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Profit Factor</div>
            <div style={{ fontSize: '28px', fontFamily: 'var(--font-inter)', fontWeight: 700, color: pfColor, lineHeight: 1, letterSpacing: '-0.02em' }}>{profitFactor === Infinity ? '∞' : profitFactor > 0 ? profitFactor.toFixed(2) : '—'}</div>
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: dark ? 'rgba(220,50,50,0.1)' : 'rgba(220,50,50,0.06)', border: '0.5px solid rgba(220,50,50,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#dc3232', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {error}
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#dc3232', cursor: 'pointer', fontSize: '16px', fontWeight: 700, lineHeight: 1, padding: 0, marginLeft: '12px' }}>×</button>
        </div>
      )}

      {!showForm && !editingTrade && (
        <button onClick={() => setShowForm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: accent, color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 20px', fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
          <span style={{ fontSize: '18px', lineHeight: 1, fontWeight: 300 }}>+</span>
          Log Trade
        </button>
      )}

      {(showForm || editingTrade) && (
        <TradeForm
          dark={dark}
          editingTrade={editingTrade}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingTrade(null) }}
          uploadScreenshot={uploadScreenshot}
          deleteScreenshot={deleteScreenshot}
        />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: textMuted }}>Loading…</div>
      ) : trades.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', boxShadow: cardShadow }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, color: textPrimary, marginBottom: '8px' }}>No trades yet</div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textMuted }}>Log your first trade to get started</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {trades.map(trade => {
            const tPnlColor = trade.pnl > 0 ? '#22c55e' : trade.pnl < 0 ? '#dc3232' : textPrimary
            const date = new Date(trade.trade_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            const hasExtra = !!(trade.notes || (trade.screenshots?.length > 0))
            return (
              <div
                key={trade.id}
                onClick={() => setSelectedTrade(trade)}
                style={{
                  background: cardBg, border: `0.5px solid ${cardBorder}`,
                  borderRadius: '12px', boxShadow: cardShadow,
                  padding: '12px 18px', cursor: 'pointer',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = dark ? 'rgba(255,255,255,0.16)' : 'rgba(43,94,167,0.25)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = dark ? '0 2px 16px rgba(0,0,0,0.5)' : '0 2px 16px rgba(43,94,167,0.08)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = cardBorder
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = cardShadow
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 700, color: textPrimary, flexShrink: 0 }}>{trade.pair || '—'}</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted, flexShrink: 0 }}>{date}</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: trade.direction === 'long' ? '#22c55e' : '#dc3232', background: trade.direction === 'long' ? (dark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.08)') : (dark ? 'rgba(220,50,50,0.12)' : 'rgba(220,50,50,0.08)'), padding: '3px 8px', borderRadius: '6px', flexShrink: 0 }}>{trade.direction}</span>
                  {trade.session && <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '6px', textTransform: 'capitalize' as const, flexShrink: 0 }}>{trade.session}</span>}
                  {trade.emotion && <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, textTransform: 'capitalize' as const, flexShrink: 0 }}>{trade.emotion}</span>}
                  {trade.rr > 0 && <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, flexShrink: 0 }}>R:R <strong style={{ color: textPrimary }}>1:{trade.rr}</strong></span>}
                  {hasExtra && <span style={{ fontSize: '11px', color: textMuted, flexShrink: 0 }}>•••</span>}
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', color: tPnlColor }}>{trade.pnl > 0 ? '+' : ''}€{trade.pnl?.toFixed(0) ?? '—'}</span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, opacity: 0.5 }}>›</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedTrade && (
        <TradeModal
          trade={selectedTrade}
          dark={dark}
          onClose={() => setSelectedTrade(null)}
          onEdit={() => { setEditingTrade(selectedTrade); setSelectedTrade(null); setShowForm(false) }}
          onDelete={() => handleDelete(selectedTrade.id)}
        />
      )}
    </div>
  )
}