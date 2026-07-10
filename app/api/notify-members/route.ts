import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: Request) {
  const { subject, message } = await req.json()

  // Fetch all member emails
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('email, full_name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const emails = profiles ?? []

  // Send to each member
  const results = await Promise.all(
    emails.map(profile =>
      resend.emails.send({
        from: 'Flow Capitals <onboarding@resend.dev>',
        to: profile.email,
        subject,
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
            <div style="margin-bottom: 32px;">
              <span style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #2B5EA7;">Flow Capitals</span>
            </div>
            <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 0 0 16px;">${subject}</h1>
            <p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0 0 32px;">${message}</p>
            <a href="https://flow-capitals.vercel.app/dashboard" style="display: inline-block; background: #2B5EA7; color: #fff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600;">Go to Dashboard →</a>
            <p style="font-size: 11px; color: #aaa; margin-top: 40px;">Flow Capitals · You're receiving this because you're a member.</p>
          </div>
        `,
      })
    )
  )

  return NextResponse.json({ sent: emails.length })
}