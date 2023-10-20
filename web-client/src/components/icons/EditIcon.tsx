import {ReactComponent as Icon} from '@/assets/pencil-icon.svg'
import cns from '@/utils/classnames'

import BaseIcon, {Props as BaseIconProps} from './BaseIcon'
import {IconSize} from './types'

interface Props extends Omit<BaseIconProps, 'Icon' | 'iconClassName'> {
  size?: IconSize
}
const EditIcon = ({size, className, ...props}: Props) => {
  const getIconSize = () => {
    switch (size) {
      case IconSize.sm:
        return 'h-4 w-4'
      case IconSize.lg:
        return 'h-9 w-9'
      case IconSize.md:
      default:
        return 'h-4.5 w-4.5'
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
      stroke="#A3A3A3"
      {...props}
    />
  )
}

export default EditIcon
