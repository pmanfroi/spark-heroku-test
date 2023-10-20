import {ReactComponent as Icon} from '@/assets/favorite-not-selected-icon.svg'

import BaseIcon, {Props as BaseIconProps} from './BaseIcon'
import {IconSize} from './types'

interface Props extends Omit<BaseIconProps, 'Icon' | 'iconClassName'> {
  size?: IconSize
}

const FavoriteUnselectedIcon = ({size, ...props}: Props) => {
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

  return <BaseIcon Icon={Icon} iconClassName={getIconSize()} {...props} />
}

export default FavoriteUnselectedIcon
