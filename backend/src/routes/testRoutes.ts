import { Express, Request, Response, NextFunction } from 'express'
import { sendGetResponse } from './routeUtils'

export const addTestRoutes = (serverApp: Express): void => {
  serverApp.get('/noop', async (req: Request, res: Response, next: NextFunction) => {
    try {
      return sendGetResponse(res, '', '', {})
    } catch (e) {
      next(e)
    }
  })
}
