import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  text: string
  Icon?: React.ElementType
  onClick?: () => void
  className?: string
}
const defaultProps = {
  text: 'No Text',
  onClick: function () {
    console.log('ActionText: No onClick handler')
  },
}
//*****************************************************************************
// Components
//*****************************************************************************
const ActionText = function ({Icon, text, onClick, className}: Props) {
  const cn = {
    root: cns('flex items-center', className),
    text: cns('cursor-pointer text-sm text-app-yellow underline', Icon && 'ml-2', className),
  }
  return (
    <div className={cn.root} onClick={onClick}>
      {Icon && <Icon />}
      <span className={cn.text}>{text}</span>
    </div>
  )
}
ActionText.defaultProps = defaultProps
export default ActionText
