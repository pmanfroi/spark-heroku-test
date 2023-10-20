import FormInput, {
  FormInputPropTypes,
  formInputDefaultProps,
  pickFormProps,
  FieldType,
} from './FormInput'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props extends FormInputPropTypes {}
//*****************************************************************************
// Components
//*****************************************************************************
const TimeInput = function (props: Props) {
  const formInputProps = {
    type: FieldType.TIME,
    defaultValue: props.defaultValue,
    className: 'text-red',
    ...pickFormProps(props),
  }
  return <FormInput {...formInputProps} />
}
TimeInput.defaultProps = formInputDefaultProps
export default TimeInput
