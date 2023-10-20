import {ElementType, SVGProps} from 'react'

import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
export interface Props extends SVGProps<SVGElement> {
  Icon: ElementType<any>
  muted?: boolean
  highlightOnHover?: boolean
  onClick?: () => void
  className?: string
  iconClassName?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const BaseIcon = ({
  onClick,
  Icon,
  muted = false,
  iconClassName,
  highlightOnHover = false,
  className,
  ...props
}: Props) => {
  const cn = {
    icon: cns(
      highlightOnHover && `opacity-100 hover:brightness-125`,
      muted && 'opacity-50',
      iconClassName
    ),
  }

  return (
    <div onClick={onClick} className={className}>
      <Icon className={cn.icon} {...props} />
    </div>
  )
}
export default BaseIcon
