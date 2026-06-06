import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import NigeriaContent from '@/components/public/NigeriaContent'
import Footer from '@/components/public/Footer'

export default async function NigeriaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <NigeriaContent />
      <Footer />
    </div>
  )
}
