import {HomeIcon, ArrowLeftIcon} from '@heroicons/react/20/solid'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import UserPanel from '@/components/UserPanel'
import Icon from '@/components/icons/Icon'
import AppLogo from '@/components/ui/AppLogo'
import SearchInput from '@/components/ui/SearchInput'
import {useActiveUser} from '@/state/activeUserState'
import {useProblemFilters, useRootPages} from '@/state/appState'
import cns from '@/utils/classnames'
import {useBasePath} from '@/utils/hooks/useBasePath'

//*****************************************************************************
// Interface
//*****************************************************************************

interface Props {
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************

const AppHeader = ({className}: Props) => {
  const {activeUser} = useActiveUser()
  const {rootPages} = useRootPages()
  const navigate = useNavigate()

  const {problemFilters, setProblemFilters} = useProblemFilters()
  const [searchTerm, setSearchTerm] = useState('')

  const onSearch = (search: string) => {
    setSearchTerm(search)
    setProblemFilters({...problemFilters, search: search.toLowerCase()})
  }

  const basePath = useBasePath()
  const isActiveRoot = Boolean(rootPages.find((page) => page.id === basePath)?.id)

  const onHomeClick = () => {
    navigate('/')
  }

  const onBackClick = () => {
    navigate(-1)
  }

  const cn = {
    root: cns('flex bg-neutral-800', className),
    actionContainer: 'flex justify-center items-center bg-neutral-775 w-20',
    homeIcon: 'text-neutral-400 cursor-pointer h-6 w-6',
    backIcon: 'text-neutral-400 cursor-pointer h-6 w-6',
    logoContainer:
      'flex flex-row gap-3 items-center pl-4 text-white font-semibold text-lg font-semibold',
    searchEntry: 'text-sm text-neutral-400 m-auto bg-neutral-900 w-1/4',
  }

  return (
    <div className={cn.root}>
      <div className={cn.actionContainer}>
        {isActiveRoot ? (
          <Icon Icon={HomeIcon} className={cn.homeIcon} onClick={onHomeClick} />
        ) : (
          <Icon Icon={ArrowLeftIcon} className={cn.backIcon} onClick={onBackClick} />
        )}
      </div>
      <div className={cn.logoContainer}>
        <AppLogo />
        <span>Spark</span>
      </div>
      <SearchInput
        className={cn.searchEntry}
        value={searchTerm}
        placeholder={'Search for ...'}
        onCancel={() => {
          onSearch('')
        }}
        onChange={(e) => {
          onSearch(e.target.value)
        }}
      />
      {activeUser && <UserPanel user={activeUser} />}
    </div>
  )
}

export default AppHeader
