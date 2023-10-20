import {Link} from 'react-router-dom'

import Button, {Props as ButtonProps} from './Button'

//*****************************************************************************
// Interface
//*****************************************************************************

interface Props extends Omit<ButtonProps, 'onClick' | 'parentButtonProps'> {
  linkto: string
}
const defaultProps = {
  buttonText: 'No Text',
  title: '',
  disabled: false,
}
//*****************************************************************************
// Components
//*****************************************************************************
const NavButton = (props: Props) => {
  const {secondary, text, linkto, disabled, className, title, icon} = props
  return (
    <div className={className}>
      <Link to={linkto}>
        <Button {...{text, secondary, disabled, title, icon}} />
      </Link>
    </div>
  )
}
NavButton.defaultProps = defaultProps
export default NavButton
