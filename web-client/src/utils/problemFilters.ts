// @ts-nocheck
import {any, append, curry, pipe, toLower} from 'ramda'

import {ProblemType, PassionLevel, ImportanceLevel} from '@/rest/types'
import {ProblemFilters} from '@/state/appState'

import {appendIf, reflect} from './generalUtils'
import {getLabelIdList, getProblemCategoryIdList} from './problemUtils'

/*
  Given a list of problems, and a set of filters,
  returns a list of problems that satisfy the set of filters
*/
export const filterProblems = (
  problems: ProblemType[],
  problemFilters: ProblemFilters
): ProblemType[] => {
  const filterPipeline = buildFilterPipeline(problemFilters)
  return pipe(...filterPipeline)(problems || [])
}

/*
  Builds an array of filtering functions based on the state of problemFilters
*/
export const buildFilterPipeline = (problemFilters: ProblemFilters): Function[] =>
  pipe(
    append(reflect), // pipeline requires at least one function
    appendIf(
      searchFilterOn(problemFilters),
      filterProblemsBySearchTerm(problemFilters?.search || '')
    ),
    appendIf(favoriteFilterOn(problemFilters), filterProblemsByIsFavorite),
    appendIf(
      categoriesFilterOn(problemFilters),
      filterProblemsByCategoryIds(getFilterValues(problemFilters?.categories))
    ),
    appendIf(
      labelsFilterOn(problemFilters),
      filterProblemsByLabelIds(getFilterValues(problemFilters?.labels))
    ),
    appendIf(
      createdByFilterOn(problemFilters),
      filterProblemsByUserIds(getFilterValues(problemFilters?.createdBy))
    ),
    appendIf(
      statusFilterOn(problemFilters),
      filterProblemsByStatusList(getFilterValues(problemFilters?.status))
    ),
    appendIf(
      passionFilterOn(problemFilters),
      filterProblemsByPassionList(problemFilters?.passionReactions)
    ),
    appendIf(
      importanceFilterOn(problemFilters),
      filterProblemsByImportanceList(problemFilters?.importanceReactions)
    )
  )([])

/*
  Filtering functions
*/

// Will keep any problems that are favorites
export const filterProblemsByIsFavorite = (problems: ProblemType[]) =>
  problems.filter((problem) => problem?.userRating?.favorite === 1)

// will keep any problems that are contained in on or more of the list of category names
export const filterProblemsByCategoryIds = curry((categoryIds: string[], problems: ProblemType[]) =>
  problems.filter((problem) => problemInCategoryIdList(problem, categoryIds))
)

export const filterProblemsByLabelIds = curry((labelIds: string[], problems: ProblemType[]) => 
  problems.filter((problem) => problemInLabelIdList(problem, labelIds))
)

// will keep any problems that were created by any of the users in the user list
export const filterProblemsByUserIds = curry((userIds: string[], problems: ProblemType[]) =>
  problems.filter((problem) => userIds.includes(problem?.createdBy || ''))
)

// will keep any problems that are in one or more of the specified statuses
export const filterProblemsByStatusList = curry((statusList: string[], problems: ProblemType[]) =>
  problems.filter((problem) => statusList.includes(problem?.status))
)

// will keep any of the problems that has passion level to set to on in specified list
export const filterProblemsByPassionList = curry(
  (passionList: PassionLevel[], problems: ProblemType[]) =>
    problems.filter((problem) => passionList.includes(problem?.userRating?.passion))
)

// will keep any of the problems that has passion level to set to on in specified list
export const filterProblemsByImportanceList = curry(
  (importanceList: ImportanceLevel[], problems: ProblemType[]) =>
    problems.filter((problem) => importanceList.includes(problem?.userRating?.importance))
)

// will keep any of the problems that have the search term in the title or content
export const filterProblemsBySearchTerm = curry((searchTerm: string, problems: ProblemType[]) =>
  problems.filter(
    (problem) =>
      problem.title?.toLowerCase().includes(toLower(searchTerm)) ||
      problem.content?.toLowerCase().includes(toLower(searchTerm))
  )
)

/*
  Helpers
*/

const problemInCategoryIdList = (problem: ProblemType, categoryIds: string[]) =>
  pipe(
    getProblemCategoryIdList,
    any((problemCategoryId: string) => categoryIds.includes(problemCategoryId))
  )(problem)

const problemInLabelIdList = (problem: ProblemType, labelIds: string[]) =>
  pipe(
    getLabelIdList,
    any((problemLabelId: string) => labelIds.includes(problemLabelId))
  )(problem)

const getFilterValues = (filterList: any[] = []) => filterList.map((f) => f.value)

export const favoriteFilterOn = (problemFilters: ProblemFilters) => problemFilters?.favorite === 1

export const categoriesFilterOn = (problemFilters: ProblemFilters) =>
  problemFilters?.categories?.length > 0

export const labelsFilterOn = (problemFilters: ProblemFilters) =>
  problemFilters?.labels?.length > 0

export const createdByFilterOn = (problemFilters: ProblemFilters) =>
  problemFilters?.createdBy?.length > 0

export const statusFilterOn = (problemFilters: ProblemFilters) => problemFilters?.status?.length > 0

export const passionFilterOn = (problemFilters: ProblemFilters) =>
  problemFilters?.passionReactions?.length > 0

export const importanceFilterOn = (problemFilters: ProblemFilters) =>
  problemFilters?.importanceReactions?.length > 0

export const searchFilterOn = (problemFilters: ProblemFilters) => problemFilters?.search?.length > 0
