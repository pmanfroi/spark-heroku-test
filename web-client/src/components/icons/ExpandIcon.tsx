import {ChevronDownIcon} from '@heroicons/react/20/solid'
import {VariantProps, cva} from 'class-variance-authority'

import cns from '@/utils/classnames'

const variants = cva('hover:brightness-125 text-neutral-500 -m-1 cursor-pointer', {
  variants: {
    size: {
      sm: 'h-3 w-3',
      md: 'h-7 w-7',
      lg: 'h-9 w-9',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface Props extends VariantProps<typeof variants> {
  className?: string
  onClick?: () => void
}
const ExpandIcon = ({size, className, onClick}: Props) => {
  return (
    <div className={cns(variants({size}), className)} onClick={onClick}>
      <ChevronDownIcon />
    </div>
  )
}

export default ExpandIcon
