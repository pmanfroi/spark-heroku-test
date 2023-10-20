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
const FileInput = function (props: Props) {
  const formProps = pickFormProps(props)
  const formInputProps = {
    type: FieldType.FILE,
    ...formProps,
    name: props.name || formProps.name,
  }
  return <FormInput {...formInputProps} />
}

FileInput.defaultProps = formInputDefaultProps
export default FileInput
