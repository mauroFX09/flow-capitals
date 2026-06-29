import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import * as jose from 'jose'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const JWKS = jose.createRemoteJWKSet(
  new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
)

async function isAdmin(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return false
  try {
    const { payload } = await jose.jwtVerify(token, JWKS)
    return payload.email === 'mauro.steenhoudt@gmail.com'
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!await isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { memberId, name } = await request.json()
  await supabaseAdmin.from('profiles').update({ active_session_token: null }).eq('id', memberId)
  return NextResponse.json({ success: true, name })
}