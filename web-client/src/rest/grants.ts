import {Roles} from './types'
import {ResourceTypes as RT} from './types'

const anyOwnerAllActions = {
  'create:any': ['*'],
  'read:any': ['*'],
  'update:any': ['*'],
  'delete:any': ['*'],
}

const adminGrants = {
  [RT.PROBLEM]: anyOwnerAllActions,
  [RT.CATEGORY]: anyOwnerAllActions,
  [RT.USER]: anyOwnerAllActions,
}

export const executiveGrants = {
  [RT.PROBLEM]: anyOwnerAllActions,
  [RT.CATEGORY]: anyOwnerAllActions,
  [RT.USER]: {
    'create:own': ['*'],
    'read:any': ['*'],
    'update:own': ['*'],
  },
}

export const editorGrants = {
  [RT.PROBLEM]: {
    'create:own': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:own': ['*'],
  },
  [RT.CATEGORY]: {
    'create:own': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:own': ['*'],
  },
  [RT.USER]: {
    'create:own': ['*'],
    'read:any': ['*'],
    'update:own': ['*'],
  },
}

export const reviewerGrants = {
  [RT.PROBLEM]: {
    'create:own': ['*'],
    'read:any': ['*'],
    'update:own': ['*'],
    'delete:own': ['*'],
  },
  [RT.CATEGORY]: {
    'create:own': ['*'],
    'read:any': ['*'],
    'update:own': ['*'],
    'delete:own': ['*'],
  },
  [RT.USER]: {
    'create:own': ['*'],
    'read:any': ['*'],
    'update:own': ['*'],
  },
}

export const grants = {
  [Roles.ADMIN]: adminGrants,
  [Roles.EXECUTIVE]: executiveGrants,
  [Roles.EDITOR]: editorGrants,
  [Roles.REVIEWER]: reviewerGrants,
}
