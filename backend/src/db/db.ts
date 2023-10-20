import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
import { User } from './models/user'
import { Problem } from './models/problem'
import { ProblemVariant } from './models/problemVariant'
import { SubProblem } from './models/subProblem'
import { ProblemVariantRating } from './models/problemVariantRating'
import { ProblemCategory } from './models/problemCategory'
import { ProblemCategoryLink } from './models/problemCategoryLink'
import { Label } from './models/label'
import { ProblemLabelLink } from './models/problemLabelLink'
import { ProblemSurvey } from './models/problemSurvey'
import { ProblemSurveyLink } from './models/problemSurveyLink'
import { ProblemSurveyVote } from './models/problemSurveyVote'
import { UserSurveyLink } from './models/userSurveyLink'

dotenv.config()

export type DB = Sequelize

export const getDB = async (): Promise<Sequelize> => {
  const db = new Sequelize({
    dialect: 'postgres',
    username: process.env.DATABASE_USERNAME,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    ssl: false,
    logging: false,
    typeValidation: true,
    pool: {
      max: 10,
      min: 5,
      acquire: 10000, // in ms, 10 seconds
      idle: 60000, // in ms, 1 minute
    },
  })

  db.addModels([
    User,
    Problem,
    ProblemVariant,
    SubProblem,
    ProblemVariantRating,
    ProblemCategory,
    ProblemCategoryLink,
    Label,
    ProblemLabelLink,
    ProblemSurvey,
    ProblemSurveyLink,
    ProblemSurveyVote,
    UserSurveyLink,
  ])

  // test db connection
  await db.authenticate()

  return db
}

export const resetDB = async () => {
  const forceCommand = { force: true, cascade: true }
  await Promise.all([
    ProblemSurveyLink.truncate(forceCommand),
    UserSurveyLink.truncate(forceCommand),
    ProblemSurveyVote.truncate(forceCommand),
    ProblemSurvey.truncate(forceCommand),
    ProblemCategoryLink.truncate(forceCommand),
    ProblemCategory.truncate(forceCommand),
    SubProblem.truncate(forceCommand),
    ProblemVariantRating.truncate(forceCommand),
    ProblemVariant.truncate(forceCommand),
    ProblemLabelLink.truncate(forceCommand),
    Label.truncate(forceCommand),
    Problem.truncate(forceCommand),
    User.truncate(forceCommand),
  ])
}
