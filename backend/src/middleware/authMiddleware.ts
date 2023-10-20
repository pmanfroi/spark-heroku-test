import { Request, Response, NextFunction } from 'express'
import { getCognitoUserFromToken, CognitoUserType } from '../service/cognitoService'
import { ForbiddenError, NotFoundError, InternalServerError } from '../errors'
import { fetchUserByCognitoId } from '../service/user-service'
import { isNotArrayOfLength } from '../utils/generalUtils'
import grants from '../access-control/grants'

const getTokenFromHeader = (req): string => {
  let token = ''
  if (req.headers && req.headers.authorization) {
    let type = req.headers.authorization.split(' ')[0]
    if (type === 'Token' || type === 'Bearer') token = req.headers.authorization.split(' ')[1]
  }
  return token
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromHeader(req)
    if (!token) throw new ForbiddenError('Token not sent')

    const cognitoUser: CognitoUserType = await getCognitoUserFromToken(token)

    // for now we are only allowing one role per user
    if (isNotArrayOfLength(1, cognitoUser?.roles))
      throw new InternalServerError(
        'ERROR during user authentication. User must have exactly 1 role, but ' +
          `${cognitoUser?.email} has the following role list: ${JSON.stringify(cognitoUser?.roles)}`
      )

    const user = await fetchUserByCognitoId(cognitoUser.userId || '')
    if (!user) throw new NotFoundError('User not found')

    res.locals = {
      ...res.locals,
      user: {
        ...user.toJSON(),
        email: cognitoUser.email,
        role: cognitoUser?.roles[0],
        permissions: grants[cognitoUser?.roles[0]],
      },
    }
    return next()
  } catch (error) {
    return next(error)
  }
}
