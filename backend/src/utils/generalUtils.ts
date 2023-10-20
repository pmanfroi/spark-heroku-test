import fs from 'fs'
import nodePath from 'path'
// prettier-ignore
import {
  assoc, complement, curry, sort, reverse, append,
  concat, reject, equals, prop, path,
} from 'ramda'
import { isArray } from 'ramda-adjunct'

// returns a single arg that was supplied
export const reflect = (a) => a

// returns 1, -1, 0, as needed for javascript sorting functions (ascending)
export const compareStrings = (s1: string, s2: string) => s1.localeCompare(s2)

export const compareResourceIds = (r1: any, r2: any) => compareStrings(r1?.id || '', r2.id || '')

export const sortResurceListById = (resourceList: any[]) => sort(compareResourceIds, resourceList)

export const boolStrToBool = (boolStr: string | undefined) => boolStr === 'true'

export const stringify = (obj: any) => JSON.stringify(obj, null, 2)

export const assocFront = curry((key: string, value: any, obj: any) => ({ [key]: value, ...obj }))

export const assocIf = curry(
  (pred: boolean, propKey: string, propVal: any, incomingObject: object) =>
    pred ? assoc(propKey, propVal, incomingObject) : incomingObject
)
export const appendIf = curry((condition, toAppend, list) =>
  condition ? append(toAppend, list) : list
)

export const concatIf = curry((condition, toConcat: any[], list: any[]) =>
  condition ? concat(toConcat, list) : list
)

export const fsAbsolutePath = (partialPath: string) => nodePath.resolve(partialPath)

// Check to see if a dir or file exist
// Can provide multiple arguments that togehter make a complete path
// For example fsPathExists(dir, fileName)
export const fsPathExists = (...path: string[]) => fs.existsSync(nodePath.join(...path))
export const dirExists = fsPathExists
export const dirDoesNotExist = complement(dirExists)
export const fileExists = fsPathExists
export const fileDoesNotExist = complement(fsPathExists)

// prettier-ignore
export const applyAsync = (acc,val) => acc.then(val);
// prettier-ignore
export const pipeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x));
// prettier-ignore
export const composeAsync = (...funcs) => x => reverse(funcs).reduce(applyAsync, Promise.resolve(x));

export const toJson = (input: any) => JSON.stringify(input, null, 2)

// removes all elements of thare are equal to `value` from the supplied array
export const removeArrayElements = (valueToRemove: any, array: any[]) =>
  reject(equals(valueToRemove), array)

export const isArrayOfLength = (length, array) => isArray(array) && array.length === length
export const isNotArrayOfLength = complement(isArrayOfLength)

export const pathOrThrow = curry((msg: string, propPath: (string | number)[], obj: any): any => {
  const value = path(propPath, obj)
  if (!value)
    throw new Error(`propOrThrow(): prop not found for path ${propPath} on object: ${toJson(obj)}`)
  return value
})

export const propOrThrow = curry((msg: string, propName: string | number, obj: any): any => {
  const value = prop(propName, obj)
  if (!value)
    throw new Error(
      `propOrThrow(): prop not found for prop '${propName}' on object: ${toJson(obj)}`
    )
  return value
})
