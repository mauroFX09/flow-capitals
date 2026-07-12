import { NextRequest, NextResponse } from 'next/server'
import MetaApi from 'metaapi.cloud-sdk'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('mt5_account_id')
      .eq('id', userId)
      .single()

    if (!profile?.mt5_account_id) {
      return NextResponse.json({ error: 'No MT5 account connected' }, { status: 400 })
    }

    const api = new MetaApi(process.env.METAAPI_TOKEN!)
    const account = await api.metatraderAccountApi.getAccount(profile.mt5_account_id)

    await account.deploy()
    const connection = account.getRPCConnection()
    await connection.connect()
    await connection.waitSynchronized()

    const to = new Date()
    const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    const history = await connection.getDealsByTimeRange(from, to)
    const deals: any[] = history.deals ?? []

    const trades = deals
      .filter((d: any) => d.type === 'DEAL_TYPE_BUY' || d.type === 'DEAL_TYPE_SELL')
      .map((d: any) => ({
        user_id: userId,
        pair: (d.symbol || '').replace('.', '/'),
        direction: d.type === 'DEAL_TYPE_BUY' ? 'long' : 'short',
        entry_price: d.price ?? null,
        exit_price: null,
        lot_size: d.volume ?? null,
        pnl: d.profit ?? 0,
        rr: 0,
        trade_date: new Date(d.time).toISOString().split('T')[0],
        source: 'mt5',
        notes: '',
        emotion: '',
        followed_plan: null,
        screenshots: [],
        screenshot_urls: [],
        session: '',
      }))

    await connection.close()

    if (trades.length === 0) {
      return NextResponse.json({ success: true, synced: 0 })
    }

    const { error } = await supabaseAdmin
      .from('trades')
      .upsert(trades, { onConflict: 'user_id,trade_date,pair,pnl' })

    if (error) throw error

    return NextResponse.json({ success: true, synced: trades.length })
  } catch (err: any) {
    console.error('[MT5 sync]', err)
    return NextResponse.json({ error: err.message || 'Sync failed' }, { status: 500 })
  }
}