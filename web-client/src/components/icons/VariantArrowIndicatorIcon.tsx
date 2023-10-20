import {ReactComponent as Icon} from '@/assets/variant-arrow-indicator-icon.svg'
import cns from '@/utils/classnames'

import BaseIcon, {Props as BaseIconProps} from './BaseIcon'
import {IconSize} from './types'

interface Props extends Omit<BaseIconProps, 'Icon' | 'iconClassName'> {
  size?: IconSize
}
const VariantArrowIndicator = ({size, className, ...props}: Props) => {
  const getIconSize = () => {
    switch (size) {
      case IconSize.sm:
        return 'h-3 w-3'
      case IconSize.lg:
        return 'h-9 w-9'
      case IconSize.md:
      default:
        return 'h-11 w-10.5'
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

export default VariantArrowIndicator
