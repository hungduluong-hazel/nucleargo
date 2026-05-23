import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export default async function TermsPage() {
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
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
            <p className="text-white/45 text-sm mt-2">Last updated: May 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 space-y-10">

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing NuclearGo, you agree to these terms. If you do not agree, do not
              use the platform.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              NuclearGo provides nuclear program intelligence and project management tools
              for professionals working on emerging nuclear energy programs.
            </p>
          </Section>

          <Section title="3. User Accounts">
            <p>You are responsible for:</p>
            <List items={[
              'Maintaining the security of your account',
              'All activity that occurs under your account',
              'Providing accurate registration information',
            ]} />
            <p>You must be 18 or older to register.</p>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree not to:</p>
            <List items={[
              'Share your account credentials with others',
              'Attempt to access other users’ data',
              'Use the platform for any unlawful purpose',
              'Scrape or systematically extract data',
              'Attempt to reverse engineer the platform',
            ]} />
          </Section>

          <Section title="5. Organization Workspaces">
            <p>Tier 3 workspace subscribers agree to:</p>
            <List items={[
              'Keep workspace credentials secure',
              'Not share workspace access with non-members',
              'Use the platform only for legitimate professional purposes',
              'Maintain accurate billing information',
            ]} />
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              All platform content, design, and code is owned by NuclearGo. Program data
              sourced from public sources is attributed where possible. Users retain ownership
              of data they enter into workspaces.
            </p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>
              NuclearGo provides information for professional reference purposes. We make
              reasonable efforts to ensure accuracy but cannot guarantee completeness. Users
              should verify critical information from primary sources before making decisions.
            </p>
          </Section>

          <Section title="8. Subscription and Billing">
            <p>
              Tier 3 subscriptions are billed monthly. Cancellations take effect at the end
              of the current billing period. No refunds for partial periods.
            </p>
          </Section>

          <Section title="9. Termination">
            <p>
              We reserve the right to terminate accounts that violate these terms. Users may
              delete their account at any time from the Profile page.
            </p>
          </Section>

          <Section title="10. Governing Law">
            <p>
              These terms are governed by the laws of Ontario, Canada.
            </p>
          </Section>

          <Section title="11. Changes to Terms">
            <p>
              We may update these terms. Continued use of the platform after changes
              constitutes acceptance.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              For terms questions contact:{' '}
              <a
                href="mailto:legal@nucleargo.com"
                className="text-accent hover:underline"
              >
                legal@nucleargo.com
              </a>
            </p>
          </Section>

          {/* Cross-link */}
          <div className="pt-6 border-t border-navy/8">
            <p className="text-sm text-navy/45">
              See also:{' '}
              <Link href="/privacy" className="text-accent hover:underline font-medium">
                Privacy Policy
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
