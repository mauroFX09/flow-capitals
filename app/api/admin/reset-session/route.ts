import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

async function isAdmin(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return false
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  return user?.email === 'mauro.steenhoudt@gmail.com'
}

export async function POST(request: Request) {
  if (!await isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { memberId, name } = await request.json()
  await supabaseAdmin.from('profiles').update({ active_session_token: null }).eq('id', memberId)
  return NextResponse.json({ success: true, name })
}