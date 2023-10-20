import { Problem } from '../db/models/problem'
import { ProblemVariant, ProblemVariantType } from '../db/models/problemVariant'
import { SubProblem } from '../db/models/subProblem'
import { ProblemVariantRating } from '../db/models/problemVariantRating'
import { NotFoundError, BadRequestError } from '../errors'
import { User } from '../db/models/user'
import { DB, getDB } from '../db/db'
import { Op, literal } from 'sequelize'
import { ProblemCategory } from '../db/models/problemCategory'
import { ProblemCategoryLink } from '../db/models/problemCategoryLink'
import { ProblemUpdateData, ProblemStatus, ProblemResponse } from '../types'
import { randomUUID } from 'crypto'
import { Label } from '../db/models/label'
import { ProblemLabelLink } from '../db/models/problemLabelLink'

interface OrderByRequest {
  // this is ugly as 'importance', 'passion', and 'favorite' are rating types
  // while status is on a difference spectrum as the afformentioned three.
  // Revisit the ordering system when there is a chance.
  field: 'importance' | 'passion' | 'favorite' | 'status'
  order: 'desc' | 'asc'
}

interface GetProblemsRequest {
  userId: string
  orderBy?: OrderByRequest[]
}

export const get = async (problemId: string, viewingUserId: string): Promise<Problem> => {
  const result = await Problem.findOne({
    where: {
      id: problemId,
    },
    include: [
      {
        model: ProblemVariant,
        include: [
          { model: SubProblem },
          {
            model: ProblemVariantRating,
            where: { userId: viewingUserId },
            required: false,
          },
        ],
      },
      {
        model: User,
      },
    ],
  })

  if (!result) {
    throw new NotFoundError(`problem with id=${problemId} does not exist`)
  }

  return result
}

export const getByPublicId = async (publicId: string, viewingUserId: string): Promise<Problem> => {
  const result = await Problem.findOne({
    where: {
      publicId: publicId,
    },
    include: [
      {
        model: ProblemVariant,
        as: 'problemVariants',
        include: [
          {
            model: SubProblem,
            as: 'subProblems',
          },
          {
            model: ProblemVariantRating,
            where: { userId: viewingUserId },
            required: false,
          },
        ],
      },
      {
        model: User,
      },
      {
        model: ProblemCategory,
      },
      {
        model: Label,
      },
    ],
    order: [
      [{ model: ProblemVariant, as: 'problemVariants' }, 'order', 'ASC'],
      [
        { model: ProblemVariant, as: 'problemVariants' },
        { model: SubProblem, as: 'subProblems' },
        'order',
        'ASC',
      ],
    ],
  })

  if (!result) {
    throw new NotFoundError(`problem with publicId=${publicId} does not exist`)
  }

  return result
}

export const create = async (db: DB, problem: any): Promise<any> => {
  const rootProblemVariant = problem?.problemVariants.find(
    (problemVariant) => problemVariant.type == ProblemVariantType.ROOT
  )

  if (!rootProblemVariant) {
    throw new BadRequestError('missing root problem variant')
  }

  if (rootProblemVariant.order !== 0) {
    throw new BadRequestError('invalid order assigned to root problem variant')
  }

  return await db.transaction(async (transaction) => {
    const prob = await Problem.create(
      {
        createdBy: problem.userId,
        ownedBy: problem.userId,
        title: problem.title,
        status: ProblemStatus.DRAFT,
      },
      { transaction }
    )

    if (problem.categories) {
      const problemCatLinks = problem.categories?.map((cat) => ({
        problemId: prob.id,
        problemCategoryId: cat,
        createdBy: problem.userId,
      }))
      await ProblemCategoryLink.bulkCreate(problemCatLinks, { transaction })
    }

    if (problem.labels) {
      const problemLabelLinks = problem.labels?.map((label) => ({
        problemId: prob.id,
        labelId: label,
        createdBy: problem.userId,
      }))
      await ProblemLabelLink.bulkCreate(problemLabelLinks, { transaction })
    }

    const root = {
      createdBy: problem.userId,
      problemId: prob.id,
      content: rootProblemVariant.content,
      type: ProblemVariantType.ROOT,
      order: 0,
      isPreferred: true,
    }

    const problemVariant = await ProblemVariant.create(root, { transaction })
    prob.setDataValue('problemVariants', [problemVariant])

    return prob
  })
}

/**
 * Checking if categories are an array of strings
 * Checking if problem exists
 * Checking if categories exists
 * If categories are sent then we remove all existing relations with categories
 * and add new ones
 * If status is sent we save it
 * If title is sent we save it
 * @param problemId
 * @param user
 * @param patchRequest
 */
export const updateProblem = async (
  problemId,
  user: any,
  patchRequest: ProblemUpdateData
): Promise<any> => {
  if (
    patchRequest.categories &&
    (!Array.isArray(patchRequest?.categories) || patchRequest.categories.length === 0)
  ) {
    throw new BadRequestError('Categories should be an array of uuids')
  }

  if (
    patchRequest.labels &&
    (!Array.isArray(patchRequest?.labels) || patchRequest.labels.length === 0)
  ) {
    throw new BadRequestError('Labels should be an array of uuids')
  }

  const problem = await Problem.findOne({ where: { id: problemId } })
  if (!problem) {
    throw new NotFoundError('Problem not found')
  }

  if (patchRequest.status) {
    if (!Object.values(ProblemStatus).includes(patchRequest.status as ProblemStatus)) {
      throw new BadRequestError(
        'ProblemStatus should have one of the values DRAFT, OPEN, IN_PROGRESS, CLOSED'
      )
    }
  }

  const db = await getDB()

  return db.transaction(async (transaction) => {
    const { categories, status, title, labels } = patchRequest
    if (categories && categories.length > 0) {
      const dbCategories = await ProblemCategory.findAll({
        where: {
          id: { [Op.in]: categories },
        },
        transaction,
      })

      if (categories.length !== dbCategories.length) {
        const categoriesNotFound = categories.filter(
          (cat) => cat !== dbCategories.find((dbc) => dbc.id === cat)?.id
        )

        if (categoriesNotFound.length > 0) {
          throw new NotFoundError('Categories not found', categoriesNotFound)
        }
      }

      await ProblemCategoryLink.destroy({
        where: {
          problemId: problemId,
        },
        transaction,
      })

      await ProblemCategoryLink.bulkCreate(
        categories.map(
          (categoryId) => ({
            id: randomUUID(),
            problemCategoryId: categoryId,
            problemId: problemId,
            createdBy: user.id,
          }),
          { transaction }
        )
      )
    }

    if (labels && labels.length > 0) {
      const dbLabels = await Label.findAll({
        where: {
          id: { [Op.in]: labels },
        },
        transaction,
      })

      if (labels.length !== dbLabels.length) {
        const labelsNotFound = labels.filter(
          (label) => !dbLabels.find((dbl) => dbl.id === label)?.id
        )

        if (labelsNotFound.length > 0) {
          throw new NotFoundError('Labels not found', labelsNotFound)
        }
      }

      await ProblemLabelLink.destroy({
        where: {
          problemId: problemId,
        },
        transaction,
      })

      await ProblemLabelLink.bulkCreate(
        labels.map(
          (labelId) => ({
            id: randomUUID(),
            labelId: labelId,
            problemId: problemId,
            createdBy: user.id,
          }),
          { transaction }
        )
      )
    }

    if (status) {
      problem.status = status
    }

    if (title) {
      problem.title = title
    }

    await problem.save({ transaction })
  })
}

function mapRatings(ratings) {
  const response: any = {}

  if (!ratings || ratings.length === 0) {
    return response
  }

  ratings.forEach((rating) => {
    response[rating.ratingType.toLowerCase()] = rating.rating
  })

  return response
}

/**
 * Returns problems to be used in the dashboard.
 * Supports sorting based on importance, passion, and favorite user ratings.
 * If the problem doesn't have a user rating based on the sorting criteria, it will get excluded from the return value.
 *
 *
 * @param db data access layer
 * @param req request object that will alter the content of the problem object that will be returned to the API consumer
 * @returns
 */
export const getMany = async (db: DB, req: GetProblemsRequest): Promise<any> => {
  const user = await User.findOne({
    where: {
      id: req.userId,
    },
  })
  if (!user) {
    throw new NotFoundError('user not found')
  }

  const orderByStmt: any[] = [
    ['created_at', 'ASC'],
    ['public_id', 'ASC'],
  ]
  const groupByStmt: string[] = [
    'problemVariants.id',
    'problemVariants->ratings.id',
    'Problem.id',
    'categories.id',
    'categories->ProblemCategoryLink.id',
    'rating_type',
    'labels.id',
    'labels->ProblemLabelLink.id',
  ]

  const problemVariantRatingJoinStmt: any = {
    model: ProblemVariantRating,
    where: {
      userId: req.userId,
    },
    required: false,
  }

  if (req.orderBy) {
    const orderBy = new Set()
    for (let orderByReq of req.orderBy) {
      if (orderByReq.field === 'status') {
        orderBy.add(['status_rank', 'DESC'])
        continue
      }

      if (['passion', 'favorite', 'importance'].includes(orderByReq.field)) {
        orderBy.add(['rating', 'DESC'])
      }
    }

    orderByStmt.unshift(...orderBy)
  }

  const problems = await Problem.findAll({
    attributes: {
      include: [
        [
          literal(
            "CASE WHEN status = 'DRAFT' THEN 0 WHEN status = 'CLOSED' THEN 1 WHEN status = 'IN_PROGRESS' THEN 2 WHEN status = 'OPEN' THEN 3 END"
          ),
          'status_rank',
        ],
        [
          literal(
            'CASE WHEN "problemVariants->ratings"."rating" is NULL THEN 0 ELSE "problemVariants->ratings"."rating" END'
          ),
          'rating',
        ],
      ],
    },
    include: [
      {
        model: Label,
      },
      {
        model: ProblemVariant,
        include: [problemVariantRatingJoinStmt],
      },
      {
        model: ProblemCategory,
      },
    ],
    order: orderByStmt,
    group: groupByStmt,
  })

  // in order to fill the ratings, fetch it from the database
  // const problemVariantIds: string[] = problems.map((problem) => problem?.problemVariants?.[0].id)
  const problemVariants = await ProblemVariant.findAll({
    where: {
      problemId: problems.map((p) => p.id),
      isPreferred: true,
    },
  })

  const problemVariantIds: string[] = problemVariants.map((pv) => pv.id)

  const problemVariantRatings = await ProblemVariantRating.findAll({
    where: {
      problemVariantId: {
        [Op.in]: problemVariantIds,
      },
      userId: req.userId,
    },
    group: ['ProblemVariantRating.id'],
  })

  // reduce the records to a dictionary so that we fill in all the ratings for the particular problem
  const ratingsMap = problemVariantRatings.reduce((acc, rating) => {
    if (!acc[rating.problemVariantId]) {
      return {
        ...acc,
        [rating.problemVariantId]: [rating.toJSON()],
      }
    }

    return {
      ...acc,
      [rating.problemVariantId]: [...acc[rating.problemVariantId], rating.toJSON()],
    }
  }, {})

  return problems.map((problem) => {
    const preferredProblemVariant = problem.problemVariants?.find(
      (problemVariant) => problemVariant.isPreferred
    )

    return {
      id: problem.id,
      title: problem.title,
      createdAt: problem.createdAt,
      createdBy: problem.createdBy,
      ownedBy: problem.ownedBy,
      content: preferredProblemVariant?.content,
      status: problem.status,
      userRating: preferredProblemVariant
        ? mapRatings(ratingsMap[preferredProblemVariant.id])
        : mapRatings([]),
      publicId: problem.publicId,
      preferredVariantId: preferredProblemVariant?.id,
      numVariants: problem?.problemVariants?.length || 0,
      categories: problem?.categories?.map((category) => category.toJSON()),
      labels: problem?.labels?.map((label) => label.toJSON()),
    }
  })
}

export const parseProblemResponse = (problem: Problem) => {
  const { id, publicId, status, title, problemVariants, categories, labels, createdBy, ownedBy } =
    problem.toJSON()
  const preferredVariantId = problemVariants?.find((problemVariant) => problemVariant.isPreferred)
    ?.id as string

  const response: ProblemResponse = {
    id,
    publicId,
    title,
    status,
    preferredVariantId,
    problemVariants,
    categories,
    labels,
    createdBy,
    ownedBy,
  }

  return response
}
