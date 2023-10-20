import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  className?: string
  children: React.ReactNode
}

//*****************************************************************************
// Components
//*****************************************************************************
const PanelTitle = ({className, children}: Props) => {
  const cn = {
    root: cns('pb-2 pr-1 text-white/30', className),
  }
  return <div className={cn.root}>{children}</div>
}
export default PanelTitle
