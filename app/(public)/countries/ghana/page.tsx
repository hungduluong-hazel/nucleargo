import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import GhanaContent from '@/components/public/GhanaContent'
import Footer from '@/components/public/Footer'

export default async function GhanaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <GhanaContent />
      <Footer />
    </div>
  )
}
