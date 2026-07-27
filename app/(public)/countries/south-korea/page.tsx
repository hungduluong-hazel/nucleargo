import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import SouthKoreaContent from '@/components/public/SouthKoreaContent'
import Footer from '@/components/public/Footer'

export default async function SouthKoreaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <SouthKoreaContent />
      <Footer />
    </div>
  )
}
