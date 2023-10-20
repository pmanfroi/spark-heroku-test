import {isNil} from 'ramda'
import {isFunction, isNotNil, isNotFunction} from 'ramda-adjunct'
import toast from 'react-hot-toast'
import {useMutation, useQueryClient} from 'react-query'
import {useNavigate} from 'react-router-dom'

import {useRestClient} from '@/state/restState'
import {
  isNotNilOrArray,
  isNotStringOrArrayOrFunction,
  isNotStringOrFunction,
  throwIf,
} from '@/utils/generalUtils'

/*
  All of the mutate hooks return a standard react-query useMutation() object

  The returned object will include the standard use-query mutation functions
  mutate and mutateAsync (which can be given custom names via options)

  All of the returned mutation functions recieve an optional last argument
  `params` (see documentation for each specific hook). The param object allows
  path paramaters and query options to be provided as follows

  params {
    pathParams {
        keys: values
        * keys: variables in the path name that will be substituted
        * values: string | number, values that will be substitued in the path
      }
    queryParams {
      keys: values // for query string to be appended
      * keys: query paramater variable names
      * values: query paramater variable values (string, number or bool)
    }
    -or-
    queryParams:
      string: will be appended directly to the request usrl
  }

  An options object can be supplied to the mutation functions, which can include
  any of the standard react-query useMutation() options

  In addition, the following options can also be included

  options: {

    mutationFnName: string
    * response object will include fxns providedFnName amd providedFnNameAsync
      which reference the stnadard react-query mutation functions

    baseURL: string
    * optional - the base URL to use for the mutation query

    onSuccess: { // as object
      cachesToAddTo: ['cachId' | [cacheId]] // list of standard react-query cache ID
      * add the entity as a new cache entry on success
      * currently NYI TODO: implement (some complications getting queryFn fetchQuery  )

      cachesToInvalidate [ 'cachId' | [cacheId] ] // list of standard react-query cache ID
      * list of caches to invalidate on success

      cachesToRemove [ 'cachId' | [cacheId] ]
      * list of standard react-query cache ID

      actions []
      * list of functions to perform

      routeTo: 'string'
      * Route here on success

      toastMessage: 'string'
      * display a toast with provided message on success
    }
    -or-
    onSuccess: // as func
      called with create/updated/deleted passed in when op is succesful

    onError: {
      routeTo: 'route'
      * Route here on error

      toastMessage: 'string'
      * display a toast with provided message on error
    }
    -or-
    onError: // as func
      called with error passed in when op is fails
  }

  Advanced Options Usage

  * cacheId / routeTo as functions

    For any option functions that recieves `cacheId` or `routeTo` as inputs,
    these may be functions

    The functions sill be passed the entity that was created/updated/deleted,
    and is expected to return the approrate cache id or route

    This can be useful if you need to construct a route or cacheId in real time
    that is dependent upon the entity being operated upon

    example
      const cacheId = newEntitiy => `[entities, newEntity.id]`
      const routeTo = newEntitiy => `/entities/${newEntity.id}`
  }
*/

/*
  Returns react-query mutation object, which includes the standard react-query
  mutation functions to create an entity, and which have the following signatures

  mutate({ data, params })
    returns created data

  mutateAsync({ data, params })
    return promise which resolves to created data

  The mutation function names can be customized via options: { mutationFnName }
    example options: { mutationFnName: createThing }
*/
export const useRestCreate = (restPath: string, options: RestMutateProps['options']) => {
  const {restClient} = useRestClient()
  const defaultOptions = {
    baseURL: restClient.serverConfig.defaultBaseUrl,
  }
  return useRestMutate(restClient.makePostFn, restPath, {...defaultOptions, ...options})
}

/*
  Returns react-query mutation obect, which includes the standard react-query
  mutation functions to update an entity, and which have the following signatures

  mutate(dataForUpdate, params)
    returns updated data

  mutateAsync(dataForUpdate, params)
    return promise which resolves to updated data

  The mutation function names can be customized via options: { mutationFnName }
    example options: { mutationFnName: updateThing }
*/
export const useRestUpdate = (restPath, options: RestMutateProps['options'] = {}) => {
  const {restClient} = useRestClient()
  const defaultOptions = {
    baseURL: restClient.serverConfig.defaultBaseUrl,
  }
  return useRestMutate(restClient.makePutFn, restPath, {...defaultOptions, ...options})
}

/*
  Returns react-query mutation obect, which includes the standard react-query
  mutation functions to update an entity, and which have the following signatures

  mutate(dataForUpdate, params)
    returns updated data

  mutateAsync(dataForUpdate, params)
    return promise which resolves to updated data

  The mutation function names can be customized via options: { mutationFnName }
    example options: { mutationFnName: updateThing }
*/
export const useRestPatch = (restPath, options: RestMutateProps['options']) => {
  const {restClient} = useRestClient()
  const defaultOptions = {
    baseURL: restClient.serverConfig.defaultBaseUrl,
  }
  return useRestMutate(restClient.makePatchFn, restPath, {...defaultOptions, ...options})
}

/*
  Returns react-query mutation obect, which includes the standard react-query
  mutation functions to delete an entity, and which have the following signatures

  mutate(params)
    returns response from rest server

  mutateAsync(params)
    returns response from rest server

  The mutation function names can be customized via options: { mutationFnName }
    example options: { mutationFnName: deleteThing }
*/
export const useRestDelete = (restPath, options: RestMutateProps['options']) => {
  const {restClient} = useRestClient()
  const defaultOptions = {
    baseURL: restClient.serverConfig.defaultBaseUrl,
  }
  return useRestMutate(restClient.makeDeleteFn, restPath, {...defaultOptions, ...options})
}

/*
  All mutation hooks call down to this guy
*/
type SuccessType = {
  cachesToInvalidate: Array<any>
  toastMessage?: string
  onSuccess?: (response) => void
  routeTo?: string
}
type ErrorType = {
  toastMessage?: string
  onError?: () => void
}
interface RestMutateProps {
  mutateFn?: (restPath: string, options: {baseURL: string}) => any
  restPath: string
  options: {
    mutationFnName?: any
    routeTo?: string
    success?: SuccessType
    error?: ErrorType
    baseURL?: string
  }
}
export const useRestMutate = (
  mutateFn: RestMutateProps['mutateFn'],
  restPath: RestMutateProps['restPath'],
  options: RestMutateProps['options']
) => {
  if (!mutateFn) {
    console.error('mutateFn not provided')
    return null
  }

  const {mutationFnName, success, error, baseURL = ''} = options

  const axiosOptions = {baseURL}

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const res = useMutation(mutateFn(restPath, axiosOptions), {
    onSuccess: success?.onSuccess || _onMutateSuccess(queryClient, navigate, success),
    onError: error?.onError || _onMutateError(queryClient, navigate, error),
  })

  if (mutationFnName) {
    res[mutationFnName] = res?.mutate
    res[`${mutationFnName}Async`] = res?.mutateAsync
  }

  return res
}

const _getCacheId = (clientCacheId, entity) =>
  isFunction(clientCacheId) ? clientCacheId(entity) : clientCacheId

const _getRoute = (clientRoute, entity) =>
  isFunction(clientRoute) ? clientRoute(entity) : clientRoute

const _validateActionsList = (op, actions) => {
  throwIf(
    isNotNilOrArray(actions),
    `${op} - running actions: expected array for action list, but got ${actions}`
  )
  if (isNil(actions)) return
  actions.forEach((action) => {
    throwIf(isNotFunction(action), `${op} - Invalid action ${action}`)
  })
}

const _validateCacheList = (op, cacheList) => {
  throwIf(
    isNotNilOrArray(cacheList),
    `${op} - invalidating caches: expected array for cache list, but got ${cacheList}`
  )
  if (isNil(cacheList)) return
  cacheList.forEach((cacheId) => {
    throwIf(isNotStringOrArrayOrFunction(cacheId), `${op}: Invalid cache ID '${cacheId}`)
  })
}

const _onMutateSuccess = (queryClient, navigate, onSuccessOptions) => (data) => {
  const {cachesToInvalidate = [], cachesToRemove = []} = onSuccessOptions
  const {routeTo, toastMessage, actions} = onSuccessOptions

  _validateActionsList('onMutateSuccess - running action functions', actions)
  if (actions) {
    actions.forEach((action) => {
      action()
    })
  }
  // Fist, remove caches, so they won't try to refetch upon invalidation
  _validateCacheList('onMutateSuccess - removing caches', cachesToRemove)
  const exact = true
  cachesToRemove.forEach((cacheToRemove) => {
    queryClient.removeQueries(_getCacheId(cacheToRemove, data), {exact})
  })

  // Next, invalidate any caches that currently exist
  _validateCacheList('onMutateSuccess - invalidating caches', cachesToInvalidate)
  cachesToInvalidate.forEach((cacheToInvalidate) => {
    queryClient.invalidateQueries(_getCacheId(cacheToInvalidate, data))
  })

  // navigate if needed
  if (isNotNil(routeTo)) {
    throwIf(isNotStringOrFunction(routeTo), 'invalid cache ID route for post query route to')

    navigate(_getRoute(routeTo, data))
  }

  // Toast !
  if (isNotNil(toastMessage)) toast.success(toastMessage)
}

const _onMutateError = (queryClient, navigate, onErrorOptions) => (error) => {
  const {toastMessage} = onErrorOptions
  console.error('Error: rest mutation failed', error)
  if (isNotNil(toastMessage)) toast.error(toastMessage)
}
