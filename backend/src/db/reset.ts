import {getDB, resetDB} from './db'
;(async function () {
  const db = await getDB()
  await resetDB()
  await db.close()
})()
