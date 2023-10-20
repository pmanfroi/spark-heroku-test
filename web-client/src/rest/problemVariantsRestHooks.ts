import {AddItemDirection} from '@/components/ProblemDetails/AddProblemToolbar'

import {useRestPatch, useRestDelete, useRestCreate} from './core/restMutateHooks'
import {Options as BaseOptions} from './core/restQueryHooks.js'
import {ProblemVariant} from './types'

interface Options extends Omit<BaseOptions, 'op'> {
  routeTo?: string
  onSuccess?: () => void
  onError?: () => void
}

interface Props {
  problemPublicId: number
  problemVariantId: string
  options?: Options
}

export const useUpdateProblemVariant = ({
  problemPublicId,
  problemVariantId,
  options,
}: Props): any => {
  const restPath = `/problem-variants/${problemVariantId}`
  const mutationFnName = 'updateProblemVariant'
  const success = {
    cachesToInvalidate: ['problem', problemPublicId?.toString()],
    ...(options?.onSuccess || {}), // caller options
  }

  const error = {
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

export const useDeleteProblemVariant = ({problemPublicId, problemVariantId, options}: Props) => {
  const restPath = `/problem-variants/${problemVariantId}`
  const mutationFnName = 'deleteProblemVariant'
  const success = {
    cachesToInvalidate: ['problem', problemPublicId?.toString()],
    ...(options?.onSuccess || {}), // caller options
  }

  const error = {
    ...(options?.onError || {}), // caller options
  }

  const updateOptions = {mutationFnName, success, error}
  const res = useRestDelete(restPath, updateOptions)
  return {
    ...res,
    [mutationFnName]: () => res?.mutate({} as any),
    [`${mutationFnName}Async`]: () => res?.mutateAsync({} as any),
  }
}

interface CreateProps {
  problemPublicId?: number
  options?: Options
}

type CreateProblemVariantType = {
  referenceVariantId: string
  direction: AddItemDirection
} & Pick<ProblemVariant, 'content' | 'type' | 'problemId'>

export const useCreateProblemVariant = ({problemPublicId, options}: CreateProps) => {
  const restPath = `/problem-variants`
  const mutationFnName = 'createProblemVariant'
  const success = {
    cachesToInvalidate: ['problem', problemPublicId?.toString()],
    ...(options?.onSuccess || {}), // caller options
  }

  const error = {
    ...(options?.onError || {}), // caller options
  }

  const updateOptions = {mutationFnName, success, error}
  const res = useRestCreate(restPath, updateOptions)
  return {
    ...res,
    [mutationFnName]: (data: CreateProblemVariantType, params) =>
      res?.mutate({data, params} as any),
    [`${mutationFnName}Async`]: (data: CreateProblemVariantType, params) =>
      res?.mutateAsync({data, params} as any),
  }
}
