import {useEffect} from 'react'

import {useActiveRootPage} from '@/state/appState'

//*****************************************************************************
// Interface
//*****************************************************************************

interface Props {
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************

const Ideas = ({className}: Props) => {
  const {setActiveRootPageId} = useActiveRootPage()
  useEffect(() => setActiveRootPageId('ideas'), [])

  const cn = {
    h1: 'font-bold text-3xl',
  }

  return (
    <div className={className}>
      <h1 className={cn.h1}>Ideas</h1>
    </div>
  )
}

export default Ideas
