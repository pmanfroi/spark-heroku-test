import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
} from 'amazon-cognito-identity-js'
import AWS from 'aws-sdk'
import config from '../config'
import { BadRequestError } from '../errors'
import { UserCognito } from '/types'
import {
  getUserFromCognitoToken,
  getUserGroupsFromCognitoUserName,
  getCognitoValueOrThrow,
  getUserFromCognitoId,
} from '../utils/cognitoUtils'

export interface CognitoUserType {
  userId: string
  firstName: string
  lastName: string
  email: string
  roles: string[]
}

const userPool = new CognitoUserPool({
  UserPoolId: config.COGNITO.USER_POOL_ID,
  ClientId: config.COGNITO.CLIENT_ID,
})

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: config.AWS.REGION,
  credentials: {
    accessKeyId: config.AWS.ACCESS_KEY,
    secretAccessKey: config.AWS.SECRET_KEY,
  },
})

export const signInUser = async (
  email: string,
  password: string
): Promise<{
  accessToken?: string
  userData?: UserCognito
  forceResetPasswordMessage?: string
}> => {
  const loginDetails = {
    Username: email,
    Password: password,
  }
  const userDetails = {
    Username: email,
    Pool: userPool,
  }
  const authDetails = new AuthenticationDetails(loginDetails)

  const cognitoUser = new CognitoUser(userDetails)
  return await cognitoLogin(cognitoUser, authDetails)
}

const cognitoLogin = (
  cognitoUser: any,
  authDetails: any
): Promise<{
  accessToken?: string
  userData?: UserCognito
  forceResetPasswordMessage?: string
}> => {
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: async (result: CognitoUserSession) => {
        const userData = result.getIdToken().payload as UserCognito
        const accessToken = result.getAccessToken().getJwtToken()
        resolve({
          accessToken,
          userData,
        })
      },
      onFailure: async (error: Error) => {
        reject(new BadRequestError(error.message))
      },
      newPasswordRequired: () => {
        resolve({
          forceResetPasswordMessage: 'FORCE_RESET_PASSWORD',
        })
      },
    })
  })
}

export const updatePassword = async (email: string, password: string) => {
  const params = {
    Password: password,
    UserPoolId: config.COGNITO.USER_POOL_ID,
    Username: email,
    Permanent: true,
  }

  return new Promise((resolve, reject) => {
    cognito.adminSetUserPassword(params, async function (error: Error) {
      if (error) {
        reject(new BadRequestError(error.message))
        return
      }
      resolve('Successful updated password.')
    })
  })
}

export const getCognitoUserFromToken = async (token: string): Promise<CognitoUserType> => {
  const cognitoUserData = await getUserFromCognitoToken(cognito, token)
  const cognitoUserGroupData = await getUserGroupsFromCognitoUserName(
    cognito,
    cognitoUserData.Username
  )

  const cognitoUser: any = {
    userId: cognitoUserData?.Username,
    firstName: getCognitoValueOrThrow('given_name', cognitoUserData?.UserAttributes),
    lastName: getCognitoValueOrThrow('family_name', cognitoUserData?.UserAttributes),
    email: getCognitoValueOrThrow('email', cognitoUserData?.UserAttributes),
    roles: (cognitoUserGroupData?.Groups || []).map((group: any) => group?.GroupName),
  }

  return cognitoUser
}

export const getCognitoUserFromCognitoId = async (cognitoId: string): Promise<CognitoUserType> => {
  const cognitoUserData = await getUserFromCognitoId(cognito, cognitoId)
  const cognitoUserGroupData = await getUserGroupsFromCognitoUserName(
    cognito,
    cognitoUserData.Username
  )

  const cognitoUser: any = {
    userId: cognitoUserData?.Username,
    firstName: getCognitoValueOrThrow('given_name', cognitoUserData?.UserAttributes),
    lastName: getCognitoValueOrThrow('family_name', cognitoUserData?.UserAttributes),
    email: getCognitoValueOrThrow('email', cognitoUserData?.UserAttributes),
    roles: (cognitoUserGroupData?.Groups || []).map((group: any) => group?.GroupName),
  }
  return cognitoUser
}
