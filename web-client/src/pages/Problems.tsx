import {useEffect, useState} from 'react'

import Error from '@/components/Error'
import AddProblemModal from '@/components/Modal/AddProblemModal'
import NotAuthorized from '@/components/NotAuthorized'
import OrderByAndPerspective from '@/components/filters'
import {useGetProblemCategories} from '@/rest/categoriesRestHooks'
import {useGetProblems} from '@/rest/problemsRestHooks'
import {ResourceTypes} from '@/rest/types'
import {useActiveUser} from '@/state/activeUserState'
import {useActiveRootPage, useAppFlow, useProblemFilters} from '@/state/appState'
import cns from '@/utils/classnames'
import {filterProblems} from '@/utils/problemFilters'
import {groupProblemsByCategory} from '@/utils/problemUtils'
import ProblemCardGhostsView from '@/views/problem/ProblemCardGhostsView'
import ProblemCardsByCategoryView from '@/views/problem/ProblemCardsByCategoryView'
import ProblemCardsView from '@/views/problem/ProblemCardsView'

//*****************************************************************************
// Component
//*****************************************************************************

const Problems = () => {
  const {setActiveRootPageId} = useActiveRootPage()
  useEffect(() => setActiveRootPageId('problems'), [setActiveRootPageId])

  const [perspective, setPerspective] = useState<string>()
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState('')

  const {categoriesFlow} = useAppFlow() // TODO: should go away, need state (show categories or not)
  const {problemFilters} = useProblemFilters()

  const {categories, ...categoriesGetRsp} = useGetProblemCategories()
  const {problems, ...problemGetRsp} = useGetProblems({
    queryParams: {perspective: problemFilters.perspective},
  })

  // User and permissions stuff
  const {activeUser, activeUserPermissions, activeUserCanAccess} = useActiveUser()
  const activeUserProblemAccess = activeUserCanAccess(ResourceTypes.PROBLEM)

  useEffect(() => {
    if (activeUser?.id) {
      setPerspective(activeUser.id)
    }
  }, [activeUser?.id])

  useEffect(() => {
    problemGetRsp.refetch()
  }, [problemFilters.perspective])

  // @ts-ignore
  for (const {type, isError, error} of [
    {type: 'Problem Categories', ...categoriesGetRsp},
    {type: 'Problems', ...problemGetRsp},
  ]) {
    if (isError) return <Error op={`loading ${type}`} error={error} />
  }

  // Active User must have permissions to read problems
  if (!activeUserProblemAccess.readAny) {
    return (
      <NotAuthorized
        resourceType={ResourceTypes.PROBLEM}
        message="Requires read.any permissions"
        userPermissions={activeUserPermissions}
      />
    )
  }

  // Show gohsts while loading
  for (const {isLoading} of [categoriesGetRsp, problemGetRsp]) {
    if (isLoading) return <ProblemCardGhostsView numToShow={8} className="mt-5" />
  }

  // OK if we get here, we have everything we need
  const filteredProblems = filterProblems(problems, problemFilters)

  const categoriesGroupedByProblem = groupProblemsByCategory(categories, filteredProblems)

  const nonEmptyCategoriesWithProblems = categoriesGroupedByProblem.filter(
    (cat) => cat?.problems?.length > 0
  )

  const emptyCatagories = categoriesGroupedByProblem
    .filter((cat) => cat?.problems?.length === 0)
    .map(({category}) => category)

  const onProblemCreateClick = (categoryId: string) => setSelectedCategoryForModal(categoryId)

  const cn = {
    container: cns('mb-10 flex flex-1 flex-col gap-10'),
    categoryName: 'mb-1 ms-2 me-2 text-xl text-app-gray-400',
    content: 'flex flex-wrap gap-6 mb-8',
  }

  return (
    <div className={cn.container}>
      <OrderByAndPerspective perspective={perspective} setPerspective={setPerspective} />
      {categoriesFlow && (
        <>
          <ProblemCardsByCategoryView
            categoriesWithProblems={nonEmptyCategoriesWithProblems}
            orderBy={problemFilters.orderBy}
            perspective={perspective}
            onCreateClick={onProblemCreateClick}
          />
          <EmptyCatagories {...{emptyCatagories}} />
        </>
      )}

      {!categoriesFlow && (
        <ProblemCardsView
          problems={filteredProblems}
          orderBy={problemFilters.orderBy}
          perspective={perspective}
        />
      )}
      <AddProblemModal
        modalIsOpen={!!selectedCategoryForModal}
        defaultCategory={selectedCategoryForModal}
        onModalClose={() => setSelectedCategoryForModal('')}
      />
    </div>
  )
}

export default Problems

//*****************************************************************************
// Helpers
//*****************************************************************************

interface EmptyCatagoriesProps {
  emptyCatagories: any[]
}

const EmptyCatagories = ({emptyCatagories = []}: EmptyCatagoriesProps) => {
  const cn = {
    root: 'mt-4 pt-4 border-t border-app-gray-700',
    title: 'text-xl text-app-gray-500',
    subTitle: 'mb-4 text-sm text-app-gray-600',
    categoryName: 'text-sm text-app-gray-500',
  }

  return (
    <div className={cn.root}>
      <div className={cn.title}>Categories Without Problems</div>
      <div className={cn.subTitle}>
        Based on current filters, these categories have no associated problems
      </div>
      {emptyCatagories.map((category: any, idx: number) => (
        <div className={cn.categoryName} key={idx}>
          {category.name}
        </div>
      ))}
    </div>
  )
}
