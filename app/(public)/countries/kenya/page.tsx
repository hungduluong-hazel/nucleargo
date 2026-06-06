import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import KenyaContent from '@/components/public/KenyaContent'
import Footer from '@/components/public/Footer'

export default async function KenyaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <KenyaContent />
      <Footer />
    </div>
  )
}
