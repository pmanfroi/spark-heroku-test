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
const TextInput = function (props: Props) {
  const formInputProps = {
    type: FieldType.TEXT,
    ...pickFormProps(props),
  }
  return <FormInput {...formInputProps} />
}
TextInput.defaultProps = formInputDefaultProps
export default TextInput
