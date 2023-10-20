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
const PasswordInput = function (props: Props) {
  const formInputProps = {
    type: FieldType.PASSWORD,
    ...pickFormProps(props),
  }
  return <FormInput {...formInputProps} />
}
PasswordInput.defaultProps = formInputDefaultProps
export default PasswordInput
