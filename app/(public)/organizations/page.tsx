import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import OrganizationsContent from '@/components/public/OrganizationsContent'
import Footer from '@/components/public/Footer'

export default async function OrganizationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <OrganizationsContent />
      <Footer />
    </div>
  )
}
