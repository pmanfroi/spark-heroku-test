import {ReactComponent as Icon} from '@/assets/passion-placeholder.svg'
import cns from '@/utils/classnames'

import BaseIcon, {Props as BaseIconProps} from './BaseIcon'
import {IconSize} from './types'

interface Props extends Omit<BaseIconProps, 'Icon' | 'iconClassName'> {
  size?: IconSize
  className?: string
}
const PassionLevelPlaceHolderIcon = ({size, className, ...props}: Props) => {
  // prettier-ignore
  const iconSize =
    size === IconSize.sm ? 'h-3.5 w-3.5' :
    size === IconSize.md ? 'h-4.5 w-4.5' :
    size === IconSize.lg ? 'h-11 w-11' : 'h-4.5 w-4.5'

  return <BaseIcon Icon={Icon} iconClassName={cns(iconSize, className)} {...props} />
}

export default PassionLevelPlaceHolderIcon
