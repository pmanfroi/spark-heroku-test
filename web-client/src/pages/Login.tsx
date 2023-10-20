import Form, {EmailInput, PasswordInput, SubmitButton} from '@/components/forms/Form'
import AppLogo from '@/components/ui/AppLogo'
import {useLoginUser} from '@/rest/authRestHooks'
import {useActiveUser} from '@/state/activeUserState'
import {useIsLoggedIn} from '@/state/appState'
import cns from '@/utils/classnames'

interface Props {
  className?: string // applied to root container
}

const Login = ({className}: Props) => {
  const {setIsLoggedIn} = useIsLoggedIn()
  const {setActiveUser} = useActiveUser()

  const {loginUser, isLoading, isError, error} = useLoginUser({
    onSuccess: ({data}) => {
      setActiveUser(data.user, data.accessToken)
      setIsLoggedIn(true)
    },
  })

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

  const logoSize = 88

  const onSubmit = ({email, password}) => {
    loginUser({email, password}, {})
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
          <AppLogo width={logoSize} height={logoSize} />
          <h1>Welcome To Spark!</h1>
        </div>
        <div className={cn.card}>
          <Form title={''} withPanel={false} onSubmit={onSubmit}>
            <EmailInput
              name={'email'}
              required={true}
              placeholder={'Email'}
              classNames={{input: cn.input}}
              disabled={isLoading}
            />
            <PasswordInput
              name={'password'}
              required={true}
              placeholder={'Password'}
              classNames={{input: cn.input}}
              disabled={isLoading}
            />
            <SubmitButton text={'Create Ideas!'} secondary disabled={isLoading} />
            {isError && (
              <div className={cn.errorMessage}>
                {error?.response?.data?.message || 'Error logging in'}
              </div>
            )}
          </Form>
          <p className={cn.text}>
            If you don't have a Spark account yet, please contact{' '}
            <span className={cn.contact}>steve@sentosatech.com</span> to join!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
