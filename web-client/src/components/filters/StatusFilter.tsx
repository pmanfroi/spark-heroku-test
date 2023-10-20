import {useState} from 'react'

import Tag from '@/components/Tag'
import EditIcon from '@/components/icons/EditIcon'
import {IconSize} from '@/components/icons/types'
import Section from '@/components/rightSideBar/RightSideSection'
import FilterSelect, {Option} from '@/components/select/FilterSelect'
import {Colors, ProblemStatus} from '@/rest/types'
import {useProblemFilters} from '@/state/appState'
import cns from '@/utils/classnames'

interface Props {
  className?: string
}

const getStatusOptions = (): Option[] => {
  return Object.entries(ProblemStatus).map(([key, value]) => ({
    label: value.split('_').join(' '),
    value: key,
    color: Colors.SLATE,
  }))
}

const StatusFilter = ({className}: Props) => {
  const {problemFilters, setProblemFilters} = useProblemFilters()
  const [isSelectVisible, setIsSelectVisible] = useState(false)
  const [options, setOptions] = useState<Option[]>()
  const cn = {
    root: cns(
      'absolute right-0 top-16 flex max-h-screen flex-col gap-4 overflow-y-scroll border-t-2 border-neutral-900 bg-neutral-800 px-5 pb-20 pt-8',
      className
    ),
    categoriesMenu: cns(
      'absolute z-10 w-80 overflow-hidden px-4 transition-all duration-300',
      isSelectVisible ? 'h-80 ease-in' : 'h-0 ease-out'
    ),
    categoriesList: 'flex max-h-32 flex-col gap-2 overflow-y-scroll pr-4',
    emptyMessage: 'mx-2 text-2xs text-neutral-500',
  }

  const fetchOptions = () => {
    const OptionsData = getStatusOptions()
    setOptions(OptionsData)
  }

  const toggleStatusVisibility = () => {
    setIsSelectVisible((prev) => !prev)
  }

  const openFilterSelect = () => {
    fetchOptions()
    toggleStatusVisibility()
  }

  const handleOptionPress = (option: Option) => {
    const currentOptions = problemFilters.status || []
    const exists = problemFilters.status?.find(({value}) => value === option.value)
    const newOptions = exists
      ? currentOptions.filter(({value}) => value !== option.value)
      : [...currentOptions, option]
    setProblemFilters({
      ...problemFilters,
      status: newOptions,
    })
  }

  return (
    <Section
      title={
        <div className="flex justify-between">
          <Section.Title>Status</Section.Title>
          <EditIcon onClick={openFilterSelect} size={IconSize.sm} />
        </div>
      }
    >
      <div className={cn.categoriesMenu}>
        <FilterSelect
          className="max-h-64"
          label="Select Status to View"
          placeholder="Status"
          onOptionPress={handleOptionPress}
          onClose={toggleStatusVisibility}
          options={options}
          selectedOptions={problemFilters.status}
        />
      </div>
      <div className={cn.categoriesList}>
        {!problemFilters.status?.length ? (
          <span className={cn.emptyMessage}>Unfiltered</span>
        ) : null}
        {problemFilters.status?.map((option) => (
          <Tag
            key={option.value}
            label={option.label}
            isHighlighted
            showIcon
            icon="close"
            onClick={() => handleOptionPress(option)}
            fit="full"
          />
        ))}
      </div>
    </Section>
  )
}

export default StatusFilter
