import {CheckIcon} from '@heroicons/react/20/solid'
import {equals, pipe, find, propEq} from 'ramda'
import {isTruthy} from 'ramda-adjunct'

import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
type StepShape = {
  id: string
  text: string
  isReview: boolean
  onClick: () => void
}
interface Props {
  activeStepId: string
  steps: Array<StepShape>
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const isComplete = equals('complete')
const isCurrent = equals('current')
const hasReview = pipe(find(propEq('isReview', true)), isTruthy)
const visibleStepCount = function (steps) {
  return hasReview(steps) ? steps.length - 1 : steps.length
}
const Stepper = ({steps = [], activeStepId, className}: Props) => {
  const numVisibleSteps = visibleStepCount(steps)
  const hideBar = function (idx) {
    return idx >= numVisibleSteps - 1
  }
  const hideText = function (idx) {
    return idx >= numVisibleSteps
  }
  const stepsWithStatus = withStatus(steps, activeStepId)
  const barColor = function (status, idx) {
    return hideBar(idx) ? 'transparent' : isComplete(status) ? 'bg-primary/80' : 'bg-zinc-600'
  }
  const textColor = function (status, idx) {
    return hideText(idx)
      ? 'text-transparent'
      : isCurrent(status)
      ? 'text-primary'
      : isComplete(status)
      ? 'text-zinc-300'
      : 'text-zinc-500'
  }
  const cn = {
    root: cns('flex flex-row', className),
    progressContainer: 'relative ml-1 flex flex-row items-center',
    bar: function (status, idx) {
      return cns('h-1 grow', barColor(status, idx))
    },
    text: function (status, idx) {
      return cns('mb-3 h-10 w-40 text-sm font-normal', textColor(status, idx))
    },
  }
  return (
    <div className={cn.root}>
      {stepsWithStatus.map(function (props, idx) {
        const _b = props === void 0 ? {} : props,
          id = _b.id,
          text = _b.text,
          status = _b.status,
          onClick = _b.onClick
        return (
          <div key={id}>
            <div className={cn.text(status, idx)}>{text}</div>
            <div className={cn.progressContainer}>
              <ProgressCircle {...{status: status, onClick: onClick}} />
              <div className={cn.bar(status, idx)} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default Stepper
//-----------------------------------------------------------------------------
interface ProgressCircleProps {
  status: 'complete' | 'current' | 'upcoming'
  onClick: () => void
}
const ProgressCircle = ({status, onClick}: ProgressCircleProps) => {
  if (status === 'complete') return <CompleteIcon {...{onClick: onClick}} />
  if (status === 'current') return <CurrentIcon {...{onClick: onClick}} />
  if (status === 'upcoming') return <UpComingIcon {...{onClick: onClick}} />
  return null
}

interface CurrentIconProps {
  onClick: () => void
}

const CurrentIcon = function ({onClick}: CurrentIconProps) {
  return (
    <div
      onClick={onClick}
      className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
    </div>
  )
}

interface CompleteIconProps {
  onClick: () => void
}
const CompleteIcon = function ({onClick}: CompleteIconProps) {
  return (
    <div
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-primary hover:bg-primary-dark"
    >
      <CheckIcon className="h-4.5 w-4.5 text-white" />
    </div>
  )
}

interface UpComingIconProps {
  onClick: () => void
}
const UpComingIcon = function ({onClick}: UpComingIconProps) {
  return (
    <div
      onClick={onClick}
      className="group relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-600"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
    </div>
  )
}

const withStatus = function (steps: any[], activeStepId: string) {
  let hitActive = false

  return steps.map(function (step) {
    if (step?.isReview) {
      return {
        ...step,
        status: 'review',
      }
    }
    if (hitActive) {
      return {
        ...step,
        status: 'upcoming',
      }
    }
    if (activeStepId) {
      hitActive = true
      return {
        ...step,
        status: 'current',
      }
    }
    return {
      ...step,
      status: 'complete',
    }
  })
}
