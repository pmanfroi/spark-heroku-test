import {Link} from 'react-router-dom'

import {useRootPages, useActiveRootPage} from '@/state/appState'
import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************

interface Props {
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************

const AppLeftSideBar = ({className}: Props) => {
  const {activeRootPage} = useActiveRootPage()
  const {rootPages} = useRootPages()

  const isActive = (page?: {id: string}) => page?.id === activeRootPage?.id

  const cn = {
    root: cns(
      'flex min-h-screen justify-center border-t-2 border-neutral-900 bg-neutral-800',
      className
    ),
    menuEntriesContainer: 'mt-8 flex flex-col gap-3 items-center',
  }

  return (
    <div className={cn.root}>
      <div className={cn.menuEntriesContainer}>
        {rootPages.map((page, index) => (
          <SideBarEntry key={index} active={isActive(page)} {...page} />
        ))}
      </div>
    </div>
  )
}

export default AppLeftSideBar

//*****************************************************************************
// Helper Components
//*****************************************************************************

type SideBarEntryPropTypes = {
  onClick?: (headerText: string) => void
  active?: boolean
  headerText: string
  navigateTo?: string
  children?: React.ReactNode
  className?: string // applied to root container
}

const SideBarEntry = (props: SideBarEntryPropTypes) => {
  const {onClick, active = false, headerText, navigateTo = '/', children, className} = props
  const text = (isActive: boolean) => (isActive ? 'text-app-yellow' : 'text-neutral-400')
  const cn = {
    root: cns('items-center rounded-lg', text(active), className),
    entry: 'hover:brightness-125 hover:cursor-pointer text-2xs font-semibold',
  }

  return (
    <div className={cn.root}>
      <Link className={cn.entry} to={navigateTo} onClick={() => onClick?.(headerText)}>
        {headerText}
      </Link>
      {children}
    </div>
  )
}
