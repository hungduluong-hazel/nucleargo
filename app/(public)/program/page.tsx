import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import ProgramContent from '@/components/public/ProgramContent'
import Footer from '@/components/public/Footer'

export default async function ProgramPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <ProgramContent />
      <Footer />
    </div>
  )
}
