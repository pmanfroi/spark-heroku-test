import CategoriesSelector from '@/components/CategoriesSelector'
import CreatedByFilter from '@/components/filters/CreatedByFilter'
import FavoritesFilter from '@/components/filters/FavoritesFilter'
import ReactionsFilter from '@/components/filters/ReactionsFilter'
import StatusFilter from '@/components/filters/StatusFilter'
import Menu from '@/components/rightSideBar/RightSideMenu'
import {useActiveRootPage, useProblemFilters} from '@/state/appState'
import cns from '@/utils/classnames'

import LabelsSelector from '../LabelsSelector'
import {Option} from '../select/FilterSelect'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************
const ProblemRightSideBar = ({className}: Props) => {
  const {activeRootPageId} = useActiveRootPage()
  const {problemFilters, setProblemFilters} = useProblemFilters()

  const cn = {
    root: cns(
      'flex flex-col gap-4 border-t-2 border-neutral-900 bg-neutral-800 px-5 pb-10 pt-8',
      className
    ),
  }

  if (activeRootPageId !== 'problems') return null

  const handleSelectPress = (newOptions: Option[], field: string) => {
    setProblemFilters({
      ...problemFilters,
      [field]: newOptions,
    })
  }

  return (
    <div className={cn.root}>
      <Menu>
        <Menu.Item isActive>Filters</Menu.Item>
        <Menu.Item>Details</Menu.Item>
        <Menu.Item>Notes</Menu.Item>
      </Menu>
      <FavoritesFilter />
      <CategoriesSelector
        selectedOptions={problemFilters.categories || []}
        onSelectOption={(newOptions) => handleSelectPress(newOptions, 'categories')}
      />
      <LabelsSelector
        selectedOptions={problemFilters.labels || []}
        onSelectOption={(newOptions) => handleSelectPress(newOptions, 'labels')}
      />
      <CreatedByFilter />
      <StatusFilter />
      <ReactionsFilter />
    </div>
  )
}

export default ProblemRightSideBar
