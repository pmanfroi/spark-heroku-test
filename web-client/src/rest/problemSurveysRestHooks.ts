import {useRestCreate, useRestPatch, useRestDelete} from './core/restMutateHooks'
import {useRestQuery, Options as BaseOptions, RestQueryResult} from './core/restQueryHooks.js'
import {ProblemSurvey} from './types'

export type ProblemSurveyCreateData = Pick<ProblemSurvey, 'title' | 'description'> & {
  problemIds: string[]
  usersIds: string[]
}

type ProblemSurveyResponse = {
  problemSurvey: ProblemSurvey
}

type ProblemSurveysResponse = {
  problemSurveys: ProblemSurvey[]
}

type QueryResponse = RestQueryResult<ProblemSurvey> & ProblemSurveysResponse

interface Options extends Omit<BaseOptions, 'op' | 'onSuccess'> {
  defaultResponse?: ProblemSurveysResponse
  routeTo?: string
  onSuccess?: (data: any) => void
  onError?: () => {}
}

export const useGetProblemSurvey = (
  problemSurveyId: string,
  options: Options
): RestQueryResult<ProblemSurvey> & ProblemSurveyResponse => {
  const {defaultResponse = {problemSurvey: {}}, resultsPropName = 'serverStatus', ...rest} = options
  const restPath = `//problem-survey/${problemSurveyId}`
  const queryCacheKey = ['/problem-survey', problemSurveyId]
  const response = useRestQuery(queryCacheKey, restPath, {
    resultsPropName,
    defaultResponse: defaultResponse || {[resultsPropName]: []},
    ...rest,
  })
  const problemSurveyResponse = response?.data?.data
  return {
    problemSurvey: problemSurveyResponse,
    ...response,
  }
}

export const useGetProblemSurveys = (options: Options): QueryResponse => {
  const {
    defaultResponse = {problemSurveys: []},
    resultsPropName = 'serverStatus',
    ...rest
  } = options
  const restPath = `/problem-surveys`
  const queryCacheKey = ['problem-surveys']
  const response = useRestQuery(queryCacheKey, restPath, {
    resultsPropName,
    defaultResponse: defaultResponse || {[resultsPropName]: []},
    ...rest,
  })
  const problemSurveysResponse = response?.data?.data
  return {
    problemSurveys: problemSurveysResponse,
    ...response,
  }
}

export const useCreateProblemSurvey = (options: Options) => {
  const restPath = '/problem-survey'

  const success = {
    cachesToInvalidate: ['problem-surveys'],
    toastMessage: 'Problem Survey Created!',
    routeTo: options.routeTo || undefined,
    onSuccess: options.onSuccess || undefined,
  }

  const error = {
    toastMessage: 'Problem Survey Create Failed!',
    onError: options.onError || undefined,
  }

  const createOptions = {success, error}
  const res = useRestCreate(restPath, createOptions)
  return {
    ...res,
    createProblemSurvey: (data: ProblemSurveyCreateData, params) =>
      res?.mutate({data, params} as any),
    createProblemSurveyAsync: (data: ProblemSurveyCreateData, params) =>
      res?.mutateAsync({data, params} as any),
  }
}

export const useDeleteProblemSurvey = (options: Options) => {
  const restPath = '/problem-survey/:problemId'
  const mutationFnName = 'deleteProblemSurvey'

  const success = {
    toastMessage: 'Problem Survey Deleted!',
    cachesToInvalidate: [['problem-surveys']],
    cachesToRemove: [(deletedProblemSurveyId) => ['problem-survey', deletedProblemSurveyId]],
    ...(options.onSuccess || {}), // caller options
  }

  const error = {
    toastMessage: 'Problem Survey Delete Failed!',
    ...(options.onError || {}), // caller options
  }

  const deleteOptions = {success, error}
  const res = useRestDelete(restPath, deleteOptions)

  return {
    ...res,
    [mutationFnName]: (problemSurveyId) => res?.mutate({pathParams: {problemSurveyId}} as any),
    [`${mutationFnName}Async`]: (problemSurveyId) =>
      res?.mutateAsync({pathParams: {problemSurveyId}} as any),
  }
}

type UpdateProblemType = {
  publicProblemId?: number
  problemId?: string
  options?: Options
}
export const useUpdateProblemSurvey = ({
  publicProblemId,
  problemId,
  options = {},
}: UpdateProblemType) => {
  const restPath = `/problem-surveys/${problemId}`
  const mutationFnName = 'updateProblemSurvey'

  const success = {
    cachesToInvalidate: ['problem-survey', publicProblemId?.toString()],
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
