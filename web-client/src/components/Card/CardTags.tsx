import {Tag} from '@/rest/types'
import cns from '@/utils/classnames'

interface Props {
  tags: Tag[]
  className?: string
}

const cn = {
  tag: 'flex h-4 items-center justify-center rounded-md p-2',
}

const CardTags = ({tags, className}: Props) => {
  return (
    <div className={cns('flex flex-wrap gap-2', className)}>
      {tags.map(({label, bgColor, textColor}, index) => {
        // Determines if color passed is a variant or hex color
        return (
          <div key={index} className={cn.tag} style={{backgroundColor: bgColor}}>
            <span className="text-center text-3xs font-semibold" style={{color: textColor}}>
              {label.toUpperCase()}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default CardTags
