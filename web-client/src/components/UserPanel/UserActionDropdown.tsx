import OutsideClickHandler from '@/components/OutsideClickHandler'
import {useActiveUser} from '@/state/activeUserState'
import {useIsLoggedIn, useProblemFilters} from '@/state/appState'

interface Props {
  setShowDropdown: (showDropdown: boolean) => void
}

const cn = {
  dropdown: 'absolute top-full z-10 bg-neutral-700 text-white rounded-md p-2 w-3/4 mt-2',
  logout: 'cursor-pointer hover:bg-neutral-600 rounded-md p-2',
}
const UserActionDropdown = (props: Props) => {
  const {clearActiveUser} = useActiveUser()
  const {clearFilters} = useProblemFilters()
  const {setIsLoggedIn} = useIsLoggedIn()
  const {setShowDropdown} = props

  const logout = () => {
    clearActiveUser()
    clearFilters()
    setIsLoggedIn(false)
  }

  return (
    <OutsideClickHandler className={cn.dropdown} onClickOutside={() => setShowDropdown(false)}>
      <p onClick={logout} className={cn.logout}>
        Log Out
      </p>
    </OutsideClickHandler>
  )
}

export default UserActionDropdown
