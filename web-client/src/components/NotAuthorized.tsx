import React from 'react'

import {ResourceTypes} from '@/rest/types'

import Json from './Json'

//*****************************************************************************
// Interface
//*****************************************************************************

interface NotAuthorizedProps {
  resourceType: ResourceTypes // resource type for which auth was denied
  userPermissions: any // permissions of the user
  message?: string // optional message to display
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************

const NotAuthorized = ({
  resourceType,
  userPermissions,
  message = '',
  className = '',
}: NotAuthorizedProps) => {
  const cn = {
    root: ` ${className}`,
  }

  return (
    <div className={cn.root}>
      <div>
        Unauthorized attempt to access resource type <strong>{resourceType}</strong>
      </div>
      {message && <div>{message}</div>}
      <Json label="Users Permissions" value={userPermissions} />
    </div>
  )
}

export default NotAuthorized
