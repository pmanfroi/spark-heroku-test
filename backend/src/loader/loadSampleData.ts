#!/usr/bin/env node

import {loadSparkSpreadSheet} from './loadSparkSpreadSheet'
import {fsAbsolutePath} from '../utils/generalUtils'
import {getDB} from '../db/db'

const go = async () => {
  console.log('\nSTARTING DATA LOAD')

  // path is relative to the root of the project since run via package.json script
  const spreadSheetPath: string = fsAbsolutePath('sample-data/spark-sample-data.xlsx')

  console.log('\nConnecting to DB')
  const db = await getDB()

  try {
    const numRecordsAdded = await loadSparkSpreadSheet(spreadSheetPath)
    console.log(`\nDATA LOAD DONE (${numRecordsAdded} recoreds added)\n`)
  } finally {
    console.log('Disconnecting from db server')
    await db.close()
  }
}

const reportErrorAndExit = (val: any) => {
  if (val) console.error(val)
  process.exit()
}

go().catch(reportErrorAndExit)
