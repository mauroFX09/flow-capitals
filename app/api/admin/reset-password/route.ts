import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

async function isAdmin() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  const authCookie = allCookies.find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))
  if (!authCookie) return false
  const { data: { user } } = await supabaseAdmin.auth.getUser(
    JSON.parse(decodeURIComponent(authCookie.value))[0]
  )
  return user?.email === 'mauro.steenhoudt@gmail.com'
}

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { email } = await request.json()
  const newPassword = `FC${Math.random().toString(36).slice(2, 8).toUpperCase()}!`
  const { data: existing } = await supabaseAdmin.auth.admin.listUsers()
  const target = existing?.users.find(u => u.email === email)
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  await supabaseAdmin.auth.admin.updateUserById(target.id, { password: newPassword })
  return NextResponse.json({ newPassword })
}