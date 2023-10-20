import {AccessControl} from 'accesscontrol'
import {any} from 'ramda'
import {isUndefined} from 'ramda-adjunct'

import {ResourceTypes} from '../rest/types'

export enum WhichResource {
  ANY = 'Any',
  OWN = 'Own',
}

export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export const resourceAccess = (permissions, resourceType: ResourceTypes) => {
  const ac = new AccessControl({user: permissions})
  return {
    // any
    createAny: ac.can('user').createAny(resourceType)?.granted || false,
    deleteAny: ac.can('user').deleteAny(resourceType)?.granted || false,
    readAny: ac.can('user').readAny(resourceType)?.granted || false,
    updateAny: ac.can('user').updateAny(resourceType)?.granted || false,
    // own
    createOwn: ac.can('user').createOwn(resourceType)?.granted || false,
    deleteOwn: ac.can('user').deleteOwn(resourceType)?.granted || false,
    readOwn: ac.can('user').readOwn(resourceType)?.granted || false,
    updateOwn: ac.can('user').updateOwn(resourceType)?.granted || false,
  }
}

export const canPerformAction = (
  action: Action,
  resourceType: ResourceTypes,
  which: WhichResource,
  permissions: any
) => {
  if (any(isUndefined, [action, resourceType, which, permissions])) return false
  const ac = new AccessControl({user: permissions})
  return ac.can('user')[action + which](resourceType)?.granted || false
}
