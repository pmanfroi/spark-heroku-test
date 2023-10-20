import {useRestPatch} from './core/restMutateHooks'
import {Options as BaseOptions} from './core/restQueryHooks.js'

interface Options extends Omit<BaseOptions, 'op'> {
  routeTo?: string
  onSuccess?: () => {}
  onError?: () => {}
}

interface Props {
  problemPublicId: number
  options?: Options
}

export const useUpdatePreferredProblemVariant = ({problemPublicId, options}: Props) => {
  const restPath = `/preferred-problem-variant`
  const mutationFnName = 'updatePreferredProblemVariant'
  const success = {
    cachesToInvalidate: ['problem', problemPublicId?.toString()],
    toastMessage: 'Preferred Problem Variant Update Successful!',
    ...(options?.onSuccess || {}), // caller options
  }

  const error = {
    toastMessage: 'Preferred Problem Variant Update Failed!',
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
