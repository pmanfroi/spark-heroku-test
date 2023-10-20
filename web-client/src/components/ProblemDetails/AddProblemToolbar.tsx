import cns from '@/utils/classnames'

import Icon from '../icons/Icon'

export enum AddItemDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

interface Props {
  isVisible: boolean
  className?: string
  onAddItemClick: (direction: AddItemDirection) => void
}

const AddProblemToolbar = ({isVisible = false, className, onAddItemClick}: Props) => {
  const cn = {
    cardHiddenActionsContainer: cns(
      'flex w-10 flex-col items-center justify-center gap-3 rounded-md bg-neutral-700 opacity-0 transition-opacity duration-200 ease-linear',
      className,
      isVisible ? 'opacity-1' : '-z-10'
    ),
  }

  return (
    <div className={cn.cardHiddenActionsContainer}>
      <Icon.ArrowPlus highlightOnHover onClick={() => onAddItemClick(AddItemDirection.UP)} />
      <Icon.ArrowPlus
        highlightOnHover
        onClick={() => onAddItemClick(AddItemDirection.DOWN)}
        className="rotate-180"
      />
    </div>
  )
}

export default AddProblemToolbar
