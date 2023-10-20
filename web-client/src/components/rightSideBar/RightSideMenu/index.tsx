import cns from '@/utils/classnames'

import Item from './MenuItem'

interface Props {
  children?: React.ReactNode
  className?: string
}

const RightSideMenu = ({children, className}: Props) => {
  return <div className={cns('flex justify-between', className)}>{children}</div>
}

export default Object.assign(RightSideMenu, {
  Item,
})
