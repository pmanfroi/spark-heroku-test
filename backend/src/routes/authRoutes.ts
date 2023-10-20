import { Express, Request, Response, NextFunction } from 'express'
import { BadRequestError, InternalServerError, ValidationError } from '../errors'
import { fetchUserByCognitoId, saveUserFirstTime } from '../service/user-service'
import { getCognitoUserFromCognitoId, signInUser, updatePassword } from '../service/cognitoService'
import { sendPostResponse, sendGetResponse } from './routeUtils'
import { authMiddleware } from '../middleware/authMiddleware'
import { isNotArrayOfLength } from '../utils/generalUtils'
import grants from '../access-control/grants'
import { validateUserCanAccessAnyOrOwn } from '../middleware/accessMiddleware'
import { Action } from '../access-control/accessUtils'
import { ResourceTypes } from '../types'

export const addAuthRoutes = (serverApp: Express): void => {
  serverApp.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        throw new ValidationError('Email and password are required')
      }
      const { accessToken, userData, forceResetPasswordMessage } = await signInUser(email, password)
      if (forceResetPasswordMessage === 'FORCE_RESET_PASSWORD') {
        throw new BadRequestError('You need to reset your password')
      }
      if (userData) {
        const dbUser = await fetchUserByCognitoId(userData.sub)
        const cognitoUser = await getCognitoUserFromCognitoId(userData.sub)

        // for now we are only allowing one role per user
        if (isNotArrayOfLength(1, cognitoUser?.roles))
          throw new InternalServerError(
            'ERROR during user authentication. User must have exactly 1 role, but ' +
              `${cognitoUser?.email} has the following role list: ${JSON.stringify(
                cognitoUser?.roles
              )}`
          )

        return sendPostResponse(res, 'Successfully logged in', {
          accessToken,
          user: {
            ...dbUser.dataValues,
            email: cognitoUser.email,
            role: cognitoUser?.roles[0],
            permissions: grants[cognitoUser?.roles[0]],
          },
        })
      }
    } catch (e) {
      next(e)
    }
  })

  serverApp.post(
    '/auth/reset-password',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, oldPassword, newPassword, confirmNewPassword } = req.body
        if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
          throw new ValidationError('Missing body params')
        }
        if (oldPassword === newPassword) {
          throw new BadRequestError('Old password and new password cannot be the same')
        }
        if (newPassword != confirmNewPassword) {
          throw new BadRequestError('Passwords do not match')
        }

        const { forceResetPasswordMessage } = await signInUser(email, oldPassword)
        await updatePassword(email, newPassword)
        const { accessToken, userData } = await signInUser(email, newPassword)
        /**
         * If reason why signIn failed with old password because new password is required
         * that means that user is logging in for the first time, and we need to save
         * all his data from cognito to postgres
         */
        if (userData && forceResetPasswordMessage === 'FORCE_RESET_PASSWORD') {
          await saveUserFirstTime(userData)
        }
        if (userData) {
          const user = await fetchUserByCognitoId(userData.sub)
          return sendPostResponse(res, 'Successfully changed password', { accessToken, user })
        }
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.get(
    '/auth/me',
    authMiddleware,
    validateUserCanAccessAnyOrOwn(Action.READ, ResourceTypes.USER),
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const { user } = res.locals
        return sendGetResponse(res, 'user', user.id, { data: user })
      } catch (error) {
        return next(error)
      }
    }
  )
}
