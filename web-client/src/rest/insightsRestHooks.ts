import {useRestQuery, Options as BaseOptions, RestQueryResult} from './core/restQueryHooks.js'
import {InsightType} from './types'

type InsightResponse = {
  insights: InsightType
}

type QueryResponse = RestQueryResult<InsightType> & InsightResponse

interface Options extends Omit<BaseOptions, 'op'> {
  defaultResponse?: InsightResponse
  routeTo?: string
  onSuccess?: () => {}
  onError?: () => {}
}

export const useGetInsights = (options?: Options): QueryResponse => {
  const {defaultResponse = {insights: {}}, ...rest} = options || {}
  const restPath = '/daily-digest'
  const queryCacheKey = ['daily-digest']
  const rsp = useRestQuery<InsightType>(queryCacheKey, restPath, {
    defaultResponse: defaultResponse,
    ...rest,
  })

  const insightResponse = rsp?.data?.data
  return {
    insights: insightResponse || defaultResponse,
    ...rsp,
  }
}
