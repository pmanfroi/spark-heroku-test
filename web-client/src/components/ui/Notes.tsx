import {isEmpty} from 'ramda'

import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  notes: Array<string>
  className?: string
}
const defaultProps = {
  notes: [],
}
//*****************************************************************************
// Components
//*****************************************************************************
const Question = ({notes, className}: Props) => {
  return null
  if (isEmpty(notes)) return null
  const cn = {
    root: cns('pb-6 text-sky-500', className),
    header: 'text-xl font-semibold',
    note: 'text-sm',
  }
  return (
    <div className={cn.root}>
      <div className={cn.header}>Notes</div>
      {notes.map(function (note, key) {
        return (
          <div className={cn.note} {...{key: key}}>
            - {note}
          </div>
        )
      })}
    </div>
  )
}
Question.defaultProps = defaultProps
export default Question
