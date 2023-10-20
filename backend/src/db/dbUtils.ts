import { ResourceTypes } from '../types'
import { Problem } from './models/problem'
import { NotFoundError } from '../errors'
import { ProblemVariant } from './models/problemVariant'
import { SubProblem } from './models/subProblem'

// prettier-ignore
export const getResourceOwnerId =
  async (resourceType: ResourceTypes, idColumnName: string, resourceId: string): Promise<string> =>
{

  switch (resourceType) {
    case ResourceTypes.PROBLEM:
      return getProblemOwnerId(idColumnName, resourceId)
    case ResourceTypes.PROBLEM_VARIANT:
      return getProblemVariantOwnerId(idColumnName, resourceId)
    case ResourceTypes.SUB_PROBLEM:
      return getSubProblemOwnerId(idColumnName, resourceId)
    default:
      throw Error(`getResourceOwnerId(): unknown resource type: ${resourceType}`)
  }
}

// prettier-ignore
export const getProblemOwnerId =
  async (idColumnName: string, problemId: string): Promise<string> =>
{
  const problem = await Problem.findOne({ where: { [idColumnName]: problemId, }})
  if (!problem)
    throw new NotFoundError(`Problem of id ${problemId} not found`)

  return problem?.ownedBy || ''
}

export const getProblemVariantOwnerId = async (
  idColumnName: string,
  problemId: string
): Promise<string> => {
  const problemVariant = await ProblemVariant.findOne({
    include: [{ model: Problem, where: { [idColumnName]: problemId } }],
  })

  if (!problemVariant)
    throw new NotFoundError(`ProblemVariant of Problem id ${problemId} not found`)

  return problemVariant?.createdBy || ''
}

export const getSubProblemOwnerId = async (
  idColumnName: string,
  problemId: string
): Promise<string> => {
  const subProblem = await SubProblem.findOne({
    include: [{ model: ProblemVariant }, { model: Problem, where: { [idColumnName]: problemId } }],
  })

  if (!subProblem) throw new NotFoundError(`SubProblem of Problem id ${problemId} not found`)

  return subProblem?.createdBy || ''
}

interface IdNames {
  restIdName: string
  dbIdName: string
}

export const idPropNamesByResourceType = (resourceType: ResourceTypes): IdNames => {
  const dbIdName = 'id'
  const restIdName = resourceType === ResourceTypes.PROBLEM ? 'problemId' : 'id'
  return { restIdName, dbIdName }
}
