import {useEffect, useState, memo} from 'react'

import {Option} from '@/components/select/FilterSelect'
import MainSelect from '@/components/select/MainSelect'
import {User} from '@/rest/types'
import {useGetUsers} from '@/rest/usersRestHooks'
import {useActiveUser} from '@/state/activeUserState'

interface Props {
  currentPerspectiveId?: string | null
  onPerspectiveChange: (userId: string) => void
}

const getPerspectiveOptions = (users: User[], activeUser: User | null): Option[] => {
  return users.map((user) => ({
    label: activeUser?.id === user.id ? 'Mine' : `${user.firstName} ${user.lastName}`,
    value: user.id,
  }))
}

const ContentRight = memo(({currentPerspectiveId, onPerspectiveChange}: Props) => {
  const {activeUser} = useActiveUser()
  const {users} = useGetUsers()
  const [perspective, setPerspective] = useState(activeUser?.id)
  const [perspectiveOptions, setPerspectiveOptions] = useState<Option[]>()
  const handlePerspectiveChange = (e) => {
    setPerspective(e.value)
    onPerspectiveChange?.(e.value)
  }
  useEffect(() => {
    if (users && activeUser) {
      const options = getPerspectiveOptions(users, activeUser)
      setPerspectiveOptions(options)
    }
  }, [users, activeUser])

  useEffect(() => {
    if (currentPerspectiveId) {
      setPerspective((prev) => (prev !== currentPerspectiveId ? currentPerspectiveId : prev))
    }
  }, [currentPerspectiveId])

  return (
    <div>
      <div className="mr-12 flex">
        <MainSelect
          label={'Perspective'}
          placeholder={'Select'}
          entries={perspectiveOptions}
          activeEntryValue={perspective}
          onChange={handlePerspectiveChange}
        />
      </div>
    </div>
  )
})

export default ContentRight
