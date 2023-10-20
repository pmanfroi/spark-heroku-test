import {useFormContext} from 'react-hook-form'

import {nullFormContext} from './Form'

//*****************************************************************************
// Interface
//*****************************************************************************
type RadioButtonShape = {
  label: string
  value: string
}
interface Props {
  name: string
  label?: string
  direction?: 'vertical' | 'horizontal'
  defaultChecked?: string
  radioButtons: RadioButtonShape[]
  readOnly?: boolean
  required: boolean
  disabled?: boolean
  hidden?: boolean
  className?: string
}
const defaultProps = {
  direction: 'horizontal',
  defaultChecked: '',
  required: false,
  disabled: false,
  readOnly: false,
}
//*****************************************************************************
// Components
//*****************************************************************************
const toId = function (name, radioButtonValue) {
  return name + '.' + radioButtonValue
}
const RadioButtonsInput = function (props: Props) {
  const {name, label, radioButtons, disabled, hidden} = props
  const {direction, defaultChecked, required, className} = props
  if (hidden) return null
  const register = (useFormContext() || nullFormContext).register
  const registerRequired = {
    value: required,
    message: label + ' is required',
  }
  const flexDir = direction === 'horizontal' ? 'flex-row' : 'flex-column'
  const getRadioStyle = function (row) {
    return direction === 'horizontal' && row !== 0 ? 'flex-3' : ''
  }
  const cn = {
    root: className,
    buttonContainer: 'flex ' + flexDir,
    label: 'fakeOverlap',
    radioButton: getRadioStyle,
  }
  return (
    <div className={cn.root}>
      <div className="mb-2 grid grid-cols-12 gap-4">
        <div className="col-span-2 text-white/50">
          {label && <label className={cn.label}>{label}</label>}
        </div>
        <div className="col-span-10 text-white/50">
          <div className={cn.buttonContainer}>
            {radioButtons.map(function (props, row) {
              const label = props.label,
                value = props.value
              return (
                <div key={value}>
                  <input
                    className={cn.radioButton(row)}
                    id={toId(name, value)}
                    defaultChecked={value === defaultChecked}
                    type="radio"
                    {...{name, value, disabled}}
                    {...register(name, {required: registerRequired})}
                  />
                  <label key={value} className="pl-1 pr-3" htmlFor={toId(name, value)}>
                    {label}
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
RadioButtonsInput.defaultProps = defaultProps
export default RadioButtonsInput
