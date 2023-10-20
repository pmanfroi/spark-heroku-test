import {ProblemType, Category, CategoryWithProblems, Label} from '@/rest/types'

export const getProblemCategoryIdList = (problem: ProblemType) =>
  (problem?.categories || []).map((category: Category) => category?.id || '')

export const getLabelIdList = (problem: ProblemType) =>
(problem?.labels || []).map((label: Label) => label?.id || '')


export const groupProblemsByCategory = (
  categories: Category[] = [],
  problems: ProblemType[] = []
): CategoryWithProblems[] => {
  const categoriesWithProblems = categories?.map((category) => {
    const categoryProblems = problems.filter((p) => {
      if (p.categories) return p.categories.find((e) => e.id === category.id)
    })
    return {
      category,
      problems: categoryProblems,
    }
  })
  return categoriesWithProblems
}
