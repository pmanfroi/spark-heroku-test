import {atom, useAtom} from 'jotai'

import {makeRestClient} from '@/rest/core/restClient'
import {getActiveUserJwt} from '@/state/activeUserState'

const APP_BACKEND_PORT = import.meta.env.VITE_APP_BACKEND_PORT
const APP_BACKEND_HOST = import.meta.env.VITE_APP_BACKEND_HOST || 'http://localhost'
const BASE_API_URL = APP_BACKEND_PORT ? `${APP_BACKEND_HOST}:${APP_BACKEND_PORT}` : APP_BACKEND_HOST 


const serverConfig = {
  defaultBaseUrl: BASE_API_URL,
  verbose: false,
  getAccessToken: () => getActiveUserJwt() || '',
}

const restClientAtom = atom(makeRestClient(serverConfig))
export const useRestClient = () => {
  const [restClient, setRestClient] = useAtom(restClientAtom)
  return {restClient, setRestClient}
}
