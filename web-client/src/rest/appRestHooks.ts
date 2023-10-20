import {useRestQuery} from './core/restQueryHooks.js'

/*
  Queries

  Returns standard useQuery object (https://react-query.tanstack.com/reference/useQuery)

  Options may contain any valid react-query useQuery() options

  In addition, queries can be customized via the following options

  options {
    defaultResponse: any:     Will be returned as results when query returns `undefined`
    transformFn:     func:   run the results through this fxn before returning
    resultsPropName: string: custom name for the results property (overrides defaults)
    queryParams      obj:    { paramName1: paramVal1, paramName2: paramVal2, etc },
                             results in /some-path?paramName1=paramVal1&paramName2=paramVal2
                             paramVal may be a string, number or boolean
                  or string: Will be directly appended to the rest path
                             Assumed is in valid query string format
  }

  NOTE: you can also supply query params within the restPath itself

  For more information, reference ./core/restHooks.js documentation.
*/

interface Props {
  defaultResponse: any
  transformFn?: () => void
  resultsPropName?: string
  queryParams: {[key: string]: any} | string
}
export const useGetServerStatus = ({
  defaultResponse,
  resultsPropName = 'serverStatus',
  ...options
}: Props) => {
  const restPath = '/server-status'
  const queryCacheKey = 'server-status'
  return useRestQuery(queryCacheKey, restPath, {
    resultsPropName,
    defaultResponse: defaultResponse || {[resultsPropName]: []},
    ...options,
  })
}
