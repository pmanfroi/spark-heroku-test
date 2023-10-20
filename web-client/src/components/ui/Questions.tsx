import {isEmpty} from 'ramda'

import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  questions: Array<string>
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const Question = ({questions = [], className}: Props) => {
  return null
  if (isEmpty(questions)) return null
  const cn = {
    root: cns('pb-6 text-red-500', className),
    header: 'text-xl font-semibold',
    question: 'text-sm',
  }
  return (
    <div className={cn.root}>
      <div className={cn.header}>Questions</div>
      {questions.map(function (question, key) {
        return (
          <div className={cn.question} {...{key: key}}>
            - {question}
          </div>
        )
      })}
    </div>
  )
}
export default Question
