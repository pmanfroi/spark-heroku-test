import React from 'react'

import {toJson} from '@/utils/generalUtils'

//*****************************************************************************
// Interface
//*****************************************************************************

interface JsonProps {
  value: any // value to display in json format
  label?: string // optional label to display above json
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************

const Json = ({value, label = '', className = ''}: JsonProps) => {
  const cn = {
    root: ` ${className}`,
    label: 'text-neutral-500 text-sm',
    jsonBox: 'break-all text-2xs bg-neutral-700 rounded p-4 shadow-2xl',
  }

  return (
    <div className={cn.root}>
      {label && <div className={cn.label}>{label}</div>}
      <div className={cn.jsonBox}>
        <pre>{toJson(value)}</pre>
      </div>
    </div>
  )
}

export default Json
