import { createClient } from '@/lib/supabase/server'
import DevelopmentsClient, { type Development } from './DevelopmentsClient'

type Category = 'Policy' | 'Technical' | 'Partnership' | 'Regulatory' | 'Workforce'
type Country  = 'Vietnam' | 'Poland' | 'Global'

function mapCategory(c: string | null): Category {
  switch (c) {
    case 'Policy':      return 'Policy'
    case 'Technical':   return 'Technical'
    case 'Partnership': return 'Partnership'
    case 'Regulatory':  return 'Regulatory'
    case 'Workforce':   return 'Workforce'
    case 'Finance':     return 'Partnership'
    default:            return 'Policy'
  }
}

function mapCountry(code: string | null | undefined): Country {
  switch (code) {
    case 'vn': return 'Vietnam'
    case 'pl': return 'Poland'
    default:   return 'Global'
  }
}

function fmtMonthYear(iso: string | null): string {
  if (!iso) return ''
  const [y, m] = iso.split('-')
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  return `${months[parseInt(m, 10) - 1]} ${y}`
}

export default async function DevelopmentsPage() {
  const supabase = await createClient()

  const { data: rows } = await supabase
    .from('developments')
    .select('*, countries(code)')
    .order('date', { ascending: false })

  const developments: Development[] = (rows ?? []).map(row => ({
    id:       row.id as string,
    category: mapCategory(row.category as string | null),
    country:  mapCountry((row.countries as { code: string } | null)?.code),
    date:     fmtMonthYear(row.date as string | null),
    sortDate: (row.date ?? '') as string,
    title:    (row.title_en ?? '') as string,
    body:     (row.body_en ?? '') as string,
    source:   (row.source ?? '') as string,
  }))

  return <DevelopmentsClient developments={developments} />
}
