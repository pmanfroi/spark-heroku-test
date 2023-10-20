import {useEffect, useState} from 'react'

import Toggle from '@/components/Toggle'
import {Option} from '@/components/select/FilterSelect'
import MainSelect from '@/components/select/MainSelect'
import {OrderBy, User} from '@/rest/types'
import {useGetUsers} from '@/rest/usersRestHooks'
import {useActiveUser} from '@/state/activeUserState'
import {useAppFlow, useProblemFilters} from '@/state/appState'

const orderByOptions = [
  {value: OrderBy.CREATION_DATE, label: 'Creation Date'},
  {value: OrderBy.IMPORTANCE, label: 'Importance'},
  {value: OrderBy.PASSION, label: 'Passion'},
  {value: OrderBy.FAVORITE, label: 'Favorite'},
  {value: OrderBy.STATUS, label: 'Status'},
]

const getPerspectiveOptions = (users: User[], activeUser: User | null): Option[] => {
  return users.map((user) => ({
    label: activeUser?.id === user.id ? 'Mine' : `${user.firstName} ${user.lastName}`,
    value: user.id,
  }))
}

const OrderByAndPerspective = ({perspective, setPerspective}) => {
  const {users} = useGetUsers()

  const {activeUser} = useActiveUser()
  const [perspectiveOptions, setPerspectiveOptions] = useState<Option[]>()
  const {categoriesFlow, setCategoriesFlow} = useAppFlow()

  const [orderBy, setOrderBy] = useState(OrderBy.CREATION_DATE)

  const {problemFilters, setProblemFilters} = useProblemFilters()

  const onOrderByChange = (e) => {
    setOrderBy(e.value)
    setProblemFilters({
      ...problemFilters,
      orderBy: e.value,
    })
  }

  const onPerspectiveChange = (e) => {
    setPerspective(e.value)
    setProblemFilters({
      ...problemFilters,
      perspective: e.value,
    })
  }

  useEffect(() => {
    if (users?.length && activeUser) {
      const options = getPerspectiveOptions(users, activeUser)
      setPerspectiveOptions(options)
    }
  }, [users, activeUser])

  const cn = {
    header: 'flex items-center justify-between pr-12',
    h1: 'font-bold text-3xl self-end ms-2',
    filters: 'flex',
  }

  if (!activeUser) {
    return null
  }

  return (
    <div className={cn.header}>
      <h1 className={cn.h1}>Problems</h1>
      <div className={cn.filters}>
        <MainSelect
          label={'Perspective'}
          placeholder={'Select'}
          entries={perspectiveOptions}
          activeEntryValue={perspective}
          onChange={onPerspectiveChange}
        />
        <MainSelect
          classNames={{mainDiv: 'ms-2'}}
          label={'Order by'}
          placeholder={'Select'}
          entries={orderByOptions}
          activeEntryValue={orderBy}
          onChange={onOrderByChange}
        />
        <Toggle
          label="Categories"
          isOn={categoriesFlow}
          onOnClick={() => setCategoriesFlow(true)}
          onOffClick={() => setCategoriesFlow(false)}
          toggleClassName={'p-1.5'}
          labelClassName={'text-neutral-400 mb-1 text-xs ps-2'}
          className={'ms-2'}
        />
      </div>
    </div>
  )
}

export default OrderByAndPerspective
