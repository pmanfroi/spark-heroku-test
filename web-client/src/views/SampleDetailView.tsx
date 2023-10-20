import ObjectValuesDisplay from '@/components/ui/ObjectValuesDisplay'
import Panel from '@/components/ui/Panel'

//*****************************************************************************
// Interface
//*****************************************************************************

interface Props {
  sample: {[k: string]: any}
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************

const SampleDetail = ({sample, className}: Props) => {
  const {fieldRequired, fieldSelection, fieldOptional} = sample || {}

  const generalInfo = {
    fieldRequired,
    fieldOptional,
    fieldSelection,
  }

  return (
    <div className={className}>
      <Panel title="General">
        <ObjectValuesDisplay object={generalInfo} />
      </Panel>
    </div>
  )
}

export default SampleDetail
