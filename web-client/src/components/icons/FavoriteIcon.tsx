import FavoriteSelectedIcon from './FavoriteSelectedIcon'
import FavoriteUnselectedIcon from './FavoriteUnselectedIcon'
import {IconSize} from './types'

interface Props {
  favoriteLevel?: number
  size?: IconSize | undefined
  className?: string
  onClick?: () => void
}

const FavoriteIcon = ({favoriteLevel, size, className, onClick}: Props) => {
  // prettier-ignore
  const FavoriteIconToShow =
  favoriteLevel === 0 ? FavoriteUnselectedIcon :
  favoriteLevel === 1 ? FavoriteSelectedIcon : FavoriteUnselectedIcon

  return <FavoriteIconToShow size={size} highlightOnHover className={className} onClick={onClick} />
}

export default FavoriteIcon
