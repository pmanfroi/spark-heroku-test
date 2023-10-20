import Panel from '@/components/ui/Panel'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  name?: string
  label: string
  hidden?: boolean
  disabled?: boolean
  withPanel?: boolean
  children: React.ReactNode
  className?: string
}
const defaultProps = {
  disabled: false,
  withPanel: false,
  hidden: false,
  label: '',
}
//*****************************************************************************
// Components
//*****************************************************************************
const FieldSet = ({name, label, hidden, disabled, className, withPanel, children}: Props) => {
  const fieldSetProps = {id: name, disabled: disabled, hidden: hidden}
  if (name) fieldSetProps.id = name

  const cn = {
    label: 'text-primary-light mb-2',
  }

  return (
    <WithPanel {...{withPanel, className}}>
      {label && <div className={cn.label}>{label}</div>}
      <fieldset {...fieldSetProps}>{children}</fieldset>
    </WithPanel>
  )
}

interface WithPanelProps {
  withPanel?: boolean
  className?: string
  children: React.ReactNode
}

const WithPanel = ({withPanel, className, children}: WithPanelProps) => {
  return withPanel ? (
    <Panel className={className}>{children}</Panel>
  ) : (
    <div className={className}>{children}</div>
  )
}

FieldSet.defaultProps = defaultProps
export default FieldSet
