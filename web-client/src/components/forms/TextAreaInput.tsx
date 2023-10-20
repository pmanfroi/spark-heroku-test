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
  rows: number
}

//*****************************************************************************
// Components
//*****************************************************************************
const TextAreaInput = function (props: Props) {
  const {rows} = props
  const formInputProps = {
    type: FieldType.TEXTAREA,
    textAreaProps: {rows: rows},
    ...pickFormProps(props),
  }
  return <FormInput {...formInputProps} />
}
TextAreaInput.defaultProps = {
  ...formInputDefaultProps,
  rows: 3,
  placeholder: 'Enter text here',
}
export default TextAreaInput
