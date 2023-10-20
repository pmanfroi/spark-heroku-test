import { NotFoundError, BadRequestError, ConflictError } from '../errors'
import { ProblemVariantRating } from '../db/models/problemVariantRating'
import { ProblemVariant } from '../db/models/problemVariant'
import { ProblemVariantRatingData, RatingType } from '../types'
import { Sequelize, Op } from 'sequelize'
import { User } from '../db/models/user'

interface CreateProblemVariantRatingRequest {
  problemVariantId: string
  creatorId: string
  ratings: any[]
}

export const updateProblemVariantRating = async (
  id: string,
  data: ProblemVariantRatingData,
  db: Sequelize
): Promise<ProblemVariantRating> => {
  const { rating } = data

  if (rating == null) {
    throw new BadRequestError(`Rating must contain a valid value. Received: ${rating}`)
  }

  return db.transaction(async (transaction) => {
    const problemVariantRating = await ProblemVariantRating.findOne({
      where: { id: id },
      transaction,
    })
    if (!problemVariantRating) {
      throw new NotFoundError('Problem variant rating not found')
    }

    problemVariantRating.rating = rating

    await problemVariantRating.save({ transaction })

    return problemVariantRating
  })
}

export const create = async (
  db: Sequelize,
  req: CreateProblemVariantRatingRequest
): Promise<any> => {
  for (const ratingReq of req.ratings) {
    if (!Object.values(RatingType).includes(ratingReq.ratingType as RatingType)) {
      throw new BadRequestError(`ratingType ${ratingReq} is not supported`)
    }
  }

  const problemVariant = await ProblemVariant.findOne({
    where: {
      id: req.problemVariantId,
    },
  })
  if (!problemVariant) {
    throw new NotFoundError(`problem variant not found for id ${req.problemVariantId}`)
  }

  const requestedRatingTypes = req.ratings.map((r) => r.ratingType)
  const ratingsFound = await ProblemVariantRating.findAll({
    where: {
      userId: req.creatorId,
      problemVariantId: req.problemVariantId,
      ratingType: {
        [Op.in]: requestedRatingTypes,
      },
    },
  })
  if (ratingsFound.length > 0) {
    throw new ConflictError('existing ratings found', ratingsFound)
  }

  const ratings = req.ratings.map((r) => ({
    userId: req.creatorId,
    problemVariantId: req.problemVariantId,
    ratingType: r.ratingType,
    rating: r.rating,
  }))

  return await ProblemVariantRating.bulkCreate(ratings)
}

export const getAll = async (
  db: Sequelize,
  problemVariantId: string,
  userId: string
): Promise<any> => {
  const problemVariant = await ProblemVariant.findOne({
    where: {
      id: problemVariantId,
    },
  })
  if (!problemVariant) {
    throw new NotFoundError(`problem variant not found for id ${problemVariantId}`)
  }

  return await ProblemVariantRating.findAll({
    where: {
      problemVariantId: problemVariantId,
      userId: userId,
    },
    include: [{ model: User }],
  })
}
