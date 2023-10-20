import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  title: string
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const FormTitle = ({title, className}: Props) => {
  const cn = {
    root: cns('mb-3 text-xl text-zinc-400', className),
  }
  return <div className={cn.root}>{title}</div>
}
export default FormTitle
