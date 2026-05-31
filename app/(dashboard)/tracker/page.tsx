import { createClient } from '@/lib/supabase/server'
import TrackerClient, { type PlantInfo, type Milestone } from './TrackerClient'

type Category = 'Policy' | 'Technical' | 'Partnership' | 'Regulatory' | 'Construction' | 'Commissioning'
type MilestoneStatus = 'completed' | 'active' | 'upcoming' | 'suspended'

function mapStatus(s: string | null): MilestoneStatus {
  switch (s) {
    case 'completed':   return 'completed'
    case 'in_progress': return 'active'
    default:            return 'upcoming'
  }
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const [y, m] = iso.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(m, 10) - 1]} ${y}`
}

const Loading = () => (
  <div className="space-y-6 max-w-3xl">
    <p className="text-navy/50 text-sm pt-4">Data loading...</p>
  </div>
)

export default async function TrackerPage() {
  const supabase = await createClient()

  const { data: vn } = await supabase
    .from('countries')
    .select('id')
    .eq('code', 'vn')
    .single()

  if (!vn) return <Loading />

  const { data: plants } = await supabase
    .from('plants')
    .select('*')
    .eq('country_id', vn.id)
    .order('code')

  if (!plants?.length) return <Loading />

  const { data: allMilestones } = await supabase
    .from('plant_milestones')
    .select('*')
    .in('plant_id', plants.map(p => p.id))
    .order('sort_order')

  const plantData: PlantInfo[] = plants.map(p => ({
    flag:             'https://flagcdn.com/w20/vn.png',
    name:             p.name_en as string,
    code:             (p.code ?? '') as string,
    owner:            (p.owner_en ?? '') as string,
    technology:       (p.technology ?? '') as string,
    capacity:         p.capacity ? `${p.capacity} MWe` : '',
    targetCompletion: p.target_completion ? String(p.target_completion) : '',
    currentPhase:     (p.current_phase_en ?? '') as string,
    progress:         (p.progress_pct ?? 0) as number,
    statusVariant:    'active' as const,
    milestones:       (allMilestones ?? [])
      .filter(m => m.plant_id === p.id)
      .map((m, i): Milestone => ({
        id:          i + 1,
        title:       m.title_en as string,
        category:    'Technical' as Category,
        status:      mapStatus(m.status as string | null),
        target:      fmtDate(m.target_date as string | null),
        completed:   m.completed_date ? fmtDate(m.completed_date as string) : undefined,
        description: '',
      })),
  }))

  return <TrackerClient plants={plantData} />
}
