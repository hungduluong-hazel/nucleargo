import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export default async function OrganizationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <main className="flex-1 flex items-center justify-center bg-surface px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/8 text-3xl mb-6">
            🏛️
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">Organizations</h1>
          <p className="text-navy/50 text-sm leading-relaxed">
            Profiles for key organizations — IAEA, Rosatom, KEPCO, Westinghouse, and others involved in global nuclear programs — are being added. Content is coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
