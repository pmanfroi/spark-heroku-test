import Tag, {TagVariantsType} from '@/components/Tag'
import ActionText from '@/components/buttons/ActionText'
import {ColorValueHex, Colors} from '@/rest/types'
import cns from '@/utils/classnames'

const GHOST_LENGTH = 5

export interface Option {
  value: string
  label: string
  disabled?: boolean
  textColor?: Colors | ColorValueHex
  bgColor?: Colors | ColorValueHex
}

export interface Props {
  className?: string
  label?: string
  placeholder?: string
  options?: Option[]
  selectedOptions?: Option[]
  onOptionPress?: (option: Option) => void
  disabled?: boolean
  tagVariants?: TagVariantsType
  onClose: () => void
}

//*****************************************************************************
// Components
//*****************************************************************************
const renderGhost = () =>
  Array.from(new Array(GHOST_LENGTH)).map((_, index) => (
    <Tag key={index} className="animate-pulse" color="neutral600" fit="full" />
  ))

const FilterSelect = function ({
  className,
  label,
  options,
  selectedOptions,
  tagVariants,
  onOptionPress,
  onClose,
}: Props) {
  const cn = {
    container: cns('flex flex-col gap-3 rounded-xl bg-neutral-700 p-6', className),
    header: 'flex items-center justify-between',
    label: 'text-sm font-bold text-neutral-300',
    closeText: 'text-2xs text-neutral-300',
    list: 'flex max-h-60 cursor-pointer flex-col items-center gap-2 overflow-y-scroll pr-4',
  }

  return (
    <div className={cn.container}>
      <div className={cn.header}>
        <div className={cn.label}>{label}</div>
        <ActionText onClick={onClose} text="DONE" className={cn.closeText} />
      </div>
      <div className={cn.list}>
        {!options?.length ? renderGhost() : null}
        {options?.map((option) => {
          const isSelected = Boolean(selectedOptions?.find(({value}) => value === option.value))
          return (
            <Tag
              key={option.value}
              label={option.label}
              isHighlighted={isSelected}
              showIcon={isSelected}
              bgColor={isSelected ? option.bgColor : undefined}
              textColor={isSelected ? option.textColor : undefined}
              icon="check"
              onClick={() => onOptionPress?.(option)}
              fit="full"
              {...tagVariants}
            />
          )
        })}
      </div>
    </div>
  )
}

export default FilterSelect
