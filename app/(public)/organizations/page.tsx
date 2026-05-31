import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import OrganizationsContent from '@/components/public/OrganizationsContent'
import Footer from '@/components/public/Footer'

type OrgType =
  | 'Owner / Operator'
  | 'Regulator'
  | 'Technology Supplier'
  | 'International'
  | 'Advisory & Engineering'
  | 'Government'

type OrgData = {
  name:     string
  flagUrl:  string
  country:  string
  type:     OrgType
  role:     string
  programs: string[]
}

const FLAG_META: Record<string, { country: string; flagUrl: string }> = {
  '🇻🇳': { country: 'Vietnam',               flagUrl: 'https://flagcdn.com/w20/vn.png' },
  '🇷🇺': { country: 'Russia',                flagUrl: 'https://flagcdn.com/w20/ru.png' },
  '🇰🇷': { country: 'South Korea',           flagUrl: 'https://flagcdn.com/w20/kr.png' },
  '🌐':  { country: 'International (Vienna)', flagUrl: 'https://flagcdn.com/w20/at.png' },
  '🇨🇦': { country: 'Canada',                flagUrl: 'https://flagcdn.com/w20/ca.png' },
}

function mapOrgType(t: string | null): OrgType {
  switch (t) {
    case 'owner':         return 'Owner / Operator'
    case 'regulator':     return 'Regulator'
    case 'contractor':    return 'Technology Supplier'
    case 'government':    return 'Government'
    case 'research':      return 'Government'
    case 'international': return 'International'
    case 'consultant':    return 'Advisory & Engineering'
    default:              return 'Government'
  }
}

export default async function OrganizationsPage() {
  const supabase = await createClient()

  const [
    { data: { user } },
    { data: rows },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('key_organizations')
      .select('*, countries(code, name_en)')
      .order('sort_order'),
  ])

  const orgs: OrgData[] = (rows ?? []).map(row => {
    const flagEmoji     = (row.flag ?? '') as string
    const linkedCountry = row.countries as { code: string; name_en: string } | null
    const flagMeta      = FLAG_META[flagEmoji]

    const country = flagMeta?.country
      ?? linkedCountry?.name_en
      ?? 'Vietnam'

    const flagUrl = flagMeta?.flagUrl
      ?? (linkedCountry?.code
        ? `https://flagcdn.com/w20/${linkedCountry.code}.png`
        : 'https://flagcdn.com/w20/vn.png')

    const type     = mapOrgType(row.type as string | null)
    const programs = type === 'International' ? ['Global'] : [linkedCountry?.name_en ?? 'Vietnam']

    return {
      name: row.name as string,
      flagUrl,
      country,
      type,
      role:     (row.role_en ?? '') as string,
      programs,
    }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <OrganizationsContent orgs={orgs} />
      <Footer />
    </div>
  )
}
