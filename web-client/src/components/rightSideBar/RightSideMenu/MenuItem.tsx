import cns from '@/utils/classnames'

interface Props {
  isActive?: boolean
  children?: React.ReactNode
  className?: string
}

const Menu = ({children, isActive, className}: Props) => {
  return (
    <span className={cns('text-lg font-semibold', !isActive && 'text-neutral-500', className)}>
      {children}
    </span>
  )
}

export default Menu
