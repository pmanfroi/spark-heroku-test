import { User } from '../db/models/user'
import { randomUUID } from 'crypto'
import { UserCognito } from '../types'
import { NotFoundError } from '../errors'

export const saveUserFirstTime = async (data: UserCognito): Promise<void> => {
  const oldUser = await User.findOne({
    where: {
      cognitoId: data.sub,
      deletedAt: null,
    },
  })

  if (!oldUser) {
    const newUser: User = User.build({
      id: randomUUID(),
      cognitoId: data.sub,
      firstName: data.given_name || 'John',
      lastName: data.family_name || 'Doe',
      problems: [],
    })
    await newUser.save()
  }
}

export const fetchUserByCognitoId = async (cognitoId: string): Promise<User> => {
  const user = await User.findOne({
    where: {
      cognitoId: cognitoId,
      deletedAt: null,
    },
  })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return user
}

export const fetchAllUsers = async (): Promise<User[]> => {
  const users = await User.findAll({
    where: {
      deletedAt: null,
    },
  })
  return users
}
