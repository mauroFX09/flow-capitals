import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import * as jose from 'jose'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
  const { email } = await request.json()
  const newPassword = `FC${Math.random().toString(36).slice(2, 8).toUpperCase()}!`
  const { data: existing } = await supabaseAdmin.auth.admin.listUsers()
  const target = existing?.users.find(u => u.email === email)
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  await supabaseAdmin.auth.admin.updateUserById(target.id, { password: newPassword })

  const { data: profile } = await supabaseAdmin.from('profiles').select('full_name').eq('id', target.id).single()

  await resend.emails.send({
    from: 'Flow Capitals <onboarding@resend.dev>',
    to: email,
    subject: 'Your password has been reset',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
        <span style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #2B5EA7;">Flow Capitals</span>
        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin: 16px 0;">Password Reset</h1>
        <p style="font-size: 15px; color: #555; line-height: 1.7;">Hi ${profile?.full_name ?? ''},</p>
        <p style="font-size: 15px; color: #555; line-height: 1.7;">Your password has been reset. Here are your new login details:</p>
        <div style="background: #f7f7f7; border-radius: 10px; padding: 16px 20px; margin: 24px 0;">
          <p style="margin: 0; font-size: 13px; color: #888;">Email</p>
          <p style="margin: 4px 0 12px; font-size: 15px; font-weight: 600; color: #1a1a1a;">${email}</p>
          <p style="margin: 0; font-size: 13px; color: #888;">New Password</p>
          <p style="margin: 4px 0 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">${newPassword}</p>
        </div>
        <a href="https://flow-capitals.vercel.app/login" style="display: inline-block; background: #2B5EA7; color: #fff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600;">Login Now →</a>
        <p style="font-size: 11px; color: #aaa; margin-top: 40px;">Flow Capitals · If you didn't request this, contact us immediately.</p>
      </div>
    `,
  })

  return NextResponse.json({ newPassword })
}