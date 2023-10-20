export const throwIf = (condition, errorMsg) => {
  if (condition) {
    console.error(`ERROR: ${errorMsg}`)
    throw new Error(`ERROR: ${errorMsg}`)
  }
}
