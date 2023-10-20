import cns from '@/utils/classnames'

import Footer from './CardFooter'
import Header from './CardHeader'
import Tags from './CardTags'

interface Props {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}
const Card = ({children, className, onClick}: Props) => {
  return (
    <div
      className={cns(
        'flex min-h-[9rem] w-60 flex-col justify-between overflow-hidden rounded-md bg-neutral-600',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Object.assign(Card, {
  Header,
  Footer,
  Tags,
})
