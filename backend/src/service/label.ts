import { Label } from '../db/models/label'
import { NotFoundError } from '../errors'
import { DB } from '../db/db'
import { LabelUpdateData } from '../types'

interface OrderByRequest {
  field: 'name'
  order: 'desc' | 'asc'
}

export const get = async (labelId: string): Promise<Label> => {
  const result = await Label.findOne({
    where: {
      id: labelId,
    },
  })

  if (!result) {
    throw new NotFoundError(`label with id=${labelId} does not exist`)
  }

  return result
}

export const create = async (db: DB, label: any): Promise<any> => {
  return await Label.create({
    textColor: label.textColor,
    bgColor: label.bgColor,
    name: label.name,
    createdBy: label.userId,
  })
}

export const update = async (labelId, patchRequest: LabelUpdateData): Promise<any> => {
  const label = await Label.findOne({ where: { id: labelId } })
  if (!label) {
    throw new NotFoundError('Label not found')
  }

  const { textColor, bgColor, name } = patchRequest
  if (name) {
    label.name = name
  }

  if (textColor) {
    label.textColor = textColor
  }

  if (bgColor) {
    label.bgColor = bgColor
  }

  await label.save()
}

export const getMany = async (orderByRequest?: OrderByRequest[]): Promise<any> => {
  const orderByStmt: any[] = [
    ['created_at', 'ASC'],
    ['id', 'ASC'],
  ]

  if (orderByRequest) {
    const orderBy = new Set()
    for (let orderByReq of orderByRequest) {
      orderBy.add([orderByReq.field, orderByReq.order])
    }

    orderByStmt.unshift(...orderBy)
  }

  const labels = await Label.findAll({
    order: orderByStmt,
  })

  return labels
}
