import { ProblemSurvey } from '../db/models/problemSurvey'
import { ProblemSurveyVote } from '../db/models/problemSurveyVote'
import { UserSurveyLink } from '../db/models/userSurveyLink'
import { Problem } from '../db/models/problem'
import { ProblemSurveyLink } from '../db/models/problemSurveyLink'
import { User } from '../db/models/user'
import { DB, getDB } from '../db/db'
import { NotFoundError, BadRequestError } from '../errors'
import { literal } from 'sequelize'
import {
  ProblemSurveyCreateData,
  ProblemSurveyUpdateData,
  ProblemSurveyVoteCreateData,
  ProblemSurveyVoteUpdateData,
  SurveyStatus,
  surveyStatusList,
} from '../types'

export const get = async (problemSurveyId: string): Promise<ProblemSurvey> => {
  const result = await ProblemSurvey.findOne({
    where: {
      id: problemSurveyId,
    },
    include: [
      {
        model: User,
      },
    ],
  })

  if (!result) {
    throw new NotFoundError(`problemSurvey with id=${problemSurveyId} does not exist`)
  }

  return result
}

export const getMany = async (): Promise<ProblemSurvey[]> => {
  const orderByStmt: any[] = [
    ['status_rank', 'DESC'],
    ['created_at', 'ASC'],
    ['id', 'ASC'],
  ]

  const problemSurveys = await ProblemSurvey.findAll({
    attributes: {
      include: [
        [
          literal(
            `CASE WHEN "ProblemSurvey".status = 'DRAFT' THEN 0 WHEN "ProblemSurvey".status = 'READY_TO_LAUNCH' THEN 1 WHEN "ProblemSurvey".status = 'ACTIVE' THEN 2 WHEN "ProblemSurvey".status = 'COMPLETE' THEN 3 END`
          ),
          'status_rank',
        ],
      ],
    },
    include: [
      {
        model: UserSurveyLink,
      },
      {
        model: ProblemSurveyLink,
      },
      {
        model: ProblemSurveyVote,
      },
    ],
    order: orderByStmt,
  })

  return problemSurveys
}

export const create = async (
  db: DB,
  problemSurvey: ProblemSurveyCreateData
): Promise<ProblemSurvey> => {
  return await db.transaction(async (transaction) => {
    const newProblemSurvey = await ProblemSurvey.create(
      {
        createdBy: problemSurvey.createdBy,
        ownedBy: problemSurvey.createdBy,
        title: problemSurvey.title,
        description: problemSurvey.description,
        status: SurveyStatus.DRAFT,
        active: true,
      },
      { transaction }
    )

    const problemSurveyLinks = problemSurvey.problemIds.map((problemId) => ({
      problemId,
      problemSurveyId: newProblemSurvey.id,
    }))
    await ProblemSurveyLink.bulkCreate(problemSurveyLinks, { transaction })

    const userSurveyLinks = problemSurvey.usersIds.map((userId) => ({
      userId,
      surveyId: newProblemSurvey.id,
    }))
    await UserSurveyLink.bulkCreate(userSurveyLinks, { transaction })

    return newProblemSurvey
  })
}

export const updateProblemSurvey = async (
  problemSurveyId,
  user: any,
  patchRequest: ProblemSurveyUpdateData
): Promise<string> => {
  const problemSurvey = await ProblemSurvey.findOne({ where: { id: problemSurveyId } })
  if (!problemSurvey) {
    throw new NotFoundError('Problem Survey not found')
  }

  if (patchRequest.status) {
    if (!Object.values(SurveyStatus).includes(patchRequest.status as SurveyStatus)) {
      throw new BadRequestError(
        `ProblemStatus should have one of the values ${surveyStatusList.join(' ')}`
      )
    }
  }

  const db = await getDB()

  return db.transaction(async (transaction) => {
    const { status, title, description, ownedBy, problemIds, active } = patchRequest
    if (status) {
      problemSurvey.status = status
    }

    if (title) {
      problemSurvey.title = title
    }

    if (description) {
      problemSurvey.description = description
    }

    if (ownedBy) {
      problemSurvey.ownedBy = ownedBy
    }

    if (active != null) {
      problemSurvey.active = active
    }

    await problemSurvey.save({ transaction })

    if (Array.isArray(problemIds)) {
      const problemSurveyLinks = await ProblemSurveyLink.findAll({
        where: {
          problemSurveyId: problemSurvey.id,
        },
      })

      if (!problemIds.length) {
        problemSurveyLinks.map(async (problemSurveyLink) => {
          await ProblemSurveyLink.update(
            {
              deletedAt: new Date(),
            },
            {
              where: {
                id: problemSurveyLink.id,
              },
              transaction,
            }
          )
        })
      } else if (problemSurveyLinks?.length) {
        const problemSurveyLinksToAdd = problemIds.filter(
          (problemId) =>
            !problemSurveyLinks.find(
              (problemSurveyLink) =>
                problemSurveyLink.problemId === problemId && !problemSurveyLink.deletedAt
            )
        )
        const problemSurveyLinksToRestore = problemIds.filter((problemId) =>
          problemSurveyLinks.find(
            (problemSurveyLink) =>
              problemSurveyLink.problemId === problemId && problemSurveyLink.deletedAt
          )
        )
        problemSurveyLinksToAdd?.forEach(async (problemId) => {
          await ProblemSurveyLink.create(
            {
              problemId,
              problemSurveyId: problemSurvey.id,
            },
            { transaction }
          )
        })

        problemSurveyLinksToRestore?.forEach(async (problemId) => {
          await ProblemSurveyLink.update(
            {
              deletedAt: undefined,
            },
            {
              where: {
                problemId,
              },
              transaction,
            }
          )
        })
      } else {
        problemIds?.forEach(async (problemId) => {
          await ProblemSurveyLink.create(
            {
              problemId,
              problemSurveyId: problemSurvey.id,
            },
            { transaction }
          )
        })
      }
    }

    return problemSurvey.id
  })
}

export const getProblemSurveyVotes = async (
  problemSurveyId: string
): Promise<ProblemSurveyVote[]> => {
  const result = await ProblemSurveyVote.findAll({
    where: {
      problemSurveyId: problemSurveyId,
    },
    include: [
      {
        model: Problem,
      },
      {
        model: User,
      },
    ],
  })

  if (!result) {
    throw new NotFoundError(
      `problemSurveyVote with problemSurveyId=${problemSurveyId} does not exist`
    )
  }

  return result
}

export const getUserSurveyVote = async (
  userId: string,
  problemSurveyId: string
): Promise<ProblemSurveyVote> => {
  const result = await ProblemSurveyVote.findOne({
    where: {
      createdBy: userId,
    },
    include: [
      {
        model: Problem,
      },
      {
        model: User,
      },
    ],
  })

  if (!result) {
    throw new NotFoundError(
      `problemSurveyVote with problemSurveyId=${problemSurveyId} and userId=${userId} does not exist`
    )
  }

  return result
}

export const getUserSurveyVotes = async (userId: string): Promise<ProblemSurveyVote[]> => {
  const result = await ProblemSurveyVote.findAll({
    where: {
      createdBy: userId,
    },
    include: [
      {
        model: Problem,
      },
      {
        model: User,
      },
    ],
  })

  if (!result?.length) {
    throw new NotFoundError(`problemSurveyVote with userId=${userId} does not exist`)
  }

  return result
}

export const createProblemSurveyVote = async (
  db: DB,
  problemSurveyVote: ProblemSurveyVoteCreateData
): Promise<ProblemSurveyVote> => {
  return await db.transaction(async (transaction) => {
    const userSurveyLink = await UserSurveyLink.findOne({
      where: {
        userId: problemSurveyVote.createdBy,
        surveyId: problemSurveyVote.problemSurveyId,
      },
    })

    if (!userSurveyLink) {
      throw new NotFoundError('User not allowed to vote on this survey')
    }

    const newProblemSurveyVote = await ProblemSurveyVote.create(
      {
        createdBy: problemSurveyVote.createdBy,
        problemSurveyId: problemSurveyVote.problemSurveyId,
        problemId: problemSurveyVote.problemId,
        problemVariantId: problemSurveyVote.problemVariantId,
        vote: problemSurveyVote.vote,
      },
      { transaction }
    )

    return newProblemSurveyVote
  })
}

export const updateProblemSurveyVote = async (
  problemSurveyId,
  user: any,
  patchRequest: ProblemSurveyVoteUpdateData
): Promise<string> => {
  const problemSurveyVote = await ProblemSurveyVote.findOne({
    where: { problemSurveyId: problemSurveyId, createdBy: user.id },
  })
  if (!problemSurveyVote) {
    throw new NotFoundError('Problem Survey Vote not found')
  }

  const db = await getDB()

  return db.transaction(async (transaction) => {
    const { vote } = patchRequest

    problemSurveyVote.vote = vote

    await problemSurveyVote.save({ transaction })

    return problemSurveyVote.id
  })
}
