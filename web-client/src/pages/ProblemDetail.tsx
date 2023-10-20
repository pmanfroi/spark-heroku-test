import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

import NotAuthorized from '@/components/NotAuthorized'
import {AddItemDirection} from '@/components/ProblemDetails/AddProblemToolbar'
import Card from '@/components/ProblemDetails/Card'
import CardGhost from '@/components/ProblemDetails/CardGhost'
import ContentLeft from '@/components/ProblemDetails/ContentLeft'
import ContentRight from '@/components/ProblemDetails/ContentRight'
import SubProblemCard from '@/components/ProblemDetails/SubProblemCard'
import UserRating, {SelectedRating} from '@/components/ProblemDetails/UserRating'
import ActionText from '@/components/buttons/ActionText'
import {useUpdatePreferredProblemVariant} from '@/rest/problemVariantsIsPreferredRestHooks'
import {
  useCreateProblemVariantRating,
  useUpdateProblemVariantRating,
} from '@/rest/problemVariantsRatingsRestHooks'
import {useGetProblemByPublicId} from '@/rest/problemsRestHooks'
import {ProblemVariant, ProblemVariantType, ResourceTypes, SubProblem} from '@/rest/types'
import {useActiveUser} from '@/state/activeUserState'
import {useSelectedUserPerspectiveId, useSelectedProblemDetail} from '@/state/appState'
import cns from '@/utils/classnames'

const GHOST_LENGTH = 5
//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************
const ProblemDetail = ({className}: Props) => {
  const {id} = useParams()
  const {activeUser, activeUserPermissions, activeUserCanAccess} = useActiveUser()
  const activeUserId = activeUser?.id
  const {selectedProblemDetail, setSelectedProblemDetail} = useSelectedProblemDetail()
  const {selectedUserPerspectiveId, setSelectedUserPerspectiveId} = useSelectedUserPerspectiveId()
  const activeUserProblemAccess = activeUserCanAccess(ResourceTypes.PROBLEM)

  const {problem, isLoading, isError, error, isRefetchError, refetch, isRefetching} =
    useGetProblemByPublicId(id!, {refetchOnWindowFocus: false, enabled: Boolean(id)})
  const isActiveUserProblemAuthor = problem?.createdBy === activeUser?.id

  const [showSubProblemsForVariantId, setShowSubProblemsForVariantId] = useState<
    string | undefined
  >()
  const [variants, setVariants] = useState<ProblemVariant[]>()
  const isActiveUserPerspective = activeUserId === selectedUserPerspectiveId

  const {updateProblemVariantRating} = useUpdateProblemVariantRating({
    problemPublicId: problem?.publicId,
  })

  const {createProblemVariantRating} = useCreateProblemVariantRating({
    problemPublicId: problem?.publicId,
  })

  const {updatePreferredProblemVariant} = useUpdatePreferredProblemVariant({
    problemPublicId: problem?.publicId,
  })

  useEffect(() => {
    if (activeUser?.id) {
      setSelectedUserPerspectiveId(activeUser.id)
    }
  }, [])

  const {title, problemVariants} = problem || {}
  const subTitle = problemVariants?.find((variant) => variant.type === ProblemVariantType.ROOT)
    ?.content

  useEffect(() => {
    if (problemVariants?.length) {
      setVariants(problemVariants?.sort((a, b) => b.order - a.order))
    }
  }, [problemVariants])

  useEffect(() => {
    if (id && problem?.preferredVariantId && selectedProblemDetail?.publicProblemId !== id) {
      setSelectedProblemDetail({
        publicProblemId: id,
        problemVariantId: problem.preferredVariantId,
      })
    }
  }, [id, problem?.preferredVariantId, selectedProblemDetail, setSelectedProblemDetail])

  useEffect(() => {
    return setSelectedProblemDetail(null)
  }, [setSelectedProblemDetail])

  if (!activeUserProblemAccess.readAny) {
    return (
      <NotAuthorized
        resourceType={ResourceTypes.PROBLEM}
        message="Requires read.any permissions"
        userPermissions={activeUserPermissions}
      />
    )
  }

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
    }
    updateProblemVariantRating(
      {
        id: ratingId,
        rating,
      },
      {}
    )
  }

  const onPreferredSelectionClick = (problemVariantId: string) => {
    updatePreferredProblemVariant(
      {
        id: problemVariantId,
      },
      {}
    )
  }

  if (isError || isRefetchError) {
    console.error('fetchError: ', error)
    return (
      <div className="flex w-full justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-red-600">Something went wrong!</span>
          <ActionText onClick={refetch} text="Try again" />
        </div>
      </div>
    )
  }

  const cn = {
    root: cns('flex flex-1', className),
    container: 'flex w-full flex-col items-center gap-20',
    cardContainer: 'flex flex-col gap-2',
    titleContainer: 'flex flex-col items-center justify-center gap-2 px-10',
    problemTitle: 'text-center text-sm font-bold text-neutral-50',
    variantContent: 'text-center text-2xl text-gray-400',
    itemsContainer: 'flex flex-col gap-4 pb-10',
    subProblemCardContainer: 'flex flex-col items-end gap-2 pb-2',
  }

  const handleSelectRating = (problemVariantId: string) => (selectedRating: SelectedRating) => {
    onSelectRating({problemVariantId, ...selectedRating})
  }

  const toggleSubProblem = (problemVariantId: string) => {
    const problemVariant = problemVariants?.find((variant) => variant.id === problemVariantId)
    if (
      problemVariant &&
      !problemVariant?.subProblems.length &&
      activeUserProblemAccess.createOwn
    ) {
      const idObj = {
        new: true,
        referenceId: null,
        order: 0,
      }
      const newSubProblem: SubProblem = {
        id: JSON.stringify(idObj),
        problemVariantId: problemVariantId,
        content: '',
        order: 0,
        createdBy: activeUserId!,
      }
      const newProblemVariant: ProblemVariant = {
        ...problemVariant,
        subProblems: [newSubProblem],
      }
      setVariants(
        [
          ...(problemVariants?.filter((variant) => variant.id !== problemVariantId) || []),
          newProblemVariant,
        ].sort((a, b) => b.order - a.order)
      )
    }
    setShowSubProblemsForVariantId((prev) =>
      prev !== problemVariantId ? problemVariantId : undefined
    )
  }

  const handleAddProblemVariantClick = (
    fromProblemVariantId: string,
    direction: AddItemDirection
  ) => {
    const existingVariants = [...(problemVariants || [])]
    const fromProblemVariant = existingVariants.find((item) => item.id === fromProblemVariantId)

    if (!fromProblemVariant) return

    // If new item is added below a BROADER (fromProblemVariant.order > 0) or above a NARROWER (fromProblemVariant.order < 0)
    // it should be replace the fromProblemVariant order
    let order = fromProblemVariant.order

    // If new item is added below a NARROWER (fromProblemVariant.order < 0)
    // it should be the next down item in order
    if (direction === AddItemDirection.DOWN && fromProblemVariant.order <= 0) {
      order = fromProblemVariant.order - 1
    }

    // If new item is added above a BROADER (fromProblemVariant.order > 0)
    // it should be the next up item in order
    if (direction === AddItemDirection.UP && fromProblemVariant.order >= 0) {
      order = fromProblemVariant.order + 1
    }

    // Fake id used to identify a new item that's not been pushed to server
    const idObj = {
      new: true,
      referenceId: fromProblemVariant.id,
      direction,
    }

    // Fake item object to render a new item
    const newVariant = {
      id: JSON.stringify(idObj),
      order,
      type: order > 0 ? ProblemVariantType.BROADER : ProblemVariantType.NARROWER,
      isPreferred: false,
      content: '',
      problemId: fromProblemVariant.problemId,
      createdBy: activeUser?.id || fromProblemVariant.createdBy,
      subProblems: [],
    }

    const reorderedVariants = existingVariants.map((variant) => {
      // Do not change ROOT
      if (variant.order === 0) {
        return variant
      }

      let variantOrder = variant.order

      // Reorder BROADER variants that come after the new variant
      if (variantOrder > 0 && order > 0 && variantOrder >= order) {
        variantOrder = variantOrder + 1
      }

      // Reorder NARROWER variants that come after the new variant
      if (variantOrder < 0 && variantOrder <= order && order < 0) {
        variantOrder = variantOrder - 1
      }

      return {
        ...variant,
        order: variantOrder,
      }
    })

    // Reorder the list based on the updated `order` values
    const newVariants = [...reorderedVariants, newVariant].sort((a, b) => b.order - a.order)

    setVariants(newVariants)
  }

  const handleRemoveNewItemClick = () => {
    setVariants(problemVariants?.sort((a, b) => b.order - a.order))
  }

  const handleCardPress = ({
    problemVariantId,
    subProblemId,
  }: {
    problemVariantId: string
    subProblemId?: string
  }) => {
    if (
      id &&
      (problemVariantId !== selectedProblemDetail?.problemVariantId ||
        subProblemId !== selectedProblemDetail?.subProblemId)
    ) {
      setSelectedProblemDetail({
        publicProblemId: id,
        problemVariantId,
        subProblemId,
      })
    }
  }

  const handleAddSubProblemClick = (fromSubProblemId: string, direction: AddItemDirection) => {
    const existingVariants = [...(problemVariants || [])]
    const fromSubProblem = existingVariants
      .map((variant) => {
        const subProblem = variant.subProblems.find(
          (subProblemItem) => subProblemItem.id === fromSubProblemId
        )
        return subProblem
      })
      .filter(Boolean)[0]

    if (!fromSubProblem) return

    const problemVariant = existingVariants.find(
      (variant) => variant.id === fromSubProblem.problemVariantId
    )!

    // If new item is added below a subProblem.order it should be replace the subProblem order
    // If new item is added above a subProblem it should be the next down item in order
    const order =
      direction === AddItemDirection.UP ? fromSubProblem.order : fromSubProblem.order + 1

    // Fake id used to identify a new item that's not been pushed to server
    const idObj = {
      new: true,
      referenceId: fromSubProblem.id,
      direction,
    }

    // Fake item object to render a new item
    const newSubProblem: SubProblem = {
      ...fromSubProblem,
      id: JSON.stringify(idObj),
      content: '',
      order,
    }

    const reorderedSubProblems = problemVariant.subProblems.map((subProblem) => {
      let subProblemOrder = subProblem.order

      if (subProblemOrder >= order) {
        subProblemOrder = subProblemOrder + 1
      }

      return {
        ...subProblem,
        order: subProblemOrder,
      }
    })

    // Reorder the list based on the updated `order` values
    const newSubProblems = [...reorderedSubProblems, newSubProblem].sort(
      (a, b) => a.order - b.order
    )
    const newVariant: ProblemVariant = {
      ...problemVariant,
      subProblems: newSubProblems,
    }

    const newVariants = [
      ...existingVariants.filter((existing) => existing.id !== problemVariant.id),
      newVariant,
    ].sort((a, b) => b.order - a.order)

    setVariants(newVariants)
  }

  return (
    <div className={cn.root}>
      <ContentLeft />
      {(!problem && (isLoading || isRefetching)) || !selectedUserPerspectiveId ? (
        <CardGhost length={GHOST_LENGTH} />
      ) : (
        <div className={cn.container}>
          <div className={cn.titleContainer}>
            <span className={cn.problemTitle}>{title}</span>
            <span className={cn.variantContent}>{subTitle}</span>
          </div>
          <div className={cn.itemsContainer}>
            {variants?.map((variant, index) => {
              const hasSubProblems = Boolean(variant?.subProblems?.length)
              const ratings =
                variant?.ratings?.filter(
                  (item) =>
                    item.problemVariantId === variant.id &&
                    item.userId === selectedUserPerspectiveId
                ) || []

              const isNewItem = variant.id.trim().includes('"new":true')
              const isActiveUserProblemVariantAuthor = variant?.createdBy === activeUser?.id
              return (
                <div key={index} className={cn.cardContainer}>
                  <Card
                    item={variant}
                    problemPublicId={problem?.publicId}
                    onPreferredSelectionClick={onPreferredSelectionClick}
                    isProblemAuthor={isActiveUserProblemAuthor}
                    isProblemVariantAuthor={isActiveUserProblemVariantAuthor}
                    onExpandClick={toggleSubProblem}
                    rotateExpandArrow={showSubProblemsForVariantId === variant.id}
                    onAddItemClick={handleAddProblemVariantClick}
                    onRemoveNewItemClick={handleRemoveNewItemClick}
                    onCardPress={handleCardPress}
                    actionsComponentLeft={
                      <UserRating
                        problemVariantId={variant.id}
                        ratings={ratings}
                        onSelectRating={handleSelectRating(variant.id)}
                        disabled={!isActiveUserPerspective || isNewItem}
                      />
                    }
                  />
                  <div
                    className={cns(
                      cn.subProblemCardContainer,
                      'transition-all duration-300',
                      hasSubProblems && showSubProblemsForVariantId === variant.id
                        ? 'translate-y-2'
                        : 'hidden'
                    )}
                  >
                    {variant.subProblems?.map((subProblem) => {
                      const isActiveUserSubProblemAuthor = subProblem?.createdBy === activeUser?.id
                      return (
                        <SubProblemCard
                          key={subProblem.id}
                          item={subProblem}
                          problemPublicId={problem?.publicId}
                          selected={false}
                          isProblemAuthor={isActiveUserProblemAuthor}
                          isSubProblemAuthor={isActiveUserSubProblemAuthor}
                          onAddItemClick={handleAddSubProblemClick}
                          onRemoveNewItemClick={handleRemoveNewItemClick}
                          onCardPress={handleCardPress}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <ContentRight
        currentPerspectiveId={selectedUserPerspectiveId}
        onPerspectiveChange={setSelectedUserPerspectiveId}
      />
    </div>
  )
}

export default ProblemDetail
