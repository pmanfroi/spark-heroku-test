import {useEffect, useState} from 'react'
import ReactModal from 'react-modal'

import DeleteIcon from '@/components/icons/DeleteIcon'
import Icon from '@/components/icons/Icon'
import {IconSize} from '@/components/icons/types'
import MainSelect, {Entry} from '@/components/select/MainSelect'
import {useGetProblemCategories} from '@/rest/categoriesRestHooks'
import {useGetLabels} from '@/rest/labelsRestHookst'
import {useCreateProblem, useGetProblems} from '@/rest/problemsRestHooks'
import {getCategoryEntries} from '@/utils/categoryUtils'
import {getLabelEntries} from '@/utils/labelUtils'

// Interface
//*****************************************************************************
interface Props {
  modalIsOpen: boolean
  onModalClose: () => void
  className?: string
  defaultCategory: string
}

const defaultProps = {
  modalIsOpen: '',
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
const AddProblemModal = (props: Props) => {
  const {modalIsOpen, onModalClose, defaultCategory, className} = props
  const [selectedCategories, setSelectedCategories] = useState<string[]>()
  const [selectedLabels, setSelectedLabels] = useState<string[]>()
  const [problemTitle, setProblemTitle] = useState('')
  const [problemTitleError, setProblemTitleError] = useState(false)
  const [problemDescription, setProblemDescription] = useState('')
  const {categories} = useGetProblemCategories()
  const [categoryOptions, setCategoryOptions] = useState<Entry[]>([])
  const [categoriesError, setCategoriesError] = useState(false)
  const {labels} = useGetLabels()
  const [labelOptions, setLabelOptions] = useState<Entry[]>([])
  const getProblems = useGetProblems()

  const {createProblem} = useCreateProblem({
    onSuccess: async () => {
      onModalClose()
      cleanState()
      await getProblems.refetch()
    },
  })

  const saveProblem = () => {
    if (!problemTitle) {
      setProblemTitleError(true)
    }
    if (!selectedCategories) {
      setCategoriesError(true)
    }

    if (problemTitle && selectedCategories) {
      const newProblem = {
        title: problemTitle,
        problemVariants: [
          {
            type: 'ROOT',
            content: problemDescription,
            order: 0,
          },
        ],
        categories: selectedCategories,
        labels: selectedLabels,
      }
      createProblem(newProblem, {})
    }
  }

  const cleanState = () => {
    setProblemDescription('')
    setProblemTitle('')
    setSelectedCategories([])
  }

  useEffect(() => {
    setCategoryOptions(getCategoryEntries(categories))
  }, [categories])

  useEffect(() => {
    setLabelOptions(getLabelEntries(labels))
  }, [labels])

  useEffect(() => {
    setSelectedCategories([defaultCategory])
  }, [defaultCategory])

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
          <div className={cn.title}>Add new problem</div>
          <Icon.CheckCircleChecked
            size={IconSize.lg}
            onClick={saveProblem}
            className={cn.checkIcon}
          />
        </div>
        <div className={cn.content}>
          <div>
            <input
              type="text"
              className="w-full border-b-2 border-gray-400 bg-neutral-700 p-2 outline-none focus:border-blue-400"
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
              placeholder="Problem Title"
            />
            {problemTitleError && (
              <span className="text-xs text-red-600">Problem title is required</span>
            )}
          </div>

          <div className={'mt-2'}>
            <textarea
              rows={5}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="w-full rounded border-2 border-gray-400 bg-neutral-700 p-2 outline-none focus:border-blue-400"
              placeholder="Problem Description"
            />
          </div>
          <div>
            <MainSelect
              classNames={{
                menuButton: 'bg-neutral-700',
                label: 'text-md text-neutral-400',
                list: 'max-h-48 overflow-y-auto',
                menu: 'fixed',
              }}
              isMultiple={true}
              label={'Categories'}
              placeholder={'Select Categories'}
              entries={categoryOptions}
              activeEntryValues={selectedCategories}
              onChange={(e) => {
                const newSelectedCategories = e ? e.map((tag) => tag.value) : null
                setSelectedCategories(newSelectedCategories)
              }}
              loading={false}
            />
            {categoriesError && (
              <span className="text-xs text-red-600">At least one category is required</span>
            )}
          </div>
          <div>
            <MainSelect
              classNames={{
                menuButton: 'bg-neutral-700',
                label: 'text-md text-neutral-400',
                list: 'max-h-48 overflow-y-auto',
                menu: 'fixed',
              }}
              isMultiple={true}
              label={'Labels'}
              placeholder={'Select Labels'}
              entries={labelOptions}
              activeEntryValues={selectedLabels}
              onChange={(e) => {
                const newSelectedLabels = e ? e.map((tag) => tag.value) : null
                setSelectedLabels(newSelectedLabels)
              }}
              loading={false}
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

AddProblemModal.defaultProps = defaultProps
export default AddProblemModal
