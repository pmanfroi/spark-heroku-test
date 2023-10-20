import { Express, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { DB } from '../db/db'
import { ProblemUpdateData, ResourceTypes } from '../types'
import { sendGetResponse, sendPostResponse } from './routeUtils'
import { getAllCategories } from '../service/categoriesService'
import {
  getByPublicId as getProblemByPublicId,
  create as createProblem,
  updateProblem,
  getMany as getProblems,
  parseProblemResponse,
} from '../service/problem'
import {
  validateUserCanAccessAny,
  validateUserCanAccessAnyOrOwn,
} from '../middleware/accessMiddleware'
import { Action } from '../access-control/accessUtils'

export const addProblemRoutes = (db: DB, serverApp: Express): void => {
  serverApp.get(
    '/problem-categories',
    authMiddleware,
    validateUserCanAccessAny(Action.READ, ResourceTypes.PROBLEM),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const categories = await getAllCategories()
        return sendGetResponse(res, 'categories', 'selma', { data: categories })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.get(
    '/problems',
    authMiddleware,
    validateUserCanAccessAny(Action.READ, ResourceTypes.PROBLEM),
    async (req: Request, res: Response, next: NextFunction) => {
      const { user } = res.locals
      const getProblemRequest: any = {}
      const { orderBy } = req.query
      if (Array.isArray(orderBy)) {
        getProblemRequest.orderBy = orderBy.map((o) => ({ field: o, order: 'desc' }))
      }
      if (typeof orderBy === 'string') {
        getProblemRequest.orderBy = [{ field: orderBy, order: 'desc' }]
      }
      getProblemRequest.userId = user.id
      if (req.query.perspective) {
        getProblemRequest.userId = req.query.perspective
      }

      try {
        const problemData = await getProblems(db, getProblemRequest)
        return sendGetResponse(res, '', '', { data: problemData })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.get(
    '/problem/:publicId',
    authMiddleware,
    validateUserCanAccessAny(Action.READ, ResourceTypes.PROBLEM),
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = res.locals.user.id

      const { publicId } = req.params
      if (!publicId) {
        return next(new Error('Problem Public ID not provided'))
      }

      try {
        const problemData = await getProblemByPublicId(publicId, userId)

        const response = parseProblemResponse(problemData)

        return sendGetResponse(res, '', '', { data: response })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.patch(
    '/problems/:problemId',
    authMiddleware,
    validateUserCanAccessAnyOrOwn(Action.UPDATE, ResourceTypes.PROBLEM),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { user } = res.locals
        const { problemId } = req.params
        const { status, title, categories, labels } = req.body

        const problemData: ProblemUpdateData = {
          status,
          title,
          categories,
          labels,
        }

        await updateProblem(problemId, user, problemData)

        return sendPostResponse(res, 'Successfully updated problem', {})
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.post(
    '/problems',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body.userId = res.locals.user.id
        const problem = await createProblem(db, req.body)

        return sendPostResponse(res, 'successfully created problem', { data: problem })
      } catch (e) {
        console.log(e)
        next(e)
      }
    }
  )
}
