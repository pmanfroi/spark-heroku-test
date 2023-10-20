import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  progress: number
  className?: string
}
//*****************************************************************************
// Components
//*****************************************************************************
const ProgressBar = ({progress, className}: Props) => {
  const cn = {
    root: cns('h-3 w-12 rounded bg-zinc-400', className),
    progress: 'rounded h-full bg-app-green',
  }
  return (
    <div className={cn.root}>
      <div className={cn.progress} style={{width: progress + '%'}} />
    </div>
  )
}
export default ProgressBar
