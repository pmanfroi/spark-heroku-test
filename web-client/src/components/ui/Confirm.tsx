import ReactModal from 'react-modal'

import Button from '@/components/buttons/Button'
import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  modalTitle: string
  modalSubtitle: string
  modalIsOpen: boolean
  onAccept: () => void
  onDeny: () => void
  className?: string
}
const defaultProps = {
  modalTitle: null,
  modalSubtitle: null,
  modalIsOpen: false,
  onAccept: function () {
    return console.error('Confirm: no onAccept() provided')
  },
  onDeny: function () {
    return console.error('Confirm: no onDeny() provided')
  },
}
//*****************************************************************************
// Components
//*****************************************************************************
const Confirm = (props: Props) => {
  const {modalTitle, modalSubtitle} = props
  const {modalIsOpen, onAccept, onDeny, className} = props

  const modalStyle = {
    overlay: {
      backgroundColor: 'rgba(25, 29, 27, 0.75)',
    },
    content: {
      background: '#1E1E22',
      borderRadius: '8px',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '10%',
      width: 'fit-content',
      height: 'fit-content',
      // maxWidth: '33%',
      // maxHeight: '33%',
      // boxSizing: 'border-box',
      color: '#DDD',
    },
  }
  const cn = {
    root: cns('text-gray-400', className),
    title: 'mb-3 text-xl font-semibold',
    buttonContainer: 'flex flex-row gap-2',
    subtitle: 'font-semibold mt-2 mb-6',
  }
  return (
    <ReactModal isOpen={modalIsOpen} style={modalStyle}>
      <div className={cn.root}>
        <div className={cn.title}>{modalTitle}</div>
        <hr />
        <div className={cn.subtitle}>{modalSubtitle}</div>
        <div className={cn.buttonContainer}>
          <Button onClick={onAccept} text="Confirm" />
          <Button onClick={onDeny} text="Cancel" />
        </div>
      </div>
    </ReactModal>
  )
}
Confirm.defaultProps = defaultProps
export default Confirm
