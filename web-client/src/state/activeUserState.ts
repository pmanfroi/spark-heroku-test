// We will be saving the JWT token to session storage
import {useAtom} from 'jotai'
import {atomWithStorage} from 'jotai/utils'

import {User, ResourceTypes} from '@/rest/types'
import {canPerformAction, Action, WhichResource} from '@/utils/accessUtils'
import {getSessionItem, removeSessionItem, setSessionItem} from '@/utils/storage'

export const setActiveUserJwt = (token) => setSessionItem('accessToken', token)
export const getActiveUserJwt = () => getSessionItem('accessToken')
export const clearActiveUserJwt = () => removeSessionItem('accessToken')

// Saving Active User to local storage in order to survive page refreshes
const activeUserAtom = atomWithStorage<User | null>('active-user', null)

export const useActiveUser = () => {
  const [activeUser, setActiveUser] = useAtom(activeUserAtom)

  const setActiveUserAndJwt = (user: User, token: string) => {
    // Store JWT in session storage
    setActiveUserJwt(token)

    // Store user in session storage
    setActiveUser(user)
  }

  const clearActiveUserAndJwt = () => {
    setActiveUser(null)
    clearActiveUserJwt()
  }

  const activeUserCanCreateResourceOwn = (resourceType: ResourceTypes) =>
    canPerformAction(Action.CREATE, resourceType, WhichResource.OWN, activeUser?.permissions)
  const activeUserCanReadResourceOwn = (resourceType: ResourceTypes) =>
    canPerformAction(Action.READ, resourceType, WhichResource.OWN, activeUser?.permissions)
  const activeUserCanUpdateResourceOwn = (resourceType: ResourceTypes) =>
    canPerformAction(Action.UPDATE, resourceType, WhichResource.OWN, activeUser?.permissions)
  const activeUserCanDeleteResourceOwn = (resourceType: ResourceTypes) =>
    canPerformAction(Action.DELETE, resourceType, WhichResource.OWN, activeUser?.permissions)
  const activeUserCanCreateResourceAny = (resourceType: ResourceTypes) =>
    canPerformAction(Action.CREATE, resourceType, WhichResource.ANY, activeUser?.permissions)
  const activeUserCanReadResourceAny = (resourceType: ResourceTypes) =>
    canPerformAction(Action.READ, resourceType, WhichResource.ANY, activeUser?.permissions)
  const activeUserCanUpdateResourceAny = (resourceType: ResourceTypes) =>
    canPerformAction(Action.UPDATE, resourceType, WhichResource.ANY, activeUser?.permissions)
  const activeUserCanDeleteResourceAny = (resourceType: ResourceTypes) =>
    canPerformAction(Action.DELETE, resourceType, WhichResource.ANY, activeUser?.permissions)

  const activeUserCanAccess = (resourceType: ResourceTypes) => ({
    createOwn: activeUserCanCreateResourceOwn(resourceType),
    createAny: activeUserCanCreateResourceAny(resourceType),
    createAnyOrOwn:
      activeUserCanCreateResourceOwn(resourceType) || activeUserCanCreateResourceAny(resourceType),
    readOwn: activeUserCanReadResourceOwn(resourceType),
    readAny: activeUserCanReadResourceAny(resourceType),
    readAnyOrOwn:
      activeUserCanReadResourceOwn(resourceType) || activeUserCanReadResourceAny(resourceType),
    updateOwn: activeUserCanUpdateResourceOwn(resourceType),
    updateAny: activeUserCanUpdateResourceAny(resourceType),
    updateAnyOrOwn:
      activeUserCanUpdateResourceOwn(resourceType) || activeUserCanUpdateResourceAny(resourceType),
    deleteOwn: activeUserCanDeleteResourceOwn(resourceType),
    deleteAny: activeUserCanDeleteResourceAny(resourceType),
    deleteAnyOrOwn:
      activeUserCanDeleteResourceOwn(resourceType) || activeUserCanDeleteResourceAny(resourceType),
  })

  return {
    activeUser,
    activeUserRole: activeUser?.role,
    activeUserPermissions: activeUser?.permissions,
    activeUserCanAccess,
    clearActiveUser: clearActiveUserAndJwt,
    setActiveUser: setActiveUserAndJwt,
    getActiveUserJwt,
  }
}
