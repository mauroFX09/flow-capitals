import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, full_name, new_password } = await req.json()

  await resend.emails.send({
    from: 'Flow Capitals <onboarding@resend.dev>',
    to: email,
    subject: 'Your password has been reset',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
        <span style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #2B5EA7;">Flow Capitals</span>
        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin: 16px 0;">Password Reset</h1>
        <p style="font-size: 15px; color: #555; line-height: 1.7;">Hi ${full_name},</p>
        <p style="font-size: 15px; color: #555; line-height: 1.7;">Your password has been reset. Here are your new login details:</p>
        <div style="background: #f7f7f7; border-radius: 10px; padding: 16px 20px; margin: 24px 0;">
          <p style="margin: 0; font-size: 13px; color: #888;">Email</p>
          <p style="margin: 4px 0 12px; font-size: 15px; font-weight: 600; color: #1a1a1a;">${email}</p>
          <p style="margin: 0; font-size: 13px; color: #888;">New Password</p>
          <p style="margin: 4px 0 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">${new_password}</p>
        </div>
        <a href="https://flow-capitals.vercel.app/login" style="display: inline-block; background: #2B5EA7; color: #fff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600;">Login Now →</a>
        <p style="font-size: 11px; color: #aaa; margin-top: 40px;">Flow Capitals · If you didn't request this, contact us immediately.</p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}