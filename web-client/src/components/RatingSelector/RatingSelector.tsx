import {useRef, useState} from 'react'

import {RatingType} from '@/rest/types'

import useOutsideClick from '../OutsideClickHandler/useOutsideClickHook'
import RatingToolbar from '../RatingToolbar'
import Icon from '../icons/Icon'

interface Props {
  ratingType: RatingType
  rating: number
  disabled?: boolean
  vertical?: boolean
  onClick?: (rating: number) => void
}

const RatingSelector = ({ratingType, rating, disabled, vertical, onClick}: Props) => {
  const [isVisible, setIsVisible] = useState(false)
  const selectorRef = useRef(null)
  useOutsideClick(selectorRef, () => {
    setIsVisible(false)
  })

  const handleClick = (selectedRating: number) => {
    setIsVisible(false)
    onClick?.(selectedRating)
  }
  const verticalDropdown = vertical ? 'vertical' : 'horizontal'

  return (
    <div ref={selectorRef} className="relative">
      {/* HIDDEN ACTIONS TOOLBAR */}
      <RatingToolbar
        orientation={verticalDropdown}
        isActive={isVisible}
        ratingType={ratingType}
        onClick={handleClick}
      />
      {/* USER CURRENT SELECTION */}
      <Icon.Rating
        type={ratingType}
        level={rating}
        disabled={disabled}
        onClick={() => {
          if (disabled) {
            return
          }

          if (ratingType === RatingType.favorite) {
            // Inverted to unselect
            handleClick(rating <= 0 ? 1 : 0)
            return
          }
          setIsVisible((prev) => !prev)
        }}
      />
    </div>
  )
}

export default RatingSelector
