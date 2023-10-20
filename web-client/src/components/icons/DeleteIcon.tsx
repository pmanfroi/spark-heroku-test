import {ReactComponent as Icon} from '@/assets/delete-icon.svg'
import cns from '@/utils/classnames'

import BaseIcon, {Props as BaseIconProps} from './BaseIcon'
import {IconSize} from './types'

interface Props extends Omit<BaseIconProps, 'Icon' | 'iconClassName'> {
  size?: IconSize
}
const DeleteIcon = ({size, className, ...props}: Props) => {
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

  return (
    <BaseIcon
      Icon={Icon}
      className={cn.icon}
      iconClassName={cns(getIconSize(), className)}
      fill="#737373"
      {...props}
    />
  )
}

export default DeleteIcon
