import {Options as BaseOptions, RestQueryResult, useRestQuery} from '@/rest/core/restQueryHooks'
import {User} from '@/rest/types'

type CategoriesResponse = {
  users: User[]
}
type QueryResponse = RestQueryResult<User> & CategoriesResponse

interface Options extends Omit<BaseOptions, 'op'> {
  defaultResponse?: CategoriesResponse
  routeTo?: string
  onSuccess?: () => {}
  onError?: () => {}
}

export const useGetUsers = (options?: Options): QueryResponse => {
  const {defaultResponse} = options || {}
  const restPath = '/users'
  const queryCacheKey = ['users']
  const rsp = useRestQuery(queryCacheKey, restPath, {
    defaultResponse: defaultResponse,
  })
  const usersResponse = rsp?.data?.data
  return {
    users: usersResponse || defaultResponse || [],
    ...rsp,
  }
}
