import {useState} from 'react'

import {ReactComponent as ChevronDown} from '@/assets/chevron-down.svg'
import {ReactComponent as UserIcon} from '@/assets/user.svg'
import UserActionDropdown from '@/components/UserPanel/UserActionDropdown'
import UserInfo from '@/components/UserPanel/UserInfo'

interface User {
  firstName: string
  lastName: string
  email: string
}

interface Props {
  user: User
}

const cn = {
  root: 'flex items-center justify-between gap-3 relative pr-3',
  chevron: 'cursor-pointer',
}

const UserPanel = (props: Props) => {
  const {user} = props

  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className={cn.root}>
      <UserIcon />
      <UserInfo firstName={user.firstName} lastName={user.lastName} email={user.email} />
      <ChevronDown onClick={() => setShowDropdown(true)} className={cn.chevron} />
      {showDropdown && <UserActionDropdown setShowDropdown={setShowDropdown} />}
    </div>
  )
}

export default UserPanel
