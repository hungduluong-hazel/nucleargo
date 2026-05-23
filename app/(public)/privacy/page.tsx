import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export default async function PrivacyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar isLoggedIn={!!user} />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-navy">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16">
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="text-white/45 text-sm mt-2">Last updated: May 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 space-y-10">

          <Section title="1. Introduction">
            <p>
              NuclearGo (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates nucleargo.com.
              This policy explains how we collect, use, and protect your personal information
              when you use our platform.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>When you register, we collect:</p>
            <List items={[
              'Name, email address',
              'Organization and country',
              'Professional role',
              'Language preference',
            ]} />
            <p>
              We also collect standard usage data including pages visited and features used.
            </p>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use your information to:</p>
            <List items={[
              'Provide access to the NuclearGo platform',
              'Send monthly intelligence briefings (with your consent)',
              'Improve the platform based on usage patterns',
              'Contact you about platform updates',
            ]} />
            <p>We never sell your personal data to third parties.</p>
          </Section>

          <Section title="4. Data Storage and Security">
            <p>
              Your data is stored securely on Supabase infrastructure hosted on AWS. We
              implement row-level security at the database level, ensuring your data is
              only accessible to authorized users. All data is encrypted at rest (AES-256)
              and in transit (TLS 1.3).
            </p>
          </Section>

          <Section title="5. Organization Workspace Data">
            <p>
              Data entered into Organization Workspaces (Tier 3) is treated as strictly
              confidential. It is only accessible to members of your workspace and is never
              shared with other organizations or used for any purpose other than providing
              the service.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>You have the right to:</p>
            <List items={[
              'Access your personal data',
              'Correct inaccurate data',
              'Request deletion of your account and data',
              'Export your data',
              'Withdraw consent for communications',
            ]} />
            <p>
              To exercise these rights, contact us at{' '}
              <a
                href="mailto:privacy@nucleargo.com"
                className="text-accent hover:underline"
              >
                privacy@nucleargo.com
              </a>
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              We use essential cookies for authentication and session management. We do not
              use advertising or tracking cookies.
            </p>
          </Section>

          <Section title="8. GDPR Compliance">
            <p>
              For users in the European Union (including Poland), we comply with the General
              Data Protection Regulation (GDPR). Our legal basis for processing is legitimate
              interest and consent where required.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this policy periodically. We will notify registered users of
              significant changes by email.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              For privacy questions contact:{' '}
              <a
                href="mailto:privacy@nucleargo.com"
                className="text-accent hover:underline"
              >
                privacy@nucleargo.com
              </a>
            </p>
          </Section>

          {/* Cross-link */}
          <div className="pt-6 border-t border-navy/8">
            <p className="text-sm text-navy/45">
              See also:{' '}
              <Link href="/terms" className="text-accent hover:underline font-medium">
                Terms of Service
              </Link>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-bold text-navy">{title}</h2>
      <div className="text-sm text-navy/65 leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="text-accent font-bold flex-shrink-0 mt-px text-xs leading-relaxed">
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
