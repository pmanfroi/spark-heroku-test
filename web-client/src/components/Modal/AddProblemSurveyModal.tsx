import {useState} from 'react'
import ReactModal from 'react-modal'

import DeleteIcon from '@/components/icons/DeleteIcon'
import Icon from '@/components/icons/Icon'
import {IconSize} from '@/components/icons/types'
import {ProblemSurveyCreateData, useCreateProblemSurvey} from '@/rest/problemSurveysRestHooks'
import {useGetProblems} from '@/rest/problemsRestHooks'
import {useGetUsers} from '@/rest/usersRestHooks'

// Interface
//*****************************************************************************
interface Props {
  modalIsOpen: boolean
  onModalClose: () => void
  className?: string
}

type Styles = {
  overlay: React.CSSProperties
  content: React.CSSProperties
}

//*****************************************************************************
// Components
//*****************************************************************************
const AddProblemSurveyModal = (props: Props) => {
  const {modalIsOpen, onModalClose, className} = props
  const {users} = useGetUsers()
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState(false)
  const [description, setDescription] = useState('')

  const problemsData = useGetProblems()
  const {createProblemSurvey} = useCreateProblemSurvey({
    onSuccess: async () => {
      onModalClose()
      cleanState()
      await problemsData.refetch()
    },
  })

  const saveProblemSurvey = () => {
    if (!title) {
      setTitleError(true)
    }

    if (title && description) {
      const newProblemSurvey: ProblemSurveyCreateData = {
        title: title,
        description: description,
        problemIds: problemsData.problems.map((problem) => problem.id),
        usersIds: users.map((user) => user.id),
      }
      createProblemSurvey(newProblemSurvey, {})
    }
  }

  const cleanState = () => {
    setDescription('')
    setTitle('')
  }

  const modalStyle: Styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    content: {
      top: '100px',
      bottom: '200px',
      // left: '500px',
      // right: '500px',
      marginLeft: '30%',
      marginRight: '30%',
      border: '',
      background: '#404040',
      borderRadius: '8px',
      padding: '20px',
      color: '#DDD',
    },
  }
  const cn = {
    headerContainer: 'flex flex-row items-start justify-between',
    closeIcon: 'cursor-pointer hover:fill-neutral-400',
    title: 'text-2xl text-neutral-400 over:text-white font-semibold',
    subTitle: '',
    content: 'border-t border-b mt-4 pb-10 p-3 border-zinc-600',
    checkIcon: 'cursor-pointer  hover:opacity-70',
  }

  return (
    <div className={className}>
      <ReactModal onRequestClose={onModalClose} isOpen={modalIsOpen} style={modalStyle}>
        <div className={cn.headerContainer}>
          <div className={cn.title}>Add new survey</div>
          <Icon.CheckCircleChecked
            size={IconSize.lg}
            onClick={saveProblemSurvey}
            className={cn.checkIcon}
          />
        </div>
        <div className={cn.content}>
          <div>
            <input
              type="text"
              className="w-full border-b-2 border-gray-400 bg-neutral-700 p-2 outline-none focus:border-blue-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Problem Title"
            />
            {titleError && <span className="text-xs text-red-600">Problem title is required</span>}
          </div>

          <div className={'mt-2'}>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border-2 border-gray-400 bg-neutral-700 p-2 outline-none focus:border-blue-400"
              placeholder="Problem Description"
            />
          </div>
        </div>
        <div className={'mt-5 flex flex-row justify-end'}>
          <DeleteIcon
            onClick={() => {
              onModalClose()
              cleanState()
            }}
            className={cn.closeIcon}
            size={IconSize.lg}
          />
        </div>
      </ReactModal>
    </div>
  )
}

export default AddProblemSurveyModal
