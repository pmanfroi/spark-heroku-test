import {useRestPatch, useRestCreate} from './core/restMutateHooks'
import {useRestQuery} from './core/restQueryHooks.js'
import {Options as BaseOptions} from './core/restQueryHooks.js'

interface Options extends Omit<BaseOptions, 'op'> {
  routeTo?: string
  onSuccess?: () => void
  onError?: () => {}
}

interface Props {
  problemPublicId: number
  problemVariantRatingId?: string
  options?: Options
}

interface GetProps {
  problemVariantId: string
  options?: Options
}

export const useUpdateProblemVariantRating = ({problemPublicId, options}: Props) => {
  const restPath = `/problem-variant-ratings`
  const mutationFnName = 'updateProblemVariantRating'
  const success = {
    cachesToInvalidate: ['problem', problemPublicId?.toString()],
    // toastMessage: 'Problem Variant Rating Update Successful!',
    // ...(options?.onSuccess || {}), // caller options
    onSuccess: options?.onSuccess || undefined,
  }

  const error = {
    // toastMessage: 'Problem Variant Rating Update Failed!',
    ...(options?.onError || {}), // caller options
  }

  const updateOptions = {mutationFnName, success, error}
  const res = useRestPatch(restPath, updateOptions)
  return {
    ...res,
    [mutationFnName]: (data, params) => res?.mutate({data, params} as any),
    [`${mutationFnName}Async`]: (data, params) => res?.mutateAsync({data, params} as any),
  }
}

export const useCreateProblemVariantRating = ({problemPublicId, options}: Props) => {
  const restPath = `/problem-variant-ratings`
  const mutationFnName = 'createProblemVariantRating'
  const success = {
    cachesToInvalidate: ['problem', problemPublicId?.toString()],
    // toastMessage: 'Problem Variant Rating Create Successful!',
    onSuccess: options?.onSuccess || undefined,
  }

  const error = {
    // toastMessage: 'Problem Variant Rating Create Failed!',
    ...(options?.onError || {}), // caller options
  }

  const updateOptions = {mutationFnName, success, error}
  const res = useRestCreate(restPath, updateOptions)
  return {
    ...res,
    [mutationFnName]: (data, params) => res?.mutate({data, params} as any),
    [`${mutationFnName}Async`]: (data, params) => res?.mutateAsync({data, params} as any),
  }
}

export const userGetProblemVariantRating = ({problemVariantId, options}: GetProps) => {
  const {defaultResponse = []} = options || {}
  const restPath = `/problem-variants/${problemVariantId}/problem-variant-ratings`
  const queryCacheKey = ['getProblemVariantRating', problemVariantId]
  const rsp = useRestQuery(queryCacheKey, restPath, {
    defaultResponse: defaultResponse,
  })
  const problemVariantRatingsResponse = rsp?.data?.data
  return {
    ratings: problemVariantRatingsResponse || defaultResponse || [],
    ...rsp,
  }
}
