import { createClient } from '@/lib/supabase/server'
import WorkforceClient, { type Institution, type Opportunity } from './WorkforceClient'

type InstitutionType =
  | 'University'
  | 'Research Institute'
  | 'College'
  | 'Training Center'
  | 'Military University'

type OpportunityType = 'Job' | 'Fellowship' | 'Training Program'

function mapInstType(t: string | null): InstitutionType {
  switch (t) {
    case 'University':          return 'University'
    case 'Research Institute':  return 'Research Institute'
    case 'College':             return 'College'
    case 'Training Center':     return 'Training Center'
    case 'Military University': return 'Military University'
    default:                    return 'University'
  }
}

function mapOppType(t: string | null): OpportunityType {
  switch (t) {
    case 'Job':              return 'Job'
    case 'Fellowship':       return 'Fellowship'
    case 'Training Program': return 'Training Program'
    default:                 return 'Job'
  }
}

function fmtDeadline(iso: string | null): string {
  if (!iso) return 'Rolling'
  const [y, m] = iso.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(m, 10) - 1]} ${y}`
}

function extractDomain(url: string | null): string {
  if (!url) return ''
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default async function WorkforcePage() {
  const supabase = await createClient()

  const { data: vn } = await supabase
    .from('countries')
    .select('id')
    .eq('code', 'vn')
    .single()

  const [{ data: instRows }, { data: oppRows }] = await Promise.all([
    vn
      ? supabase
          .from('training_institutions')
          .select('*')
          .eq('country_id', vn.id)
          .order('annual_quota', { ascending: false, nullsFirst: false })
      : Promise.resolve({ data: [] as Record<string, unknown>[] | null, error: null }),
    supabase
      .from('opportunities')
      .select('*')
      .eq('is_active', true)
      .order('deadline', { ascending: true, nullsFirst: false }),
  ])

  const institutions: Institution[] = (instRows ?? []).map((row, i) => ({
    number:   i + 1,
    name:     (row.name_en ?? '') as string,
    city:     (row.city ?? '') as string,
    type:     mapInstType(row.type as string | null),
    programs: ((row.programs_en ?? '') as string)
      .split(',')
      .map((p: string) => p.trim())
      .filter(Boolean),
    quota:    row.annual_quota
      ? `${row.annual_quota} students/year`
      : undefined,
    notable:  (row.notable_en ?? undefined) as string | undefined,
  }))

  const opportunities: Opportunity[] = (oppRows ?? []).map((row) => {
    const url = (row.url ?? '') as string
    return {
      id:          (row.id ?? '') as string,
      type:        mapOppType(row.type as string | null),
      title:       (row.title_en ?? '') as string,
      org:         (row.organization ?? '') as string,
      location:    (row.country ?? '') as string,
      deadline:    fmtDeadline(row.deadline as string | null),
      description: (row.description_en ?? '') as string,
      linkHref:    url,
      linkLabel:   extractDomain(url),
    }
  })

  return <WorkforceClient institutions={institutions} opportunities={opportunities} />
}
