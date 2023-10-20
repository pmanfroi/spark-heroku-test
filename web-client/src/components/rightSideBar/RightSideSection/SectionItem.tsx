import cns from '@/utils/classnames'

interface Props {
  className?: string
}

const SectionItem = ({className}: Props) => {
  return <div className={cns('flex h-8 flex-grow rounded-lg', className)} />
}

export default SectionItem
