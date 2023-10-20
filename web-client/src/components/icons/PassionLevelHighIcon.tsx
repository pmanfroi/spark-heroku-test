import {ReactComponent as Icon} from '@/assets/jazzed-icon.svg'
import cns from '@/utils/classnames'

import BaseIcon, {Props as BaseIconProps} from './BaseIcon'
import {IconSize} from './types'

interface Props extends Omit<BaseIconProps, 'Icon' | 'iconClassName'> {
  size?: IconSize
  className?: string
}
const PassionLevelHighIcon = ({size, className, ...props}: Props) => {
  const getIconSize = () => {
    switch (size) {
      case IconSize.sm:
        return 'h-3.5 w-3.5'
      case IconSize.lg:
        return 'h-11 w-11'
      case IconSize.md:
      default:
        return 'h-4 w-4'
    }
  }
  return <BaseIcon Icon={Icon} iconClassName={cns(getIconSize(), className)} {...props} />
}

export default PassionLevelHighIcon
