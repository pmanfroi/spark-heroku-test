import { Response } from 'express'

const makeGetError = (resourceType: string, resourceId: string) => ({
  status: `GET /${resourceType}s:${resourceType}Id failed`,
  message: `${resourceType} '${resourceId}' not found`,
})

export const sendGetResponse = (
  res: Response,
  resourceType: string,
  resourceId: string,
  resource: any
) => {
  if (!resource) res.status(404).send(makeGetError(resourceType, resourceId))
  else res.status(200).send(resource)
}

export const sendPostResponse = (res: Response, message: string, resource: any) => {
  res.status(200).send({
    message,
    data: resource,
  })
}

export const sendUpdateResponse = (
  res: Response,
  resourceType: string,
  resourceId: string,
  updatedDesource: any
) => {
  if (!updatedDesource) return res.status(400).send(makeUpdateError('region', updatedDesource))
  else return res.send(updatedDesource)
}

export const makeDeleteResponse = (
  resourceType: string,
  wasDeleted: boolean,
  resourceId: string
) => ({
  deletedResourceId: wasDeleted ? resourceId : '',
  status: wasDeleted ? 'Success' : 'No-Op',
  message: wasDeleted
    ? `${resourceType} ${resourceId} deleted`
    : `${resourceType} ${resourceId} did not exist`,
})

const makeUpdateError = (resourceType: string, resourceId: string) => ({
  status: `PUT /${resourceType}s:${resourceType}Id failed`,
  message: `${resourceType} '${resourceId}' not found`,
})
