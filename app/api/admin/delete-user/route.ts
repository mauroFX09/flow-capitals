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

export async function DELETE(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { memberId } = await request.json()
  await supabaseAdmin.auth.admin.deleteUser(memberId)
  await supabaseAdmin.from('profiles').delete().eq('id', memberId)
  return NextResponse.json({ success: true })
}