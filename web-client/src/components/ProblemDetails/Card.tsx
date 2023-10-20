import {KeyboardEvent, memo, useEffect, useRef, useState} from 'react'
import twColors from 'tailwindcss/colors'

import Icon from '@/components/icons/Icon'
import {
  useCreateProblemVariant,
  useDeleteProblemVariant,
  useUpdateProblemVariant,
} from '@/rest/problemVariantsRestHooks'
import {ProblemVariant, ProblemVariantType, ResourceTypes} from '@/rest/types'
import {useActiveUser} from '@/state/activeUserState'
import cns from '@/utils/classnames'

import useOutsideClick from '../OutsideClickHandler/useOutsideClickHook'
import AddProblemToolbar, {AddItemDirection} from './AddProblemToolbar'

type Mode = 'edit' | 'delete' | 'new' | 'view'

type CardProps = {
  item: ProblemVariant
  problemPublicId: number
  actionsComponentLeft: React.ReactNode
  isProblemAuthor: boolean
  isProblemVariantAuthor: boolean
  rotateExpandArrow?: boolean
  onPreferredSelectionClick: (id: string) => void
  onExpandClick?: (problemVariantId: string) => void
  onAddItemClick: (fromProblemVariantId: string, direction: AddItemDirection) => void
  onRemoveNewItemClick: () => void
  onCardPress: (props: {problemVariantId: string}) => void
}

const variantTypeText = (type: ProblemVariantType) => {
  if (type === ProblemVariantType.ROOT) {
    return 'ROOT'
  }
  if (type === ProblemVariantType.BROADER) {
    return 'Broader'
  }
  if (type === ProblemVariantType.NARROWER) {
    return 'Narrower'
  }

  return ''
}

const Card = memo(
  ({
    item,
    problemPublicId,
    actionsComponentLeft,
    isProblemAuthor,
    isProblemVariantAuthor,
    rotateExpandArrow,
    onPreferredSelectionClick,
    onExpandClick,
    onAddItemClick,
    onRemoveNewItemClick,
    onCardPress,
  }: CardProps) => {
    const {activeUserCanAccess} = useActiveUser()
    const [selected, setSelected] = useState(false)
    const [cardMode, setCardMode] = useState<Mode>('view')
    const [textareaHeight, setTextareaHeight] = useState<string | null>()

    const activeUserProblemAccess = activeUserCanAccess(ResourceTypes.PROBLEM)

    const canEditProblem = isProblemAuthor
      ? activeUserProblemAccess.updateOwn
      : activeUserProblemAccess.updateAny
    const canEditProblemVariant = isProblemVariantAuthor
      ? activeUserProblemAccess.updateOwn
      : activeUserProblemAccess.updateAny
    const canDeleteProblemVariant = isProblemVariantAuthor
      ? activeUserProblemAccess.deleteOwn
      : activeUserProblemAccess.deleteAny

    const {updateProblemVariant} = useUpdateProblemVariant({
      problemPublicId,
      problemVariantId: item.id,
    })
    const {deleteProblemVariant} = useDeleteProblemVariant({
      problemPublicId,
      problemVariantId: item.id,
    })
    const {createProblemVariant} = useCreateProblemVariant({
      problemPublicId,
    })

    const cardRef = useRef<HTMLDivElement>(null)
    const contentContainerRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
      if (textareaRef.current && (cardMode === 'edit' || cardMode === 'new')) {
        textareaRef.current?.focus()
        textareaRef.current.selectionStart = item.content.length || 0
        textareaRef.current.selectionEnd = item.content.length || 0
      }
    }, [textareaRef.current, cardMode])

    useEffect(() => {
      const isNewItem = item.id.trim().includes('"new":true')
      if (cardMode !== 'new' && isNewItem) {
        setCardMode('new')
      } else if (!isNewItem) {
        setCardMode('view')
      }
    }, [item])

    useEffect(() => {
      if (contentContainerRef.current?.clientHeight && !textareaHeight) {
        const twHeight = `h-[${contentContainerRef.current.clientHeight}px]`
        setTextareaHeight(twHeight)
      }
    }, [contentContainerRef.current?.clientHeight])

    useOutsideClick(cardRef, () => {
      setSelected(false)
    })

    const toggleActive = () => {
      onCardPress({problemVariantId: item.id})
      setSelected((prev) => !prev)
    }

    const toggleCardMode = (mode?: Mode) => {
      if (cardMode === 'new') {
        onRemoveNewItemClick()
      }
      setCardMode(mode || 'view')
    }

    const handleContentSubmit = async () => {
      if (textareaRef.current?.value && textareaRef.current?.value !== item.content) {
        if (cardMode === 'new') {
          handleProblemVariantCreate()
          return
        }
        await updateProblemVariant(
          {
            content: textareaRef.current.value,
          },
          {}
        )
      }
      toggleCardMode()
    }

    const handleProblemVariantDelete = async () => {
      await deleteProblemVariant()
      toggleCardMode()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && event.shiftKey == false) {
        event.preventDefault()
        handleContentSubmit()
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        toggleCardMode()
      }
    }

    const handleProblemVariantCreate = async () => {
      if (!textareaRef.current?.value) return
      const referenceVariantId = JSON.parse(item.id)?.referenceId

      if (!referenceVariantId) {
        console.error('Missing referenceVariantId')
        return
      }

      await createProblemVariant(
        {
          content: textareaRef.current.value,
          type: item.type,
          problemId: item.problemId,
          referenceVariantId,
          direction: JSON.parse(item.id).direction,
        },
        {}
      )
      toggleCardMode()
    }

    const handleConfirmAction = () => {
      if (cardMode === 'new' || cardMode === 'edit') {
        handleContentSubmit()
        return
      }
      handleProblemVariantDelete()
    }

    const handleAddItemClick = (direction: AddItemDirection) => {
      setSelected(false)
      onAddItemClick(item.id, direction)
    }

    const cn = {
      container: 'flex gap-2',
      problemCard: cns(
        'flex w-96 cursor-pointer justify-between rounded-md border border-transparent bg-neutral-700 px-5 py-3 hover:underline hover:brightness-125',
        selected && 'border-white'
      ),
      cardContentContainer: 'flex flex-col gap-2',
      cardHeader: 'flex items-center gap-2',
      variantTypeText: 'text-xs',
      orderText: 'text-xs',
      contentTextContainer: 'pr-5',
      contentText: 'text-sm',
      editCardActionsContainer: 'flex flex-col items-center justify-center gap-3 pt-2 -m-1 pb-8',
      cardActionsContainer: 'flex flex-col items-center justify-center gap-3',
      expandArrow: cns(
        'translate-rotate cursor-pointer duration-300',
        rotateExpandArrow ? 'rotate-180' : 'rotate-0'
      ),
      textarea: cns(
        '-ml-2 w-[19rem] resize-none rounded-md border border-zinc-600 bg-transparent px-2 text-sm leading-relaxed text-zinc-400',
        textareaHeight
      ),
      closeIcon: 'cursor-pointer text-neutral-500 hover:brightness-125',
      enabledIcon: 'cursor-pointer',
      disabledIcon: 'cursor-not-allowed',
    }

    const isRootVariant = item.type === ProblemVariantType.ROOT
    const isPreferredVariant = item.isPreferred

    return (
      <div ref={cardRef} className={cn.container}>
        {actionsComponentLeft}
        <div
          onClick={toggleActive}
          className={cns(
            cn.problemCard,
            isRootVariant && 'border-2 border-neutral-700 bg-transparent'
          )}
        >
          <div className={cn.cardContentContainer}>
            <div className={cn.cardHeader}>
              <div
                onClick={() =>
                  canEditProblem && cardMode !== 'new' && onPreferredSelectionClick(item.id)
                }
              >
                {isPreferredVariant ? (
                  <Icon.CheckCircleChecked
                    highlightOnHover
                    className={cns(canEditProblem ? cn.enabledIcon : cn.disabledIcon)}
                  />
                ) : (
                  <Icon.CheckCircle
                    highlightOnHover
                    className={cns(canEditProblem ? cn.enabledIcon : cn.disabledIcon)}
                  />
                )}
              </div>
              <span className={cns(cn.variantTypeText, isRootVariant && 'underline')}>
                {variantTypeText(item.type)}
              </span>
              <span className={cn.orderText}>{Math.abs(item.order)}</span>
            </div>
            {cardMode === 'edit' || cardMode === 'new' ? (
              <textarea
                ref={textareaRef}
                name="content"
                defaultValue={item.content}
                className={cn.textarea}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <div ref={contentContainerRef} className={cn.contentTextContainer}>
                <span className={cn.contentText}>{item.content}</span>
              </div>
            )}
          </div>

          {cardMode !== 'view' ? (
            <div className={cns(cn.editCardActionsContainer)}>
              <Icon.CheckedIcon
                onClick={handleConfirmAction}
                highlightOnHover
                stroke={twColors.yellow['400']}
                fill={twColors.yellow['400']}
              />
              <Icon.Close className={cn.closeIcon} onClick={() => toggleCardMode()} />
            </div>
          ) : (
            <div className={cn.cardActionsContainer}>
              <Icon.Edit
                onClick={() => {
                  canEditProblemVariant ? toggleCardMode('edit') : null
                }}
                className={cns(canEditProblemVariant ? cn.enabledIcon : cn.disabledIcon)}
                highlightOnHover
                stroke={twColors.neutral['500']}
                fill="transparent"
              />
              {!isRootVariant && !isPreferredVariant ? (
                <Icon.Delete
                  onClick={() => {
                    canDeleteProblemVariant ? toggleCardMode('delete') : null
                  }}
                  className={cns(canDeleteProblemVariant ? cn.enabledIcon : cn.disabledIcon)}
                  highlightOnHover
                />
              ) : null}
              <Icon.Expand onClick={() => onExpandClick?.(item.id)} className={cn.expandArrow} />
            </div>
          )}
        </div>
        <AddProblemToolbar
          isVisible={activeUserProblemAccess.createOwn && selected}
          onAddItemClick={handleAddItemClick}
        />
      </div>
    )
  }
)

export default Card
