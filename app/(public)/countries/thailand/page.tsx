import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import ThailandContent from '@/components/public/ThailandContent'
import Footer from '@/components/public/Footer'

export default async function ThailandPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <ThailandContent />
      <Footer />
    </div>
  )
}
