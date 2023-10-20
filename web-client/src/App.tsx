import {compose} from 'ramda'
import {useEffect} from 'react'
import Modal from 'react-modal'
import {QueryClient, QueryClientProvider} from 'react-query'
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'

import {Login, ResetPassword} from '@/pages'
import {useGetMe} from '@/rest/authRestHooks'
import {useActiveUser} from '@/state/activeUserState'
import {useIsLoggedIn} from '@/state/appState'

import AppLayout from './app/AppLayout'

Modal.setAppElement('#root')

const withQueryClient = (toWrap) => {
  const client = new QueryClient()
  return <QueryClientProvider {...{client}}>{toWrap}</QueryClientProvider>
}

const withRouter = (toWrap) => <Router>{toWrap}</Router>

const cn = {
  appDefaults: 'text-white bg-neutral-900',
}

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/ResetPassword" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" replace={true} />} />
    </Routes>
  )
}

const AppRoot = () => {
  const {isLoggedIn, setIsLoggedIn} = useIsLoggedIn()
  const {data, isLoading, failureCount} = useGetMe()

  const {setActiveUser, getActiveUserJwt} = useActiveUser()
  const token = getActiveUserJwt()

  useEffect(() => {
    if (data && token) {
      setActiveUser(data, token)
      setIsLoggedIn(true)
    }
  }, [data])

  if (isLoading && !failureCount) {
    return <div className={'text-center'}>Loading Spark..</div>
  }

  return isLoggedIn ? <AppLayout className={cn.appDefaults} /> : <PublicRoutes />
}

const App = () => compose(withRouter, withQueryClient)(<AppRoot />)

export default App
