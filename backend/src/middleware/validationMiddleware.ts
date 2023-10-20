import { Request, Response, NextFunction } from 'express'
import * as OpenApiValidator from 'express-openapi-validator'
import { ApiErrorResponse } from '../types'
import { NotFoundError } from '../errors'

interface OpenApiError extends Error {
  status: number
  errors: any[]
}

// Error specific to schema validation
class ResponseValidationError extends Error {
  status: number
  cause: string
  errors: any[]
  restAction: string
  responseBody: any

  constructor(openApiValidationError: OpenApiError, responseBody: any, req: Request) {
    const restAction = `${req?.method} ${req?.path}`
    console.log('restAction: ', restAction)
    const errMsg = `ERROR: schema validation of response failed for '${restAction}'`
    super(errMsg)
    this.status = 400 // always make 400 to conform to spark response spec
    this.name = 'ValidationError'
    this.cause = openApiValidationError?.message || ''
    this.restAction = restAction
    this.responseBody = responseBody || {}
    this.errors = [
      errMsg,
      openApiValidationError?.message || 'Response Validation Error',
      ...(openApiValidationError?.errors || []),
      { responseBody: this.responseBody },
    ]
    this.stack = openApiValidationError?.stack || ''
  }

  log(): void {
    let errStr = this.message || 'Response Validator Missing Error Message'
    if (this?.status) errStr += `\nStatus: ${this.status}`
    if (this?.name) errStr += `\nName: ${this.name}`
    if (this?.cause) errStr += `\nCause: ${this.cause}`
    if (this?.restAction) errStr += `\nRest Action: ${this.restAction}`
    console.error(errStr)
    console.error('Errors: ', this?.errors)
    console.error('responseBody', JSON.stringify(this.responseBody, null, 2))
    console.error('Call stack: ', this.stack)
  }
}

export const schemaValidator = (openApiSpec: string) =>
  OpenApiValidator.middleware({
    apiSpec: openApiSpec,
    ignorePaths: /.*\/server-status$/,
    validateSecurity: true,
    validateRequests: true, // (default)
    validateResponses: {
      onError: (err, body, req) => {
        // ResponseValidationError will contain all info needed to log problems
        throw new ResponseValidationError(err, body, req)
      },
    },
  })

// TODO: convert this into a switch statement
export const errorHandler = (
  err: Error & { status?: number; errors?: unknown[] },
  req: Request,
  rsp: Response,
  _next: NextFunction
): void => {
  if (err instanceof ResponseValidationError) {
    // details to the console
    err.log()

    // Response validation error is always internal server error
    const errorResponse: ApiErrorResponse = {
      status: 500,
      message: `Internal server error: response for '${err?.restAction}' was invalid`,
      data: err?.errors || undefined,
    }
    rsp.status(errorResponse.status).json(errorResponse)
    return
  }

  // TODO: this is a hack, as the validateResponse function does not seem to be called for
  // responses to post functions (maybe express is getting in the way?)
  else if (err?.errors) {
    // @ts-ignore
    const openApiError: OpenApiError = err
    const validationErr = new ResponseValidationError(openApiError, 'body not available', req)

    validationErr.log()

    if (req?.body) console.error('request body', JSON.stringify(req?.body, null, 2))

    const errorResponse: ApiErrorResponse = {
      status: err?.status || 500,
      message: `Inavalid input for rest call: '${validationErr?.restAction}`,
      data: err?.errors || undefined,
    }
    rsp.status(errorResponse.status).json(errorResponse)
    return
  }

  // TODO: currently we have many ways of determining an API error
  // We need to create a single base class and extend that.
  else if (err instanceof NotFoundError) {
    const errorData: ApiErrorResponse = {
      status: 404,
      message: err.message,
      data: err.data,
    }
    rsp.status(404).json(errorData)
    return _next()
  }

  console.error('Error: ', err)
  const errorResponse: ApiErrorResponse = {
    status: err?.status || 500,
    message: err?.message || '',
  }
  rsp.status(errorResponse.status).json(errorResponse)
}
