import express, { Express } from 'express'
import cors from 'cors'
import { schemaValidator, errorHandler } from './middleware/validationMiddleware'
import addRoutes from './routes'
import { DB } from './db/db'

const makeServerApp = (db: DB): Express => {
  const serverApp: Express = express()

  serverApp.use(cors())
  serverApp.use(express.json())
  serverApp.use(express.urlencoded({ extended: false }))
  serverApp.use(schemaValidator('./schemas/app-v1-openapi.yaml'))

  addRoutes(db, serverApp)

  // Must be installed after the routes are added
  serverApp.use(errorHandler)

  return serverApp
}

export default makeServerApp
