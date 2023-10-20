import {useState} from 'react'

import Tag from '@/components/Tag'
import EditIcon from '@/components/icons/EditIcon'
import {IconSize} from '@/components/icons/types'
import Section from '@/components/rightSideBar/RightSideSection'
import FilterSelect, {Option} from '@/components/select/FilterSelect'
import {Colors, User} from '@/rest/types'
import {useGetUsers} from '@/rest/usersRestHooks'
import {useActiveUser} from '@/state/activeUserState'
import {useProblemFilters} from '@/state/appState'
import cns from '@/utils/classnames'

interface Props {
  className?: string
}

const getCreatedByOptions = (users: User[], activeUser: User | null): Option[] => {
  return users.map((user) => ({
    label: `${user.firstName} ${user.lastName}` + `${activeUser?.id === user.id ? ' (Me)' : ''}`,
    value: user.id,
    bgColor: Colors.PURPLE,
  }))
}

const CreatedByFilter = ({className}: Props) => {
  const {users} = useGetUsers()
  const {activeUser} = useActiveUser()
  const [isSelectVisible, setIsSelectVisible] = useState(false)
  const [createdByOptions, setCreatedByOptions] = useState<Option[]>()
  const {problemFilters, setProblemFilters} = useProblemFilters()
  const cn = {
    root: cns(
      'absolute right-0 top-16 flex max-h-screen flex-col gap-4 overflow-y-scroll border-t-2 border-neutral-900 bg-neutral-800 px-5 pb-20 pt-8',
      className
    ),
    menu: cns(
      'absolute z-10 w-80 overflow-hidden px-4 transition-all duration-300',
      isSelectVisible ? 'h-80 ease-in' : 'h-0 ease-out'
    ),
    list: 'flex max-h-32 flex-col gap-2 overflow-y-scroll pr-4',
    emptyMessage: 'mx-2 text-2xs text-neutral-500',
  }

  const fetchOptions = () => {
    const createdByOptionsData = getCreatedByOptions(users, activeUser)
    setCreatedByOptions(createdByOptionsData)
  }

  const toggleCreatedByVisibility = () => {
    setIsSelectVisible((prev) => !prev)
  }

  const openFilterSelect = () => {
    fetchOptions()
    toggleCreatedByVisibility()
  }

  const handleOptionPress = (option: Option) => {
    const currentOptions = problemFilters.createdBy || []
    const exists = problemFilters.createdBy?.find(({value}) => value === option.value)
    const newOptions = exists
      ? currentOptions.filter(({value}) => value !== option.value)
      : [...currentOptions, option]
    setProblemFilters({
      ...problemFilters,
      createdBy: newOptions,
    })
  }

  return (
    <Section
      title={
        <div className="flex justify-between">
          <Section.Title>Created By</Section.Title>
          <EditIcon onClick={openFilterSelect} size={IconSize.sm} />
        </div>
      }
    >
      <div className={cn.menu}>
        <FilterSelect
          className="max-h-64"
          label="Select Created By to View"
          placeholder="Created By"
          onOptionPress={handleOptionPress}
          onClose={toggleCreatedByVisibility}
          options={createdByOptions}
          selectedOptions={problemFilters.createdBy}
        />
      </div>
      <div className={cn.list}>
        {!problemFilters.createdBy?.length ? (
          <span className={cn.emptyMessage}>Unfiltered</span>
        ) : null}
        {problemFilters.createdBy?.map((option) => (
          <Tag
            key={option.value}
            label={option.label}
            isHighlighted
            showIcon
            icon="close"
            onClick={() => handleOptionPress(option)}
            fit="full"
            bgColor={option.bgColor}
          />
        ))}
      </div>
    </Section>
  )
}

export default CreatedByFilter
