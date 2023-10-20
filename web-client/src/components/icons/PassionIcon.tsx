import PassionLevelHighIcon from './PassionLevelHighIcon'
import PassionLevelLowIcon from './PassionLevelLowIcon'
import PassionLevelMidIcon from './PassionLevelMidIcon'
import PassionLevelPlaceHolderIcon from './PassionLevelPlaceHolderIcon'
import {IconSize} from './types'

interface Props {
  passionLevel?: number
  size?: IconSize | undefined
  className?: string
  onClick?: () => void
}

const PassionIcon = ({passionLevel, size, className, onClick}: Props) => {
  // prettier-ignore
  const PassionIconToShow =
    passionLevel === 0 ? PassionLevelLowIcon :
    passionLevel === 1 ? PassionLevelMidIcon :
    passionLevel === 2 ? PassionLevelHighIcon : PassionLevelPlaceHolderIcon

  return <PassionIconToShow size={size} highlightOnHover className={className} onClick={onClick} />
}

export default PassionIcon
