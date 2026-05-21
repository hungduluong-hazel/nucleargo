import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export default async function ProgramPage() {
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
            📡
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">Program Intelligence</h1>
          <p className="text-navy/50 text-sm leading-relaxed">
            This section is being built. Detailed nuclear program tracking, IAEA milestone data, and project timelines will be available here soon.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
