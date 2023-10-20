export const reportError = (errMsg: string, error: Error) => {
  if (errMsg) console.error(errMsg)
  if (error) console.error(error)
}

enum ErrorNames {
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  BadRequest = 'BadRequest',
  NotFound = 'NotFound',
  Conflict = 'Conflict',
  InternalServerError = 'InternalServerError',
  ValidationError = 'ValidationERror',
}

enum StatusCodes {
  Unauthorized = 401,
  Forbidden = 403,
  BadRequest = 400,
  NotFound = 404,
  Conflict = 409,
  ValidationError = 422,
  InternalServerError = 500,
}

export class ValidationError extends Error {
  status: number
  type: ErrorNames

  constructor(message) {
    super(message)
    this.name = ErrorNames.ValidationError
    this.status = StatusCodes.ValidationError
  }
}

export class NotFoundError extends Error {
  status: number
  type: ErrorNames
  data?: any

  constructor(message, data?: any) {
    super(message)
    this.name = ErrorNames.NotFound
    this.status = StatusCodes.NotFound
    this.data = data
  }
}

export class ConflictError extends Error {
  status: number
  type: ErrorNames
  data?: any

  constructor(message, data?: any) {
    super(message)
    this.name = ErrorNames.Conflict
    this.status = StatusCodes.Conflict
    this.data = data
  }
}

export class BadRequestError extends Error {
  status: number
  type: ErrorNames
  data?: any

  constructor(message, data?: any) {
    super(message)
    this.name = ErrorNames.BadRequest
    this.status = StatusCodes.BadRequest
    this.data = data
  }
}

export class InternalServerError extends Error {
  status: number
  type: ErrorNames

  constructor(message) {
    super(message)
    this.name = ErrorNames.InternalServerError
    this.status = StatusCodes.InternalServerError
  }
}

export class UnauthorizedError extends Error {
  status: number
  type: ErrorNames

  constructor(message) {
    super(message)
    this.name = ErrorNames.Unauthorized
    this.status = StatusCodes.Unauthorized
  }
}

export class ForbiddenError extends Error {
  status: number
  type: ErrorNames

  constructor(message) {
    super(message)
    this.name = ErrorNames.Forbidden
    this.status = StatusCodes.Forbidden
  }
}
