import {ToastViewport} from '@/components/ui/Toast'
import cns from '@/utils/classnames'

import AppHeader from './AppHeader'
import AppLeftSideBar from './AppLeftSideBar'
import AppMain from './AppMain'
import AppRightSideBar from './AppRightSideBar'

//*****************************************************************************
// Interface
//*****************************************************************************

interface Props {
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************

const AppLayout = ({className}: Props) => {
  const cn = {
    root: cns('flex h-screen flex-col', className),
    header: 'py-4',
    container: 'flex overflow-hidden',
    main: 'flex flex-1 grow-4 overflow-y-scroll',
    rightSideBar: 'flex flex-1 grow-1',
    leftSideBar: 'min-w-20 max-w-20',
  }

  return (
    <div className={cn.root}>
      <AppHeader className={cn.header} />
      <div className={cn.container}>
        <AppLeftSideBar className={cn.leftSideBar} />
        <AppMain className={cn.main} />
        <AppRightSideBar className={cn.rightSideBar} />
      </div>
      <ToastViewport />
    </div>
  )
}

export default AppLayout
