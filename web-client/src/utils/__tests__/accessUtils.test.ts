import {grants} from '../../rest/grants'
import {Roles} from '../../rest/types'
import {ResourceTypes as RT} from '../../rest/types'
import {canPerformAction, resourceAccess, Action, WhichResource} from '../accessUtils'

const allResources = [RT.PROBLEM, RT.CATEGORY, RT.USER]

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

      const role = grants[Roles.ADMIN]
      const anyResource = WhichResource.ANY
      const ownResource = WhichResource.OWN

      // any
      expect(canPerformAction(Action.CREATE, resource, anyResource, role)).toBe(true)
      expect(canPerformAction(Action.READ, resource, anyResource, role)).toBe(true)
      expect(canPerformAction(Action.UPDATE, resource, anyResource, role)).toBe(true)
      expect(canPerformAction(Action.DELETE, resource, anyResource, role)).toBe(true)
      // own
      expect(canPerformAction(Action.CREATE, resource, ownResource, role)).toBe(true)
      expect(canPerformAction(Action.READ, resource, ownResource, role)).toBe(true)
      expect(canPerformAction(Action.UPDATE, resource, ownResource, role)).toBe(true)
      expect(canPerformAction(Action.DELETE, resource, ownResource, role)).toBe(true)
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

    const problemResource = RT.PROBLEM
    const role = grants[Roles.EDITOR]
    const anyResource = WhichResource.ANY
    const ownResource = WhichResource.OWN

    // any
    expect(canPerformAction(Action.CREATE, problemResource, anyResource, role)).toBe(false)
    expect(canPerformAction(Action.READ, problemResource, anyResource, role)).toBe(true)
    expect(canPerformAction(Action.UPDATE, problemResource, anyResource, role)).toBe(true)
    expect(canPerformAction(Action.DELETE, problemResource, anyResource, role)).toBe(false)
    // own
    expect(canPerformAction(Action.CREATE, problemResource, ownResource, role)).toBe(true)
    expect(canPerformAction(Action.READ, problemResource, ownResource, role)).toBe(true)
    expect(canPerformAction(Action.UPDATE, problemResource, ownResource, role)).toBe(true)
    expect(canPerformAction(Action.DELETE, problemResource, ownResource, role)).toBe(true)

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

    const categoryResource = RT.CATEGORY

    // any
    expect(canPerformAction(Action.CREATE, categoryResource, anyResource, role)).toBe(false)
    expect(canPerformAction(Action.READ, categoryResource, anyResource, role)).toBe(true)
    expect(canPerformAction(Action.UPDATE, categoryResource, anyResource, role)).toBe(true)
    expect(canPerformAction(Action.DELETE, categoryResource, anyResource, role)).toBe(false)
    // own
    expect(canPerformAction(Action.CREATE, categoryResource, ownResource, role)).toBe(true)
    expect(canPerformAction(Action.READ, categoryResource, ownResource, role)).toBe(true)
    expect(canPerformAction(Action.UPDATE, categoryResource, ownResource, role)).toBe(true)
    expect(canPerformAction(Action.DELETE, categoryResource, ownResource, role)).toBe(true)

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

    const userResource = RT.USER
    // any
    expect(canPerformAction(Action.CREATE, userResource, anyResource, role)).toBe(false)
    expect(canPerformAction(Action.READ, userResource, anyResource, role)).toBe(true)
    expect(canPerformAction(Action.UPDATE, userResource, anyResource, role)).toBe(false)
    expect(canPerformAction(Action.DELETE, userResource, anyResource, role)).toBe(false)
    // own
    expect(canPerformAction(Action.CREATE, userResource, ownResource, role)).toBe(true)
    expect(canPerformAction(Action.READ, userResource, ownResource, role)).toBe(true)
    expect(canPerformAction(Action.UPDATE, userResource, ownResource, role)).toBe(true)
    expect(canPerformAction(Action.DELETE, userResource, ownResource, role)).toBe(false)
  })
})
