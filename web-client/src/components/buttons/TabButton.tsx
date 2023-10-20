import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  className?: string
  active?: boolean
  onClick?: () => void
  text?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const TabButton = ({active = false, onClick, className, text}: Props) => {
  const commonStyle = 'w-38'
  const activeStyle = cns('rounded-md bg-white/20 pb-2 pl-7 pr-7 pt-2 text-app-green', commonStyle)
  const inactiveStyle = cns(
    'rounded-md bg-white/10 pb-2 pl-7 pr-7 pt-2 text-white/50 hover:bg-white/20',
    commonStyle
  )

  const cn = {
    button: (active: boolean) => (active ? activeStyle : inactiveStyle),
  }

  return (
    <div className={className}>
      <button onClick={onClick} className={cn.button(active)}>
        {text}
      </button>
    </div>
  )
}
export default TabButton
