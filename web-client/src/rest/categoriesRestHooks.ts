import {Options as BaseOptions, RestQueryResult, useRestQuery} from '@/rest/core/restQueryHooks'
import {Category} from '@/rest/types'

type CategoriesResponse = {
  categories: Category[]
}
type QueryResponse = RestQueryResult<Category> & CategoriesResponse

interface Options extends Omit<BaseOptions, 'op'> {
  defaultResponse?: CategoriesResponse
  routeTo?: string
  onSuccess?: () => {}
  onError?: () => {}
}

export const useGetProblemCategories = (options?: Options): QueryResponse => {
  const {defaultResponse = []} = options || {}
  const restPath = '/problem-categories'
  const queryCacheKey = ['problem-categories']
  const rsp = useRestQuery(queryCacheKey, restPath, {
    defaultResponse: defaultResponse,
  })
  const categoriesResponse = rsp?.data?.data
  return {
    categories: categoriesResponse || defaultResponse,
    ...rsp,
  }
}
