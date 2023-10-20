import { Express, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { DB } from '../db/db'
import { ProblemSurveyUpdateData, ResourceTypes } from '../types'
import { sendGetResponse, sendPostResponse } from './routeUtils'
import {
  get as getProblemSurvey,
  create as createProblemSurvey,
  updateProblemSurvey,
  getMany as getProblemSurveys,
  createProblemSurveyVote,
  updateProblemSurveyVote,
  getProblemSurveyVotes,
  getUserSurveyVote,
  getUserSurveyVotes,
} from '../service/problemSurvey'
import {
  validateUserCanAccessAny,
  validateUserCanAccessAnyOrOwn,
} from '../middleware/accessMiddleware'
import { Action } from '../access-control/accessUtils'

export const addProblemSurveyRoutes = (db: DB, serverApp: Express): void => {
  serverApp.get(
    '/problem-surveys',
    authMiddleware,
    validateUserCanAccessAny(Action.READ, ResourceTypes.PROBLEM_SURVEY),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const problemSurveysData = await getProblemSurveys()

        const parsedProblemSurveysData = problemSurveysData?.map(({ dataValues }) => {
          const {
            users,
            problems,
            votes,
            createdBy,
            createdAt,
            updatedAt,
            deletedAt,
            ...problemSurveyData
          } = dataValues
          const thumbsUpCount = votes?.filter(({ vote }) => vote === 2)?.length || 0
          const thumbsDownCount = votes?.filter(({ vote }) => vote === 1)?.length || 0
          return {
            ...problemSurveyData,
            usersCount: users?.length || 0,
            problemsCount: problems?.length || 0,
            thumbsUpCount,
            thumbsDownCount,
          }
        })

        return sendGetResponse(res, '', '', { data: parsedProblemSurveysData })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.get(
    '/problem-survey/:problemSurveyId',
    authMiddleware,
    validateUserCanAccessAny(Action.READ, ResourceTypes.PROBLEM_SURVEY),
    async (req: Request, res: Response, next: NextFunction) => {
      const { problemSurveyId } = req.params
      if (!problemSurveyId) {
        return next(new Error('Problem Survey ID not provided'))
      }

      try {
        const problemData = await getProblemSurvey(problemSurveyId)

        return sendGetResponse(res, '', '', { data: problemData })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.patch(
    '/problem-survey/:problemSurveyId',
    authMiddleware,
    validateUserCanAccessAnyOrOwn(Action.UPDATE, ResourceTypes.PROBLEM_SURVEY),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { user } = res.locals
        const { problemId } = req.params
        const { status, title, description, ownedBy, problemIds } = req.body

        const problemData: ProblemSurveyUpdateData = {
          status,
          title,
          description,
          ownedBy,
          problemIds,
        }

        await updateProblemSurvey(problemId, user, problemData)

        return sendPostResponse(res, 'Successfully updated problem survey', {})
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.post(
    '/problem-survey',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body.createdBy = res.locals.user.id
        const problemSurvey = await createProblemSurvey(db, req.body)

        return sendPostResponse(res, 'successfully created problem survey', { data: problemSurvey })
      } catch (e) {
        console.log(e)
        next(e)
      }
    }
  )

  serverApp.get(
    '/problem-survey-votes/:problemSurveyId',
    authMiddleware,
    validateUserCanAccessAny(Action.READ, ResourceTypes.PROBLEM_SURVEY),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { problemSurveyId } = req.params
        const problemSurveyVotesData = await getProblemSurveyVotes(problemSurveyId)
        return sendGetResponse(res, '', '', { data: problemSurveyVotesData })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.get(
    '/user-survey-vote/:problemSurveyId',
    authMiddleware,
    validateUserCanAccessAny(Action.READ, ResourceTypes.PROBLEM_SURVEY),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { problemSurveyId } = req.params
        const userSurveyVoteData = await getUserSurveyVote(res.locals.user.id, problemSurveyId)
        return sendGetResponse(res, '', '', { data: userSurveyVoteData })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.get(
    '/user-survey-votes',
    authMiddleware,
    validateUserCanAccessAny(Action.READ, ResourceTypes.PROBLEM_SURVEY),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userSurveyVotesData = await getUserSurveyVotes(res.locals.user.id)
        return sendGetResponse(res, '', '', { data: userSurveyVotesData })
      } catch (e) {
        next(e)
      }
    }
  )

  serverApp.post(
    '/problem-survey-vote',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body.createdBy = res.locals.user.id
        const problemSurveyVote = await createProblemSurveyVote(db, req.body)

        return sendPostResponse(res, 'successfully created problem survey vote', {
          data: problemSurveyVote,
        })
      } catch (e) {
        console.log(e)
        next(e)
      }
    }
  )

  serverApp.patch(
    '/problem-survey-vote/:problemSurveyId',
    authMiddleware,
    validateUserCanAccessAnyOrOwn(Action.UPDATE, ResourceTypes.PROBLEM_SURVEY),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { user } = res.locals
        const { problemSurveyId } = req.params
        const { vote } = req.body

        await updateProblemSurveyVote(problemSurveyId, user, vote)

        return sendPostResponse(res, 'Successfully updated problem survey vote', {})
      } catch (e) {
        next(e)
      }
    }
  )
}
