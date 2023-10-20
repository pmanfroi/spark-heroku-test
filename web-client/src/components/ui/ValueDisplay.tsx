import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
// for custom styling
type ClassNamesShape = {
  label: string
  value: string
}
interface Props {
  label: string
  value: any
  className?: string
  classNames?: ClassNamesShape
}
//*****************************************************************************
// Components
//*****************************************************************************
const ValueDisplay = ({label, value, className, classNames}: Props) => {
  const cn = {
    root: cns('flex flex-row items-center gap-2 text-xs', className),
    label: cns(classNames?.label, 'text-zinc-500'),
    value: cns(classNames?.value, 'text-zinc-300'),
  }
  return (
    <div className={cn.root}>
      <div className={cn.label}>{label}</div>
      <div className={cn.value}>{value}</div>
    </div>
  )
}
export default ValueDisplay
