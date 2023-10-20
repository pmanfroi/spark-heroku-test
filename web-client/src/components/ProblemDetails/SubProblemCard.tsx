import {KeyboardEvent, memo, useEffect, useRef, useState} from 'react'
import twColors from 'tailwindcss/colors'

import Icon from '@/components/icons/Icon'
import {
  useCreateSubProblem,
  useDeleteSubProblem,
  useUpdateSubProblem,
} from '@/rest/subProblemsRestHooks'
import {ResourceTypes, SubProblem} from '@/rest/types'
import {useActiveUser} from '@/state/activeUserState'
import cns from '@/utils/classnames'

import useOutsideClick from '../OutsideClickHandler/useOutsideClickHook'
import AddProblemToolbar, {AddItemDirection} from './AddProblemToolbar'

type Mode = 'edit' | 'delete' | 'new' | 'view'

type Props = {
  item: SubProblem
  selected: boolean
  problemPublicId: number
  isProblemAuthor: boolean
  isSubProblemAuthor: boolean
  onAddItemClick: (fromSubProblemId: string, direction: AddItemDirection) => void
  onRemoveNewItemClick: () => void
  onCardPress: (props: {problemVariantId: string; subProblemId?: string}) => void
}

const SubProblemCard = memo(
  ({
    item,
    problemPublicId,
    isSubProblemAuthor,
    onAddItemClick,
    onRemoveNewItemClick,
    onCardPress,
  }: Props) => {
    const {activeUserCanAccess} = useActiveUser()
    const [selected, setSelected] = useState(false)
    const [cardMode, setCardMode] = useState<Mode>('view')
    const [textareaHeight, setTextareaHeight] = useState<string | null>()

    const activeUserSubProblemAccess = activeUserCanAccess(ResourceTypes.PROBLEM)

    const canEdit = isSubProblemAuthor
      ? activeUserSubProblemAccess.updateOwn
      : activeUserSubProblemAccess.updateAny
    const canDelete = isSubProblemAuthor
      ? activeUserSubProblemAccess.deleteOwn
      : activeUserSubProblemAccess.deleteAny

    const {updateSubProblem} = useUpdateSubProblem({
      problemPublicId,
      subProblemId: item.id,
      problemVariantId: item.problemVariantId,
    })
    const {deleteSubProblem} = useDeleteSubProblem({
      problemPublicId,
      subProblemId: item.id,
      problemVariantId: item.problemVariantId,
    })
    const {createSubProblem} = useCreateSubProblem({
      problemPublicId,
      problemVariantId: item.problemVariantId,
    })

    const cardRef = useRef<HTMLDivElement>(null)
    const contentContainerRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

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
        const twHeight = `h-[${contentContainerRef.current?.clientHeight}px]`
        setTextareaHeight(twHeight)
      }
    }, [contentContainerRef.current?.clientHeight])

    useEffect(() => {
      if (textareaRef.current && (cardMode === 'edit' || cardMode === 'new')) {
        textareaRef.current?.focus()
        textareaRef.current.selectionStart = item.content.length || 0
        textareaRef.current.selectionEnd = item.content.length || 0
      }
    }, [textareaRef.current, cardMode])

    useOutsideClick(cardRef, () => {
      setSelected(false)
    })

    const toggleActive = () => {
      onCardPress({problemVariantId: item.problemVariantId, subProblemId: item.id})
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
          handleSubProblemCreate()
          return
        }
        await updateSubProblem(
          {
            content: textareaRef.current.value,
          },
          {}
        )
      }
      toggleCardMode()
    }

    const handleSubProblemDelete = async () => {
      await deleteSubProblem()
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

    const handleSubProblemCreate = async () => {
      if (!textareaRef.current?.value) return
      const referenceSubProblemId = JSON.parse(item.id)?.referenceId

      await createSubProblem(
        {
          content: textareaRef.current.value,
          reference: referenceSubProblemId,
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
      handleSubProblemDelete()
    }

    const handleAddItemClick = (direction: AddItemDirection) => {
      setSelected(false)
      onAddItemClick(item.id, direction)
    }

    const isFirstNew = item.id.trim().includes('"new":true') && item.id.trim().includes('"order":0')

    const cn = {
      container: 'flex gap-2',
      subProblemCard: cns(
        'flex w-[23rem] cursor-pointer justify-between rounded-md border border-transparent bg-neutral-800 px-5 py-3 hover:underline hover:brightness-125',
        selected && 'border-neutral-400'
      ),
      cardContentContainer: 'flex flex-col gap-2',
      orderText: 'text-xs text-neutral-600',
      contentTextContainer: 'text-neutral-500 pr-5',
      contentText: 'text-sm',
      cardActionsContainer: 'flex flex-col items-center justify-center gap-2',
      addProblemToolbar: 'bg-neutral-800',
      editCardActionsContainer: 'flex flex-col items-center justify-center gap-2 pt-1 -m-1',
      textarea: cns(
        '-ml-2 w-[19rem] resize-none rounded-md border border-zinc-600 bg-transparent px-2 pb-6 text-sm leading-relaxed text-zinc-400',
        textareaHeight
      ),
      closeIcon: cns(
        '-mb-1 cursor-pointer text-neutral-500 hover:brightness-125',
        isFirstNew && '-z-10 opacity-0'
      ),
      enabledIcon: 'cursor-pointer',
      disabledIcon: 'cursor-not-allowed',
    }

    return (
      <div className={cn.container} ref={cardRef}>
        <div className={cn.subProblemCard} onClick={toggleActive}>
          <div className={cn.cardContentContainer}>
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
              <div className={cn.orderText}>{`SP${item.order}`}</div>
            </div>
          ) : (
            <div className={cn.cardActionsContainer}>
              <Icon.Edit
                onClick={() => {
                  canEdit ? toggleCardMode('edit') : null
                }}
                className={cns(canEdit ? cn.enabledIcon : cn.disabledIcon)}
                highlightOnHover
                stroke={twColors.neutral['500']}
                fill="transparent"
              />
              <Icon.Delete
                onClick={() => {
                  canDelete ? toggleCardMode('delete') : null
                }}
                className={cns(canDelete ? cn.enabledIcon : cn.disabledIcon)}
                highlightOnHover
              />
              <div className={cn.orderText}>{`SP${item.order + 1}`}</div>
            </div>
          )}
        </div>
        <AddProblemToolbar
          className={cn.addProblemToolbar}
          isVisible={activeUserSubProblemAccess.createOwn && selected}
          onAddItemClick={handleAddItemClick}
        />
      </div>
    )
  }
)

export default SubProblemCard
