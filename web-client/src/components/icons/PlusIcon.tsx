import {ReactComponent as Icon} from '@/assets/plus-icon.svg'
import cns from '@/utils/classnames'

import BaseIcon, {Props as BaseIconProps} from './BaseIcon'
import {IconSize} from './types'

interface Props extends Omit<BaseIconProps, 'Icon' | 'iconClassName'> {
  size?: IconSize
}
const PlusIcon = ({size, className, ...props}: Props) => {
  const getIconSize = () => {
    switch (size) {
      case IconSize.sm:
        return 'h-3 w-3'
      case IconSize.lg:
        return 'h-6 w-6'
      case IconSize.md:
      default:
        return 'h-5 w-5'
    }
  }

  const cn = {
    icon: cns('hover:cursor-pointer', className),
  }

  return (
    <BaseIcon
      Icon={Icon}
      className={cn.icon}
      iconClassName={cns(getIconSize(), className)}
      fill="#00000"
      {...props}
    />
  )
}

export default PlusIcon
