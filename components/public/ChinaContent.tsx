import EstablishedProgramLayout from '@/components/public/EstablishedProgramLayout'
import { chinaHualongOne } from '@/lib/data/established-programs'
import { getEstablishedProgramFromDb } from '@/lib/data/established-programs-db'

export default async function ChinaContent() {
  const config = (await getEstablishedProgramFromDb('china')) ?? chinaHualongOne

  return <EstablishedProgramLayout config={config} />
}
