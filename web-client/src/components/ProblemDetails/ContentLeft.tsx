import {memo} from 'react'

import Icon from '@/components/icons/Icon'

const ContentLeft = memo(() => {
  const cn = {
    container: 'flex flex-col mt-64 gap-10',
    arrowItem: 'flex flex-col items-center justify-center gap-4',
    text: 'text-center text-xl text-neutral-500',
    arrowDown: 'rotate-180',
  }
  return (
    <div className={cn.container}>
      <div className={cn.arrowItem}>
        <Icon.VariantArrowIndicator />
        <span className={cn.text}>Broader Problems</span>
      </div>
      <div className={cn.arrowItem}>
        <span className={cn.text}>Narrower problems</span>
        <Icon.VariantArrowIndicator className={cn.arrowDown} />
      </div>
    </div>
  )
})

export default ContentLeft
