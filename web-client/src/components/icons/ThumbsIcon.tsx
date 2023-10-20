import {HandThumbUpIcon} from '@heroicons/react/20/solid'
import {VariantProps, cva} from 'class-variance-authority'

import cns from '@/utils/classnames'

const variants = cva('hover:brightness-125 -m-1 cursor-pointer', {
  variants: {
    size: {
      sm: 'h-3 w-3',
      md: 'h-5 w-5',
      lg: 'h-7 w-7',
    },
    direction: {
      up: 'stroke-app-green text-transparent',
      down: 'rotate-180 stroke-app-red text-transparent',
    },
  },
  defaultVariants: {
    size: 'md',
    direction: 'up',
  },
})

interface Props extends VariantProps<typeof variants> {
  className?: string
  onClick?: () => void
}
const ThumbsIcon = ({size, direction, className, onClick}: Props) => {
  return (
    <div className={cns(variants({size, direction}), className)} onClick={onClick}>
      <HandThumbUpIcon />
    </div>
  )
}

export default ThumbsIcon
