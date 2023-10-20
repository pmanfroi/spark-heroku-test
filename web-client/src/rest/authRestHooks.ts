import {User} from '@/rest/types'

import {useRestCreate} from './core/restMutateHooks'
import {Options as BaseOptions, RestQueryResult, useRestQuery} from './core/restQueryHooks.js'

type AuthData = {
  email: string
  password: string
}

type AuthMutateResponse = {
  loginUser: (data: AuthData, params?: object) => void
  loginUserAsync: (data: AuthData, params?: object) => void
}

type LoginUserResponse = RestQueryResult<AuthData> & AuthMutateResponse

type SuccessData = {
  data: {
    user: User
    accessToken: string
  }
}

interface Options extends Omit<BaseOptions, 'op' | 'onSuccess'> {
  defaultResponse?: AuthMutateResponse
  routeTo?: string
  onSuccess?: (data: SuccessData) => void
  onError?: () => {}
}

export const useLoginUser = (options: Options): LoginUserResponse => {
  const restPath = `/auth/login`

  const success = {
    cachesToInvalidate: [['auth/login']],
    toastMessage: 'Login Successful!',
    routeTo: options.routeTo || undefined,
    onSuccess: options.onSuccess || undefined,
  }

  const error = {
    toastMessage: 'Login Failed!',
    onError: options.onError || undefined,
  }
  const createOptions = {success, error}
  const res = useRestCreate(restPath, createOptions)
  return {
    ...res,
    loginUser: (data, params) => res?.mutate({data, params} as any),
    loginUserAsync: (data, params) => res?.mutateAsync({data, params} as any),
  }
}

type ResetPasswordData = {
  email: string
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}

type ResetPasswordMutateResponse = {
  resetPassword: (data: ResetPasswordData, params?: object) => void
  resetPasswordAsync: (data: ResetPasswordData, params?: object) => void
}

type ResetPasswordResponse = RestQueryResult<ResetPasswordData> & ResetPasswordMutateResponse

export const useResetPassword = (options: Options): ResetPasswordResponse => {
  const restPath = `/auth/reset-password`

  const success = {
    cachesToInvalidate: [['auth/reset-password']],
    toastMessage: 'Reset Password Successful!',
    routeTo: options.routeTo || undefined,
    onSuccess: options.onSuccess || undefined,
  }

  const error = {
    toastMessage: 'Reset Password Failed!',
    onError: options.onError || undefined,
  }
  const createOptions = {success, error}
  const res = useRestCreate(restPath, createOptions)
  return {
    ...res,
    resetPassword: (data, params) => res?.mutate({data, params} as any),
    resetPasswordAsync: (data, params) => res?.mutateAsync({data, params} as any),
  }
}

type GetMeResponse = RestQueryResult<User>

export const useGetMe = (): GetMeResponse => {
  const restPath = '/auth/me'
  const queryCacheKey = ['authMe']

  const rsp = useRestQuery(queryCacheKey, restPath, {refetchOnWindowFocus: false})
  const getMeResponse = rsp?.data?.data
  return {
    ...rsp,
    data: getMeResponse,
  }
}
