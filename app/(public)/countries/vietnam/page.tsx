import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import CountryDetailPlaceholder from '@/components/public/CountryDetailPlaceholder'
import Footer from '@/components/public/Footer'

export default async function VietnamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <CountryDetailPlaceholder flag="🇻🇳" countryName="Vietnam" />
      <Footer />
    </div>
  )
}
