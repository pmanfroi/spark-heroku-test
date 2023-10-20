import ReactModal from 'react-modal'

import CloseIcon from '@/components/icons/CloseIcon'

// Interface
//*****************************************************************************
interface Props {
  modalTitle: string
  modalSubtitle: string
  modalIsOpen: boolean
  onModalClose: () => void
  className?: string
  children: React.ReactNode
}
const defaultProps = {
  modalTitle: null,
  modalSubtitle: null,
  modalIsOpen: false,
  onClose: function () {
    return console.error('Modal: no onClose() provided')
  },
}
type Styles = {
  overlay: React.CSSProperties
  content: React.CSSProperties
}
//*****************************************************************************
// Components
//*****************************************************************************
const Modal = (props: Props) => {
  const {modalTitle, modalSubtitle, modalIsOpen, onModalClose, className, children} = props

  const modalStyle: Styles = {
    overlay: {
      position: 'fixed',
      top: 80,
      left: 240,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    content: {
      top: '50px',
      bottom: '50px',
      left: '75px',
      right: '75px',
      border: '',
      background: '#1E1E22',
      borderRadius: '8px',
      padding: '20px',
      color: '#DDD',
    },
  }
  const cn = {
    headerContainer: 'flex flex-row items-startd justify-between',
    closeIcon: 'cursor-pointer w-10 h-108',
    title: 'text-2xl text-zinc-600 over:text-white font-semibold',
    subTitle: '',
    content: 'border-t mt-4 border-zinc-600',
  }
  return (
    <div className={className}>
      <ReactModal onRequestClose={onModalClose} isOpen={modalIsOpen} style={modalStyle}>
        <div className={cn.headerContainer}>
          <div className={cn.title}>{modalTitle}</div>
          <CloseIcon onClick={onModalClose} className={cn.closeIcon} />
        </div>
        <div className={cn.subTitle}>{modalSubtitle}</div>
        <div className={cn.content}>{children}</div>
      </ReactModal>
    </div>
  )
}

Modal.defaultProps = defaultProps
export default Modal
