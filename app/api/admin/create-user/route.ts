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