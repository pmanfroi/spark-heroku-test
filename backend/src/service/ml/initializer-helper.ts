type TResult = {
  output: string
  topics: string
}

let dailyDigestData: TResult | null = null

export function setDailyDigestData(result: TResult) {
  dailyDigestData = result
}

export function getDailyDigestData() {
  return dailyDigestData
}
