import {PencilIcon} from '@heroicons/react/20/solid'
import {XMarkIcon} from '@heroicons/react/20/solid'
import {useState} from 'react'

import Icon from '@/components/icons/Icon'
import Confirm from '@/components/ui/Confirm'
import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  name: string
  onDelete?: () => void
  onEdit?: () => void
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const ManageControls = ({onDelete, onEdit, name, className}: Props) => {
  const _b = useState(false),
    confirmModalOpen = _b[0],
    setConfirmModalOpen = _b[1]
  const cn = {
    root: cns('flex flex-auto place-content-center', className),
  }
  return (
    <div className={cn.root}>
      <Confirm
        modalTitle="Confirm Delete"
        modalSubtitle={'Are you sure you want to delete ' + name + '?'}
        modalIsOpen={confirmModalOpen}
        onDeny={function () {
          return setConfirmModalOpen(false)
        }}
        onAccept={function () {
          setConfirmModalOpen(false)
          onDelete?.()
        }}
      />
      {onEdit && <Icon Icon={XMarkIcon} className="mt-[2px]" highlightOnHover onClick={onEdit} />}
      {onDelete && (
        <Icon
          Icon={PencilIcon}
          className="mt-[2px]"
          highlightOnHover
          onClick={function () {
            return setConfirmModalOpen(true)
          }}
        />
      )}
    </div>
  )
}
export default ManageControls
