import cns from '@/utils/classnames'

interface Props {
  className?: string
  children: string
}

const SectionTitle = ({className, children}: Props) => {
  return <span className={cns('text-sm text-neutral-400', className)}>{children}</span>
}

export default SectionTitle
