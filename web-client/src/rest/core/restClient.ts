import axios, {Axios, AxiosInstance, AxiosRequestConfig} from 'axios'
import {keys} from 'ramda'
import {isNilOrEmpty, isNotObject, isString} from 'ramda-adjunct'

import {
  throwIf,
  isNotStringOrNumber,
  isNotStringOrNumberOrBool,
  isNotNilOrObject,
  isNotNilOrStringOrObject,
} from '@/utils/generalUtils'

/*

  Several functions w/in this module accept the following serverConfig object
  serverConfig {
    defaultBaseUrl: String: example http://localhost:8888
      * will be default if no url provided for rest actions
      * can be over-ridden with axios config object { baseURL }
    getAccessToken: function to call to get the access token for the current user
    timeout: number: timeout period for requests (default 1000 ms)
    verbose: boolean: should rest interactions be logged to the console (default false)?
  }

  several functions w/in this module accept pathParams & queryParams as inputs, as follows
    pathParams {
      keys: values
      * keys: variables in the path name that will be substituted
      * values: string | number, values that will be substitued in the path
    }
    queryParams {
      keys: values // for query string to be appended
      * keys: query paramater variable names
      * values: query paramater variable values (string, number or bool)
    }
    -or-
    queryParams:
      string: will be appended directly to the request url

    params {
      pathParams
      queryParams
    }

*/

// export const restClient = () => _restClient

// Configure the app wide rest client
type RestClientType = Partial<Axios> & {
  serverConfig: any
  axiosClient: AxiosInstance
  makeGetFn?: (
    restPath: string,
    queryParams: any,
    axiosOptions?: Partial<AxiosRequestConfig>
  ) => () => void
  makePostFn?: (
    restPath: string,
    axiosOptions?: Partial<AxiosRequestConfig>
  ) => ({data, params}: any) => void
  makePutFn?: (
    restPath: string,
    axiosOptions?: Partial<AxiosRequestConfig>
  ) => ({data, params}: any) => void
  makePatchFn?: (
    restPath: string,
    axiosOptions?: Partial<AxiosRequestConfig>
  ) => ({data, params}: any) => void
  makeDeleteFn?: (
    restPath: string,
    axiosOptions?: Partial<AxiosRequestConfig>
  ) => ({data, params}: any) => void
}
type ServerConfigType = {
  defaultBaseUrl?: string
  timeout?: number
  verbose?: boolean
  getAccessToken?: () => string
}
export const makeRestClient = (serverConfig: ServerConfigType) => {
  let restClient: RestClientType = {
    serverConfig,
    axiosClient: axios.create({
      baseURL: serverConfig?.defaultBaseUrl,
      timeout: serverConfig?.timeout || 5000,
    }),
  }

  // rest actions
  restClient.get = (...args) => restClient.axiosClient.get(...args)
  restClient.post = (...args) => restClient.axiosClient.post(...args)
  restClient.put = (...args) => restClient.axiosClient.put(...args)
  restClient.patch = (...args) => restClient.axiosClient.patch(...args)
  restClient.delete = (...args) => restClient.axiosClient.delete(...args)

  /*

    The following makeXXXFn utilities return functions that are context specific

    The functions returned will represent REST actions to specific URLs
    and path/query paramater.

    These functions can be passed directly into 'react-query' query and
    mutation hooks
  */

  /*
    Returns a function that
    * recives no arguments
    * performs a rest GET for the specified restPath/queryParams
    * returns the queried object

    restPath: string: required
      path to rest endpoint

    queryParams: optional
      see documentation above

    examples
      const getThings = restClient.makeGetFn("/things")
      const things = await getThings()

      const getThing1 = restClient.makeGetFn("/things/1")
      const thing1 = await getThing1()
  */
  restClient.makeGetFn =
    (restPath, queryParams, axiosOptions?: Partial<AxiosRequestConfig>) => () =>
      restClient.get?.(_expandRestPath(restPath, {queryParams}), axiosOptions)

  /*
    Returns a function that
    * recives one arument ({data, params}) // params is optional
    * performs a rest POST for the specified restPath/data/pathParams/queryParams
    * returns the created object

    restPath: string: required
      path to rest endpoint, can include replacable path entries // i.e. :someThing

    axiosOptions: {[k:string]: any}: optional
      axios options to pass along to the axios client, // i.e. { baseURL: "baseURL" }
      only support baseURL per restMutateHooks.useRestMutate

    params { // see documentation above
      queryParams // Optional
      pathParams  // Optional
    }

    example
      const createThing = restClient.makePostFn("/things/:bucket")
      const newThing = await createThing({ thing: 'data'}, { pathParams: { bucket: 'blueThings' }})
  */
  restClient.makePostFn =
    (restPath, axiosOptions) =>
    ({data, params}) =>
      restClient.post?.(_expandRestPath(restPath, params), data, axiosOptions)

  /*
    Returns a function that
    * receives one aruments ({ data, params }) // params is optional
    * performs a rest PUT for the specified restPath/data/pathParams/queryParams
    * returns the updated object

    restPath: string: required
      path to rest endpoint, can include replacable path entries // i.e. :someThing

    axiosOptions: {[k:string]: any}: optional
      axios options to pass along to the axios client, // i.e. { baseURL: "baseURL" }
      only support baseURL per restMutateHooks.useRestMutate

    params { // optional:see documentation above
      queryParams // Optional
      pathParams  // Optional
    }

    example
      const updateThing = restClient.makePutFn("/things/:id")
      const updatedThing = await updateThing({ thing: 'updated-data'}, { pathParams: { id: 22 }})
  */
  restClient.makePutFn =
    (restPath, axiosOptions) =>
    ({data, params}) =>
      restClient.put?.(_expandRestPath(restPath, params), data, axiosOptions)

  /*
    Returns a function that
    * receives one arguments ({ data, params }) // params is optional
    * performs a rest PUT for the specified restPath/data/pathParams/queryParams
    * returns the updated object

    restPath: string: required
      path to rest endpoint, can include replacable path entries // i.e. :someThing

    axiosOptions: {[k:string]: any}: optional
      axios options to pass along to the axios client, // i.e. { baseURL: "baseURL" }
      only support baseURL per restMutateHooks.useRestMutate

    params { // optional:see documentation above
      queryParams // Optional
      pathParams  // Optional
    }

    example
      const updateThing = restClient.makePutFn("/things/:id")
      const updatedThing = await updateThing({ thing: 'updated-data'}, { pathParams: { id: 22 }})
  */
  restClient.makePatchFn =
    (restPath, axiosOptions) =>
    ({data, params}) =>
      restClient.patch?.(_expandRestPath(restPath, params), data, axiosOptions)

  /*

  Returns a function that
  * recives one arument (params) // params is optional
  * performs a rest Delete for the specified restPath/data/pathParams/queryParams

  restPath: string: required
    path to rest endpoint, can include replacable path entries // i.e. :someThing

  axiosOptions: {[k:string]: any}: optional
    axios options to pass along to the axios client, // i.e. { baseURL: "baseURL" }
    only support baseURL per restMutateHooks.useRestMutate

  params { // see documentation above
    queryParams // Optional
    pathParams  // Optional
  }

  example
    const deleteThing = restClient.makeDeleteFn("/things/:id")
    await deleteThing({ pathParams: { id: 22 }})
*/
  restClient.makeDeleteFn = (restPath, axiosOptions) => (params) =>
    restClient.delete?.(_expandRestPath(restPath, params), axiosOptions)

  /*
    all clients use these middlewares
  */

  restClient.axiosClient.interceptors.request.use(
    _requestPreprocessor({
      verbose: !!serverConfig?.verbose,
      getAccessToken: serverConfig?.getAccessToken || (() => 'fakeApiToken'),
    })
  )

  restClient.axiosClient.interceptors.response.use(_responsePostProcessor(serverConfig?.verbose))

  return restClient
}

//*****************************************************************************
// Module Only Stuff
//*****************************************************************************

// const _requestPreprocessor = (verbose = false) => (req = {}) => {
// opts = {
//   verbose: bool
//   getAccessToken: function that returns auth token the request
// }
type RequestPreprocessorType = {
  opts: {
    verbose: boolean
    getAccessToken: () => string
  }
  req: {
    method?: string
    baseURL?: string
    url?: string
    data?: any
    headers: any
  }
}
const _requestPreprocessor =
  (opts: RequestPreprocessorType['opts']) => (req: RequestPreprocessorType['req']) => {
    const {verbose, getAccessToken} = opts
    const accessToken = getAccessToken()
    const {method, baseURL, url, data} = req
    if (verbose) {
      console.debug(`\n${method} (new) ${baseURL}${url}`)
      if (data) console.debug('body', data)
    }
    return accessToken
      ? {...req, headers: {...req.headers, Authorization: `Bearer ${accessToken}`}}
      : req
  }

type ResponsePostProcessorType = {
  data: any
  status: number
  statusText: string
}
const _responsePostProcessor =
  (verbose: boolean = false) =>
  (rsp: ResponsePostProcessorType) => {
    const {data, status, statusText} = rsp
    if (verbose) console.debug(`response: ${status} ${statusText} `, data || '')

    // only returning data potion of the response
    return data
  }

/*
  path may include variable params such as :entityId

  params {
    pathParams: {[k:string]: any} (see docs above)
    queryParams: {[k:string]: any} || string (see docs above)
  }

  example
    path:  /v1/spark/appplatforms/:appPlatformId
    params = {
      pathParms { appPlatformId: 22 }
      queryParams { hydrate: true}
    }
    output
      /v1/spark/appplatforms/22?hydrate=true
*/

export const _expandRestPath = (restPath, params) => {
  if (isNilOrEmpty(params)) return restPath
  throwIf(isNotObject(params), 'expandUrl(): non object supplied for params')

  const {pathParams, queryParams} = params

  if (isNilOrEmpty(pathParams) && isNilOrEmpty(queryParams)) return restPath
  throwIf(isNotNilOrObject(pathParams), 'expandUrl(): non object supplied for pathParams')
  throwIf(isNotNilOrStringOrObject(queryParams), 'expandUrl(): non object supplied for queryParams')

  let expandedPath = restPath

  // insert path params
  if (pathParams) {
    expandedPath = keys(pathParams).reduce((accumPath, paramKey) => {
      const paramValue = pathParams[paramKey]
      throwIf(
        isNotStringOrNumber(paramValue),
        'expandRestPath(): param value is not a string or number'
      )
      const regExParamKey = new RegExp(`:${String(paramKey)}`, 'g')
      return accumPath.replace(regExParamKey, String(paramValue))
    }, expandedPath)
  }

  // append query params
  if (queryParams) {
    expandedPath = isString(queryParams)
      ? expandedPath + queryParams
      : keys(queryParams).reduce((accumPath, queryKey, idx) => {
          const queryValue = queryParams[queryKey]
          throwIf(
            isNotStringOrNumberOrBool(queryValue),
            'expandRestPath(): query value is not a string or number or bool'
          )
          return accumPath + `${idx === 0 ? '?' : '&'}${String(queryKey)}=${String(queryValue)}`
        }, expandedPath)
  }
  return expandedPath
}
