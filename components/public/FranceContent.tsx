import EstablishedProgramLayout from '@/components/public/EstablishedProgramLayout'
import { franceEpr } from '@/lib/data/established-programs'
import { getEstablishedProgramFromDb } from '@/lib/data/established-programs-db'

export default async function FranceContent() {
  const config = (await getEstablishedProgramFromDb('france')) ?? franceEpr

  return <EstablishedProgramLayout config={config} />
}
