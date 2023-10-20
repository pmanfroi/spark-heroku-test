import { fileDoesNotExist, pipeAsync } from '../utils/generalUtils'
import excel, { Worksheet } from 'exceljs'
import { curry, pick } from 'ramda'
import { getWorksheets, getWorkSheetData } from './xlsUtils'
import { resetDB } from '../db/db'
import { User } from '../db/models/user'
import { ProblemCategory } from '../db/models/problemCategory'
import { Problem } from '../db/models/problem'
import { ProblemVariant } from '../db/models/problemVariant'
import { SubProblem } from '../db/models/subProblem'
import { ProblemCategoryLink } from '../db/models/problemCategoryLink'
import { ProblemVariantRating } from '../db/models/problemVariantRating'
import { Label } from '../db/models/label'
import { ProblemLabelLink } from '../db/models/problemLabelLink'

export const loadSparkSpreadSheet = async (spreadSheetPath: string) => {
  await resetDB()
  const numRecordsAdded = await parseSparkSpreadSheet(spreadSheetPath)
  return numRecordsAdded
}

// prase the spreadsheet
const parseSparkSpreadSheet = async (spreadSheetPath: string): Promise<number> => {
  console.log(`\nOpening spreadsheet:\n${spreadSheetPath}\n`)

  // make sure the file exists
  if (fileDoesNotExist(spreadSheetPath)) {
    throw Error(`Spreadsheet does not exist: ${spreadSheetPath}`)
  }

  const workbook = new excel.Workbook()
  await workbook.xlsx.readFile(spreadSheetPath)
  const workSheets = getWorksheets(workbook)

  // load the data

  const context = await pipeAsync(
    addUsers(workSheets.Users),
    addProblems(workSheets.Problems),
    addProblemVariants(workSheets.ProblemVariants),
    addProblemVariantRatings(workSheets.ProblemVariantRatings),
    addSubProblems(workSheets.SubProblems),
    addCategories(workSheets.Categories),
    addProblemCategoryLinks(workSheets.ProblemCategoryLinks),
    addLabels(workSheets.Labels),
    addProblemLabelLinks(workSheets.ProblemLabelLinks)
  )({
    numRecordsAdded: 0,
    idMap: {},
  })

  return context.numRecordsAdded
}

const mapToDbId = (context: any, spreadSheetId: string) => {
  const dbId = context.idMap[spreadSheetId]
  if (!dbId) throw Error(`ID mapping error: no db id found for spreadsheet id: ${spreadSheetId}`)
  return dbId
}

const addUsers = curry(async (userWorksheet: Worksheet, context: any) => {
  const localContext = { ...context }
  const userFields = ['cognitoId', 'firstName', 'lastName']
  const users: any[] = getWorkSheetData(userWorksheet)
  for await (const user of users) {
    const createdUser = await User.create(<User>pick(userFields, user))
    localContext.numRecordsAdded++
    localContext.idMap[user.id] = createdUser.dataValues.id
  }
  return localContext
})

const addProblems = curry(async (problemWorksheet: Worksheet, context: any) => {
  const localContext = { ...context }
  const problemFields = ['title', 'status', 'createdBy', 'ownedBy']
  const problems: any[] = getWorkSheetData(problemWorksheet).map((problem: any) => ({
    ...problem,
    createdBy: mapToDbId(localContext, problem.createdBy),
    ownedBy: mapToDbId(localContext, problem.ownedBy),
  }))
  for await (const problem of problems) {
    const createdProblem = await Problem.create(<Problem>pick(problemFields, problem))
    localContext.numRecordsAdded++
    localContext.idMap[problem.id] = createdProblem.dataValues.id
  }
  return localContext
})

const addProblemVariants = curry(async (problemVariantsWorksheet: Worksheet, context: any) => {
  const localContext = { ...context }
  const problemVariantsFields = [
    'problemId',
    'type',
    'order',
    'isPreferred',
    'content',
    'createdBy',
  ]
  const problemVariants: any[] = getWorkSheetData(problemVariantsWorksheet).map(
    (problemVariant: any) => ({
      ...problemVariant,
      problemId: mapToDbId(localContext, problemVariant.problemId),
      createdBy: mapToDbId(localContext, problemVariant.createdBy),
    })
  )
  for await (const problemVariant of problemVariants) {
    const createdProblemVariant = await ProblemVariant.create(
      <ProblemVariant>pick(problemVariantsFields, problemVariant)
    )
    localContext.numRecordsAdded++
    localContext.idMap[problemVariant.id] = createdProblemVariant.dataValues.id
  }
  return localContext
})

const addProblemVariantRatings = curry(
  async (problemVariantRatingWorksheet: Worksheet, context: any) => {
    const localContext = { ...context }
    const problemVariantRatingsFields = ['problemVariantId', 'userId', 'ratingType', 'rating']
    const problemVariantRatings: any[] = getWorkSheetData(problemVariantRatingWorksheet).map(
      (problemVariantRating: any) => ({
        ...problemVariantRating,
        problemVariantId: mapToDbId(localContext, problemVariantRating.problemVariantId),
        userId: mapToDbId(localContext, problemVariantRating.userId),
      })
    )
    for await (const problemVariantRating of problemVariantRatings) {
      const createdProblemVariant = await ProblemVariantRating.create(
        <ProblemVariantRating>pick(problemVariantRatingsFields, problemVariantRating)
      )
      localContext.numRecordsAdded++
      localContext.idMap[problemVariantRating.id] = createdProblemVariant.dataValues.id
    }
    return localContext
  }
)

const addSubProblems = curry(async (subProblemsWorksheet: Worksheet, context: any) => {
  const localContext = { ...context }
  const subProblemsFields = ['problemVariantId', 'order', 'content', 'createdBy']
  const subProblems: any[] = getWorkSheetData(subProblemsWorksheet).map((subProblem: any) => ({
    ...subProblem,
    problemVariantId: mapToDbId(localContext, subProblem.problemVariantId),
    createdBy: mapToDbId(localContext, subProblem.createdBy),
  }))
  for await (const subProblem of subProblems) {
    const createdSubProblem = await SubProblem.create(
      <SubProblem>pick(subProblemsFields, subProblem)
    )
    localContext.numRecordsAdded++
    localContext.idMap[subProblem.id] = createdSubProblem.dataValues.id
  }
  return localContext
})

const addCategories = curry(async (categoryWorksheet: Worksheet, context: any) => {
  const localContext = { ...context }
  const categoryFields = ['name', 'description', 'createdBy']
  const categories: any[] = getWorkSheetData(categoryWorksheet).map((category: any) => ({
    ...category,
    createdBy: mapToDbId(localContext, category.createdBy),
  }))
  for await (const user of categories) {
    const createdUser = await ProblemCategory.create(<ProblemCategory>pick(categoryFields, user))
    localContext.numRecordsAdded++
    localContext.idMap[user.id] = createdUser.dataValues.id
  }
  return localContext
})

const addProblemCategoryLinks = curry(
  async (problemCategoryLinksWorksheet: Worksheet, context: any) => {
    const localContext = { ...context }
    const problemCategoryLinksFields = ['problemId', 'problemCategoryId', 'createdBy']
    const problemCategoryLinks: any[] = getWorkSheetData(problemCategoryLinksWorksheet).map(
      (problemCategoryLink: any) => ({
        ...problemCategoryLink,
        problemId: mapToDbId(localContext, problemCategoryLink.problemId),
        problemCategoryId: mapToDbId(localContext, problemCategoryLink.problemCategoryId),
        createdBy: mapToDbId(localContext, problemCategoryLink.createdBy),
      })
    )
    for await (const problemCategoryLink of problemCategoryLinks) {
      const createdCategory = await ProblemCategoryLink.create(
        <ProblemCategory>pick(problemCategoryLinksFields, problemCategoryLink)
      )
      localContext.numRecordsAdded++
      localContext.idMap[problemCategoryLink.id] = createdCategory.dataValues.id
    }
    return localContext
  }
)

const addLabels = curry(async (labelWorksheet: Worksheet, context: any) => {
  const localContext = { ...context }
  const labelFields = ['name', 'textColor', 'bgColor', 'createdBy']
  const labels: any[] = getWorkSheetData(labelWorksheet).map((label: any) => ({
    ...label,
    createdBy: mapToDbId(localContext, label.createdBy),
  }))
  for await (const label of labels) {
    const createdLabel = await Label.create(<Label>pick(labelFields, label))
    localContext.numRecordsAdded++
    localContext.idMap[label.id] = createdLabel.dataValues.id
  }
  return localContext
})

const addProblemLabelLinks = curry(async (problemLabelLinksWorksheet: Worksheet, context: any) => {
  const localContext = { ...context }
  const problemLabelLinksFields = ['problemId', 'labelId', 'createdBy']
  const problemLabelLinks: any[] = getWorkSheetData(problemLabelLinksWorksheet).map(
    (problemLabelLink: any) => ({
      ...problemLabelLink,
      problemId: mapToDbId(localContext, problemLabelLink.problemId),
      labelId: mapToDbId(localContext, problemLabelLink.labelId),
      createdBy: mapToDbId(localContext, problemLabelLink.createdBy),
    })
  )
  for await (const problemLabelLink of problemLabelLinks) {
    const createdLabel = await ProblemLabelLink.create(
      <ProblemLabelLink>pick(problemLabelLinksFields, problemLabelLink)
    )
    localContext.numRecordsAdded++
    localContext.idMap[problemLabelLink.id] = createdLabel.dataValues.id
  }
  return localContext
})
