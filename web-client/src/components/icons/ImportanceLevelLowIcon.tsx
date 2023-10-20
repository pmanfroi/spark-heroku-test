import {ReactComponent as Icon} from '@/assets/not-important-icon.svg'

import BaseIcon, {Props as BaseIconProps} from './BaseIcon'
import {IconSize} from './types'

interface Props extends Omit<BaseIconProps, 'Icon' | 'iconClassName'> {
  size?: IconSize
}
const ImportanceLevelLowIcon = ({size, ...props}: Props) => {
  const getIconSize = () => {
    switch (size) {
      case IconSize.sm:
        return 'h-3.5 w-3.5'
      case IconSize.lg:
        return 'h-10 w-10'
      case IconSize.md:
      default:
        return 'h-4 w-4'
    }
  }
  return <BaseIcon Icon={Icon} iconClassName={getIconSize()} {...props} />
}

export default ImportanceLevelLowIcon
