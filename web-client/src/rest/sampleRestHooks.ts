import {useRestCreate, useRestUpdate, useRestDelete} from './core/restMutateHooks'
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
  defaultResponse?: any
  transformFn?: () => void
  resultsPropName?: string
  queryParams?: {[key: string]: any} | string
  routeTo?: string
  onSuccess?: () => {}
  onError?: () => {}
}

// Returns list of Samples in sample prop of returned object.
export const useGetSample = (props?: Props) => {
  const {defaultResponse, resultsPropName = 'sample', ...options} = props || {}
  const restPath = '/sample'
  const queryCacheKey = ['sample']
  const rsp = useRestQuery(queryCacheKey, restPath, {
    defaultResponse: defaultResponse || {[resultsPropName]: []},
    ...options,
  })
  return {
    [resultsPropName]: rsp?.data?.sample || defaultResponse,
    ...rsp,
  }
}

export const useGetSampleById = (sampleId: string, props: Props) => {
  const {defaultResponse, resultsPropName = 'serverStatus', ...options} = props
  const restPath = `/sample/${sampleId}`
  const queryCacheKey = ['sample', sampleId]
  return useRestQuery(queryCacheKey, restPath, {
    resultsPropName,
    defaultResponse: defaultResponse || {[resultsPropName]: []},
    ...options,
  })
}

export const useCreateSample = (options: Props) => {
  const restPath = '/sample'
  const mutationFnName = 'createSample'

  const success = {
    cachesToInvalidate: [['sample']],
    toastMessage: 'Sample Created!',
    routeTo: options.routeTo || undefined,
    ...(options.onSuccess || {}), // caller options
  }

  const error = {
    toastMessage: 'Sample Create Failed!',
    ...(options.onError || {}), // caller options
  }

  const createOptions = {success, error}
  const res = useRestCreate(restPath, createOptions)
  return {
    ...res,
    [mutationFnName]: (data, params) => res?.mutate({data, params} as any),
    [`${mutationFnName}Async`]: (data, params) => res?.mutateAsync({data, params} as any),
  }
}

export const useDeleteSample = (options: Props) => {
  const restPath = '/sample/:sampleId'
  const mutationFnName = 'deleteSample'

  const success = {
    toastMessage: 'Sample Deleted!',
    cachesToInvalidate: [['sample']],
    cachesToRemove: [(deletedSampleId) => ['sample', deletedSampleId]],
    ...(options.onSuccess || {}), // caller options
  }

  const error = {
    toastMessage: 'Sample Delete Failed!',
    ...(options.onError || {}), // caller options
  }

  const deleteOptions = {success, error}
  const res = useRestDelete(restPath, deleteOptions)

  return {
    ...res,
    [mutationFnName]: (sampleId) => res?.mutate({pathParams: {sampleId}} as any),
    [`${mutationFnName}Async`]: (sampleId) => res?.mutateAsync({pathParams: {sampleId}} as any),
  }
}

export const useUpdateSample = (sampleId: string, options: Props) => {
  const restPath = `/sample/${sampleId}`
  const mutationFnName = 'updateSample'

  const success = {
    cachesToInvalidate: ['sample'],
    toastMessage: 'Sample Update Successful!',
    routeTo: options.routeTo || undefined,
    ...(options.onSuccess || {}), // caller options
  }

  const error = {
    toastMessage: 'Sample Update Failed!',
    ...(options.onError || {}), // caller options
  }

  const updateOptions = {mutationFnName, success, error}
  const res = useRestUpdate(restPath, updateOptions)
  return {
    ...res,
    [mutationFnName]: (data, params) => res?.mutate({data, params} as any),
    [`${mutationFnName}Async`]: (data, params) => res?.mutateAsync({data, params} as any),
  }
}
