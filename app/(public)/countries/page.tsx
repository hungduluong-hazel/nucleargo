import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import CountriesContent from '@/components/public/CountriesContent'
import Footer from '@/components/public/Footer'

export default async function CountriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <CountriesContent />
      <Footer />
    </div>
  )
}
