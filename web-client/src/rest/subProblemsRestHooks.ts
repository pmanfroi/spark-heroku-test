import {AddItemDirection} from '@/components/ProblemDetails/AddProblemToolbar'

import {useRestPatch, useRestDelete, useRestCreate} from './core/restMutateHooks'
import {Options as BaseOptions} from './core/restQueryHooks.js'
import {SubProblem} from './types'

interface Options extends Omit<BaseOptions, 'op'> {
  routeTo?: string
  onSuccess?: () => void
  onError?: () => void
}

interface Props {
  problemPublicId: number
  subProblemId: string
  problemVariantId: string
  options?: Options
}

export const useUpdateSubProblem = ({
  problemPublicId,
  problemVariantId,
  subProblemId,
  options,
}: Props) => {
  const restPath = `/problem-variants/${problemVariantId}/sub-problems/${subProblemId}`
  const mutationFnName = 'updateSubProblem'
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

export const useDeleteSubProblem = ({
  problemPublicId,
  problemVariantId,
  subProblemId,
  options,
}: Props) => {
  const restPath = `/problem-variants/${problemVariantId}/sub-problems/${subProblemId}`
  const mutationFnName = 'deleteSubProblem'
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
  problemVariantId: string
  options?: Options
}

type CreateSubProblemType = {
  reference: string
  direction: AddItemDirection
} & Pick<SubProblem, 'content'>

export const useCreateSubProblem = ({problemPublicId, problemVariantId, options}: CreateProps) => {
  const restPath = `/problem-variants/${problemVariantId}/sub-problems`
  const mutationFnName = 'createSubProblem'
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
    [mutationFnName]: (data: CreateSubProblemType, params) => res?.mutate({data, params} as any),
    [`${mutationFnName}Async`]: (data: CreateSubProblemType, params) =>
      res?.mutateAsync({data, params} as any),
  }
}
