import {noop} from 'ramda-adjunct'
import {Link} from 'react-router-dom'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  text: string
  to: string
  onClick?: () => void
  className?: string
}
const defaultProps = {
  text: 'No Text',
  to: '',
  onClick: noop,
}
//*****************************************************************************
// Components
//*****************************************************************************
const NavText = function ({text, ...props}: Props) {
  const cn = {
    text: 'text-zinc-400 underline hover:cursor-pointer hover:text-zinc-300',
  }
  return (
    <Link {...props}>
      <span className={cn.text}>{text}</span>
    </Link>
  )
}
NavText.defaultProps = defaultProps
export default NavText
