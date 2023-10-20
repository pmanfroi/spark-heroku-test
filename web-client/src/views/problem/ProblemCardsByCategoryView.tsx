import ProblemCard from '@/components/Card'
import PlusIcon from '@/components/icons/PlusIcon'
import {IconSize} from '@/components/icons/types'
import {CategoryWithProblems, OrderBy, ResourceTypes} from '@/rest/types'
import {useActiveUser} from '@/state/activeUserState'
import cns from '@/utils/classnames'
import { getTags } from '@/utils/labelUtils'
import {orderProblems} from '@/utils/problemSorting'

//*****************************************************************************
// Interface
//*****************************************************************************

type OnCreateClickFn = (categoryId: string) => void

interface Props {
  categoriesWithProblems: CategoryWithProblems[]
  orderBy: OrderBy
  perspective?: string
  onCreateClick?: undefined | OnCreateClickFn // if supplied, create per category enabled
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************

const ProblemCardsByCategoryView = ({
  categoriesWithProblems = [],
  orderBy = OrderBy.CREATION_DATE,
  perspective = '',
  onCreateClick = undefined,
  className = '',
}: Props) => {
  const {activeUserCanAccess} = useActiveUser()
  const activeUserCanCreateProblem = activeUserCanAccess(ResourceTypes.PROBLEM).createAnyOrOwn

  const cn = {
    root: cns('flex flex-col gap-6', className),
    categoryName: 'mb-1 ms-2 me-2 text-xl text-app-gray-400',
    problemContainer: 'flex flex-wrap gap-6 mb-8',
    createIcon: 'cursor-pointer flex flex-column items-center',
  }

  return (
    <div className={cn.root}>
      {categoriesWithProblems.map(({category, problems}) => (
        <div key={category.id}>
          <div className={cn.categoryName}>{category.name}</div>
          <div className={cn.problemContainer}>
            {orderProblems(orderBy, problems).map((problem) => (
              <ProblemCard key={problem?.publicId} perspective={perspective} tags={getTags(problem)} {...problem} />
            ))}
            {onCreateClick && activeUserCanCreateProblem && (
              <PlusIcon
                className={cn.createIcon}
                size={IconSize.lg}
                onClick={() => onCreateClick(category.id)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProblemCardsByCategoryView
