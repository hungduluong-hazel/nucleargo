import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import PolandContent from '@/components/public/PolandContent'
import Footer from '@/components/public/Footer'

export default async function PolandPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <PolandContent />
      <Footer />
    </div>
  )
}
