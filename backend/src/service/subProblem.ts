import { DB } from '../db/db'
import { ProblemVariant } from '../db/models/problemVariant'
import { SubProblem } from '../db/models/subProblem'
import { User } from '../db/models/user'
import { NotFoundError, BadRequestError } from '../errors'
import { Op, literal } from 'sequelize'
import { NewProblemDirection } from '../types'

interface CreateReq {
  problemVariantId: string
  reference?: string
  createdBy: string
  content: string
  direction: NewProblemDirection
}

interface DeleteReq {
  problemVariantId: string
  subProblemId: string
}

interface PatchReq {
  problemVariantId: string
  subProblemId: string
  content: string
}

function validateSubProblemMutateRequest(req: any) {
  if (!req.problemVariantId) {
    throw new BadRequestError('problemVariantId is required')
  }

  if (!req.subProblemId) {
    throw new BadRequestError('createdBy is required')
  }
}

export const create = async (db: DB, createRequest: CreateReq) => {
  if (!createRequest.problemVariantId) {
    throw new BadRequestError('problemVariantId is required')
  }

  if (!createRequest.createdBy) {
    throw new BadRequestError('createdBy is required')
  }

  return db.transaction(async (transaction) => {
    const creator = await User.findOne({
      where: { id: createRequest.createdBy },
      transaction,
    })
    if (!creator) {
      throw new NotFoundError('provided user id not found')
    }

    const problemVariant = await ProblemVariant.findOne({
      where: { id: createRequest.problemVariantId },
      transaction,
    })
    if (!problemVariant) {
      throw new NotFoundError(`problem variant not found for id ${createRequest.problemVariantId}`)
    }

    let reference: SubProblem | null
    let order = 0

    if (createRequest.reference) {
      reference = await SubProblem.findOne({
        where: { id: createRequest.reference },
        transaction,
      })
      if (!reference) {
        throw new NotFoundError('sub-problem not found')
      }

      // If new item is added below a subProblem.order it should be replace the subProblem order
      // If new item is added above a subProblem it should be the next down item in order
      order =
        createRequest.direction === NewProblemDirection.UP ? reference.order : reference.order + 1

      if (reference.order >= order) {
        await SubProblem.update(
          { order: literal('"order" + 1') },
          {
            where: {
              problemVariantId: createRequest.problemVariantId,
              order: { [Op.gte]: reference.order },
            },
            transaction,
          }
        )
      }
    } else {
      reference = await SubProblem.findOne({
        where: {
          problemVariantId: createRequest.problemVariantId,
        },
        order: [['order', 'DESC']],
        transaction,
      })
      order = reference ? reference.order + 1 : 0
    }

    return await SubProblem.create(
      {
        problemVariantId: createRequest.problemVariantId,
        content: createRequest.content,
        order,
        createdBy: createRequest.createdBy,
      },
      { transaction }
    )
  })
}

export const patch = async (db: DB, patchRequest: PatchReq) => {
  validateSubProblemMutateRequest(patchRequest)

  const subproblem = await SubProblem.findOne({
    where: {
      problemVariantId: patchRequest.problemVariantId,
      id: patchRequest.subProblemId,
    },
  })
  if (!subproblem) {
    throw new NotFoundError('subproblem not found')
  }

  subproblem.content = patchRequest.content
  await subproblem.save()
}

export const remove = async (db: DB, deleteRequest: DeleteReq) => {
  validateSubProblemMutateRequest(deleteRequest)

  return db.transaction(async (transaction) => {
    const subproblem = await SubProblem.findOne({
      where: {
        problemVariantId: deleteRequest.problemVariantId,
        id: deleteRequest.subProblemId,
      },
      transaction,
    })
    if (!subproblem) {
      throw new NotFoundError('subproblem not found')
    }

    await subproblem.destroy({ transaction })

    await SubProblem.update(
      {
        order: literal('"order" - 1'),
      },
      {
        where: {
          problemVariantId: deleteRequest.problemVariantId,
          order: {
            [Op.gt]: subproblem.order,
          },
        },
      }
    )
  })
}
