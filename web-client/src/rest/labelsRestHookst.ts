import {Options as BaseOptions, RestQueryResult, useRestQuery} from '@/rest/core/restQueryHooks'
import {Label} from '@/rest/types'

type LabelsResponse = {
  labels: Label[]
}
type QueryResponse = RestQueryResult<Label> & LabelsResponse

interface Options extends Omit<BaseOptions, 'op'> {
  defaultResponse?: LabelsResponse
  routeTo?: string
  onSuccess?: () => {}
  onError?: () => {}
}

export const useGetLabels = (options?: Options): QueryResponse => {
  const {defaultResponse = []} = options || {}
  const restPath = '/labels'
  const queryCacheKey = ['labels']
  const rsp = useRestQuery(queryCacheKey, restPath, {
    defaultResponse: defaultResponse,
  })
  const labelsResponse = rsp?.data?.data
  return {
    labels: labelsResponse || defaultResponse,
    ...rsp,
  }
}
