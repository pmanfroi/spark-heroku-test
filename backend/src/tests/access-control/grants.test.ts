import 'jest-extended'
import { AccessControl } from 'accesscontrol'
import { Roles } from '../../access-control/roles'
import grants from '../../access-control/grants'
import { removeArrayElements } from '../../utils/generalUtils'
import { ResourceTypes as RT } from '../../types'

const allResources = [RT.PROBLEM, RT.CATEGORY, RT.USER]
const allResourcesExceptUser = removeArrayElements(RT.USER, allResources)

describe('Test Grants', () => {
  const ac = new AccessControl(grants)

  test('Test admin grants', async () => {
    for (const resource of allResources) {
      // any
      expect(ac.can(Roles.ADMIN).createAny(resource).granted).toBe(true)
      expect(ac.can(Roles.ADMIN).readAny(resource).granted).toBe(true)
      expect(ac.can(Roles.ADMIN).updateAny(resource).granted).toBe(true)
      expect(ac.can(Roles.ADMIN).deleteAny(resource).granted).toBe(true)
      // own
      expect(ac.can(Roles.ADMIN).createOwn(resource).granted).toBe(true)
      expect(ac.can(Roles.ADMIN).readOwn(resource).granted).toBe(true)
      expect(ac.can(Roles.ADMIN).updateOwn(resource).granted).toBe(true)
      expect(ac.can(Roles.ADMIN).deleteOwn(resource).granted).toBe(true)
    }

    // Bad requests
    expect(ac.can(Roles.ADMIN).createAny('bad').granted).toBe(false)
  })

  test('Test executive grants', async () => {
    // all resources except user
    for (const resource of allResourcesExceptUser) {
      // any
      expect(ac.can(Roles.EXECUTIVE).createAny(resource).granted).toBe(true)
      expect(ac.can(Roles.EXECUTIVE).readAny(resource).granted).toBe(true)
      expect(ac.can(Roles.EXECUTIVE).updateAny(resource).granted).toBe(true)
      expect(ac.can(Roles.EXECUTIVE).deleteAny(resource).granted).toBe(true)
      // own
      expect(ac.can(Roles.EXECUTIVE).createOwn(resource).granted).toBe(true)
      expect(ac.can(Roles.EXECUTIVE).readOwn(resource).granted).toBe(true)
      expect(ac.can(Roles.EXECUTIVE).updateOwn(resource).granted).toBe(true)
      expect(ac.can(Roles.EXECUTIVE).deleteOwn(resource).granted).toBe(true)
    }

    //
    // exec user access
    //

    // any
    expect(ac.can(Roles.EXECUTIVE).createAny(RT.USER).granted).toBe(false)
    expect(ac.can(Roles.EXECUTIVE).readAny(RT.USER).granted).toBe(true)
    expect(ac.can(Roles.EXECUTIVE).updateAny(RT.USER).granted).toBe(false)
    expect(ac.can(Roles.EXECUTIVE).deleteAny(RT.USER).granted).toBe(false)
    // own
    expect(ac.can(Roles.EXECUTIVE).createOwn(RT.USER).granted).toBe(true)
    expect(ac.can(Roles.EXECUTIVE).readOwn(RT.USER).granted).toBe(true)
    expect(ac.can(Roles.EXECUTIVE).updateOwn(RT.USER).granted).toBe(true)
    expect(ac.can(Roles.EXECUTIVE).deleteOwn(RT.USER).granted).toBe(false)

    // Bad requests
    expect(ac.can(Roles.EXECUTIVE).readAny('bad').granted).toBe(false)
  })
  test('Test editor grants', async () => {
    //
    // editor problem access
    //

    // any
    expect(ac.can(Roles.EDITOR).createAny(RT.PROBLEM).granted).toBe(false)
    expect(ac.can(Roles.EDITOR).readAny(RT.PROBLEM).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).updateAny(RT.PROBLEM).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).deleteAny(RT.PROBLEM).granted).toBe(false)
    // own
    expect(ac.can(Roles.EDITOR).createOwn(RT.PROBLEM).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).readOwn(RT.PROBLEM).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).updateOwn(RT.PROBLEM).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).deleteOwn(RT.PROBLEM).granted).toBe(true)

    //
    // editor category access
    //

    // any
    expect(ac.can(Roles.EDITOR).createAny(RT.CATEGORY).granted).toBe(false)
    expect(ac.can(Roles.EDITOR).readAny(RT.CATEGORY).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).updateAny(RT.CATEGORY).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).deleteAny(RT.CATEGORY).granted).toBe(false)
    // own
    expect(ac.can(Roles.EDITOR).createOwn(RT.CATEGORY).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).readOwn(RT.CATEGORY).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).updateOwn(RT.CATEGORY).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).deleteOwn(RT.CATEGORY).granted).toBe(true)

    //
    // editor label access
    //

    // any
    expect(ac.can(Roles.EDITOR).createAny(RT.LABEL).granted).toBe(false)
    expect(ac.can(Roles.EDITOR).readAny(RT.LABEL).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).updateAny(RT.LABEL).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).deleteAny(RT.LABEL).granted).toBe(false)
    // own
    expect(ac.can(Roles.EDITOR).createOwn(RT.LABEL).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).readOwn(RT.LABEL).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).updateOwn(RT.LABEL).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).deleteOwn(RT.LABEL).granted).toBe(true)

    //
    // editor user access
    //

    // any
    expect(ac.can(Roles.EDITOR).createAny(RT.USER).granted).toBe(false)
    expect(ac.can(Roles.EDITOR).readAny(RT.USER).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).updateAny(RT.USER).granted).toBe(false)
    expect(ac.can(Roles.EDITOR).deleteAny(RT.USER).granted).toBe(false)
    // own
    expect(ac.can(Roles.EDITOR).createOwn(RT.USER).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).readOwn(RT.USER).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).updateOwn(RT.USER).granted).toBe(true)
    expect(ac.can(Roles.EDITOR).deleteOwn(RT.USER).granted).toBe(false)

    // Bad requests
    expect(ac.can(Roles.EDITOR).deleteOwn('bad').granted).toBe(false)
  })

  test('Test reviewr grants', async () => {
    //
    // reviewer problems access
    //

    // any
    expect(ac.can(Roles.REVIEWER).createAny(RT.PROBLEM).granted).toBe(false)
    expect(ac.can(Roles.REVIEWER).readAny(RT.PROBLEM).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).updateAny(RT.PROBLEM).granted).toBe(false)
    expect(ac.can(Roles.REVIEWER).deleteAny(RT.PROBLEM).granted).toBe(false)
    // own
    expect(ac.can(Roles.REVIEWER).createOwn(RT.PROBLEM).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).readOwn(RT.PROBLEM).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).updateOwn(RT.PROBLEM).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).deleteOwn(RT.PROBLEM).granted).toBe(true)

    //
    // reviewer category access
    //

    // any
    expect(ac.can(Roles.REVIEWER).createAny(RT.CATEGORY).granted).toBe(false)
    expect(ac.can(Roles.REVIEWER).readAny(RT.CATEGORY).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).updateAny(RT.CATEGORY).granted).toBe(false)
    expect(ac.can(Roles.REVIEWER).deleteAny(RT.CATEGORY).granted).toBe(false)
    // own
    expect(ac.can(Roles.REVIEWER).createOwn(RT.CATEGORY).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).readOwn(RT.CATEGORY).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).updateOwn(RT.CATEGORY).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).deleteOwn(RT.CATEGORY).granted).toBe(true)

    //
    // reviewer label access
    //

    // any
    expect(ac.can(Roles.REVIEWER).createAny(RT.LABEL).granted).toBe(false)
    expect(ac.can(Roles.REVIEWER).readAny(RT.LABEL).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).updateAny(RT.LABEL).granted).toBe(false)
    expect(ac.can(Roles.REVIEWER).deleteAny(RT.LABEL).granted).toBe(false)
    // own
    expect(ac.can(Roles.REVIEWER).createOwn(RT.LABEL).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).readOwn(RT.LABEL).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).updateOwn(RT.LABEL).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).deleteOwn(RT.LABEL).granted).toBe(true)

    // reviewer user access
    //

    // own
    expect(ac.can(Roles.REVIEWER).createAny(RT.USER).granted).toBe(false)
    expect(ac.can(Roles.REVIEWER).readAny(RT.USER).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).updateAny(RT.USER).granted).toBe(false)
    expect(ac.can(Roles.REVIEWER).deleteAny(RT.USER).granted).toBe(false)
    // any
    expect(ac.can(Roles.REVIEWER).createOwn(RT.USER).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).readOwn(RT.USER).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).updateOwn(RT.USER).granted).toBe(true)
    expect(ac.can(Roles.REVIEWER).deleteOwn(RT.USER).granted).toBe(false)

    // Bad requests
    expect(ac.can(Roles.REVIEWER).deleteOwn('bad').granted).toBe(false)
  })
})
