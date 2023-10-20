import {useRestCreate, useRestPatch, useRestDelete} from './core/restMutateHooks'
import {useRestQuery, Options as BaseOptions, RestQueryResult} from './core/restQueryHooks.js'
import {ProblemType} from './types'

type ProblemResponse = {
  problem: ProblemType
}

type ProblemsResponse = {
  problems: ProblemType[]
}

type QueryResponse = RestQueryResult<ProblemType> & ProblemsResponse

// interface Options extends Omit<BaseOptions, 'op'> {
//   defaultResponse?: ProblemsResponse
//   routeTo?: string
//   onSuccess?: () => {}
//   onError?: () => {}
// }

interface Options extends Omit<BaseOptions, 'op' | 'onSuccess'> {
  defaultResponse?: ProblemsResponse
  routeTo?: string
  onSuccess?: (data: any) => void
  onError?: () => {}
}

/**
 * Returns standard useQuery object (https://react-query.tanstack.com/reference/useQuery)
 * Options may contain any valid react-query useQuery() options
 * NOTE: you can also supply query params within the restPath itself
  For more information, reference ./core/restHooks.js documentation.
 * @param options
 * @returns
 */
export const useGetProblems = (options?: Options): QueryResponse => {
  const {defaultResponse = [], ...rest} = options || {}
  const restPath = '/problems'
  const queryCacheKey = ['problems']
  const rsp = useRestQuery(queryCacheKey, restPath, {
    defaultResponse: defaultResponse,
    ...rest,
  })

  const problemResponse = rsp?.data?.data
  return {
    problems: problemResponse || defaultResponse,
    ...rsp,
  }
}

export const useGetProblemByPublicId = (
  problemId: string,
  options: Options
): RestQueryResult<ProblemType> & ProblemResponse => {
  const {defaultResponse = {problem: {}}, resultsPropName = 'serverStatus', ...rest} = options
  const restPath = `/problem/${problemId}`
  const queryCacheKey = ['problem', problemId]
  const response = useRestQuery(queryCacheKey, restPath, {
    resultsPropName,
    defaultResponse: defaultResponse || {[resultsPropName]: []},
    ...rest,
  })
  const problemResponse = response?.data?.data
  return {
    problem: problemResponse,
    ...response,
  }
}

export const useCreateProblem = (options: Options) => {
  const restPath = '/problems'

  const success = {
    cachesToInvalidate: [['problem']],
    toastMessage: 'Problem Created!',
    routeTo: options.routeTo || undefined,
    onSuccess: options.onSuccess || undefined,
  }

  const error = {
    toastMessage: 'Problem Create Failed!',
    onError: options.onError || undefined,
  }

  const createOptions = {success, error}
  const res = useRestCreate(restPath, createOptions)
  return {
    ...res,
    createProblem: (data, params) => res?.mutate({data, params} as any),
    createProblemAsync: (data, params) => res?.mutateAsync({data, params} as any),
  }
}

export const useDeleteProblem = (options: Options) => {
  const restPath = '/problem/:problemId'
  const mutationFnName = 'deleteProblem'

  const success = {
    toastMessage: 'Problem Deleted!',
    cachesToInvalidate: [['problem']],
    cachesToRemove: [(deletedProblemId) => ['problem', deletedProblemId]],
    ...(options.onSuccess || {}), // caller options
  }

  const error = {
    toastMessage: 'Problem Delete Failed!',
    ...(options.onError || {}), // caller options
  }

  const deleteOptions = {success, error}
  const res = useRestDelete(restPath, deleteOptions)

  return {
    ...res,
    [mutationFnName]: (problemId) => res?.mutate({pathParams: {problemId}} as any),
    [`${mutationFnName}Async`]: (problemId) => res?.mutateAsync({pathParams: {problemId}} as any),
  }
}

type UpdateProblemType = {
  publicProblemId?: number
  problemId?: string
  options?: Options
}
export const useUpdateProblem = ({publicProblemId, problemId, options = {}}: UpdateProblemType) => {
  const restPath = `/problems/${problemId}`
  const mutationFnName = 'updateProblem'

  const success = {
    cachesToInvalidate: ['problem', publicProblemId?.toString()],
    routeTo: options.routeTo || undefined,
    ...(options.onSuccess || {}), // caller options
  }

  const error = {
    ...(options.onError || {}), // caller options
  }

  const updateOptions = {mutationFnName, success, error}
  const res = useRestPatch(restPath, updateOptions)
  return {
    ...res,
    [mutationFnName]: (data) => res?.mutate({data} as any),
    [`${mutationFnName}Async`]: (data) => res?.mutateAsync({data} as any),
  }
}
