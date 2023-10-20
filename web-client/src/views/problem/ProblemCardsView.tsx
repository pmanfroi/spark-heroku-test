//*****************************************************************************
// Interface
//*****************************************************************************
import ProblemCard from '@/components/Card'
import {OrderBy, ProblemType} from '@/rest/types'
import cns from '@/utils/classnames'
import { getTags } from '@/utils/labelUtils'
import {orderProblems} from '@/utils/problemSorting'

interface Props {
  problems: ProblemType[]
  orderBy: OrderBy
  perspective?: string
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************

const ProblemCardsView = ({
  problems = [],
  orderBy = OrderBy.CREATION_DATE,
  perspective = '',
  className = '',
}: Props) => {
  const cn = {
    root: cns('mb-8 flex flex-wrap gap-6', className),
  }

  return (
    <div className={cn.root}>
      {orderProblems(orderBy, problems).map((problem) => (
        <ProblemCard key={problem?.publicId} perspective={perspective} tags={getTags(problem)} {...problem} />
      ))}
    </div>
  )
}

export default ProblemCardsView
