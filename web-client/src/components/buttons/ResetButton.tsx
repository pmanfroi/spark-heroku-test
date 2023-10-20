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
  formName: string
  tranparent: boolean
}
const defaultProps = {
  text: 'Reset',
  onClick: function () {
    return noop
  },
  tranparent: false,
}
//*****************************************************************************
// Components
//*****************************************************************************
const ResetButton = ({text, onClick, tranparent, formName, className}: Props) => {
  let parentButtonProps: ParentButtonPropsShape = {type: 'reset'}
  if (formName) parentButtonProps.form = formName

  const solid = !tranparent
  return <Button {...{solid, text, onClick, parentButtonProps, className}} />
}

ResetButton.defaultProps = defaultProps
export default ResetButton
