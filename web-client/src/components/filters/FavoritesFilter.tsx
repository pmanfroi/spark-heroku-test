import {useState} from 'react'

import Icon from '@/components/icons/Icon'
import Section from '@/components/rightSideBar/RightSideSection'
import {RatingType} from '@/rest/types'
import {useProblemFilters} from '@/state/appState'

const FavoritesFilter = () => {
  const [favoritesFilter, setFavoritesFilter] = useState(false)
  const {problemFilters, setProblemFilters} = useProblemFilters()

  const handleFavoritesFilter = () => {
    const newFavoritesFilter = !favoritesFilter
    setFavoritesFilter(newFavoritesFilter)
    setProblemFilters({
      ...problemFilters,
      favorite: newFavoritesFilter ? 1 : 0,
    })
  }

  return (
    <Section
      className="flex-row items-center"
      title={
        <div className={'flex hover:cursor-pointer'} onClick={handleFavoritesFilter}>
          <Section.Title className={'me-2 text-sm'}>Favorites</Section.Title>
          <Icon.Rating type={RatingType.favorite} level={favoritesFilter ? 1 : 0} />
        </div>
      }
    />
  )
}

export default FavoritesFilter
