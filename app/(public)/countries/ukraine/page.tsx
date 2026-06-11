import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import UkraineContent from '@/components/public/UkraineContent'
import Footer from '@/components/public/Footer'

export default async function UkrainePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <UkraineContent />
      <Footer />
    </div>
  )
}
