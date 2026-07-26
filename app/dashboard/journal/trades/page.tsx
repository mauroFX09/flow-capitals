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
  source?: string
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

const SESSIONS  = ['London', 'New York', 'Asia', 'Overlap']
const EMOTIONS  = ['Calm', 'Confident', 'Anxious', 'FOMO', 'Revenge', 'Disciplined']

function TradeModal({ trade, dark, onClose, onEdit, onDelete }: {
  trade: Trade; dark: boolean; onClose: () => void; onEdit: () => void; onDelete: () => void
}) {
  const accent      = '#2B5EA7'
  const cardBg      = dark ? '#0d1e36' : '#ffffff'
  const cardBorder  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.08)'
  const textPrimary = dark ? '#ffffff' : '#1a1a1a'
  const textMuted   = dark ? 'rgba(255,255,255,0.4)' : 'rgba(26,26,26,0.4)'
  const overlayBg   = dark ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.45)'
  const divider     = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const rowBg       = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
  const pnlColor    = trade.pnl > 0 ? '#22c55e' : trade.pnl < 0 ? '#dc3232' : textPrimary
  const date        = new Date(trade.trade_date + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  const [lightboxUrl,   setLightboxUrl]   = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose() }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') lightboxUrl ? setLightboxUrl(null) : onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxUrl, onClose])

  const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: textMuted }
  const valueStyle: React.CSSProperties = { fontFamily: 'var(--font-inter)', fontSize: '13px', color: textPrimary, fontWeight: 500 }

  return (
    <>
      <div onClick={handleBackdrop} style={{ position: 'fixed', inset: 0, background: overlayBg, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '20px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: dark ? '0 24px 80px rgba(0,0,0,0.7)' : '0 24px 80px rgba(0,0,0,0.18)' }}>
          <div style={{ padding: '22px 24px 16px', borderBottom: `0.5px solid ${divider}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: textPrimary }}>{trade.pair}</div>
                {trade.source === 'mt5' && (
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7aaee8', background: dark ? 'rgba(122,174,232,0.12)' : 'rgba(43,94,167,0.08)', padding: '2px 7px', borderRadius: '5px' }}>MT5</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted }}>{date}</span>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: trade.direction === 'long' ? '#22c55e' : '#dc3232', background: trade.direction === 'long' ? (dark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.08)') : (dark ? 'rgba(220,50,50,0.12)' : 'rgba(220,50,50,0.08)'), padding: '3px 8px', borderRadius: '6px' }}>{trade.direction}</span>
                {trade.session && <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '6px', textTransform: 'capitalize' }}>{trade.session}</span>}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '22px', lineHeight: 1, padding: '0 0 0 12px', flexShrink: 0 }}>×</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', background: divider, borderBottom: `0.5px solid ${divider}` }}>
            {[{ label: 'P&L', value: `${trade.pnl > 0 ? '+' : ''}€${trade.pnl?.toFixed(0) ?? '—'}`, color: pnlColor }, { label: 'R:R', value: trade.rr > 0 ? `1:${trade.rr}` : '—', color: textPrimary }, { label: 'Emotion', value: trade.emotion || '—', color: textPrimary }].map(({ label, value, color }) => (
              <div key={label} style={{ background: rowBg, padding: '14px 16px' }}>
                <div style={{ ...labelStyle, marginBottom: '5px' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 700, color, letterSpacing: '-0.01em', textTransform: 'capitalize' }}>{value}</div>
              </div>
            ))}
          </div>
          {(trade.entry_price || trade.exit_price) && (
            <div style={{ padding: '16px 24px', borderBottom: `0.5px solid ${divider}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {trade.entry_price != null && <div><div style={{ ...labelStyle, marginBottom: '4px' }}>Entry</div><div style={valueStyle}>{trade.entry_price}</div></div>}
              {trade.exit_price  != null && <div><div style={{ ...labelStyle, marginBottom: '4px' }}>Exit</div><div style={valueStyle}>{trade.exit_price}</div></div>}
            </div>
          )}
          <div style={{ padding: '12px 24px', borderBottom: `0.5px solid ${divider}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, background: trade.followed_plan ? (dark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)') : (dark ? 'rgba(220,50,50,0.15)' : 'rgba(220,50,50,0.1)'), border: `1px solid ${trade.followed_plan ? '#22c55e' : '#dc3232'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {trade.followed_plan && <span style={{ color: '#22c55e', fontSize: '10px', fontWeight: 700, lineHeight: 1 }}>✓</span>}
            </div>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: trade.followed_plan ? '#22c55e' : '#dc3232' }}>{trade.followed_plan ? 'Followed the trading plan' : 'Did not follow the trading plan'}</span>
          </div>
          {trade.notes && (
            <div style={{ padding: '16px 24px', borderBottom: `0.5px solid ${divider}` }}>
              <div style={{ ...labelStyle, marginBottom: '8px' }}>Notes</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textPrimary, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{trade.notes}</div>
            </div>
          )}
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
      {lightboxUrl && (
        <div onClick={() => setLightboxUrl(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'zoom-out' }}>
          <img src={lightboxUrl} alt="screenshot" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
          <button onClick={() => setLightboxUrl(null)} style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer', lineHeight: 1, opacity: 0.7 }}>×</button>
        </div>
      )}
    </>
  )
}

interface TradeFormProps {
  dark: boolean; editingTrade: Trade | null
  onSave: (data: Partial<Trade>) => Promise<void>; onCancel: () => void
  uploadScreenshot: (file: File) => Promise<string | null>; deleteScreenshot: (url: string) => Promise<void>
}

function TradeForm({ dark, editingTrade, onSave, onCancel, uploadScreenshot, deleteScreenshot }: TradeFormProps) {
  const accent      = '#2B5EA7'
  const cardBg      = dark ? '#0d1e36' : '#ffffff'
  const cardBorder  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.08)'
  const textPrimary = dark ? '#ffffff' : '#1a1a1a'
  const textMuted   = dark ? 'rgba(255,255,255,0.4)' : 'rgba(26,26,26,0.4)'
  const inputBg     = dark ? '#071428' : '#f9f9f9'

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
    await onSave({ pair, direction, trade_date: tradeDate, entry_price: entryPrice ? parseFloat(entryPrice) : null, exit_price: exitPrice ? parseFloat(exitPrice) : null, pnl: parseFloat(pnl) || 0, rr: parseFloat(rr) || 0, notes, screenshots, session, emotion, followed_plan: followedPlan })
    setSaving(false)
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: inputBg, border: `0.5px solid ${cardBorder}`, borderRadius: '8px', padding: '9px 12px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: textPrimary, outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: textMuted, marginBottom: '8px', display: 'block' }

  // Reusable pill-button style builder
  const pillBtn = (active: boolean, activeColor: string, activeBg: string, activeBorder: string): React.CSSProperties => ({
    flex: 1,
    padding: '9px 8px',
    borderRadius: '8px',
    border: `0.5px solid ${active ? activeBorder : cardBorder}`,
    background: active ? activeBg : inputBg,
    color: active ? activeColor : textMuted,
    fontFamily: 'var(--font-inter)',
    fontSize: '12px',
    fontWeight: active ? 700 : 400,
    cursor: 'pointer',
    textAlign: 'center' as const,
    letterSpacing: '0.04em',
    transition: 'all 0.12s',
    whiteSpace: 'nowrap' as const,
  })

  return (
    <form onSubmit={handleSubmit} style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '20px' }}>{editingTrade ? 'Edit Trade' : 'Log New Trade'}</div>

      {/* Pair + Date */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>Pair</label>
          <select value={pair} onChange={e => setPair(e.target.value)} style={{ ...inputStyle, appearance: 'none' as any }}>{PAIRS.map(p => <option key={p} value={p}>{p}</option>)}</select>
        </div>
        <div>
          <label style={labelStyle}>Date</label>
          <input type="date" value={tradeDate} onChange={e => setTradeDate(e.target.value)} style={inputStyle} required />
        </div>
      </div>

      {/* Direction — Long green / Short red */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Direction</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setDirection('long')}
            style={pillBtn(
              direction === 'long',
              '#16a34a',
              dark ? 'rgba(34,197,94,0.14)' : 'rgba(22,163,74,0.09)',
              dark ? 'rgba(34,197,94,0.4)'  : 'rgba(22,163,74,0.35)',
            )}
          >
            ▲ Long
          </button>
          <button
            type="button"
            onClick={() => setDirection('short')}
            style={pillBtn(
              direction === 'short',
              '#dc3232',
              dark ? 'rgba(220,50,50,0.14)' : 'rgba(220,50,50,0.09)',
              dark ? 'rgba(220,50,50,0.4)'  : 'rgba(220,50,50,0.35)',
            )}
          >
            ▼ Short
          </button>
        </div>
      </div>

      {/* Entry / Exit */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div><label style={labelStyle}>Entry Price</label><input type="number" step="any" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} placeholder="0.00" style={inputStyle} /></div>
        <div><label style={labelStyle}>Exit Price</label><input type="number" step="any" value={exitPrice} onChange={e => setExitPrice(e.target.value)} placeholder="0.00" style={inputStyle} /></div>
      </div>

      {/* P&L + R:R */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div><label style={labelStyle}>P&amp;L (€)</label><input type="number" step="any" value={pnl} onChange={e => setPnl(e.target.value)} placeholder="0.00" style={inputStyle} required /></div>
        <div><label style={labelStyle}>Realized R:R</label><input type="number" step="any" value={rr} onChange={e => setRr(e.target.value)} placeholder="0.00" style={inputStyle} /></div>
      </div>

      {/* Session — 4 tap buttons */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Session</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {SESSIONS.map(s => {
            const key    = s.toLowerCase().replace(' ', '')
            const active = session === key
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSession(active ? '' : key)}
                style={{
                  ...pillBtn(
                    active,
                    accent,
                    dark ? 'rgba(43,94,167,0.18)' : 'rgba(43,94,167,0.09)',
                    dark ? 'rgba(43,94,167,0.5)'  : 'rgba(43,94,167,0.35)',
                  ),
                  flex: 'none',
                  padding: '8px 16px',
                }}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Emotion — tap buttons */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Emotion</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {EMOTIONS.map(em => {
            const key    = em.toLowerCase()
            const active = emotion === key
            return (
              <button
                key={em}
                type="button"
                onClick={() => setEmotion(active ? '' : key)}
                style={{
                  ...pillBtn(
                    active,
                    accent,
                    dark ? 'rgba(43,94,167,0.18)' : 'rgba(43,94,167,0.09)',
                    dark ? 'rgba(43,94,167,0.5)'  : 'rgba(43,94,167,0.35)',
                  ),
                  flex: 'none',
                  padding: '8px 16px',
                }}
              >
                {em}
              </button>
            )
          })}
        </div>
      </div>

      {/* Followed plan */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="checkbox" id="followedPlan" checked={followedPlan} onChange={e => setFollowedPlan(e.target.checked)} style={{ width: '15px', height: '15px', accentColor: accent, cursor: 'pointer' }} />
        <label htmlFor="followedPlan" style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted, cursor: 'pointer' }}>Followed the trading plan</label>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="What happened? What did you learn?" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
      </div>

      {/* Screenshots */}
      <div style={{ marginBottom: '20px' }}>
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

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={{ padding: '9px 20px', borderRadius: '10px', border: `0.5px solid ${cardBorder}`, background: 'transparent', color: textMuted, fontFamily: 'var(--font-inter)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
        <button type="submit" disabled={saving} style={{ padding: '9px 24px', borderRadius: '10px', border: 'none', background: accent, color: '#fff', fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving…' : editingTrade ? 'Update Trade' : 'Log Trade'}</button>
      </div>
    </form>
  )
}

export default function TradesPage() {
  const router = useRouter()
  const [trades,        setTrades]        = useState<Trade[]>([])
  const [loading,       setLoading]       = useState(true)
  const [showForm,      setShowForm]      = useState(false)
  const [editingTrade,  setEditingTrade]  = useState<Trade | null>(null)
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
  const [error,         setError]         = useState('')
  const [dark,          setDark]          = useState(false)
  const [isMobile,      setIsMobile]      = useState(false)

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
    const { data, error } = await supabase.from('trades').select('*').eq('user_id', session.user.id).order('trade_date', { ascending: false })
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
      const { error } = await supabase.from('trades').insert({ ...formData, user_id: session.user.id, source: 'manual' })
      if (error) { setError(error.message); return }
    }
    setShowForm(false); setEditingTrade(null); setSelectedTrade(null)
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
  const winRate      = trades.length > 0 ? (wins.length / trades.length) * 100 : 0
  const winRateRound = Math.round(winRate * 100) / 100
  const grossProfit  = wins.reduce((s, t) => s + t.pnl, 0)
  const grossLoss    = Math.abs(losses.reduce((s, t) => s + t.pnl, 0))
  const profitFactor = grossLoss > 0 ? parseFloat((grossProfit / grossLoss).toFixed(2)) : grossProfit > 0 ? Infinity : 0
  const avgWin       = wins.length > 0 ? grossProfit / wins.length : 0
  const avgLoss      = losses.length > 0 ? grossLoss / losses.length : 0

  const cumulativePnlPoints = [...trades]
    .sort((a, b) => new Date(a.trade_date + 'T12:00:00').getTime() - new Date(b.trade_date + 'T12:00:00').getTime())
    .reduce<number[]>((acc, t) => { acc.push((acc[acc.length - 1] ?? 0) + (t.pnl || 0)); return acc }, [])

  const accent      = '#2B5EA7'
  const cardBg      = dark ? '#0d1e36' : '#ffffff'
  const cardBorder  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.08)'
  const cardShadow  = dark ? '0 2px 16px rgba(0,0,0,0.4)' : '0 2px 16px rgba(0,0,0,0.06)'
  const textPrimary = dark ? '#ffffff' : '#1a1a1a'
  const textMuted   = dark ? 'rgba(255,255,255,0.4)' : 'rgba(26,26,26,0.4)'
  const pageBg      = dark ? '#071428' : '#f4f4f6'
  const divider     = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const pnlColor    = totalPnl > 0 ? '#22c55e' : totalPnl < 0 ? '#dc3232' : textPrimary
  const pfColor     = profitFactor >= 1.5 ? '#22c55e' : profitFactor >= 1 ? accent : profitFactor === 0 ? textMuted : '#dc3232'
  const wrColor     = winRate >= 50 ? '#22c55e' : '#dc3232'
  const maxAvg      = Math.max(avgWin, avgLoss, 1)

  const renderSparkline = () => {
    const pts = cumulativePnlPoints
    if (pts.length < 2) return null
    const W = 160, H = 52
    const min = Math.min(0, ...pts), max = Math.max(0, ...pts), range = max - min || 1
    const toX = (i: number) => (i / (pts.length - 1)) * W
    const toY = (v: number) => H - 4 - ((v - min) / range) * (H - 10)
    const line = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(' ')
    const area = `${line} L ${W} ${toY(0).toFixed(1)} L 0 ${toY(0).toFixed(1)} Z`
    const color = pts[pts.length - 1] >= 0 ? '#22c55e' : '#dc3232'
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="fcSparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#fcSparkGrad)" />
        <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  const renderGauge = () => {
    const r = 52, cx = 70, cy = 62, sw = 11
    const p = winRate / 100
    const bgPath  = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`
    const xE      = cx - r * Math.cos(p * Math.PI)
    const yE      = cy - r * Math.sin(p * Math.PI)
    const winPath = p <= 0 ? null : p >= 1 ? bgPath
      : `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${xE.toFixed(2)} ${yE.toFixed(2)}`
    return (
      <svg width="140" height="92" viewBox="0 0 140 92" style={{ display: 'block' }}>
        <path d={bgPath} fill="none" stroke={dark ? 'rgba(220,50,50,0.28)' : 'rgba(230,60,60,0.18)'} strokeWidth={sw} strokeLinecap="round" />
        {winPath && <path d={winPath} fill="none" stroke="#22c55e" strokeWidth={sw} strokeLinecap="round" />}
        <text x={cx - r - 2} y={cy + 18} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="13" fontWeight="700" fill="#22c55e">{wins.length}</text>
        <text x={cx + r + 2} y={cy + 18} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="13" fontWeight="700" fill="#dc3232">{losses.length}</text>
        <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle" fontFamily="Inter,sans-serif" fontSize="18" fontWeight="800" fill={wrColor}>
          {winRateRound.toFixed(winRateRound % 1 === 0 ? 0 : 2)}%
        </text>
      </svg>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: pageBg, padding: isMobile ? '20px 16px' : '32px 32px' }}>

      <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? '24px' : '32px', fontWeight: 700, color: textPrimary, marginBottom: '4px' }}>Trade Journal.</div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textMuted }}>Track, review and improve every trade</div>
      </div>

      {!loading && trades.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '14px', marginBottom: '28px' }}>
          <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', boxShadow: cardShadow, padding: '20px 22px 12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Net Cumulative P&L</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: textMuted, background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }}>{trades.length}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '28px', fontWeight: 800, color: pnlColor, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '14px' }}>
              {totalPnl >= 0 ? '+' : ''}€{Math.abs(totalPnl).toFixed(0)}
            </div>
            <div style={{ marginLeft: '-4px' }}>{renderSparkline()}</div>
          </div>

          <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', boxShadow: cardShadow, padding: '20px 22px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Profit Factor</div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '40px', fontWeight: 800, color: pfColor, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '10px' }}>
              {profitFactor === Infinity ? '∞' : profitFactor > 0 ? profitFactor.toFixed(2) : '—'}
            </div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: profitFactor >= 1.5 ? '#22c55e' : profitFactor >= 1 ? accent : '#dc3232', fontWeight: 500 }}>
              {profitFactor >= 1.5 ? '✦ Strong edge' : profitFactor >= 1 ? 'Breakeven range' : profitFactor > 0 ? 'Below breakeven' : 'No data yet'}
            </div>
          </div>

          <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', boxShadow: cardShadow, padding: '20px 22px 12px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Trade Win %</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{renderGauge()}</div>
          </div>

          <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', boxShadow: cardShadow, padding: '20px 22px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Avg Win / Loss Trade</div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', fontWeight: 500 }}>Avg Win</span>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '16px', color: '#22c55e', fontWeight: 700, letterSpacing: '-0.02em' }}>+€{avgWin.toFixed(0)}</span>
              </div>
              <div style={{ height: '8px', background: dark ? 'rgba(255,255,255,0.06)' : '#ececec', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(avgWin / maxAvg) * 100}%`, background: 'linear-gradient(90deg, #16a34a, #22c55e)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', fontWeight: 500 }}>Avg Loss</span>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '16px', color: '#dc3232', fontWeight: 700, letterSpacing: '-0.02em' }}>-€{avgLoss.toFixed(0)}</span>
              </div>
              <div style={{ height: '8px', background: dark ? 'rgba(255,255,255,0.06)' : '#ececec', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(avgLoss / maxAvg) * 100}%`, background: 'linear-gradient(90deg, #b91c1c, #dc3232)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
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
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => setShowForm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: accent, color: '#fff', border: 'none', borderRadius: '12px', padding: '11px 22px', fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 12px rgba(43,94,167,0.3)' }}>
            <span style={{ fontSize: '18px', lineHeight: 1, fontWeight: 300 }}>+</span>
            Log Trade
          </button>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent', border: `0.5px solid ${cardBorder}`, borderRadius: '12px', padding: '11px 18px', opacity: 0.55 }}>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textMuted }}>MT5 Sync</span>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#f59e0b', background: dark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.1)', padding: '2px 7px', borderRadius: '5px' }}>SOON</span>
          </div>
        </div>
      )}

      {(showForm || editingTrade) && (
        <TradeForm dark={dark} editingTrade={editingTrade} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingTrade(null) }} uploadScreenshot={uploadScreenshot} deleteScreenshot={deleteScreenshot} />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: textMuted }}>Loading…</div>
      ) : trades.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', boxShadow: cardShadow }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, color: textPrimary, marginBottom: '8px' }}>No trades yet</div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: textMuted }}>Log your first trade to get started</div>
        </div>
      ) : trades.length > 0 ? (
        <div style={{ background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: '18px', boxShadow: cardShadow, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '520px' }}>
              <thead>
                <tr style={{ background: dark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.02)', borderBottom: `1px solid ${divider}` }}>
                  {[{ label: 'Pair', align: 'left' }, { label: 'Bias', align: 'left' }, { label: 'Result', align: 'left' }, { label: 'Net P&L', align: 'right' }, { label: 'R:R', align: 'left' }, { label: 'Date', align: 'left' }].map(col => (
                    <th key={col.label} style={{ padding: '13px 20px', fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: col.align as any, whiteSpace: 'nowrap' }}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trades.map((trade, i) => {
                  const isWin  = trade.pnl > 0
                  const isBE   = trade.pnl === 0
                  const result = isWin ? 'WIN' : isBE ? 'BE' : 'LOSS'
                  const resultColor  = isWin ? '#16a34a' : isBE ? textMuted : '#b91c1c'
                  const resultBg     = isWin ? (dark ? 'rgba(34,197,94,0.14)' : 'rgba(22,163,74,0.09)') : isBE ? (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : (dark ? 'rgba(220,50,50,0.14)' : 'rgba(185,28,28,0.09)')
                  const resultBorder = isWin ? (dark ? 'rgba(34,197,94,0.25)' : 'rgba(22,163,74,0.2)') : isBE ? cardBorder : (dark ? 'rgba(220,50,50,0.25)' : 'rgba(185,28,28,0.2)')
                  const biasColor    = trade.direction === 'long' ? '#16a34a' : '#b91c1c'
                  const biasBg       = trade.direction === 'long' ? (dark ? 'rgba(34,197,94,0.14)' : 'rgba(22,163,74,0.09)') : (dark ? 'rgba(220,50,50,0.14)' : 'rgba(185,28,28,0.09)')
                  const biasBorder   = trade.direction === 'long' ? (dark ? 'rgba(34,197,94,0.25)' : 'rgba(22,163,74,0.2)') : (dark ? 'rgba(220,50,50,0.25)' : 'rgba(185,28,28,0.2)')
                  const tradePnlColor = isWin ? '#16a34a' : isBE ? textMuted : '#b91c1c'
                  const date = new Date(trade.trade_date + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  const isLast = i === trades.length - 1
                  const offPlan    = !trade.followed_plan
                  const rowBaseBg  = offPlan ? (dark ? 'rgba(220,50,50,0.07)' : 'rgba(220,50,50,0.05)') : 'transparent'
                  const rowHoverBg = offPlan ? (dark ? 'rgba(220,50,50,0.13)' : 'rgba(220,50,50,0.09)') : (dark ? 'rgba(255,255,255,0.035)' : 'rgba(43,94,167,0.03)')

                  return (
                    <tr
                      key={trade.id}
                      onClick={() => setSelectedTrade(trade)}
                      style={{ borderBottom: isLast ? 'none' : `0.5px solid ${divider}`, cursor: 'pointer', transition: 'background 0.12s', background: rowBaseBg }}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = rowHoverBg }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = rowBaseBg }}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 700, color: textPrimary, letterSpacing: '-0.01em' }}>{trade.pair}</span>
                          {trade.source === 'mt5' && <span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.06em', color: '#7aaee8', background: dark ? 'rgba(122,174,232,0.12)' : 'rgba(43,94,167,0.08)', padding: '2px 6px', borderRadius: '4px', border: '0.5px solid rgba(122,174,232,0.2)' }}>MT5</span>}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: biasColor, background: biasBg, border: `0.5px solid ${biasBorder}`, padding: '4px 10px', borderRadius: '6px' }}>
                          {trade.direction === 'long' ? 'LONG' : 'SHORT'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: resultColor, background: resultBg, border: `0.5px solid ${resultBorder}`, padding: '4px 10px', borderRadius: '6px' }}>
                          {result}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 700, color: tradePnlColor, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                          {trade.pnl > 0 ? '+' : ''}€{trade.pnl?.toFixed(0) ?? '—'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: trade.rr > 0 ? textPrimary : textMuted, fontWeight: trade.rr > 0 ? 600 : 400, whiteSpace: 'nowrap' }}>
                          {trade.rr > 0 ? `1:${trade.rr}` : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: textMuted, whiteSpace: 'nowrap' }}>{date}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 20px', borderTop: `0.5px solid ${divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{trades.length} trade{trades.length !== 1 ? 's' : ''} total</span>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: textMuted }}>{wins.length}W · {losses.length}L{trades.filter(t => t.pnl === 0).length > 0 ? ` · ${trades.filter(t => t.pnl === 0).length}BE` : ''}</span>
          </div>
        </div>
      ) : null}

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