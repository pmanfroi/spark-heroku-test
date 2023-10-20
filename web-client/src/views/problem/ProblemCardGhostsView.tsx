//*****************************************************************************
// Interface
//*****************************************************************************
import {times} from 'ramda'

import CardGhost from '@/components/Card/CardGhost'
import cns from '@/utils/classnames'

interface Props {
  numToShow: number
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************

const ProblemCardGhostsView = ({numToShow = 8, className}: Props) => {
  const cn = {
    root: cns('flex flex-wrap gap-6', className),
  }

  return (
    <div className={cn.root}>
      {times(
        (key) => (
          <CardGhost {...{key}} />
        ),
        numToShow
      )}
    </div>
  )
}

export default ProblemCardGhostsView
