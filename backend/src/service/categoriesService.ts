import {ProblemCategory} from '../db/models/problemCategory'

export const getAllCategories = async () => {
  const result = await ProblemCategory.findAll()
  return result
}
