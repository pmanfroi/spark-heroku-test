import {VariantProps, cva} from 'class-variance-authority'

import {ReactComponent as Icon} from '@/assets/checked-icon.svg'
import cns from '@/utils/classnames'

import BaseIcon, {Props as BaseIconProps} from './BaseIcon'

const variants = cva('hover:brightness-125 text-neutral-500 -m-1 cursor-pointer', {
  variants: {
    size: {
      sm: 'h-3 w-3',
      md: 'h-4.5 w-4.5',
      lg: 'h-9 w-9',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface Props
  extends Omit<BaseIconProps, 'Icon' | 'iconClassName'>,
    VariantProps<typeof variants> {}
const CheckedIcon = ({size, className, ...props}: Props) => {
  return <BaseIcon Icon={Icon} iconClassName={cns(variants({size}), className)} {...props} />
}

export default CheckedIcon
