import FormInput, {
  FormInputPropTypes,
  formInputDefaultProps,
  pickFormProps,
  FieldType,
} from './FormInput'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props extends FormInputPropTypes {
  onChange?: () => void
}
//*****************************************************************************
// Components
//*****************************************************************************
const RadioButton = function (props: Props) {
  const formInputProps = {
    type: FieldType.RADIO,
    id: props.id,
    onChange: props.onChange,
    ...pickFormProps(props),
  }
  return <FormInput {...formInputProps} />
}
RadioButton.defaultProps = formInputDefaultProps
export default RadioButton
