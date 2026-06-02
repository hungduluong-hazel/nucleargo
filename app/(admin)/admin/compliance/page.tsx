import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const STATUS_OPTIONS = [
  { value: 'met',         label: 'Met',         style: 'bg-emerald-50 text-emerald-700' },
  { value: 'partial',     label: 'Partial',      style: 'bg-amber-50 text-amber-700' },
  { value: 'in_progress', label: 'In progress',  style: 'bg-blue-50 text-blue-700' },
  { value: 'not_met',     label: 'Not yet',      style: 'bg-red-50 text-red-700' },
]

async function updateIssueStatus(id: string, formData: FormData) {
  'use server'
  const supabase = await createClient()
  await supabase.from('infrastructure_issues').update({
    status:       formData.get('status') as string,
    analysis_en:  (formData.get('analysis_en') as string) || null,
    last_updated: new Date().toISOString(),
  }).eq('id', id)
  revalidatePath('/admin/compliance')
}

export default async function AdminCompliancePage() {
  const supabase = await createClient()

  const { data: vn } = await supabase
    .from('countries')
    .select('id')
    .eq('code', 'vn')
    .single()

  const { data: issues } = vn
    ? await supabase
        .from('infrastructure_issues')
        .select('id, number, title_en, category, status, analysis_en, last_updated')
        .eq('country_id', vn.id)
        .order('sort_order')
    : { data: [] }

  const statusCounts = STATUS_OPTIONS.map(opt => ({
    ...opt,
    count: issues?.filter(i => i.status === opt.value).length ?? 0,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">IAEA Compliance — Vietnam</h1>
        <p className="text-sm text-navy/50 mt-1">Update status and analysis notes for the 19 infrastructure issues</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {statusCounts.map(({ label, count, style }) => (
          <div key={label} className="bg-white rounded-xl border border-navy/8 p-4 text-center">
            <p className="text-2xl font-bold text-navy">{count}</p>
            <span className={`text-xs font-semibold rounded-full px-2 py-0.5 mt-1.5 inline-block ${style}`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Issues list */}
      <div className="space-y-3">
        {issues && issues.length > 0 ? issues.map((issue) => {
          const action = updateIssueStatus.bind(null, issue.id as string)
          const currentStatus = STATUS_OPTIONS.find(s => s.value === issue.status) ?? STATUS_OPTIONS[3]
          return (
            <details key={issue.id as string} className="bg-white rounded-xl border border-navy/8 group">
              <summary className="flex items-center gap-4 px-5 py-4 cursor-pointer list-none">
                <span className="text-xs font-bold text-navy/30 w-6 flex-shrink-0">
                  {issue.number as number}.
                </span>
                <span className="flex-1 text-sm font-semibold text-navy">{issue.title_en as string}</span>
                <span className="text-xs text-navy/40">{issue.category as string}</span>
                <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 flex-shrink-0 ${currentStatus.style}`}>
                  {currentStatus.label}
                </span>
                <svg className="w-4 h-4 text-navy/30 flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              <form action={action} className="px-5 pb-5 pt-2 border-t border-navy/6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy/50 mb-2 uppercase tracking-wider">Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {STATUS_OPTIONS.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value={opt.value}
                          defaultChecked={issue.status === opt.value}
                          className="text-accent"
                        />
                        <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${opt.style}`}>
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy/50 mb-2 uppercase tracking-wider">Analysis notes</label>
                  <textarea
                    name="analysis_en"
                    rows={4}
                    defaultValue={(issue.analysis_en as string) ?? ''}
                    className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y"
                    placeholder="Notes on current status, evidence, or actions required..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="rounded-lg px-4 py-2 text-sm font-semibold bg-navy text-white hover:bg-navy/90 transition-colors"
                  >
                    Save
                  </button>
                  {issue.last_updated && (
                    <span className="text-xs text-navy/30">
                      Last updated {new Date(issue.last_updated as string).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </form>
            </details>
          )
        }) : (
          <div className="bg-white rounded-xl border border-navy/8 px-5 py-12 text-center">
            <p className="text-sm text-navy/40">No compliance issues found. Make sure the database is seeded with Vietnam data.</p>
          </div>
        )}
      </div>
    </div>
  )
}
