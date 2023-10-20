import {atom, useAtom} from 'jotai'
import {useResetAtom, atomWithReset} from 'jotai/utils'
import {values} from 'ramda'

import {Option} from '@/components/select/FilterSelect'
import {ImportanceLevel, OrderBy, PassionLevel} from '@/rest/types'

const rootPages = {
  problems: {id: 'problems', headerText: 'Problems', navigateTo: '/problems'},
  ideas: {id: 'ideas', headerText: 'Ideas', navigateTo: '/ideas'},
  problemSurveys: {id: 'problemSurveys', headerText: 'Surveys', navigateTo: '/problem-surveys'},
  insights: {id: 'insights', headerText: 'Insights', navigateTo: '/insights'},
}

const rootPagesAtom = atom(rootPages)
export const useRootPages = () => {
  const [rootPages] = useAtom(rootPagesAtom)
  return {rootPages: values(rootPages)}
}

const activeRootPageAtomId = atom('problems')
export const useActiveRootPage = () => {
  const [activeRootPageId, setActiveRootPageId] = useAtom(activeRootPageAtomId)
  return {
    setActiveRootPageId,
    activeRootPageId,
    activeRootPage: rootPages[activeRootPageId],
  }
}
const isLoggedInAtom = atom(false)

export const useIsLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom)
  return {isLoggedIn, setIsLoggedIn}
}

type ProblemFilters = {
  favorite: 0 | 1
  categories: Option[]
  labels: Option[]
  createdBy: Option[]
  status: Option[]
  passionReactions: PassionLevel[]
  importanceReactions: ImportanceLevel[]
  perspective: string
  orderBy: OrderBy
  search: string
}

const problemFiltersAtom = atomWithReset<ProblemFilters>({
  favorite: 0,
  categories: [],
  labels: [],
  createdBy: [],
  status: [],
  passionReactions: [],
  importanceReactions: [],
  perspective: '',
  orderBy: OrderBy.CREATION_DATE,
  search: '',
})

export const useProblemFilters = () => {
  const [problemFilters, setProblemFilters] = useAtom(problemFiltersAtom)
  const clearFilters = useResetAtom(problemFiltersAtom)
  return {problemFilters, setProblemFilters, clearFilters}
}

const isCategoriesFlow = atom(true)

export const useAppFlow = () => {
  const [categoriesFlow, setCategoriesFlow] = useAtom(isCategoriesFlow)
  return {categoriesFlow, setCategoriesFlow}
}

type SelectedProblemDetailAtomType = {
  publicProblemId: string
  problemVariantId: string
  subProblemId?: string
}
const selectedProblemDetailAtom = atom<SelectedProblemDetailAtomType | null>(null)
export const useSelectedProblemDetail = () => {
  const [selectedProblemDetail, setSelectedProblemDetail] = useAtom(selectedProblemDetailAtom)
  return {selectedProblemDetail, setSelectedProblemDetail}
}

const selectedUserPerspectiveIdAtom = atom<string | null>(null)
export const useSelectedUserPerspectiveId = () => {
  const [selectedUserPerspectiveId, setSelectedUserPerspectiveId] = useAtom(
    selectedUserPerspectiveIdAtom
  )
  return {selectedUserPerspectiveId, setSelectedUserPerspectiveId}
}

// utils

export const getFilterValues = (filterList: any[] = []) => filterList.map((f) => f.value)
