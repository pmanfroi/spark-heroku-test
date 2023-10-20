import {ReactComponent as Icon} from '@/assets/check-circle-checked-icon.svg'

import BaseIcon, {Props as BaseIconProps} from './BaseIcon'
import {IconSize} from './types'

interface Props extends Omit<BaseIconProps, 'Icon' | 'iconClassName'> {
  size?: IconSize
}
const CheckCircleCheckedIcon = ({size, ...props}: Props) => {
  const getIconSize = () => {
    switch (size) {
      case IconSize.sm:
        return 'h-3 w-3'
      case IconSize.lg:
        return 'h-9 w-9'
      case IconSize.md:
      default:
        return 'h-5 w-5'
    }
  }

  const cn = {
    icon: 'hover:cursor-pointer',
  }

  return <BaseIcon Icon={Icon} className={cn.icon} iconClassName={getIconSize()} {...props} />
}

export default CheckCircleCheckedIcon
