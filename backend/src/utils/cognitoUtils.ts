import AWS from 'aws-sdk'
import { defaultTo, find, pipe, propOr } from 'ramda'

import { toJson } from './generalUtils'
import { NotFoundError, InternalServerError, reportError } from '../errors'
import { isNotArray, isNotString } from 'ramda-adjunct'

interface CognitoValue {
  Name: string
  Value: string
}

export const getUserFromCognitoToken = async (
  cognito: AWS.CognitoIdentityServiceProvider,
  token: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const cognitoParams = {
      AccessToken: token,
    }
    cognito.getUser(cognitoParams, async function (error, data) {
      // prettier-ignore
      if (error) {
        cognitoReject(reject,
          'getUserFromCognitoToken','Could not get congito user from token',
          cognitoParams, error
        )
      } else resolve(data)
    })
  })
}

export const getUserFromCognitoId = async (
  cognito: AWS.CognitoIdentityServiceProvider,
  cognitoId: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const cognitoParams = {
      Username: cognitoId,
      UserPoolId: process.env.COGNITO_USER_POOL_ID || '',
    }
    cognito.adminGetUser(cognitoParams, async function (error, data) {
      // prettier-ignore
      if (error) {
        cognitoReject(reject,
          'getUserFromCognitoId','Could not get congito user from id/username',
          cognitoParams, error
        )
      } else resolve(data)
    })
  })
}

export const getUserGroupsFromCognitoUserName = async (
  cognito: AWS.CognitoIdentityServiceProvider,
  username: string
): Promise<any> => {
  // Cognito only supports callbacks, sigh ...
  const cognitoParams = {
    Username: username,
    UserPoolId: process.env.COGNITO_USER_POOL_ID || '',
  }
  return new Promise((resolve, reject) => {
    cognito.adminListGroupsForUser(cognitoParams, async function (error, data) {
      // prettier-ignore
      if (error) {
        cognitoReject(reject,
          'getUserGroupsFromCognitoUserName','Could not get congito groups for',
          cognitoParams, error
        )
      } else resolve(data)
    })
  })
}

// prettier-ignore
export const getCognitoValue = (valueName: string, cognitoAttributeList: CognitoValue[]): any =>
  pipe(
    defaultTo([]),
    find((cognitoAttribute: CognitoValue) => cognitoAttribute.Name === valueName),
    propOr(null, 'Value')
  )(cognitoAttributeList)

// prettier-ignore
export const getCognitoValueOrThrow = (
  valueName: string,
  cognitoAttributeList: CognitoValue[]
): any => {

  if (isNotArray(cognitoAttributeList))
    throw new InternalServerError(`getCognitoValue(): Invalid cognitoAttributeList: ${toJson(cognitoAttributeList)}`)
  if (isNotString(valueName))
    throw new NotFoundError(`getCognitoValue(): Invalid valueName: ${toJson(valueName)}`)

  const cognitoValue = getCognitoValue(valueName, cognitoAttributeList)
  if (!cognitoValue) {
    throw new NotFoundError(`Cognito value not found for ${valueName}`)
  }
  return cognitoValue
}

const cognitoErrorMsg = (fxnName: string, msg: string, cognitoParams: any) =>
  `COGNITO ERROR: ${fxnName}(). ${msg}: ${toJson(cognitoParams)}`

const cognitoReject = (
  reject: any,
  fxnName: string,
  msg: string,
  cognitoParams: any,
  error: Error
) => {
  const errMsg = cognitoErrorMsg(fxnName, msg, cognitoParams)
  reportError(errMsg, error)
  reject(new NotFoundError(errMsg))
}
