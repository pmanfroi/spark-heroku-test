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
const EmailInput = function (props: Props) {
  const formInputProps = {
    type: FieldType.EMAIL,
    ...pickFormProps(props),
  }
  return <FormInput {...formInputProps} />
}

EmailInput.defaultProps = formInputDefaultProps
export default EmailInput
