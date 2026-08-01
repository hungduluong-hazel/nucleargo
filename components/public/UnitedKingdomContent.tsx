import EstablishedProgramLayout from '@/components/public/EstablishedProgramLayout'
import { unitedKingdomHinkleyC } from '@/lib/data/established-programs'
import { getEstablishedProgramFromDb } from '@/lib/data/established-programs-db'

export default async function UnitedKingdomContent() {
  const config = (await getEstablishedProgramFromDb('united-kingdom')) ?? unitedKingdomHinkleyC

  return <EstablishedProgramLayout config={config} />
}
