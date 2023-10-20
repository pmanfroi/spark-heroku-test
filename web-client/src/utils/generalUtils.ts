import {append, assoc, complement, curry, flatten, isNil, keys} from 'ramda'
import {
  isNumber,
  isString,
  isObject,
  isBoolean,
  isNotNilOrEmpty,
  isArray,
  isFunction,
} from 'ramda-adjunct'

// returns a single arg that was supplied
export const reflect = (a) => a

export const throwIf = (condition: any, errorMsg: string) => {
  if (condition) {
    console.error(`ERROR: ${errorMsg}`)
    throw new Error(`ERROR: ${errorMsg}`)
  }
}

export const isStringOrNumber = (toCheck: string) => isString(toCheck) || isNumber(toCheck)

export const isNotStringOrNumber = complement(isStringOrNumber)

export const isStringOrNumberOrBool = (toCheck: string) =>
  isString(toCheck) || isNumber(toCheck) || isBoolean(toCheck)

export const isNotStringOrNumberOrBool = complement(isStringOrNumberOrBool)

export const isNilOrObject = (toCheck: string) => isNil(toCheck) || isObject(toCheck)
export const isNotNilOrObject = complement(isNilOrObject)

export const isNilOrArray = (toCheck: string) => isNil(toCheck) || isArray(toCheck)
export const isNotNilOrArray = complement(isNilOrArray)

export const isStringOrArrayOrFunction = (toCheck: string) =>
  isString(toCheck) || isArray(toCheck) || isFunction(toCheck)

export const isNotStringOrArrayOrFunction = complement(isStringOrArrayOrFunction)

export const isStringOrFunction = (toCheck: string) => isString(toCheck) || isFunction(toCheck)

export const isNotStringOrFunction = complement(isStringOrFunction)

export const isNilOrStringOrObject = (toCheck: string) =>
  isNil(toCheck) || isString(toCheck) || isObject(toCheck)

export const isNotNilOrStringOrObject = complement(isNilOrStringOrObject)

// returns random number between 0 and 100
export const randomPercentage = () => Math.floor(Math.random() * 101)

export const randomNumberBetween = (min: number, max: number) => {
  min = Math.floor(min)
  max = Math.ceil(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const assocIf = curry((condition, propName, propVal, toObj) =>
  condition ? assoc(propName, propVal, toObj) : toObj
)

// will remove any props from an object that have a value of
// null, undefined, [], '', or {}
export const omitNilOrEmptyProps = (obj: object) =>
  keys(obj).reduce((newObj, key) => assocIf(isNotNilOrEmpty(obj[key]), key, obj[key], newObj), {})

export const boolToYesNo = (bool: boolean) => (bool ? 'Yes' : 'No')

export const appendIf = curry((condition, toAppend, list) =>
  condition ? append(toAppend, list) : list
)

// if input is an array return as it, otherwise return array with single element of input
export const arrayify = (input: any) => (isArray(input) ? input : [input])

// if input is an array return as it, flatten nexted arrays
export const flatArrayify = (input: any) => flatten(arrayify(input))

export const toJson = (input: any) => JSON.stringify(input, null, 2)
