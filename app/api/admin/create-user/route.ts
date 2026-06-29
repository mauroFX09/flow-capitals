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
  const { email, password, full_name, role } = await request.json()

  const { data: existing } = await supabaseAdmin.auth.admin.listUsers()
  const found = existing?.users.find(u => u.email === email)

  let userId: string

  if (found) {
    await supabaseAdmin.auth.admin.updateUserById(found.id, { password })
    userId = found.id
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { full_name }
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    userId = data.user.id
  }

  await supabaseAdmin.from('profiles').upsert({
    id: userId, email, full_name, role
  }, { onConflict: 'id' })

  return NextResponse.json({ userId, email, full_name, role })
}