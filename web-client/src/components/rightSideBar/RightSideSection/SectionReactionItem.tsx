import {ReactComponentElement, ElementType} from 'react'

interface Props {
  icon: ReactComponentElement<ElementType<SVGAElement>>
  label: string
}

const SectionReactionItem = ({icon, label}: Props) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <label className="text-xs text-neutral-500">{label}</label>
    </div>
  )
}

export default SectionReactionItem
