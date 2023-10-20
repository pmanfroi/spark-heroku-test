import {useNavigate, useSearchParams} from 'react-router-dom'

import Form, {PasswordInput, SubmitButton} from '@/components/forms/Form'
import AppLogo from '@/components/ui/AppLogo'
import {useResetPassword} from '@/rest/authRestHooks'
import {useActiveUser} from '@/state/activeUserState'
import {useIsLoggedIn} from '@/state/appState'
import cns from '@/utils/classnames'

interface Props {
  className?: string // applied to root container
}

const ResetPassword = ({className}: Props) => {
  const {setIsLoggedIn} = useIsLoggedIn()
  const [searchParams] = useSearchParams()
  const {setActiveUser} = useActiveUser()
  const navigate = useNavigate()
  const {resetPassword, isLoading, isError, error} = useResetPassword({
    onSuccess: ({data}) => {
      setActiveUser(data.user, data.accessToken)
      setIsLoggedIn(true)
      navigate('/problems')
    },
  })

  const onSubmitResetPassword = (formData) => {
    const email = searchParams.get('email')
    if (!email) {
      console.error('Email is missing')
      return
    }
    const {oldPassword, newPassword, confirmNewPassword} = formData
    resetPassword({email, oldPassword, newPassword, confirmNewPassword})
  }

  const cn = {
    root: 'h-screen flex flex-col bg-neutral-900',
    header: cns('flex w-full flex-row items-center bg-neutral-800 py-2 ps-3', className),
    logo: 'flex text-white text-base font-semibold flex flex-row gap-3 items-center text-lg font-semibold',
    heading: 'justify-center items-center text-white font-bold flex w-full text-5xl gap-5 mb-6',
    content: 'w-full flex flex-col items-center gap-4 justify-center flex-auto',
    card: 'bg-neutral-800 px-14 py-10 md:w-1/2 lg:w-1/3 rounded-lg w-auto',
    text: 'text-center text-neutral-500 mt-3 text-l',
    input: 'py-5 px-2 bg-gray-700',
    contact: 'underline',
    errorMessage: 'my-2 text-center text-xs text-red-500',
  }

  return (
    <div className={cn.root}>
      <div className={cn.header}>
        <div className={cn.logo}>
          <AppLogo />
          <span>Spark</span>
        </div>
      </div>
      <div className={cn.content}>
        <div className={cn.heading}>
          <h1>Please Reset Your Password</h1>
        </div>
        <div className={cn.card}>
          <Form title={''} withPanel={false} onSubmit={onSubmitResetPassword}>
            <PasswordInput
              name={'oldPassword'}
              required={true}
              placeholder={'Current Password'}
              classNames={{input: cn.input}}
              disabled={isLoading}
            />
            <PasswordInput
              name={'newPassword'}
              required={true}
              placeholder={'New Password'}
              classNames={{input: cn.input}}
              disabled={isLoading}
            />
            <PasswordInput
              name={'confirmNewPassword'}
              required={true}
              placeholder={'Confirm New Password'}
              classNames={{input: cn.input}}
              disabled={isLoading}
            />
            <SubmitButton text={'Reset Password'} secondary disabled={isLoading} />
            {isError && (
              <div className={cn.errorMessage}>
                {error?.response?.data?.message || 'Error resetting password'}
              </div>
            )}
          </Form>
          <p className={cn.text}>
            This is your first time logging in (using your temporary password). Please update your
            password to something that you like :)
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
