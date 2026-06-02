import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'hungduluong@gmail.com'
const RESEND_API_KEY = process.env.RESEND_API_KEY

export async function POST(req: NextRequest) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email notification')
    return NextResponse.json({ ok: true, skipped: true })
  }

  const { devCount, briefingCount } = await req.json()
  const total = (devCount ?? 0) + (briefingCount ?? 0)

  const resend = new Resend(RESEND_API_KEY)

  const parts = []
  if (devCount > 0)      parts.push(`${devCount} development${devCount > 1 ? 's' : ''}`)
  if (briefingCount > 0) parts.push(`${briefingCount} briefing draft${briefingCount > 1 ? 's' : ''}`)
  const summary = parts.join(' and ')

  const { error } = await resend.emails.send({
    from:    'NuclearGo <noreply@nucleargo.com>',
    to:      ADMIN_EMAIL,
    subject: `[NuclearGo] ${total} AI draft${total > 1 ? 's' : ''} ready for review`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #0f1923;">
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">
          Monthly AI drafts are ready
        </h2>
        <p style="color: #6b7280; margin-bottom: 24px;">
          Claude has generated ${summary} for your review.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          ${devCount > 0 ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #6b7280;">Developments</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; font-weight: 600; text-align: right;">${devCount}</td>
          </tr>` : ''}
          ${briefingCount > 0 ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #6b7280;">Briefing drafts</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; font-weight: 600; text-align: right;">${briefingCount}</td>
          </tr>` : ''}
        </table>

        <a
          href="https://nucleargo.com/admin/review"
          style="display: inline-block; background: #0f1923; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;"
        >
          Review &amp; approve drafts →
        </a>

        <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
          Approve to add to the site, or reject to discard. You can also edit any draft before approving.
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ ok: false, error }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
