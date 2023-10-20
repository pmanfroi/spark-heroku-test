import 'jest-extended'
import { Roles } from '../../access-control/roles'
import grants from '../../access-control/grants'
import { ResourceTypes as RT } from '../../types'
import {
  Action,
  WhichResource,
  canPerformAction,
  resourceAccess,
} from '../../access-control/accessUtils'

/*
  Not testing every single permutation of resource and role, that is tested in other test.
  Rather, just testing that the access utils are working as expected for a number of representative cases.
*/

const allResources = [RT.PROBLEM, RT.CATEGORY, RT.USER]

// prettier-ignore
describe('Access Utils', () => {
  test('Admin access', async () => {
    for (const resource of allResources) {
      const adminAccess = resourceAccess(grants[Roles.ADMIN], resource)

      // any
      expect(adminAccess.createAny).toBe(true)
      expect(adminAccess.readAny).toBe(true)
      expect(adminAccess.updateAny).toBe(true)
      expect(adminAccess.deleteAny).toBe(true)
      // own
      expect(adminAccess.createOwn).toBe(true)
      expect(adminAccess.readOwn).toBe(true)
      expect(adminAccess.updateOwn).toBe(true)
      expect(adminAccess.deleteOwn).toBe(true)
      // any
      expect(canPerformAction(Action.CREATE, resource, WhichResource.ANY, grants[Roles.ADMIN])).toBe(true)
      expect(canPerformAction(Action.READ, resource, WhichResource.ANY, grants[Roles.ADMIN])).toBe(true)
      expect(canPerformAction(Action.UPDATE, resource, WhichResource.ANY, grants[Roles.ADMIN])).toBe(true)
      expect(canPerformAction(Action.DELETE, resource, WhichResource.ANY, grants[Roles.ADMIN])).toBe(true)
      // own
      expect(canPerformAction(Action.CREATE, resource, WhichResource.OWN, grants[Roles.ADMIN])).toBe(true)
      expect(canPerformAction(Action.READ, resource, WhichResource.OWN, grants[Roles.ADMIN])).toBe(true)
      expect(canPerformAction(Action.UPDATE, resource, WhichResource.OWN, grants[Roles.ADMIN])).toBe(true)
      expect(canPerformAction(Action.DELETE, resource, WhichResource.OWN, grants[Roles.ADMIN])).toBe(true)
    }
  })

  test('Test editor grants', async () => {
    const editorProblemAccess = resourceAccess(grants[Roles.EDITOR], RT.PROBLEM)

    //
    // editor problem access
    //

    // any
    expect(editorProblemAccess.createAny).toBe(false)
    expect(editorProblemAccess.readAny).toBe(true)
    expect(editorProblemAccess.updateAny).toBe(true)
    expect(editorProblemAccess.deleteAny).toBe(false)
    // own
    expect(editorProblemAccess.createOwn).toBe(true)
    expect(editorProblemAccess.readOwn).toBe(true)
    expect(editorProblemAccess.updateOwn).toBe(true)
    expect(editorProblemAccess.deleteOwn).toBe(true)

    // any
    expect(canPerformAction(Action.CREATE, RT.PROBLEM, WhichResource.ANY, grants[Roles.EDITOR])).toBe(false)
    expect(canPerformAction(Action.READ, RT.PROBLEM, WhichResource.ANY, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.UPDATE, RT.PROBLEM, WhichResource.ANY, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.DELETE, RT.PROBLEM, WhichResource.ANY, grants[Roles.EDITOR])).toBe(false)
    // own
    expect(canPerformAction(Action.CREATE, RT.PROBLEM, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.READ, RT.PROBLEM, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.UPDATE, RT.PROBLEM, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.DELETE, RT.PROBLEM, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)

    //
    // editor category access
    //

    const editorCategoryAccess = resourceAccess(grants[Roles.EDITOR], RT.CATEGORY)

    // any
    expect(editorCategoryAccess.createAny).toBe(false)
    expect(editorCategoryAccess.readAny).toBe(true)
    expect(editorCategoryAccess.updateAny).toBe(true)
    expect(editorCategoryAccess.deleteAny).toBe(false)

    // own
    expect(editorCategoryAccess.createOwn).toBe(true)
    expect(editorCategoryAccess.readOwn).toBe(true)
    expect(editorCategoryAccess.updateOwn).toBe(true)
    expect(editorCategoryAccess.deleteOwn).toBe(true)

    // any
    expect(canPerformAction(Action.CREATE, RT.CATEGORY, WhichResource.ANY, grants[Roles.EDITOR])).toBe(false)
    expect(canPerformAction(Action.READ, RT.CATEGORY, WhichResource.ANY, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.UPDATE, RT.CATEGORY, WhichResource.ANY, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.DELETE, RT.CATEGORY, WhichResource.ANY, grants[Roles.EDITOR])).toBe(false)
    // own
    expect(canPerformAction(Action.CREATE, RT.CATEGORY, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.READ, RT.CATEGORY, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.UPDATE, RT.CATEGORY, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.DELETE, RT.CATEGORY, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)

    //
    // editor label access
    //

    const editorLabelAccess = resourceAccess(grants[Roles.EDITOR], RT.LABEL)

    // any
    expect(editorLabelAccess.createAny).toBe(false)
    expect(editorLabelAccess.readAny).toBe(true)
    expect(editorLabelAccess.updateAny).toBe(true)
    expect(editorLabelAccess.deleteAny).toBe(false)

    // own
    expect(editorLabelAccess.createOwn).toBe(true)
    expect(editorLabelAccess.readOwn).toBe(true)
    expect(editorLabelAccess.updateOwn).toBe(true)
    expect(editorLabelAccess.deleteOwn).toBe(true)

    // any
    expect(canPerformAction(Action.CREATE, RT.LABEL, WhichResource.ANY, grants[Roles.EDITOR])).toBe(false)
    expect(canPerformAction(Action.READ, RT.LABEL, WhichResource.ANY, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.UPDATE, RT.LABEL, WhichResource.ANY, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.DELETE, RT.LABEL, WhichResource.ANY, grants[Roles.EDITOR])).toBe(false)

    // own
    expect(canPerformAction(Action.CREATE, RT.LABEL, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.READ, RT.LABEL, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.UPDATE, RT.LABEL, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.DELETE, RT.LABEL, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)

    // editor user access
    const editorUserAccess = resourceAccess(grants[Roles.EDITOR], RT.USER)

    // any
    expect(editorUserAccess.createAny).toBe(false)
    expect(editorUserAccess.readAny).toBe(true)
    expect(editorUserAccess.updateAny).toBe(false)
    expect(editorUserAccess.deleteAny).toBe(false)

    // own
    expect(editorUserAccess.createOwn).toBe(true)
    expect(editorUserAccess.readOwn).toBe(true)
    expect(editorUserAccess.updateOwn).toBe(true)
    expect(editorUserAccess.deleteOwn).toBe(false)

    // any
    expect(canPerformAction(Action.CREATE, RT.USER, WhichResource.ANY, grants[Roles.EDITOR])).toBe(false)
    expect(canPerformAction(Action.READ, RT.USER, WhichResource.ANY, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.UPDATE, RT.USER, WhichResource.ANY, grants[Roles.EDITOR])).toBe(false)
    expect(canPerformAction(Action.DELETE, RT.USER, WhichResource.ANY, grants[Roles.EDITOR])).toBe(false)
    // own
    expect(canPerformAction(Action.CREATE, RT.USER, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.READ, RT.USER, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.UPDATE, RT.USER, WhichResource.OWN, grants[Roles.EDITOR])).toBe(true)
    expect(canPerformAction(Action.DELETE, RT.USER, WhichResource.OWN, grants[Roles.EDITOR])).toBe(false)
  })
})
