import {User} from '../../db/models/user'
import {Problem} from '../../db/models/problem'
import {ProblemCategoryLink} from '../../db/models/problemCategoryLink'
import {ProblemCategory} from '../../db/models/problemCategory'
import {ProblemVariant, ProblemVariantType} from '../../db/models/problemVariant'
import {ProblemVariantRating} from '../../db/models/problemVariantRating'
import {SubProblem} from '../../db/models/subProblem'
import {ProblemStatus} from '../../types'

type VariantType = {
  type: ProblemVariantType
  order: number
  content: string
  isPreferred: boolean
  ratings: ProblemVariantRating[]
  subProblems: SubProblem[]
}

export type ProblemType = {
  status: ProblemStatus
  title: string
  category: ProblemCategory | null
  variants: VariantType[]
}

export async function fetchData() {
  const data: ProblemType[] = []
  try {
    const problems = await Problem.findAll({
      attributes: ['id', 'title', 'status'],
      limit: 5,
      order: [['createdAt', 'DESC']],
      raw: true,
    })

    for (const problem of problems) {
      // Fetch category_id from the link table
      const problemCategoryLink = await ProblemCategoryLink.findOne({
        attributes: ['problemCategoryId'],
        raw: true,
        where: {
          problemId: problem.id,
        },
      })

      // Fetch the category based on category_id
      const problemCategory = await ProblemCategory.findOne({
        attributes: ['id', 'name', 'description'],
        raw: true,
        where: {
          id: problemCategoryLink?.problemCategoryId,
        },
      })

      // Fetch variants
      const problemVariants = await ProblemVariant.findAll({
        attributes: ['id', 'type', 'order', 'content', 'isPreferred'],
        raw: true,
        limit: 5,
        order: [['createdAt', 'DESC']],
        where: {
          problemId: problem.id,
        },
      })
      const variantList: VariantType[] = []

      for (const variant of problemVariants) {
        const problemVariantRatings = await ProblemVariantRating.findAll({
          attributes: ['problemVariantId', 'userId', 'ratingType', 'rating'],
          raw: true,
          limit: 5,
          order: [['createdAt', 'DESC']],
          where: {
            problemVariantId: variant.id,
          },
        })

        const subProblems = await SubProblem.findAll({
          attributes: ['problemVariantId', 'order', 'content'],
          raw: true,
          limit: 5,
          order: [['createdAt', 'DESC']],
          where: {
            problemVariantId: variant.id,
          },
        })

        variantList.push({
          type: variant.type,
          order: variant.order,
          content: variant.content,
          isPreferred: variant.isPreferred,
          ratings: problemVariantRatings,
          subProblems,
        })
      }

      data.push({
        status: problem.status,
        title: problem.title,
        category: problemCategory,
        variants: variantList,
      })
    }
  } catch (e) {
    console.error('An error occurred: ', e)
  }
  return data
}

export async function fetchUsername(userId: string) {
  try {
    const user = await User.findByPk(userId, {
      attributes: ['firstName'],
    })
    return user?.firstName
  } catch (e) {
    console.error('An error occurred while fetching the username: ', e)
  }
}
