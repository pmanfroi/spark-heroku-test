import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  text: string
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const PanelLabel = ({text, className}: Props) => {
  const cn = {
    root: cns('text-lg text-white/80', className),
  }
  return <div className={cn.root}>{text}</div>
}
export default PanelLabel
