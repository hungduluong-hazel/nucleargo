import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import IndonesiaContent from '@/components/public/IndonesiaContent'
import Footer from '@/components/public/Footer'

export default async function IndonesiaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <IndonesiaContent />
      <Footer />
    </div>
  )
}
