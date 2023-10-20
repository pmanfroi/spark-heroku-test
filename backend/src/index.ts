// import dotenv from "dotenv";
import { getDB } from './db/db'
import makeServerApp from './serverApp'
import { setDailyDigestData, getDailyDigestData } from './service/ml/initializer-helper'
import { dailyDigestLlm } from './service/ml/service-topics-generator'
import { loadSparkSpreadSheet } from './loader/loadSparkSpreadSheet'
import { fsAbsolutePath } from './utils/generalUtils'

const startServer = async () => {
  // Load env vars from .env file

  const appConfig = {
    port: process.env.APP_BACKEND_PORT || process.env.PORT || 8000
  }

  console.log('\nApp Configuration: ', appConfig)

  const db = await getDB()

  const serverApp = makeServerApp(db)
  const _server = serverApp.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port} my dudes`)
  })

  if (process.env.ML_LOAD_PROBLEM_SUMMARY_AT_STARTUP === 'true') {
    console.log('Processing daily digest...')
    const data = getDailyDigestData()
    if (data) {
      console.log('Daily digest data already found!')
      return
    }
    try {
      const result = await dailyDigestLlm()
      setDailyDigestData(result)
      console.log('Daily digest data processing completed!')
    } catch (e) {
      console.log('Something went wrong running daily digest processing: ', e)
    }
  }

  // Load the sample data
  const spreadSheetPath: string = fsAbsolutePath('sample-data/spark-sample-data.xlsx')
  const numRecordsAdded = await loadSparkSpreadSheet(spreadSheetPath)
  console.log(`\nSAMPLE DATA LOADED (${numRecordsAdded} records added)\n`)
}

// Let the server crash and fail loudly if there is a programming error
startServer()
