import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import BangladeshContent from '@/components/public/BangladeshContent'
import Footer from '@/components/public/Footer'

export default async function BangladeshPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <BangladeshContent />
      <Footer />
    </div>
  )
}
