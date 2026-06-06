import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import PhilippinesContent from '@/components/public/PhilippinesContent'
import Footer from '@/components/public/Footer'

export default async function PhilippinesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <PhilippinesContent />
      <Footer />
    </div>
  )
}
