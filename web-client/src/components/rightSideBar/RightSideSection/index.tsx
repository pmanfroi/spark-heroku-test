import cns from '@/utils/classnames'

import Item from './SectionItem'
import ReactionItem from './SectionReactionItem'
import Title from './SectionTitle'

interface Props {
  className?: string
  title?: React.ReactNode
  children?: React.ReactNode
}
const Section = ({className, title, children}: Props) => {
  return (
    <div className={cns('flex flex-col gap-3', className)}>
      {title}
      {children ? <div className={'flex flex-col gap-2'}>{children}</div> : null}
    </div>
  )
}

export default Object.assign(Section, {
  Item,
  Title,
  ReactionItem,
})
