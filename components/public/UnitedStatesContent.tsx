import EstablishedProgramLayout from '@/components/public/EstablishedProgramLayout'
import { unitedStatesVogtle } from '@/lib/data/established-programs'

export default function UnitedStatesContent() {
  return <EstablishedProgramLayout config={unitedStatesVogtle} />
}
