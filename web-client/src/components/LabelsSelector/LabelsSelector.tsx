import {useState} from 'react'

import Tag from '@/components/Tag'
import EditIcon from '@/components/icons/EditIcon'
import {IconSize} from '@/components/icons/types'
import Section from '@/components/rightSideBar/RightSideSection'
import FilterSelect, {Option} from '@/components/select/FilterSelect'
import {useGetLabels} from '@/rest/labelsRestHookst'
import cns from '@/utils/classnames'
import {getLabelOptions} from '@/utils/labelUtils'

interface Props {
  onSelectOption: (option: Option[]) => void
  selectedOptions: Option[]
  emptyText?: string
  className?: string
  disabled?: boolean
}

const LabelsSelector = ({
  className,
  disabled,
  selectedOptions,
  emptyText = 'Unfiltered',
  onSelectOption,
}: Props) => {
  const [isSelectVisible, setIsSelectVisible] = useState(false)
  const [labelOptions, setLabelOptions] = useState<Option[]>()
  const {labels} = useGetLabels()

  const cn = {
    labelsMenu: cns(
      'absolute z-10 w-80 overflow-hidden px-4 transition-all duration-300',
      isSelectVisible ? 'h-80 ease-in' : 'h-0 ease-out',
      className
    ),
    labelsList: 'flex max-h-32 flex-col gap-2 overflow-y-scroll pr-4',
    emptyMessage: 'mx-2 text-2xs text-neutral-500',
    editIcon: disabled ? 'cursor-not-allowed' : 'cursor-pointer',
  }

  const fetchOptions = () => {
    const labelOptionsData = getLabelOptions(labels)
    setLabelOptions(labelOptionsData)
  }

  const toggleLabelsVisible = () => {
    setIsSelectVisible((prev) => !prev)
  }

  const openFilterSelect = () => {
    if (disabled) return
    fetchOptions()
    toggleLabelsVisible()
  }

  const handleOptionPress = (option: Option) => {
    const exists = selectedOptions?.find(({value}) => value === option.value)
    const newOptions = exists
      ? selectedOptions.filter(({value}) => value !== option.value)
      : [...selectedOptions, option]
    onSelectOption(newOptions)
  }

  return (
    <Section
      title={
        <div className="flex justify-between">
          <Section.Title>Labels</Section.Title>
          <EditIcon className={cn.editIcon} onClick={openFilterSelect} size={IconSize.sm} />
        </div>
      }
    >
      <div className={cn.labelsMenu}>
        <FilterSelect
          className="max-h-64"
          label="Select Labels to View"
          placeholder="Labels"
          disabled={disabled}
          onOptionPress={handleOptionPress}
          onClose={toggleLabelsVisible}
          options={labelOptions}
          selectedOptions={selectedOptions}
        />
      </div>
      <div className={cn.labelsList}>
        {!selectedOptions?.length ? <span className={cn.emptyMessage}>{emptyText}</span> : null}
        {selectedOptions?.map((option) => (
          <Tag
            key={option.value}
            label={option.label}
            isHighlighted
            showIcon
            bgColor={option.bgColor}
            textColor={option.textColor}
            icon="close"
            onClick={() => !disabled && handleOptionPress(option)}
            fit="full"
          />
        ))}
      </div>
    </Section>
  )
}

export default LabelsSelector
