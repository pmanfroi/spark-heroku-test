import {pathOr, sortWith} from 'ramda'

import {OrderBy, ProblemStatus, ProblemType} from '@/rest/types'

type CompareFunction = (a: ProblemType, b: ProblemType) => number

// returns copy of list of problems, sorted by orderBy
export const orderProblems = (orderBy: OrderBy, problems: ProblemType[] = []) =>
  orderBy === OrderBy.NONE ? [...problems] : sortWith(compareFxns(orderBy), problems)

// returns a list of functions, to be applied in order of sorting precedence
export const compareFxns = (orderBy: OrderBy): CompareFunction[] => {
  switch (orderBy) {
    case OrderBy.IMPORTANCE:
      return [_importanceCompare, _passionCompare]
    case OrderBy.PASSION:
      return [_passionCompare, _importanceCompare]
    case OrderBy.FAVORITE:
      return [_favoriteCompare]
    case OrderBy.CREATION_DATE:
      return [_creationDateCompare]
    case OrderBy.STATUS:
      return [_statusCompare]
    case OrderBy.NONE:
      return [
        () => {
          console.error('compareBy NONE was called')
          return 0
        },
      ]
    default:
      throw new Error(`compareBy(): Unknown orderBy: ${orderBy}`)
  }
}

// ----- Module scoped stuff --------------------------------------------------

// returns rating number if assigned, otherwise, -1
const _getProblemRating = (problem: ProblemType, ratingType: string) =>
  pathOr(-1, ['userRating', ratingType], problem)

// comparitor functions return values for descending sort

export const _importanceCompare: CompareFunction = (a: ProblemType, b: ProblemType) =>
  _getProblemRating(b, 'importance') - _getProblemRating(a, 'importance')

export const _passionCompare: CompareFunction = (a: ProblemType, b: ProblemType) =>
  _getProblemRating(b, 'passion') - _getProblemRating(a, 'passion')

export const _favoriteCompare: CompareFunction = (a: ProblemType, b: ProblemType) =>
  _getProblemRating(b, 'favorite') - _getProblemRating(a, 'favorite')

export const _creationDateCompare: CompareFunction = (a: ProblemType, b: ProblemType) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()

export const _statusCompare: CompareFunction = (a: ProblemType, b: ProblemType) =>
  _statusSortingOrder.indexOf(b?.status) - _statusSortingOrder.indexOf(a?.status)

const _statusSortingOrder = [
  ProblemStatus.PUBLISHED,
  ProblemStatus.FINAL_REVIEW,
  ProblemStatus.INITIAL_REVIEW,
  ProblemStatus.SELECTED,
  ProblemStatus.DRAFT,
  ProblemStatus.BACKLOG,
  ProblemStatus.CLOSED,
]
