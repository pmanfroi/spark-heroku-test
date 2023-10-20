import { Express } from 'express'
import { DB } from './db/db'
import { addAuthRoutes } from './routes/authRoutes'
import { addUserRoutes } from './routes/userRoutes'
import { addProblemRoutes } from './routes/problemRoutes'
import { addProblemVariantRoutes } from './routes/problemVariantRoutes'
import { addProblemSurveyRoutes } from './routes/problemSurveyRoutes'
import { addLlmRoutes } from './routes/llmRoutes'
import { addTestRoutes } from './routes/testRoutes'
import { addLabelRoutes } from './routes/labelRoutes'

export const addRoutes = (db: DB, serverApp: Express) => {
  addTestRoutes(serverApp)
  addAuthRoutes(serverApp)
  addUserRoutes(serverApp)
  addProblemRoutes(db, serverApp)
  addProblemSurveyRoutes(db, serverApp)
  addLabelRoutes(db, serverApp)
  addProblemVariantRoutes(db, serverApp)
  addLlmRoutes(serverApp)
}

export default addRoutes
