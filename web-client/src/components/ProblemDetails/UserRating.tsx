import {memo} from 'react'

import {ProblemVariantRating, RatingType} from '@/rest/types'

import RatingSelector from '../RatingSelector'

//*****************************************************************************
// Interface
//*****************************************************************************
export type SelectedRating = {
  ratingId: string | undefined
  rating: number
  ratingType: RatingType
}
interface Props {
  problemVariantId: string
  disabled?: boolean
  ratings: ProblemVariantRating[]
  onSelectRating: (rating: SelectedRating) => void
}

//*****************************************************************************
// Components
//*****************************************************************************

const UserRating = memo(({disabled, ratings, onSelectRating}: Props) => {
  const onRatingPassion = (rating: number) => {
    const ratingId = ratings.find((ratingItem) => ratingItem.ratingType === RatingType.passion)?.id
    onSelectRating({ratingId, rating, ratingType: RatingType.passion})
  }

  const onRatingImportance = (rating: number) => {
    const ratingId = ratings.find((ratingItem) => ratingItem.ratingType === RatingType.importance)
      ?.id
    onSelectRating({ratingId, rating, ratingType: RatingType.importance})
  }

  const onRatingFavorite = (rating: number) => {
    const ratingId = ratings.find((ratingItem) => ratingItem.ratingType === RatingType.favorite)?.id
    onSelectRating({ratingId, rating, ratingType: RatingType.favorite})
  }

  const onRatingClick = (ratingType: RatingType, rating: number) => {
    if (ratingType === RatingType.passion) {
      onRatingPassion(rating)
      return
    }
    if (ratingType === RatingType.importance) {
      onRatingImportance(rating)
      return
    }
    if (ratingType === RatingType.favorite) {
      onRatingFavorite(rating)
      return
    }
  }

  const cn = {
    ratingsContainer: 'flex w-10 flex-col items-center justify-center gap-2',
  }

  return (
    <div className={cn.ratingsContainer}>
      {[RatingType.passion, RatingType.importance, RatingType.favorite].map((ratingType, index) => {
        const userRating = ratings?.find((rating) => rating.ratingType === ratingType)
        return (
          <RatingSelector
            key={index}
            rating={userRating?.rating === undefined ? -1 : userRating.rating}
            ratingType={ratingType}
            disabled={disabled}
            onClick={(rating: number) => onRatingClick(ratingType, rating)}
          />
        )
      })}
    </div>
  )
})

export default UserRating
