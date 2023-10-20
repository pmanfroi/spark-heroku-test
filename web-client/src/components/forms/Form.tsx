import {DevTool} from '@hookform/devtools'
import {createContext, useContext} from 'react'
import {useFormContext, FormProvider, useForm, useFormState} from 'react-hook-form'

import SubmitButton from '@/components/buttons/SubmitButton'
import Panel from '@/components/ui/Panel'

import CheckboxInput from './CheckboxInput'
import DateInput from './DateInput'
import EmailInput from './EmailInput'
import FieldSet from './FieldSet'
import FileInput from './FileInput'
import FormTitle from './FormTitle'
import NumberInput from './NumberInput'
import PasswordInput from './PasswordInput'
import RadioButton from './RadioButton'
import RadioButtonsInput from './RadioButtonsInput'
import RadioFormLabel from './RadioFormLabel'
import SelectMenuInput from './SelectMenuInput'
import TextAreaInput from './TextAreaInput'
// So that everything can be imported from Form
import TextInput from './TextInput'

export {
  TextInput,
  DateInput,
  TextAreaInput,
  EmailInput,
  NumberInput,
  SubmitButton,
  FieldSet,
  RadioButtonsInput,
  RadioButton,
  PasswordInput,
  RadioFormLabel,
  FileInput,
  SelectMenuInput,
  CheckboxInput,
}
//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  id?: string
  onSubmit?: (data: any, event: any) => void
  onError?: () => void
  onDirtyChange?: () => void
  defaultValues?: {[key: string]: any}
  title: string
  withPanel?: boolean
  panelClassName?: string
  debug?: boolean
  children: React.ReactNode
  className?: string
}
export const FormContext = createContext('unintilized form context')
export const useBdiFormContext = function () {
  return useContext(FormContext)
}
//*****************************************************************************
// Components
//*****************************************************************************
const Form = function (props: Props) {
  const {
    id,
    withPanel = true,
    title,
    onError = (e) => console.log('Form submission error', e),
    onDirtyChange,
    className,
    panelClassName = '',
    children,
    debug = false,
    onSubmit = () => console.log('Form onSubmit() not provided'),
  } = props

  const formProps = useFormContext()
  const {handleSubmit, control} = formProps

  return (
    <div className={className}>
      {title && <FormTitle {...{title: title}} />}
      <WithPanel {...{withPanel, panelClassName}}>
        <form onSubmit={handleSubmit(onSubmit, onError)} {...{id: id}}>
          <StateMonitor {...{onDirtyChange}} />
          {children}
        </form>
        {debug && <DevTool control={control} />}
      </WithPanel>
    </div>
  )
}

interface WithPanelProps {
  withPanel?: boolean
  panelClassName?: string
  children: React.ReactNode
}
const WithPanel = ({withPanel, panelClassName, children}: WithPanelProps) =>
  withPanel ? <Panel className={panelClassName}>{children}</Panel> : <div>{children}</div>

export const nullFormContext = {
  register: function () {
    console.log('register not available, inputs must be wrapped in <Form />')
  },
  setValue: function () {
    console.log('setValue not available, inputs must be wrapped in <Form />')
  },
  control: function () {
    console.log('control not available, inputs must be wrapped in <Form />')
  },
  formState: {errors: {}},
}
const withFormContext = function (FormToWrap) {
  return function (props: Props) {
    const defaultValues = props.defaultValues
    const useFormOptions = defaultValues ? {defaultValues: defaultValues} : {}
    const useFormMethods = useForm(useFormOptions)
    return (
      <FormProvider {...useFormMethods}>
        <FormToWrap {...props} />
      </FormProvider>
    )
  }
}

export default withFormContext(Form)
//*****************************************************************************
// Helpers
//*****************************************************************************
interface StateMonitorProps {
  onDirtyChange?: (dirtyFields?: any) => void
}
const StateMonitor = function (props: StateMonitorProps) {
  const onDirtyChange = props.onDirtyChange
  const control = useFormContext().control
  const dirtyFields = useFormState({control: control}).dirtyFields
  onDirtyChange?.(dirtyFields)
  return null
}
