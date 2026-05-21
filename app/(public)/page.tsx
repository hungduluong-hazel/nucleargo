import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import Hero from '@/components/public/Hero'
import MetricCards from '@/components/public/MetricCards'
import LatestDevelopments from '@/components/public/LatestDevelopments'
import Footer from '@/components/public/Footer'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <main className="flex-1">
        <Hero />
        <MetricCards />
        <LatestDevelopments />
      </main>
      <Footer />
    </div>
  )
}
