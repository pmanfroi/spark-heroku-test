import ImportanceLevelHighIcon from './ImportanceLevelHighIcon'
import ImportanceLevelLowIcon from './ImportanceLevelLowIcon'
import ImportanceLevelMidIcon from './ImportanceLevelMidIcon'
import ImportanceLevelPlaceHolderIcon from './ImportanceLevelPlaceHolderIcon'
import {IconSize} from './types'

interface Props {
  importanceLevel?: number
  size?: IconSize | undefined
  className?: string
  onClick?: () => void
}

const ImportanceIcon = ({importanceLevel, size, className, onClick}: Props) => {
  // prettier-ignore
  const ImportanceIconToShow =
    importanceLevel === 0 ? ImportanceLevelLowIcon :
    importanceLevel === 1 ? ImportanceLevelMidIcon :
    importanceLevel === 2 ? ImportanceLevelHighIcon : ImportanceLevelPlaceHolderIcon

  return (
    <ImportanceIconToShow size={size} highlightOnHover className={className} onClick={onClick} />
  )
}

export default ImportanceIcon
