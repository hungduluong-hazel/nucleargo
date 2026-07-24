import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import UnitedStatesContent from '@/components/public/UnitedStatesContent'
import Footer from '@/components/public/Footer'

export default async function UnitedStatesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <UnitedStatesContent />
      <Footer />
    </div>
  )
}
