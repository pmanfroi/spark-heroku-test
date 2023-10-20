import {noop} from 'ramda-adjunct'
import {useEffect, useState} from 'react'

import {
  useCreateProblemVariantRating,
  useUpdateProblemVariantRating,
  userGetProblemVariantRating,
} from '@/rest/problemVariantsRatingsRestHooks'
import {useGetProblems} from '@/rest/problemsRestHooks'
import {RatingType, ResourceTypes, UserRating as UserRatingType} from '@/rest/types'
import {useActiveUser} from '@/state/activeUserState'
import cns from '@/utils/classnames'

import RatingSelector from '../RatingSelector'

interface Props extends UserRatingType {
  title?: string
  description?: string
  onTitleClick?: React.MouseEventHandler<HTMLDivElement>
  className?: string
  preferredVariantId: string
  problemPublicId: number
  perspective?: string
}

export type SelectedRating = {
  ratingId: string | undefined
  rating: number
  ratingType: RatingType
}

const CardHeader = ({
  title,
  onTitleClick,
  passion,
  importance,
  favorite,
  description,
  className,
  preferredVariantId,
  problemPublicId,
  perspective,
}: Props) => {
  const {activeUser, activeUserCanAccess} = useActiveUser()
  const activeUserId = activeUser?.id
  const [isActiveUserPerspective, setIsActiveUserPerspective] = useState<boolean>(true)
  const {ratings} = userGetProblemVariantRating({
    problemVariantId: preferredVariantId,
  })
  const {refetch} = useGetProblems()

  useEffect(() => {
    setIsActiveUserPerspective(activeUserId === perspective)
  }, [activeUserId, perspective])

  const cn = {
    root: cns('flex flex-col bg-neutral-725 p-3.5', className),
    headerContainer: 'flex justify-between',
    titleContainer:
      'mr-4 line-clamp-2 h-10 max-w-[12rem] overflow-hidden text-ellipsis leading-tight',
    title: cns('text-sm text-neutral-100', {
      'cursor-pointer hover:underline': !!onTitleClick,
    }),
    iconContainer: 'flex justify-center gap-2',
    description: 'mt-1 h-10 text-2xs text-app-gray-400 overflow-auto',
  }

  const {updateProblemVariantRating} = useUpdateProblemVariantRating({
    problemPublicId: problemPublicId,
    options: {
      onSuccess: async () => {
        await refetch()
      },
    },
  })

  const {createProblemVariantRating} = useCreateProblemVariantRating({
    problemPublicId: problemPublicId,
    options: {
      onSuccess: async () => {
        await refetch()
      },
    },
  })

  const onSelectRating = ({
    problemVariantId,
    ratingId,
    rating,
    ratingType,
  }: SelectedRating & {problemVariantId: string}) => {
    if (!ratingId) {
      const ratingData = {
        ratingType,
        rating,
      }

      createProblemVariantRating({problemVariantId, ratings: [ratingData]}, {})
      return
    } else {
      const ratingData = {
        id: ratingId,
        rating,
      }
      updateProblemVariantRating(ratingData, {})
    }
  }

  const handleSelectRating = (ratingType, rating) => {
    const variantRating = ratings?.find((curRating) => curRating.ratingType === ratingType)
    onSelectRating({
      problemVariantId: preferredVariantId,
      rating: rating,
      ratingType: ratingType,
      ratingId: variantRating?.id,
    })
  }

  const activeUserProblemAccess = activeUserCanAccess(ResourceTypes.PROBLEM)

  return (
    <div className={cn.root}>
      <div className={cn.headerContainer}>
        <div className={cn.titleContainer}>
          <div className={cn.title} onClick={onTitleClick || noop}>
            {title}
          </div>
        </div>
        <div className={cn.iconContainer}>
          {[
            {ratingType: RatingType.passion, rating: passion},
            {ratingType: RatingType.importance, rating: importance},
            {ratingType: RatingType.favorite, rating: favorite},
          ].map((rating, index) => {
            return (
              <RatingSelector
                key={index}
                rating={rating?.rating === undefined ? -1 : rating.rating}
                ratingType={rating?.ratingType}
                disabled={
                  (!isActiveUserPerspective && !activeUserProblemAccess.updateAny) ||
                  !activeUserProblemAccess.updateOwn
                }
                onClick={(ratingValue) => handleSelectRating(rating.ratingType, ratingValue)}
                vertical={true}
              />
            )
          })}
        </div>
      </div>
      <div className={cn.description}>{description}</div>
    </div>
  )
}

export default CardHeader
