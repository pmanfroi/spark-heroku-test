import {ReactComponent as Icon} from '@/assets/arrow-plus-icon.svg'
import cns from '@/utils/classnames'

import BaseIcon, {Props as BaseIconProps} from './BaseIcon'
import {IconSize} from './types'

interface Props extends Omit<BaseIconProps, 'Icon' | 'iconClassName'> {
  size?: IconSize
}
const ArrowPlusIcon = ({size, className, ...props}: Props) => {
  const getIconSize = () => {
    switch (size) {
      case IconSize.sm:
        return 'h-5.5 w-3.5'
      case IconSize.lg:
        return 'h-12 w-10'
      case IconSize.md:
      default:
        return 'h-7.5 w-6.5'
    }
  }

  const cn = {
    icon: 'hover:cursor-pointer',
  }

  return (
    <BaseIcon
      Icon={Icon}
      className={cn.icon}
      iconClassName={cns(getIconSize(), className)}
      {...props}
    />
  )
}

export default ArrowPlusIcon
