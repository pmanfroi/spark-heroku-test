import {ProblemStatus, ProblemType, Tag} from '@/rest/types'
import cns from '@/utils/classnames'

import CardTags from './CardTags'

interface Props extends Pick<ProblemType, 'publicId'> {
  status?: ProblemStatus
  numVariants?: number
  className?: string
  tags?: Tag[]
}
const CardFooter = ({publicId, status, numVariants, tags, className}: Props) => {
  const cn = {
    root: cns('flex min-h-[2rem] justify-between gap-2 bg-neutral-800 p-3', className),
    statusContainer: 'mt-1 flex flex-col',
    variantCountContainer: 'mt-2 flex flex-col',
    idContainer: 'mt-2 flex flex-col',
    footerLabel: 'text-3xs text-neutral-550',
    footerValue: 'text-neutral-475 text-2xs',
    tagsContainer: 'mt-2',
  }

  return (
    <div className={cn.root}>
      <div className={cn.statusContainer}>
        <span className={cn.footerLabel}>Status</span>
        <span className={cn.footerValue}>{status}</span>
        <div className={cn.tagsContainer}>{tags?.length ? <CardTags tags={tags} /> : null}</div>
      </div>
      <div className={cn.variantCountContainer}>
        <span className={cn.footerLabel}># Variants</span>
        <span className={cn.footerValue}>{numVariants}</span>
      </div>
      <div className={cn.idContainer}>
        <span className={cn.footerLabel}>ID</span>
        <span className={cn.footerValue}>{publicId}</span>
      </div>
    </div>
  )
}

export default CardFooter
