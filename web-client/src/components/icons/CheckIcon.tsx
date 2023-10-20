import {ReactComponent as Icon} from '@/assets/check-icon.svg'
import cns from '@/utils/classnames'

import BaseIcon, {Props as BaseIconProps} from './BaseIcon'
import {IconSize} from './types'

interface Props extends Omit<BaseIconProps, 'Icon' | 'iconClassName'> {
  size?: IconSize
}
const CheckIcon = ({size, className, ...props}: Props) => {
  const getIconSize = () => {
    switch (size) {
      case IconSize.sm:
        return 'h-3 w-3'
      case IconSize.lg:
        return 'h-9 w-9'
      case IconSize.md:
      default:
        return 'h-4.5 w-4.5'
    }
  }

  return <BaseIcon Icon={Icon} iconClassName={cns(getIconSize(), className)} {...props} />
}

export default CheckIcon
