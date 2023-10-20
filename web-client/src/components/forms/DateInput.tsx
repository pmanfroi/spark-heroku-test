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
const DateInput = function (props: Props) {
  const formInputProps = {
    type: FieldType.DATE,
    defaultValue: props.defaultValue,
    ...pickFormProps(props),
    className: 'text-red',
  }
  return <FormInput {...formInputProps} />
}
DateInput.defaultProps = formInputDefaultProps
export default DateInput
