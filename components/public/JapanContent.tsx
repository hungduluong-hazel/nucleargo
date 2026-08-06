import EstablishedProgramLayout from '@/components/public/EstablishedProgramLayout'
import { japanShimane3 } from '@/lib/data/established-programs'
import { getEstablishedProgramFromDb } from '@/lib/data/established-programs-db'

export default async function JapanContent() {
  const config = (await getEstablishedProgramFromDb('japan')) ?? japanShimane3

  return <EstablishedProgramLayout config={config} />
}
