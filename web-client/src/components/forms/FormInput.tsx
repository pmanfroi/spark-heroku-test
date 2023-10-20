import {pick, path} from 'ramda'
import {isNotNil} from 'ramda-adjunct'
import {useLayoutEffect} from 'react'
import {useFormContext} from 'react-hook-form'

import cns from '@/utils/classnames'

import {nullFormContext} from './Form'
import FormInputLabel from './FormInputLabel'

//*****************************************************************************
// Interface
//*****************************************************************************
// for custom stying (build this out)
type ClassNamesShape = {
  input: string
}
type TextAreaPropsShape = {
  rows: number
}
// Can be imported and used by parent componenet
export type FormInputPropTypes = {
  name: string
  value?: any
  defaultValue?: any
  id?: string
  label?: string
  placeholder?: string
  valueAsNumber?: boolean
  required: boolean
  disabled?: boolean
  hidden?: boolean
  touched?: boolean
  dirty?: boolean
  onFocus?: () => void
  // only if type = text area
  textAreaProps?: TextAreaPropsShape
  classNames?: ClassNamesShape
}
// Can be imported and used by parent component
export const formInputDefaultProps = {
  label: '',
  placeholder: '',
  valueAsNumber: false,
  required: false,
  readOnly: false,
  disabled: false,
  hidden: false,
  touched: false,
  dirty: false,
  onFocus: function () {},
  textAreaProps: {},
}
// can be used to pick form specific props from a props object
const formInputProps = [
  'type',
  'name',
  'value',
  'label',
  'placeholder',
  'required',
  'disabled',
  'hidden',
  'onFocus',
  'classNames',
]
export const pickFormProps = pick(formInputProps)

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  EMAIL = 'email',
  CHECKBOX = 'checkbox',
  'DATETIME-LOCAL' = 'datetime-local',
  DATE = 'date',
  TIME = 'time',
  FILE = 'file',
  NUMBER = 'number',
  PASSWORD = 'password',
  RADIO = 'radio',
}

type Props = FormInputPropTypes & {
  type: FieldType
  classNames?: ClassNamesShape
  className?: string
}
const defaultProps = {...formInputDefaultProps}
//*****************************************************************************
// Components
//*****************************************************************************

const FormInput = (props: Props) => {
  const {
    textAreaProps,
    className,
    classNames,
    type,
    name,
    id,
    value,
    label,
    defaultValue,
    onFocus,
    valueAsNumber,
    disabled,
    hidden,
    placeholder,
    required,
  } = props

  const {register, setValue, formState} = useFormContext() || nullFormContext
  const {errors} = formState || {}

  useLayoutEffect(() => {
    isNotNil(value) && setValue(name, value)
  }, [name, value, setValue])

  if (hidden) return null

  const labelText = label
  const errorTextPath = [...name.split('.'), 'message']
  const errorText: React.ReactNode = path(errorTextPath, errors)

  const registerRequired = {
    value: required,
    message: `${label} is required`,
  }

  const cn = {
    root: cns('', className),
    input: cns(
      'rounded-md border border-zinc-600 bg-zinc-925 text-sm text-zinc-400',
      'mb-3 h-7 w-full p-1',
      classNames?.input
    ),
    error: 'text-red-300 font-semibold mb-1',
  }

  const inputProps = {
    type,
    placeholder: placeholder,
    className: cn.input,
    id: id || name,
    disabled,
    onFocus: onFocus,
    ...register(name, {required: registerRequired, valueAsNumber: valueAsNumber}),
    rows: 0,
  }

  if (type === FieldType.TEXTAREA)
    inputProps.rows =
      (textAreaProps === null || textAreaProps === void 0 ? void 0 : textAreaProps.rows) || 3

  const InputComponent = (
    <div className={cn.root}>
      {labelText && <FormInputLabel {...{labelText, required}} />}
      <div className="">
        {(() => {
          switch (type) {
            case FieldType.TEXTAREA:
              return <textarea {...inputProps} className={cn.input} />
            default:
              return (
                <input
                  defaultValue={defaultValue}
                  {...inputProps}
                  type={String(inputProps.type)}
                  className={cn.input}
                />
              )
          }
        })()}
        {errorText ? (
          <div className={cn.error}>
            {name} {errorText}
          </div>
        ) : null}
      </div>
    </div>
  )

  return InputComponent
}
FormInput.defaultProps = defaultProps
export default FormInput
