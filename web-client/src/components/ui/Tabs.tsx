import TabButton from '@/components//buttons/TabButton'
import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
type TabShape = {
  id: string | number
  text: string
}
interface Props {
  tabs: TabShape[]
  activeTabId: string
  onTabSelect: (tab: TabShape) => void
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const Tabs = ({tabs = [], activeTabId, onTabSelect, className}: Props) => {
  const isActive = function (id?: TabShape['id']) {
    return id === activeTabId
  }
  const cn = {
    root: cns('flex flex-row gap-2 text-sm', className),
  }
  return (
    <div className={cn.root}>
      {tabs.map(function (tab) {
        return (
          <div key={tab.id}>
            <TabButton
              text={tab === null || tab === void 0 ? void 0 : tab.text}
              onClick={function () {
                return onTabSelect(tab)
              }}
              active={isActive(tab === null || tab === void 0 ? void 0 : tab.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
export default Tabs
