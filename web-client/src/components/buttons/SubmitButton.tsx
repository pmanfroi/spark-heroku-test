import {noop} from 'ramda-adjunct'

import Button, {Props as ButtonProps, ParentButtonPropsShape} from './Button'

//*****************************************************************************
// Interface
//*****************************************************************************

/*
  Causes a submit event for associated form
  An optional action can be specified by supplying onClick()
*/
interface Props extends Omit<ButtonProps, 'parentButtonProps'> {
  formName?: string
  secondary?: boolean // if true, colors will be app-secondary instead of app-primray
  disabled?: boolean
}

const defaultProps = {
  text: 'Submit',
  onClick: noop,
  disabled: false,
  secondary: false,
}

//*****************************************************************************
// Components
//*****************************************************************************
const SubmitButton = ({disabled, text, onClick, secondary, formName, className}: Props) => {
  let parentButtonProps: ParentButtonPropsShape = {type: 'submit'}
  if (formName) parentButtonProps.form = formName

  return <Button {...{disabled, secondary, text, onClick, parentButtonProps, className}} />
}
SubmitButton.defaultProps = defaultProps
export default SubmitButton
