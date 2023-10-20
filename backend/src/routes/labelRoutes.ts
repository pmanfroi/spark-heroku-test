import { Express, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { DB } from '../db/db'
import { LabelUpdateData, ResourceTypes } from '../types'
import { sendGetResponse, sendPostResponse } from './routeUtils'
import {
  create as createLabel,
  update as updateLabel,
  getMany as getLabels,
  get as getLabel,
} from '../service/label'
import {
  validateUserCanAccessAny,
  validateUserCanAccessAnyOrOwn,
} from '../middleware/accessMiddleware'
import { Action } from '../access-control/accessUtils'

export const addLabelRoutes = (db: DB, serverApp: Express): void => {
  serverApp.get(
    '/labels',
    authMiddleware,
    validateUserCanAccessAny(Action.READ, ResourceTypes.LABEL),
    async (req: Request, res: Response, next: NextFunction) => {
      let orderByRequest: any
      const { orderBy } = req.query
      if (Array.isArray(orderBy)) {
        orderByRequest = orderBy.map((o) => ({ field: o, order: 'desc' }))
      }
      if (typeof orderBy === 'string') {
        orderByRequest = [{ field: orderBy, order: 'desc' }]
      }

      try {
        const labelData = await getLabels(orderByRequest)
        return sendGetResponse(res, '', '', { data: labelData })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.get(
    '/label/:labelId',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      const { labelId } = req.params
      if (!labelId) {
        return next(new Error('Label ID not provided'))
      }

      try {
        const response = await getLabel(labelId)

        return sendGetResponse(res, '', '', { data: response })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.patch(
    '/labels/:labelId',
    authMiddleware,
    validateUserCanAccessAnyOrOwn(Action.UPDATE, ResourceTypes.LABEL),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { labelId } = req.params
        const { name, textColor, bgColor } = req.body

        const labelData: LabelUpdateData = {
          textColor,
          bgColor,
          name,
        }

        await updateLabel(labelId, labelData)

        return sendPostResponse(res, 'Successfully updated label', {})
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.post(
    '/labels',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const label = await createLabel(db, req.body)

        return sendPostResponse(res, 'successfully created label', { data: label })
      } catch (e) {
        console.log(e)
        next(e)
      }
    }
  )
}
