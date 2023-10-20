import { Express, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { fetchAllUsers } from '../service/user-service'
import { sendGetResponse } from './routeUtils'
import { validateUserCanAccessAny } from '../middleware/accessMiddleware'
import { Action } from '../access-control/accessUtils'
import { ResourceTypes } from '../types'

export const addUserRoutes = (serverApp: Express): void => {
  serverApp.get(
    '/users',
    authMiddleware,
    validateUserCanAccessAny(Action.READ, ResourceTypes.USER),
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const { user } = res.locals
        const users = await fetchAllUsers()
        const newUsers = users.filter((u) => u.id !== user.id)
        newUsers.unshift(user)
        return sendGetResponse(res, 'users', '', { data: users })
      } catch (error) {
        return next(error)
      }
    }
  )
}
