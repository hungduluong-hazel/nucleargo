import EstablishedProgramLayout from '@/components/public/EstablishedProgramLayout'
import { unitedStatesVogtle } from '@/lib/data/established-programs'
import { getEstablishedProgramFromDb } from '@/lib/data/established-programs-db'

export default async function UnitedStatesContent() {
  // DB-first: falls back to the static object below until migration 010 is
  // applied and scripts/seed-established-programs.ts has been run. Once
  // seeded, this transparently switches to Supabase without a code change.
  const config = (await getEstablishedProgramFromDb('united-states')) ?? unitedStatesVogtle

  return <EstablishedProgramLayout config={config} />
}
