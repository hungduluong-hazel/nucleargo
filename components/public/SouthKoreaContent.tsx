import EstablishedProgramLayout from '@/components/public/EstablishedProgramLayout'
import { southKoreaApr1400 } from '@/lib/data/established-programs'
import { getEstablishedProgramFromDb } from '@/lib/data/established-programs-db'

export default async function SouthKoreaContent() {
  const config = (await getEstablishedProgramFromDb('south-korea')) ?? southKoreaApr1400

  return <EstablishedProgramLayout config={config} />
}
