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
  const { memberId, name } = await request.json()
  await supabaseAdmin.from('profiles').update({ active_session_token: null }).eq('id', memberId)

  const { data: profile } = await supabaseAdmin.from('profiles').select('email, full_name').eq('id', memberId).single()

  if (profile?.email) {
    await resend.emails.send({
      from: 'Flow Capitals <onboarding@resend.dev>',
      to: profile.email,
      subject: 'Your session has been reset',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
          <span style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #2B5EA7;">Flow Capitals</span>
          <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin: 16px 0;">Session Reset</h1>
          <p style="font-size: 15px; color: #555; line-height: 1.7;">Hi ${profile.full_name ?? name},</p>
          <p style="font-size: 15px; color: #555; line-height: 1.7;">Your session has been reset. You can now log in on your device.</p>
          <a href="https://flow-capitals.vercel.app/login" style="display: inline-block; background: #2B5EA7; color: #fff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600;">Login Now →</a>
          <p style="font-size: 11px; color: #aaa; margin-top: 40px;">Flow Capitals · If you didn't request this, contact us immediately.</p>
        </div>
      `,
    })
  }

  return NextResponse.json({ success: true, name })
}