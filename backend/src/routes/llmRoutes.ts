import { Express, Request, Response, NextFunction } from 'express'
import { sendGetResponse } from './routeUtils'
import { dailyDigestLlm } from '../service/ml/service-topics-generator'
import { getDailyDigestData, setDailyDigestData } from '../service/ml/initializer-helper'

export const addLlmRoutes = (serverApp: Express): void => {
  serverApp.get('/daily-digest', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dailyDigestData = getDailyDigestData()
      if (dailyDigestData) {
        return sendGetResponse(res, '', '', { data: dailyDigestData, cached: true })
      }
      const data = await dailyDigestLlm()
      setDailyDigestData(data)
      return sendGetResponse(res, '', '', { data })
    } catch (e) {
      next(e)
    }
  })
}
