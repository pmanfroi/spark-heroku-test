import {noop} from 'ramda-adjunct'
import React from 'react'

import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************

// Should only be used by Button components that wrap this component
// For example SubmitButon, ResetButton.  It is reccomended that these
// are not ever set directly by a client view
export type ParentButtonPropsShape = {
  type: 'submit' | 'reset'
  form?: string
}

export interface Props {
  text: string
  onClick: () => void
  icon?: React.ComponentType
  secondary?: boolean // if true, colors will be app-secondary instead of app-primray
  disabled?: boolean
  parentButtonProps?: ParentButtonPropsShape
  title?: string
  className?: string
}

const defaultProps = {
  parentButtonProps: {},
  onClick: noop,
  disabled: false,
  secondary: false,
  title: '',
  text: 'No Text',
}

//*****************************************************************************
// Components
//*****************************************************************************

const Button = function (props: Props) {
  const {secondary, text, onClick, icon, className, parentButtonProps, title, disabled} = props
  const {type, form} = parentButtonProps || {}

  const baseCn = cns(
    'w-full rounded-md p-2.5 text-sm font-medium text-white',
    'bg-app-primary-500 hover:bg-app-primary-400'
  )

  const varients = {
    'bg-app-secondary-700 hover:bg-app-secondary-600': secondary,
    'bg-app-gray-700 text-app-gray-500': disabled,
  }

  const cn = {
    root: cns('flex w-fit items-center gap-1', baseCn, varients, className),
  }

  const iconStyle: any = {
    width: '1.25rem',
    height: '1.25rem',
    display: 'inline',
    verticalAlign: 'middle',
  }
  return (
    <div className={cn.root}>
      {icon && React.createElement(icon, iconStyle)}
      <button
        {...{type: type || 'button', form, onClick, title, disabled}}
        className={'h-full w-full'}
      >
        {text}
      </button>
    </div>
  )
}
Button.defaultProps = defaultProps
export default Button
