import { Express, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { DB } from '../db/db'
import { sendGetResponse } from './routeUtils'
import {
  create as createProblemVariant,
  deleteProblemVariant,
  updatePreferredProblemVariant,
  updateProblemVariant,
} from '../service/problemVariant'
import {
  updateProblemVariantRating,
  create as createProblemVariantRating,
  getAll as getAllProblemVariantRating,
} from '../service/problemVariantRating'
import {
  create as createSubProblem,
  remove as deleteSubProblem,
  patch as patchSubProblem,
} from '../service/subProblem'
import { sendPostResponse } from './routeUtils'
import {
  validateUserCanAccessAny,
  validateUserCanAccessAnyOrOwn,
} from '../middleware/accessMiddleware'
import { Action } from '../access-control/accessUtils'
import { ResourceTypes } from '../types'

export const addProblemVariantRoutes = (db: DB, serverApp: Express): void => {
  serverApp.post(
    '/problem-variants',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body.userId = res.locals.user.id
        const problem = await createProblemVariant(db, req.body)

        return sendPostResponse(res, 'successfully created problem variant', { data: problem })
      } catch (e) {
        console.log(e)
        next(e)
      }
    }
  )

  serverApp.get(
    '/problem-variants/:id/problem-variant-ratings',
    authMiddleware,
    validateUserCanAccessAny(Action.READ, ResourceTypes.PROBLEM),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const problemVariantRatings = await getAllProblemVariantRating(
          db,
          req.params.id,
          res.locals.user.id
        )

        return sendGetResponse(res, '', '', {
          data: problemVariantRatings,
        })
      } catch (e) {
        console.log(e)
        next(e)
      }
    }
  )

  serverApp.patch(
    '/problem-variants/:id',
    authMiddleware,
    validateUserCanAccessAnyOrOwn(Action.UPDATE, ResourceTypes.PROBLEM),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { content, isPreferred } = req.body
        const { id } = req.params

        const problemVariant = await updateProblemVariant(id, { content, isPreferred })

        return sendPostResponse(res, 'Successfully updated problem variant', {
          data: problemVariant,
        })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.post(
    '/problem-variant-ratings',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body.creatorId = res.locals.user.id
        const ratings = await createProblemVariantRating(db, req.body)
        return sendPostResponse(res, 'Successfully created problem variant ratings', ratings)
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.patch(
    '/problem-variant-ratings',
    authMiddleware,
    validateUserCanAccessAnyOrOwn(Action.UPDATE, ResourceTypes.PROBLEM),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id, rating } = req.body

        const problemVariant = await updateProblemVariantRating(id, { rating }, db)
        return sendPostResponse(res, 'Successfully updated problem variant rating', {
          data: problemVariant,
        })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.patch(
    '/preferred-problem-variant',
    authMiddleware,
    validateUserCanAccessAnyOrOwn(Action.UPDATE, ResourceTypes.PROBLEM),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.body

        const problemVariant = await updatePreferredProblemVariant(id, db)
        return sendPostResponse(res, 'Successfully updated preferred problem variant', {
          data: problemVariant,
        })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.delete(
    '/problem-variants/:id',
    authMiddleware,
    validateUserCanAccessAnyOrOwn(Action.DELETE, ResourceTypes.PROBLEM),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params
        const problemVariant = await deleteProblemVariant(db, id)

        return sendPostResponse(res, 'Successfully deleted problem variant', {
          data: problemVariant,
        })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.post(
    '/problem-variants/:variant_id/sub-problems',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body.createdBy = res.locals.user.id
        const subProblem = await createSubProblem(db, {
          ...req.body,
          problemVariantId: req.params.variant_id,
        })

        return sendPostResponse(res, 'Successfully created sub problem', { data: subProblem })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.delete(
    '/problem-variants/:variant_id/sub-problems/:id',
    authMiddleware,
    validateUserCanAccessAnyOrOwn(Action.DELETE, ResourceTypes.PROBLEM),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await deleteSubProblem(db, {
          subProblemId: req.params.id,
          problemVariantId: req.params.variant_id,
        })

        return res
          .status(200)
          .send({ message: `successfully deleted sub-problem ${req.params.variant_id}` })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.patch(
    '/problem-variants/:variant_id/sub-problems/:id',
    authMiddleware,
    validateUserCanAccessAnyOrOwn(Action.UPDATE, ResourceTypes.PROBLEM),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const subProblem = await patchSubProblem(db, {
          subProblemId: req.params.id,
          problemVariantId: req.params.variant_id,
          content: req.body.content,
        })

        return res.status(200).send({
          message: `successfully updated sub-problem ${req.params.variant_id}`,
          data: subProblem,
        })
      } catch (e) {
        next(e)
      }
    }
  )
}
