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
const SectionTitle = ({text, className}: Props) => {
  const cn = {
    root: cns('pb-2 pr-1 text-lg font-semibold text-white/30', className),
  }
  return <div className={cn.root}>{text}</div>
}
export default SectionTitle
