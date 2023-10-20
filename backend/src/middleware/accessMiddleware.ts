import { NextFunction, Request, Response } from 'express'
import { ResourceTypes } from '../types'
import { curry } from 'ramda'
import { canPerformAction, Action, WhichResource } from '../access-control/accessUtils'
import { getResourceOwnerId, idPropNamesByResourceType } from '../db/dbUtils'
import { ForbiddenError, InternalServerError } from '../errors'
import { propOrThrow } from '../utils/generalUtils'

interface UserAccessInfo {
  email?: string
  role?: string
  permissions?: any[]
  errorMsg?: string
  id?: string
}

// prettier-ignore
export const validateUserCanAccessAny = curry(
  (action: Action, resourceType: ResourceTypes, req: Request, res: Response, next: NextFunction) => 
{
    const userInfo = getUserInfoFromExpress('validateUserCanAccessAnyOrOwn()', res)
    if (userInfo?.errorMsg) return next(new InternalServerError(userInfo?.errorMsg))
  
    canPerformAction(action, resourceType, WhichResource.ANY, userInfo?.permissions)
      ? next()
      : next(new ForbiddenError(
          `User ${userInfo?.email}does not have read any access to resource type ${resourceType}`))
})

/*
  Passes if
    * user can access any
    * user can access own and user owns the resource
  Otherwise
    throws ForbiddenError
*/
// prettier-ignore
export const validateUserCanAccessAnyOrOwn = curry(
  async (action: Action, resourceType: ResourceTypes, req: Request, res: Response, next: NextFunction) => 
{
    const userInfo = getUserInfoFromExpress('validateUserCanAccessAnyOrOwn()', res)
    if (userInfo?.errorMsg) return next(new InternalServerError(userInfo.errorMsg))

    // If user can access `ANY`, then it can read its own
    if (canPerformAction(action, resourceType, WhichResource.ANY, userInfo?.permissions))
      return next()

    if (!canPerformAction(action, resourceType, WhichResource.OWN, userInfo?.permissions))
      return next(
        new ForbiddenError(
          `User ${userInfo?.email} does not have access to resource type ${resourceType}`
        )
      )

    const { restIdName, dbIdName } = idPropNamesByResourceType(resourceType)
    const resourceId = propOrThrow(
      `validateUserCanAccessAnyOrOwn(${resourceType})`,
      restIdName,
      req.params
    )

    // OK, if we get here, the user has canAccessOwn access.
    // Next we need to see if the user owns the resource
    const ownerId = await getResourceOwnerId(resourceType, dbIdName, resourceId)
    if (ownerId !== userInfo?.id)
      return next(
        new ForbiddenError(
          `User ${userInfo?.email} does not own resource ${resourceType} with id ${resourceId}`
        )
      )

    return next()
  }
)

/*
  package all of this ugly stuff in a fxn to keep the code above cleaner
  If there is a problem, rsp.errorMsg will be returned, otherwise user access info is returned
*/
// prettier-ignore
const getUserInfoFromExpress = (op: string, res: Response) : UserAccessInfo => {
  const { user } = res?.locals || {}
  // Throw errors on props required for access validation
  if (!user)
    return { errorMsg: `${op}: User not found on express res.locals` }
  if (!user?.permissions)
    return { errorMsg: `${op}: User permissions not found on express res.locals.user` }
  return {
    email: user?.email,
    role: user?.role,
    permissions: user?.permissions,
    id: user?.id,
  }
}
