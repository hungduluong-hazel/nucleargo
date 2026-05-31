import { createClient } from '@/lib/supabase/server'
import ComplianceClient, { type Issue } from './ComplianceClient'

type IssueStatus   = 'Met' | 'Partial' | 'Not yet'
type IssueCategory = 'National Position' | 'Legal & Regulatory' | 'Nuclear Safety' | 'Grid & Site' | 'Human Resources' | 'Industry'
type NoteLabel     = 'Evidence' | 'Action required'

function mapStatus(s: string | null): IssueStatus {
  switch (s) {
    case 'met':         return 'Met'
    case 'partial':     return 'Partial'
    case 'not_met':     return 'Not yet'
    case 'in_progress': return 'Partial'
    default:            return 'Not yet'
  }
}

function mapCategory(c: string | null): IssueCategory {
  switch (c) {
    case 'Legal & Regulatory': return 'Legal & Regulatory'
    case 'Safety & Security':  return 'Nuclear Safety'
    case 'Infrastructure':     return 'Grid & Site'
    case 'Workforce':          return 'Human Resources'
    case 'Management':         return 'National Position'
    default:                   return 'National Position'
  }
}

function fmtLastUpdated(ts: string | null): string {
  if (!ts) return 'December 2025'
  return new Date(ts).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default async function CompliancePage() {
  const supabase = await createClient()

  const { data: vn } = await supabase
    .from('countries')
    .select('id')
    .eq('code', 'vn')
    .single()

  if (!vn) return <ComplianceClient issues={[]} />

  const { data: rows } = await supabase
    .from('infrastructure_issues')
    .select('*')
    .eq('country_id', vn.id)
    .order('sort_order')

  if (!rows?.length) return <ComplianceClient issues={[]} />

  const issues: Issue[] = rows.map(row => {
    const status: IssueStatus   = mapStatus(row.status as string | null)
    const noteLabel: NoteLabel  = status === 'Met' ? 'Evidence' : 'Action required'
    const analysis              = (row.analysis_en ?? '') as string
    const firstSentenceEnd      = analysis.indexOf('. ')
    const note                  = firstSentenceEnd > 0
      ? analysis.slice(0, firstSentenceEnd + 1)
      : analysis

    return {
      id:          (row.number ?? 0) as number,
      title:       row.title_en as string,
      category:    mapCategory(row.category as string | null),
      status,
      analysis,
      noteLabel,
      note,
      lastUpdated: fmtLastUpdated(row.last_updated as string | null),
    }
  })

  return <ComplianceClient issues={issues} />
}
