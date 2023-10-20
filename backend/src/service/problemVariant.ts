import { DB, getDB } from '../db/db'
import { NotFoundError, BadRequestError } from '../errors'
import { ProblemVariant, ProblemVariantType } from '../db/models/problemVariant'
import { Problem } from '../db/models/problem'
import { Sequelize, literal } from 'sequelize'
import { Op } from 'sequelize'
import { ProblemVariantUpdateData, NewProblemDirection } from '../types'

export const create = async (db: DB, createRequest: any): Promise<any> => {
  if (!createRequest.referenceVariantId) {
    throw new BadRequestError('reference error is not defined')
  }

  if (createRequest.type.toLowerCase() === ProblemVariantType.ROOT.toString().toLowerCase()) {
    throw new BadRequestError('type can only be "NARROWER" or "BROADER"')
  }

  return db.transaction(async (transaction) => {
    const problem = await Problem.findOne({ where: { id: createRequest.problemId }, transaction })
    if (!problem) {
      throw new NotFoundError('reference problem not found')
    }

    const reference = await ProblemVariant.findOne({
      where: { id: createRequest.referenceVariantId },
      transaction,
    })
    if (!reference) {
      throw new NotFoundError(
        `reference problem variant not found for id: ${createRequest.referenceVariantId}`
      )
    }

    // If new item is added below a BROADER (reference.order > 0) or above a NARROWER (reference.order < 0)
    // it should be replace the reference order
    let order = reference.order

    // If new item is added below a NARROWER (reference.order < 0)
    // it should be the next down item in order
    if (createRequest.direction === NewProblemDirection.DOWN && reference.order <= 0) {
      order = reference.order - 1
    }

    // If new item is added above a BROADER (reference.order > 0)
    // it should be the next up item in order
    if (createRequest.direction === NewProblemDirection.UP && reference.order >= 0) {
      order = reference.order + 1
    }

    // Reorder BROADER variants that come after the new variant
    if (order > 0 && (reference.order === 0 || reference.order <= order)) {
      await ProblemVariant.update(
        { order: literal('"order" + 1') },
        {
          where: { problemId: createRequest.problemId, order: { [Op.gte]: order } },
          transaction,
        }
      )
    }

    // Reorder NARROWER variants that come after the new variant
    if (order < 0 && (reference.order === 0 || reference.order >= order)) {
      await ProblemVariant.update(
        { order: literal('"order" - 1') },
        {
          where: { problemId: createRequest.problemId, order: { [Op.lte]: order } },
          transaction,
        }
      )
    }

    await ProblemVariant.create(
      {
        createdBy: createRequest.userId,
        problemId: createRequest.problemId,
        content: createRequest.content,
        type: ProblemVariantType[createRequest.type],
        order,
        isPreferred: false,
      },
      { transaction }
    )
  })
}

export const updateProblemVariant = async (
  id: string,
  data: ProblemVariantUpdateData
): Promise<any> => {
  const { content, isPreferred } = data

  const problemVariant = await ProblemVariant.findOne({
    where: {
      id,
    },
  })

  if (!problemVariant) {
    throw new NotFoundError(`problem variant not found for id: ${id}`)
  }

  const db = await getDB()

  return db.transaction(async (transaction) => {
    if (typeof isPreferred === 'boolean') {
      const currentPreferredVariant = await ProblemVariant.findOne({
        where: {
          problemId: problemVariant.problemId,
          isPreferred: true,
        },
      })

      if (!currentPreferredVariant) {
        throw new NotFoundError(
          `Current preferred problem variant not found for problem id: ${problemVariant.problemId}`
        )
      }

      if (problemVariant.id === currentPreferredVariant.id && !isPreferred) {
        throw new NotFoundError('At least one Problem variant must be preferred')
      }

      currentPreferredVariant.isPreferred = false
      problemVariant.isPreferred = true

      await currentPreferredVariant.save({ transaction })
    }

    if (typeof content === 'string') {
      problemVariant.content = content
    }

    await problemVariant.save({ transaction })

    return problemVariant
  })
}

export const deleteProblemVariant = async (db: DB, id: string): Promise<void> => {
  return db.transaction(async (transaction) => {
    const problemVariant = await ProblemVariant.findOne({ where: { id: id }, transaction })

    if (!problemVariant) {
      throw new NotFoundError(`problem variant not found for id: ${id}`)
    }

    if (problemVariant.type === ProblemVariantType.ROOT) {
      throw new BadRequestError('Cannot delete root problem variant')
    }

    if (problemVariant.order > 0) {
      await ProblemVariant.update(
        {
          order: literal('"order" - 1'),
        },
        {
          transaction,
          where: { problemId: problemVariant.problemId, order: { [Op.gt]: problemVariant.order } },
        }
      )
    }
    if (problemVariant.order < 0) {
      await ProblemVariant.update(
        {
          order: literal('"order" + 1'),
        },
        {
          transaction,
          where: { problemId: problemVariant.problemId, order: { [Op.lt]: problemVariant.order } },
        }
      )
    }

    await problemVariant.destroy({ transaction })
  })
}

export const updatePreferredProblemVariant = async (
  id: string,
  db: Sequelize
): Promise<ProblemVariant> => {
  const problemVariant = await ProblemVariant.findOne({
    where: { id },
  })
  if (!problemVariant) {
    throw new NotFoundError(`Current preferred problem variant not found for id: ${id}`)
  }

  const currentPreferredVariant = await ProblemVariant.findOne({
    where: {
      problemId: problemVariant.problemId,
      isPreferred: true,
    },
  })

  if (!currentPreferredVariant) {
    throw new NotFoundError(
      `Current preferred problem variant not found for problem id: ${
        problemVariant ? problemVariant.problemId : ''
      }`
    )
  }

  if (problemVariant.id === currentPreferredVariant.id) {
    throw new NotFoundError('At least one Problem variant must be preferred')
  }

  return db.transaction(async (transaction) => {
    currentPreferredVariant.isPreferred = false
    problemVariant.isPreferred = true

    await currentPreferredVariant.save({ transaction })
    await problemVariant.save({ transaction })

    return problemVariant
  })
}
