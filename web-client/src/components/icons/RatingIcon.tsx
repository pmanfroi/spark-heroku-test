import {RatingType} from '@/rest/types'
import cns from '@/utils/classnames'

import FavoriteIcon from './FavoriteIcon'
import ImportanceIcon from './ImportanceIcon'
import PassionIcon from './PassionIcon'

interface Props {
  level?: number
  type: RatingType
  disabled?: boolean
  onClick?: () => void
}

const RatingIcon = ({level, type, disabled, onClick}: Props) => {
  const cn = {
    cursor: cns(disabled ? 'cursor-not-allowed' : 'cursor-pointer'),
  }
  if (type === RatingType.favorite) {
    return <FavoriteIcon favoriteLevel={level} onClick={onClick} className={cn.cursor} />
  }

  if (type === RatingType.passion) {
    return <PassionIcon passionLevel={level} onClick={onClick} className={cn.cursor} />
  }

  if (type === RatingType.importance) {
    return <ImportanceIcon importanceLevel={level} onClick={onClick} className={cn.cursor} />
  }
}

export default RatingIcon
