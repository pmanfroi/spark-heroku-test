import {XMarkIcon} from '@heroicons/react/20/solid'

import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

//*****************************************************************************
// Components
//*****************************************************************************
const CloseIcon = ({onClick, className, ...props}: Props) => {
  const cn = {
    root: cns('h-7 w-7 text-secondary', className),
  }
  return (
    <div onClick={onClick} className={cn.root}>
      <XMarkIcon {...props} />
    </div>
  )
}
export default CloseIcon
