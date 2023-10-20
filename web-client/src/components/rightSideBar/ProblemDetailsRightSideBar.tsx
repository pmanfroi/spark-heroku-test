import {useMemo} from 'react'

import CategoriesSelector from '@/components/CategoriesSelector'
// import LabelsFilter from '@/components/filters/LabelsFilter'
import Menu from '@/components/rightSideBar/RightSideMenu'
import {useUpdatePreferredProblemVariant} from '@/rest/problemVariantsIsPreferredRestHooks'
import {
  useCreateProblemVariantRating,
  useUpdateProblemVariantRating,
} from '@/rest/problemVariantsRatingsRestHooks'
import {useGetProblemByPublicId, useUpdateProblem} from '@/rest/problemsRestHooks'
import {
  ProblemStatus,
  ProblemVariant,
  ProblemVariantType,
  RatingType,
  ResourceTypes,
  SubProblem,
  User,
} from '@/rest/types'
import {useGetUsers} from '@/rest/usersRestHooks'
import {useActiveUser} from '@/state/activeUserState'
import {useSelectedProblemDetail, useSelectedUserPerspectiveId} from '@/state/appState'
import {getCategoryOptions} from '@/utils/categoryUtils'
import cns from '@/utils/classnames'
import {getLabelOptions} from '@/utils/labelUtils'

import {SelectedRating} from '../Card/CardHeader'
import LabelsSelector from '../LabelsSelector'
import RatingSelector from '../RatingSelector'
import Icon from '../icons/Icon'
import {Option} from '../select/FilterSelect'
import MainSelect from '../select/MainSelect'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  className?: string // applied to root container
}

type Reaction = {
  authorId: string
  authorName: string
  authorRatings?: Array<{
    ratingType: RatingType
    ratingId: string
    rating: number
  }>
}

//*****************************************************************************
// Components
//*****************************************************************************

const GhostComponent = ({className}) => {
  const cn = {
    root: cns(
      'flex flex-col gap-5 border-t-2 border-neutral-900 bg-neutral-800 px-5 pb-10 pt-8',
      className
    ),
    separator: 'my-1 w-full border border-neutral-600',
    ghostContainer: 'flex animate-pulse flex-col gap-6 mt-1',
    ghostBase: 'w-full rounded-md bg-neutral-600',
    ghost3sm: 'h-3',
    ghost2sm: 'h-4',
    ghostSm: 'h-6',
    ghostMd: 'h-8',
    ghostLg: 'h-10',
    ghost2lg: 'h-12',
    ghost3lg: 'h-20',
    titleSection: 'flex flex-col gap-4',
    variantSection: 'flex flex-col gap-1',
    filtersSection: 'flex flex-col gap-5',
    selectedSection: 'flex flex-col gap-5',
  }
  return (
    <div className={cn.root}>
      <div className={cn.ghostContainer}>
        <div className={cns(cn.ghostSm, cn.ghostBase)} />

        <div className={cn.titleSection}>
          <div className={cns(cn.ghostMd, cn.ghostBase)} />
          <div className={cns(cn.ghost2sm, cn.ghostBase)} />
        </div>

        <div className={cn.variantSection}>
          <div className={cns(cn.ghost3sm, cn.ghostBase)} />
          <div className={cns(cn.ghostSm, cn.ghostBase)} />
        </div>

        <div className={cn.variantSection}>
          <div className={cns(cn.ghost3sm, cn.ghostBase)} />
          <div className={cns(cn.ghostSm, cn.ghostBase)} />
        </div>

        <div className={cn.filtersSection}>
          <div className={cns(cn.ghost2lg, cn.ghostBase)} />
          <div className={cns(cn.ghost2lg, cn.ghostBase)} />
          <div className={cns(cn.ghost2lg, cn.ghostBase)} />
        </div>

        <div className={cns(cn.separator)} />

        <div className={cn.selectedSection}>
          <div className={cns(cn.ghostLg, cn.ghostBase)} />
          <div className={cns(cn.ghostLg, cn.ghostBase)} />
          <div className={cns(cn.ghost3lg, cn.ghostBase)} />
        </div>
      </div>
    </div>
  )
}

interface UserRatings extends SelectedRating {
  problemVariantId: string
  problemPublicId: number
  disabled: boolean
}
const UserRatings = ({
  problemPublicId,
  problemVariantId,
  ratingId,
  rating,
  ratingType,
  disabled,
}: UserRatings) => {
  const {updateProblemVariantRating} = useUpdateProblemVariantRating({
    problemPublicId,
  })

  const {createProblemVariantRating} = useCreateProblemVariantRating({
    problemPublicId,
  })

  const onSelectRating = ({ratingLevel}) => {
    if (!ratingId) {
      const ratingData = {
        ratingType,
        rating: ratingLevel,
      }
      createProblemVariantRating({problemVariantId, ratings: [ratingData]}, {})
      return
    }
    updateProblemVariantRating(
      {
        id: ratingId,
        rating: ratingLevel,
      },
      {}
    )
  }

  return (
    <RatingSelector
      vertical
      rating={rating}
      ratingType={ratingType}
      disabled={disabled}
      onClick={(ratingLevel: number) =>
        onSelectRating({
          ratingLevel,
        })
      }
    />
  )
}

const sortUsersByActiveUserId = (users, currentUserId) => {
  const index = users.findIndex((obj) => obj.id === currentUserId)

  if (index === -1) {
    return users
  }

  const objectToMove = users.splice(index, 1)[0]
  users.unshift(objectToMove)

  return users
}

const ProblemDetailsRightSideBar = ({className}: Props) => {
  const {selectedUserPerspectiveId, setSelectedUserPerspectiveId} = useSelectedUserPerspectiveId()
  const {selectedProblemDetail} = useSelectedProblemDetail()
  const {users} = useGetUsers()
  const {activeUser, activeUserCanAccess} = useActiveUser()
  const activeUserId = activeUser?.id

  const sortedUsers = sortUsersByActiveUserId(users, activeUserId)

  const {problem, isLoading, isError} = useGetProblemByPublicId(
    selectedProblemDetail?.publicProblemId!,
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(selectedProblemDetail?.publicProblemId),
    }
  )

  const {updateProblem} = useUpdateProblem({
    problemId: problem?.id,
    publicProblemId: problem?.publicId,
  })

  const {updatePreferredProblemVariant} = useUpdatePreferredProblemVariant({
    problemPublicId: problem?.publicId,
  })

  const onPreferredSelectionClick = (problemVariantId: string) => {
    updatePreferredProblemVariant(
      {
        id: problemVariantId,
      },
      {}
    )
  }

  const getStatusOptions = (): Option[] => {
    return Object.entries(ProblemStatus).map(([key, value]) => ({
      label: value.split('_').join(' '),
      value: key,
    }))
  }

  const handleStatusOptionChange = (option: Option) => {
    updateProblem({status: option.value})
  }

  const handleCategoryOptionsChange = (options: Option[]) => {
    const categories = options.map((option) => option.value)
    updateProblem({categories})
  }

  const handleLabelOptionsChange = (options: Option[]) => {
    const labels = options.map((option) => option.value)
    updateProblem({labels})
  }

  const rootProblemVariant = problem?.problemVariants?.find(
    (problemVariant) => problemVariant.type === ProblemVariantType.ROOT
  )

  const selectedProblemVariant = selectedProblemDetail?.problemVariantId
    ? problem?.problemVariants?.reduce((acc, problemVariant) => {
        if (problemVariant.id === selectedProblemDetail.problemVariantId) {
          return problemVariant
        }
        return acc
      }, {} as ProblemVariant)
    : null

  const isRootVariantSelected = rootProblemVariant?.id === selectedProblemVariant?.id

  const selectedSubProblem = selectedProblemDetail?.subProblemId
    ? selectedProblemVariant?.subProblems?.reduce((acc, problemVariant) => {
        if (problemVariant.id === selectedProblemDetail.subProblemId) {
          return problemVariant
        }
        return acc
      }, {} as SubProblem)
    : null

  const author: User = useMemo(
    () =>
      sortedUsers?.find(
        (user) =>
          user.id ===
          (selectedSubProblem?.createdBy || selectedProblemVariant?.createdBy || problem?.createdBy)
      ),
    [sortedUsers, selectedSubProblem, selectedProblemVariant, problem]
  )

  const problemVariantType =
    selectedProblemVariant?.type === ProblemVariantType.BROADER
      ? 'Broader'
      : selectedProblemVariant?.type === ProblemVariantType.NARROWER
      ? 'Narrower'
      : 'Root'

  const reactionTypes = Object.values(RatingType)

  const reactions = selectedProblemVariant?.ratings?.reduce((acc, rating) => {
    if (!acc) return []

    const existingAuthor = acc.find((user) => user.authorId === rating.userId)

    const ratingAuthor = sortedUsers.find((user) => user.id === rating.userId)
    const ratingAuthorFullName = `${ratingAuthor?.firstName} ${ratingAuthor?.lastName}`

    const item = {
      authorId: rating.userId,
      authorName: ratingAuthorFullName,
      authorRatings: [
        ...(existingAuthor?.authorRatings || []),
        {
          ratingType: rating.ratingType,
          ratingId: rating.id,
          rating: rating.rating,
        },
      ],
    }

    if (existingAuthor) {
      Object.assign(existingAuthor, item)
    } else {
      acc.push(item)
    }

    return acc
  }, [] as Reaction[])

  const activeUserProblemAccess = activeUserCanAccess(ResourceTypes.PROBLEM)

  const detailsData = {
    title: problem?.title,
    author: `${author?.firstName} ${author?.lastName}`,
    canEdit:
      activeUserId === author?.id
        ? activeUserProblemAccess.updateOwn
        : activeUserProblemAccess.updateAny,
    variantsCount: problem?.problemVariants?.length || 0,
    problemId: problem?.publicId,
    problemStatus: problem?.status,
    problemCategories: getCategoryOptions(problem?.categories || []),
    labels: getLabelOptions(problem?.labels || []),
    problemVariantId: selectedProblemVariant?.id,
    rootVariantContent: rootProblemVariant?.content,
    preferredVariantContent: problem?.problemVariants?.find(
      (variant) => variant.isPreferred && variant.type !== ProblemVariantType.ROOT
    )?.content,
    isPreferred: selectedProblemVariant?.isPreferred,
    type:
      selectedSubProblem?.order != null ? `SP${selectedSubProblem?.order + 1}` : problemVariantType,
    order:
      !selectedSubProblem &&
      selectedProblemVariant?.type !== ProblemVariantType.ROOT &&
      Math.abs(selectedProblemVariant?.order || 0),
    content: selectedSubProblem?.content || selectedProblemVariant?.content,
    reactions,
  }

  const cn = {
    root: cns(
      'flex flex-col gap-5 overflow-y-scroll border-t-2 border-neutral-900 bg-neutral-800 px-5 pb-10 pt-8',
      className
    ),
    menu: 'justify-start gap-5',
    headerContainer: 'flex flex-col gap-3',
    details: 'flex justify-between',
    section: 'flex flex-col',
    verticalSeparator: 'h-full w-[1px] bg-neutral-600',
    separator: 'my-2 w-full border border-neutral-600',
    selectedItemTitleContainer: 'flex justify-between',
    selectedItemTitle: 'text-lg font-bold',
    itemContentContainer: 'flex flex-col',
    reactionsSection: 'flex flex-col gap-2',
    reactionsList: 'flex max-h-48 flex-col gap-1 overflow-x-hidden overflow-y-visible min-h-[8rem]',
    reactionsListHeader: 'flex gap-2',
    reactionsUserTitle: 'w-1/2 text-xs text-neutral-500',
    reactionsTitle: 'flex w-full items-center justify-around',
    reactionRow:
      'flex items-center gap-2 rounded-md hover:bg-neutral-500 py-1 pl-2 cursor-default hover:cursor-pointer',
    reactionRowActive: 'bg-neutral-500',
    reactionRowUser: 'w-1/2 text-xs',
    reactionRowReactions: 'flex w-full items-center justify-around',
    preferredCheckIcon: cns(
      detailsData.canEdit && !detailsData.isPreferred ? 'cursor-pointer' : 'cursor-not-allowed'
    ),

    smallText: 'text-xs',
    smallGrayText: 'text-xs text-neutral-500',
    highlightSmallText: 'text-xs text-app-yellow',
  }

  if ((!problem && isLoading) || isError) {
    return <GhostComponent className={className} />
  }

  return (
    <div className={cn.root}>
      <Menu className={cns(cn.menu)}>
        <Menu.Item isActive>Details</Menu.Item>
        <Menu.Item>Notes</Menu.Item>
      </Menu>
      <div className={cns(cn.headerContainer)}>
        <div className={cns(cn.section)}>
          <span className={cns(cn.smallGrayText)}>Problem:</span>
          <span className="font-semibold">{detailsData.title}</span>
        </div>
        <div className={cns(cn.details)}>
          <span className={cns(cn.smallGrayText)}>{`Author: ${detailsData.author}`}</span>
          <div className={cns(cn.verticalSeparator)} />
          <span className={cns(cn.smallGrayText)}>{`Variants: ${detailsData.variantsCount}`}</span>
          <div className={cns(cn.verticalSeparator)} />
          <span className={cns(cn.smallGrayText)}>{`ID: ${detailsData.problemId}`}</span>
        </div>
      </div>
      <div className={cns(cn.section)}>
        <span
          className={cns(
            cn.smallGrayText,
            !detailsData.preferredVariantContent && isRootVariantSelected && cn.highlightSmallText
          )}
        >
          Root Variant
        </span>
        <span className={cns(cn.smallText)}>{detailsData.rootVariantContent}</span>
      </div>
      {detailsData.preferredVariantContent ? (
        <div className={cns(cn.section)}>
          <span className={cns(cn.highlightSmallText)}>Problem Variant</span>
          <span className={cns(cn.smallText)}>{detailsData.preferredVariantContent}</span>
        </div>
      ) : null}

      <CategoriesSelector
        selectedOptions={detailsData.problemCategories}
        onSelectOption={handleCategoryOptionsChange}
        emptyText="Uncategorized"
        disabled={!detailsData.canEdit}
      />
      <LabelsSelector
        selectedOptions={detailsData.labels}
        onSelectOption={handleLabelOptionsChange}
        emptyText="Unlabeled"
        disabled={!detailsData.canEdit}
      />
      <MainSelect
        entries={getStatusOptions()}
        activeEntryValue={detailsData?.problemStatus}
        onChange={handleStatusOptionChange}
        disabled={!detailsData.canEdit}
        label="Status"
        classNames={{
          menu: 'border border-neutral-600',
          label: 'bg-transparent',
        }}
      />

      <div className={cns(cn.separator)} />

      <div className={cns(cn.headerContainer)}>
        <div className={cns(cn.section)}>
          <div className={cns(cn.selectedItemTitleContainer)}>
            <span className={cns(cn.selectedItemTitle)}>{`Selected ${
              selectedSubProblem ? 'Idea' : 'Variant'
            }`}</span>
            {!selectedSubProblem ? (
              <div
                onClick={() =>
                  detailsData.canEdit &&
                  detailsData.problemVariantId &&
                  !detailsData.isPreferred &&
                  onPreferredSelectionClick(detailsData.problemVariantId)
                }
              >
                {detailsData.isPreferred ? (
                  <Icon.CheckCircleChecked className={cn.preferredCheckIcon} />
                ) : (
                  <Icon.CheckCircle className={cn.preferredCheckIcon} />
                )}
              </div>
            ) : null}
          </div>
          <span className={cns(cn.smallGrayText)}>{`${detailsData.type} ${
            detailsData.order || ''
          }`}</span>
        </div>
        <div className={cns(cn.itemContentContainer)}>
          <span className={cns(cn.smallGrayText)}>Problem Statement</span>
          <span className={cns(cn.smallText)}>{detailsData.content}</span>
        </div>
      </div>
      {!selectedSubProblem && reactions?.length ? (
        <div className={cn.reactionsSection}>
          <span>Reactions</span>
          <div className={cns(cn.reactionsList)}>
            <div className={cns(cn.reactionsListHeader)}>
              <span className={cns(cn.reactionsUserTitle)}>User</span>
              <div className={cns(cn.reactionsTitle)}>
                <span className={cns(cn.smallGrayText)}>Importance</span>
                <span className={cns(cn.smallGrayText)}>Passion</span>
                <span className={cns(cn.smallGrayText)}>Favorite</span>
              </div>
            </div>
            {reactions.map((reaction, idx) => {
              const authorId = reaction.authorId
              const isAuthorPerspective = authorId === selectedUserPerspectiveId
              const authorFullName = reaction.authorName

              return (
                <div
                  key={idx}
                  className={cns(cn.reactionRow, isAuthorPerspective && cn.reactionRowActive)}
                  onClick={() => setSelectedUserPerspectiveId(authorId)}
                >
                  <span className={cns(cn.reactionRowUser)}>{authorFullName}</span>
                  <div className={cns(cn.reactionRowReactions)}>
                    {reactionTypes.map((type) => {
                      const authorRating = reactions
                        ?.find((authorReaction) => authorReaction.authorId === authorId)
                        ?.authorRatings?.find((ar) => ar.ratingType === type)
                      return (
                        <UserRatings
                          key={type}
                          problemPublicId={detailsData.problemId}
                          problemVariantId={detailsData.problemVariantId!}
                          rating={
                            typeof authorRating?.rating === 'number' ? authorRating.rating : -1
                          }
                          ratingId={authorRating?.ratingId}
                          ratingType={type}
                          disabled={!isAuthorPerspective}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ProblemDetailsRightSideBar
