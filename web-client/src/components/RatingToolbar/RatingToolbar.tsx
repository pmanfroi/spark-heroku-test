import {VariantProps, cva} from 'class-variance-authority'

import {RatingType} from '@/rest/types'
import cns from '@/utils/classnames'

import Icon from '../icons/Icon'

const MAX_RATING_LEVEL = 3

export type VariantsProps = VariantProps<typeof variants>

interface Props extends VariantsProps {
  isActive: boolean
  ratingType: RatingType
  maxRatingLevel?: number
  onClick?: (rating: number) => void
}

const variants = cva(
  'absolute -z-10 flex h-0 w-0 items-center justify-center gap-3 rounded-md bg-neutral-700 p-0 opacity-0',
  {
    variants: {
      orientation: {
        horizontal: '-mt-2',
        vertical: 'mt-1 -ml-2 flex-col',
      },
    },
  }
)

const animationVariants = cva('', {
  variants: {
    orientation: {
      horizontal:
        'z-10 h-max w-max overflow-hidden p-2 transition-all duration-200 ease-linear -translate-x-[8rem] opacity-100',
      vertical:
        'z-10 h-max w-max overflow-hidden p-2 transition-all duration-200 ease-linear translate-y-5 opacity-100',
    },
  },
})

const RatingToolbar = ({
  orientation = 'horizontal',
  isActive,
  ratingType,
  maxRatingLevel,
  onClick,
}: Props) => {
  return (
    <div className={cns(variants({orientation}), isActive && animationVariants({orientation}))}>
      {Array.from(new Array(MAX_RATING_LEVEL || maxRatingLevel)).map((_, index) => (
        <Icon.Rating key={index} type={ratingType} level={index} onClick={() => onClick?.(index)} />
      ))}
      <Icon.Close
        className="-m-2 h-7 w-7 cursor-pointer p-0 leading-3 text-neutral-400 hover:brightness-125"
        onClick={() => onClick?.(-1)}
      />
    </div>
  )
}

export default RatingToolbar
